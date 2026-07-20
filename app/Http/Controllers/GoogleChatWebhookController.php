<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessGoogleChatMessage;
use App\Models\GoogleChatConversation;
use App\Models\GoogleChatUser;
use App\Services\GoogleChat\WebsiteChatBridgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GoogleChatWebhookController extends Controller
{
    public function __construct(
        protected WebsiteChatBridgeService $websiteChatBridgeService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->all();
        $type = $payload['type'] ?? null;

        return match ($type) {
            'ADDED_TO_SPACE' => $this->handleAddedToSpace($payload),
            'MESSAGE' => $this->handleMessage($payload),
            default => response()->json([]),
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function handleAddedToSpace(array $payload): JsonResponse
    {
        $spaceName = $payload['space']['name'] ?? null;

        if ($this->websiteChatBridgeService->isBridgeSpace($spaceName)) {
            return response()->json([
                'text' => 'Website chat bridge is active. Visitor conversations from the website will appear in threads here. Reply in a thread to message that visitor.',
            ]);
        }

        return response()->json([
            'text' => (string) config('google-chat.welcome_message'),
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function handleMessage(array $payload): JsonResponse
    {
        $message = $payload['message'] ?? [];
        // Prefer message.sender for attribution; fall back to event.user for missing fields.
        $sender = array_merge(
            $payload['user'] ?? [],
            $message['sender'] ?? [],
        );

        if (($sender['type'] ?? null) === 'BOT') {
            return response()->json([]);
        }

        // Prefer argumentText so @mentions of the bot are stripped for website visitors.
        $text = trim($message['argumentText'] ?? $message['text'] ?? '');

        if ($text === '') {
            return response()->json([]);
        }

        $spaceName = $payload['space']['name'] ?? $message['space']['name'] ?? null;
        $threadName = $message['thread']['name'] ?? $payload['thread']['name'] ?? null;

        if (! $spaceName) {
            Log::warning('Google Chat message missing space name.', ['payload' => $payload]);

            return response()->json([]);
        }

        // Staff reply in the website-bridge space → deliver to website visitor.
        if ($this->websiteChatBridgeService->isBridgeSpace($spaceName)) {
            return $this->handleBridgeStaffReply($text, $threadName, $sender);
        }

        try {
            $googleChatUser = GoogleChatUser::findOrCreateFromSender($sender);
            $googleChatConversation = GoogleChatConversation::findOrCreateSession(
                $googleChatUser,
                $spaceName,
                $threadName,
            );

            ProcessGoogleChatMessage::dispatch(
                $googleChatUser,
                $googleChatConversation,
                $text,
                $spaceName,
                $threadName,
            );
        } catch (\Throwable $exception) {
            Log::error('Failed to queue Google Chat message.', [
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'text' => (string) config('google-chat.error_message'),
            ]);
        }

        return response()->json([
            'text' => (string) config('google-chat.processing_message'),
        ]);
    }

    /**
     * @param  array<string, mixed>  $sender
     */
    protected function handleBridgeStaffReply(string $text, ?string $threadName, array $sender): JsonResponse
    {
        $visitor = $this->websiteChatBridgeService->findVisitorByBridgeThread($threadName);

        if (! $visitor) {
            return response()->json([
                'text' => 'No website visitor is linked to this thread yet. Wait for a website chat message first, then reply in that visitor’s thread.',
            ]);
        }

        $delivered = $this->websiteChatBridgeService->deliverStaffReply(
            $visitor,
            $text,
            $sender['displayName'] ?? null,
        );

        if (! $delivered) {
            return response()->json([
                'text' => 'Could not deliver this reply to the website visitor (conversation not ready yet).',
            ]);
        }

        $name = $visitor->name ?: 'visitor';

        return response()->json([
            'text' => "✅ Delivered to {$name} on the website chat.",
        ]);
    }
}