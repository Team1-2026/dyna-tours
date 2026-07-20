<?php

namespace App\Http\Controllers;

use App\Models\GoogleChatUser;
use App\Models\WebsiteChatVisitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmChatController extends Controller
{
    private const SOURCES = ['website', 'google_chat'];

    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $search = trim((string) $request->query('search', ''));
        $sourceFilter = $request->query('source');

        $leads = collect();

        if (! $sourceFilter || $sourceFilter === 'website') {
            $leads = $leads->merge($this->websiteLeads($status, $search));
        }

        if (! $sourceFilter || $sourceFilter === 'google_chat') {
            $leads = $leads->merge($this->googleChatLeads($status, $search));
        }

        $sorted = $leads
            ->sortByDesc(fn (array $lead) => $lead['last_message_at'] ?? $lead['updated_at'] ?? $lead['created_at'])
            ->values();

        return response()->json($sorted);
    }

    public function show(string $source, int $id): JsonResponse
    {
        $this->assertSource($source);

        if ($source === 'website') {
            $lead = WebsiteChatVisitor::query()->findOrFail($id);

            return response()->json($this->formatWebsiteLead($lead, includeMessages: true));
        }

        $lead = GoogleChatUser::query()->findOrFail($id);

        return response()->json($this->formatGoogleChatLead($lead, includeMessages: true));
    }

    public function update(Request $request, string $source, int $id): JsonResponse
    {
        $this->assertSource($source);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'requirements' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:new,in_progress,contacted,qualified,closed'],
        ]);

        if ($source === 'website') {
            $lead = WebsiteChatVisitor::query()->findOrFail($id);
            $lead->update($validated);

            return response()->json([
                'message' => 'CRM lead updated.',
                'lead' => $this->formatWebsiteLead($lead->fresh()),
            ]);
        }

        $lead = GoogleChatUser::query()->findOrFail($id);

        $googleUpdates = collect($validated)
            ->only(['requirements', 'notes', 'status', 'email'])
            ->when(isset($validated['name']), fn ($data) => $data->put('display_name', $validated['name']))
            ->all();

        $lead->update($googleUpdates);

        return response()->json([
            'message' => 'CRM lead updated.',
            'lead' => $this->formatGoogleChatLead($lead->fresh()),
        ]);
    }

    public function destroy(string $source, int $id): JsonResponse
    {
        $this->assertSource($source);

        if ($source === 'website') {
            WebsiteChatVisitor::query()->findOrFail($id)->delete();
        } else {
            GoogleChatUser::query()->findOrFail($id)->delete();
        }

        return response()->json([
            'message' => 'CRM lead deleted.',
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function websiteLeads(mixed $status, string $search): array
    {
        $query = WebsiteChatVisitor::query()
            ->whereNotNull('email')
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('requirements', 'like', "%{$search}%");
            });
        }

        return $query->get()
            ->map(fn (WebsiteChatVisitor $lead) => $this->formatWebsiteLead($lead))
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function googleChatLeads(mixed $status, string $search): array
    {
        $query = GoogleChatUser::query()
            ->with(['conversations' => fn ($q) => $q->orderByDesc('last_message_at')->orderByDesc('id')])
            ->orderByDesc('updated_at');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('display_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('google_user_name', 'like', "%{$search}%")
                    ->orWhere('requirements', 'like', "%{$search}%");
            });
        }

        return $query->get()
            ->map(fn (GoogleChatUser $lead) => $this->formatGoogleChatLead($lead))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function formatWebsiteLead(WebsiteChatVisitor $lead, bool $includeMessages = false): array
    {
        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');
        $messageCount = 0;

        if ($lead->agent_conversation_id) {
            $messageCount = DB::table($messagesTable)
                ->where('conversation_id', $lead->agent_conversation_id)
                ->count();
        }

        $payload = [
            'id' => $lead->id,
            'source' => 'website',
            'visitor_uuid' => $lead->visitor_uuid,
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'avatar_url' => null,
            'requirements' => $lead->requirements,
            'notes' => $lead->notes,
            'status' => $lead->status ?? 'new',
            'agent_conversation_id' => $lead->agent_conversation_id,
            'last_message_at' => $lead->last_message_at,
            'created_at' => $lead->created_at,
            'updated_at' => $lead->updated_at,
            'message_count' => $messageCount,
        ];

        if ($includeMessages) {
            $payload['messages'] = $lead->chatMessages();
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    protected function formatGoogleChatLead(GoogleChatUser $lead, bool $includeMessages = false): array
    {
        $latest = $lead->relationLoaded('conversations')
            ? $lead->conversations->first()
            : $lead->latestConversation();

        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');
        $messageCount = 0;
        $agentConversationId = $latest?->agent_conversation_id;

        if ($agentConversationId) {
            $messageCount = DB::table($messagesTable)
                ->where('conversation_id', $agentConversationId)
                ->count();
        }

        $payload = [
            'id' => $lead->id,
            'source' => 'google_chat',
            'visitor_uuid' => $lead->google_user_name,
            'name' => $lead->display_name,
            'email' => $lead->email,
            'phone' => null,
            'avatar_url' => $lead->avatar_url,
            'requirements' => $lead->requirements,
            'notes' => $lead->notes,
            'status' => $lead->status ?? 'new',
            'agent_conversation_id' => $agentConversationId,
            'last_message_at' => $latest?->last_message_at,
            'created_at' => $lead->created_at,
            'updated_at' => $lead->updated_at,
            'message_count' => $messageCount,
        ];

        if ($includeMessages) {
            $payload['messages'] = $lead->chatMessages();
        }

        return $payload;
    }

    protected function assertSource(string $source): void
    {
        if (! in_array($source, self::SOURCES, true)) {
            abort(404, 'Unknown CRM source.');
        }
    }
}