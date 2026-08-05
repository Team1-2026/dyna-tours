<?php

namespace App\Http\Controllers;

use App\Jobs\MirrorWebsiteChatToGoogleChat;
use App\Models\WebsiteChatVisitor;
use App\Services\ChatConversationService;
use App\Services\GoogleIdentityService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class PublicChatController extends Controller
{
    public function __construct(
        protected ChatConversationService $chatConversationService,
        protected GoogleIdentityService $googleIdentityService,
    ) {}

    public function googleIdentity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential' => ['required', 'string'],
        ]);

        try {
            $profile = $this->googleIdentityService->verifyIdToken($validated['credential']);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 401);
        }

        return response()->json([
            'name' => $profile['name'],
            'email' => $profile['email'],
            'picture' => $profile['picture'],
        ]);
    }

    public function identify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'name' => ['required', 'string'],
        ]);

        $visitor = WebsiteChatVisitor::query()
            ->where('email', $validated['email'])
            ->first();

        if (! $visitor) {
            return response()->json(['exists' => false]);
        }

        $messages = [];
        if ($visitor->agent_conversation_id) {
            $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');

            $messages = DB::table($messagesTable)
                ->where('conversation_id', $visitor->agent_conversation_id)
                ->orderBy('created_at')
                ->orderBy('id')
                ->get(['id', 'role', 'content', 'created_at', 'meta'])
                ->map(function ($row) {
                    $role = $row->role;

                    if ($role === 'assistant' || $role === 'staff') {
                        $meta = [];
                        if (is_string($row->meta) && $row->meta !== '') {
                            try {
                                $meta = json_decode($row->meta, true, 512, JSON_THROW_ON_ERROR);
                            } catch (Throwable) {
                                $meta = [];
                            }
                        }
                        if (($meta['source'] ?? null) === 'google_chat_staff') {
                            $role = 'staff';
                        }
                    }

                    return [
                        'id' => $row->id,
                        'role' => $role === 'user' ? 'user' : ($role === 'staff' ? 'staff' : 'assistant'),
                        'content' => $row->content,
                        'created_at' => $row->created_at,
                    ];
                })
                ->values()
                ->all();
        }

        return response()->json([
            'exists' => true,
            'visitor_id' => $visitor->visitor_uuid,
            'conversation_id' => $visitor->agent_conversation_id,
            'messages' => $messages,
        ]);
    }

    

    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'visitor_id' => ['required', 'uuid'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        return $this->respond(
            $validated['visitor_id'],
            $validated['message'],
            null,
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ],
        );
    }

    public function continue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'visitor_id' => ['required', 'uuid'],
            'conversation_id' => ['required', 'string', 'max:1000'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        return $this->respond(
            $validated['visitor_id'],
            $validated['message'],
            $validated['conversation_id'],
        );
    }

    public function messages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'visitor_id' => ['required', 'uuid'],
            'conversation_id' => ['required', 'string', 'max:1000'],
            'after' => ['nullable', 'date'],
        ]);

        $visitor = WebsiteChatVisitor::query()
            ->where('visitor_uuid', $validated['visitor_id'])
            ->where('agent_conversation_id', $validated['conversation_id'])
            ->first();

        if (! $visitor) {
            return response()->json(['messages' => []]);
        }

        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');

        $query = DB::table($messagesTable)
            ->where('conversation_id', $visitor->agent_conversation_id)
            ->orderBy('created_at')
            ->orderBy('id');

        if (! empty($validated['after'])) {
            $query->where('created_at', '>', $validated['after']);
        }

        $messages = $query
            ->get(['id', 'role', 'content', 'created_at', 'meta'])
            ->map(function ($row) {
                $role = $row->role;

                if ($role === 'assistant' || $role === 'staff') {
                    $meta = [];

                    if (is_string($row->meta) && $row->meta !== '') {
                        try {
                            $meta = json_decode($row->meta, true, 512, JSON_THROW_ON_ERROR);
                        } catch (Throwable) {
                            $meta = [];
                        }
                    }

                    if (($meta['source'] ?? null) === 'google_chat_staff') {
                        $role = 'staff';
                    }
                }

                return [
                    'id' => $row->id,
                    'role' => $role === 'user' ? 'user' : ($role === 'staff' ? 'staff' : 'assistant'),
                    'content' => $row->content,
                    'created_at' => $row->created_at,
                ];
            })
            ->values()
            ->all();

        return response()->json(['messages' => $messages]);
    }

    /**
     * @param  array{name?: string, email?: string, phone?: string|null}  $lead
     */
    protected function respond(
        string $visitorId,
        string $message,
        ?string $conversationId = null,
        array $lead = [],
    ): JsonResponse {
        try {
            $visitor = WebsiteChatVisitor::findOrCreateByUuid($visitorId, $lead);

            if (!$visitor->staff_id) {
                $staff = \App\Models\Staff::inRandomOrder()->first();
                if ($staff) {
                    $visitor->staff_id = $staff->id;
                    $visitor->save();
                }
            }

            if ($conversationId && ! $visitor->agent_conversation_id) {
                $visitor->agent_conversation_id = $conversationId;
            }

            $response = $this->chatConversationService->prompt($visitor, $message, $conversationId);
            $resolvedConversationId = $response->conversationId ?? $conversationId;
            $agentResponse = (string) $response;

            // Payment links are currently hidden/disabled as requested. Suppress any payment tags.
            if (preg_match('/\[GENERATE_LINK:\s*([^\|]+?)\s*\|\s*(.+?)\]/', $agentResponse, $matches)) {
                $agentResponse = preg_replace(
                    '/\[GENERATE_LINK:.*?\]/',
                    "Your dedicated travel expert will coordinate your itinerary details and final payment arrangements directly with you.",
                    $agentResponse
                );
            }

            if (preg_match('/\[CHECK_PAYMENT:\s*(.+?)\]/', $agentResponse, $matches)) {
                $agentResponse = preg_replace(
                    '/\[CHECK_PAYMENT:.*?\]/',
                    "Our travel team will assist you directly with payment verification.",
                    $agentResponse
                );
            }

            $updates = [
                'last_message_at' => now(),
            ];

            if ($resolvedConversationId) {
                $updates['agent_conversation_id'] = $resolvedConversationId;
            }

            // Seed requirements from the first user message if empty.
            if (! $visitor->requirements) {
                $updates['requirements'] = $message;
            }

            $visitor->update($updates);
            $visitor = $visitor->fresh();

            MirrorWebsiteChatToGoogleChat::dispatch(
                $visitor->id,
                $message,
                $agentResponse,
            );

            return response()->json([
                'conversation_id' => $resolvedConversationId,
                'agent_response' => $agentResponse,
                'lead' => [
                    'name' => $visitor->name,
                    'email' => $visitor->email,
                    'phone' => $visitor->phone,
                    'status' => $visitor->status,
                ],
            ]);
        } catch (ConnectionException $exception) {
            $provider = (string) config('ai.default', 'webui');
            Log::error('AI provider connection failed.', [
                'provider' => $provider,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to reach the AI server. Check AI_PROVIDER and API credentials in .env.',
            ], 503);
        } catch (Throwable $exception) {
            Log::error('Public chat failed.', [
                'message' => $exception->getMessage(),
            ]);

            $raw = $exception->getMessage();

            if (str_contains($raw, 'Model not found') || str_contains($raw, 'model_not_found')) {
                $provider = (string) config('ai.default', 'webui');
                return response()->json([
                    'message' => 'The configured AI model was not found.',
                    'hint' => 'Check AI_PROVIDER and AI_MODEL in .env, then run: php artisan config:clear',
                    'configured_provider' => $provider,
                    'configured_model' => config("ai.providers.{$provider}.models.text.default") ?? env('AI_MODEL'),
                ], 503);
            }

            return response()->json([
                'message' => 'The AI consultant is temporarily unavailable. Please try again shortly.',
            ], 503);
        }
    }
}

