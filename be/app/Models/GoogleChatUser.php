<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class GoogleChatUser extends Model
{
    protected $fillable = [
        'google_user_name',
        'display_name',
        'email',
        'avatar_url',
        'requirements',
        'notes',
        'status',
    ];

    public function conversations(): HasMany
    {
        return $this->hasMany(GoogleChatConversation::class);
    }

    public function latestConversation(): ?GoogleChatConversation
    {
        return $this->conversations()
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->first();
    }

    /**
     * @param  array<string, mixed>  $sender
     */
    public static function findOrCreateFromSender(array $sender): self
    {
        $googleUserName = $sender['name'] ?? null;

        if (! $googleUserName) {
            throw new \InvalidArgumentException('Google Chat sender is missing a user name.');
        }

        return static::query()->updateOrCreate(
            ['google_user_name' => $googleUserName],
            [
                'display_name' => $sender['displayName'] ?? null,
                'email' => $sender['email'] ?? null,
                'avatar_url' => $sender['avatarUrl'] ?? null,
            ],
        );
    }

    /**
     * @return list<array{id: string, role: string, content: string, created_at: mixed}>
     */
    public function chatMessages(): array
    {
        $conversation = $this->latestConversation();

        if (! $conversation?->agent_conversation_id) {
            return [];
        }

        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');

        return DB::table($messagesTable)
            ->where('conversation_id', $conversation->agent_conversation_id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'role', 'content', 'created_at'])
            ->map(fn ($row) => [
                'id' => $row->id,
                'role' => $row->role,
                'content' => $row->content,
                'created_at' => $row->created_at,
            ])
            ->all();
    }
}
