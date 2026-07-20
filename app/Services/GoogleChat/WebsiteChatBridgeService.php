<?php

namespace App\Services\GoogleChat;

use App\Models\WebsiteChatVisitor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class WebsiteChatBridgeService
{
    public function __construct(
        protected GoogleChatMessageService $googleChatMessageService,
    ) {}

    public function isEnabled(): bool
    {
        return (bool) config('google-chat.bridge_enabled')
            && filled(config('google-chat.bridge_space'))
            && ! empty(config('google-chat.service_account_credentials'));
    }

    public function bridgeSpace(): ?string
    {
        $space = config('google-chat.bridge_space');

        return filled($space) ? (string) $space : null;
    }

    public function isBridgeSpace(?string $spaceName): bool
    {
        $bridgeSpace = $this->bridgeSpace();

        return $bridgeSpace !== null && $spaceName === $bridgeSpace;
    }

    public function mirrorTurn(WebsiteChatVisitor $visitor, string $userMessage, string $aiResponse): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $spaceName = $this->bridgeSpace();
        $threadKey = $visitor->bridge_thread_key ?: 'website-visitor-'.$visitor->visitor_uuid;

        if (! $visitor->bridge_thread_key) {
            $visitor->bridge_thread_key = $threadKey;
            $visitor->bridge_space_name = $spaceName;
            $visitor->save();
        }

        $header = $this->formatLeadHeader($visitor);
        $text = "{$header}\n\n*Visitor:*\n{$userMessage}\n\n*AI:*\n{$aiResponse}\n\n_Reply in this thread and @mention this app to send your message to the website visitor._";

        try {
            $created = $this->googleChatMessageService->sendText(
                $spaceName,
                $text,
                $visitor->bridge_thread_name,
                $visitor->bridge_thread_name ? null : $threadKey,
            );

            $resolvedThreadName = $created->getThread()?->getName();

            if ($resolvedThreadName && $visitor->bridge_thread_name !== $resolvedThreadName) {
                $visitor->update([
                    'bridge_thread_name' => $resolvedThreadName,
                    'bridge_space_name' => $spaceName,
                    'bridge_thread_key' => $threadKey,
                ]);
            }
        } catch (Throwable $exception) {
            Log::error('Failed to mirror website chat to Google Chat.', [
                'visitor_id' => $visitor->id,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Store a staff reply from Google Chat into the website conversation transcript.
     *
     * @return array{id: string, role: string, content: string, created_at: string}|null
     */
    public function deliverStaffReply(
        WebsiteChatVisitor $visitor,
        string $content,
        ?string $staffName = null,
    ): ?array {
        if (! $visitor->agent_conversation_id) {
            Log::warning('Cannot deliver Google Chat staff reply without agent conversation.', [
                'visitor_id' => $visitor->id,
            ]);

            return null;
        }

        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');
        $messageId = (string) Str::uuid();
        $now = now();

        DB::table($messagesTable)->insert([
            'id' => $messageId,
            'conversation_id' => $visitor->agent_conversation_id,
            'user_id' => null,
            'agent' => 'ChatAgent',
            'role' => 'staff',
            'content' => $content,
            'attachments' => '[]',
            'tool_calls' => '[]',
            'tool_results' => '[]',
            'usage' => '{}',
            'meta' => json_encode([
                'source' => 'google_chat_staff',
                'staff_name' => $staffName,
            ], JSON_THROW_ON_ERROR),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $visitor->update([
            'last_message_at' => $now,
            'status' => $visitor->status === 'new' ? 'in_progress' : $visitor->status,
        ]);

        return [
            'id' => $messageId,
            'role' => 'staff',
            'content' => $content,
            'created_at' => $now->toIso8601String(),
        ];
    }

    public function findVisitorByBridgeThread(?string $threadName): ?WebsiteChatVisitor
    {
        if (! $threadName) {
            return null;
        }

        return WebsiteChatVisitor::query()
            ->where('bridge_thread_name', $threadName)
            ->first();
    }

    protected function formatLeadHeader(WebsiteChatVisitor $visitor): string
    {
        $lines = [
            '🌐 *Website chat lead*',
            'Name: '.($visitor->name ?: '—'),
            'Email: '.($visitor->email ?: '—'),
        ];

        if ($visitor->phone) {
            $lines[] = 'Phone: '.$visitor->phone;
        }

        $lines[] = 'Visitor ID: '.$visitor->visitor_uuid;

        return implode("\n", $lines);
    }
}
