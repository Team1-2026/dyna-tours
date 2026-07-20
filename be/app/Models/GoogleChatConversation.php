<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoogleChatConversation extends Model
{
    protected $fillable = [
        'google_chat_user_id',
        'space_name',
        'thread_name',
        'agent_conversation_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function googleChatUser(): BelongsTo
    {
        return $this->belongsTo(GoogleChatUser::class);
    }

    public static function findOrCreateSession(
        GoogleChatUser $user,
        string $spaceName,
        ?string $threadName,
    ): self {
        return static::query()->firstOrCreate(
            [
                'google_chat_user_id' => $user->id,
                'space_name' => $spaceName,
                'thread_name' => $threadName,
            ],
            [
                'last_message_at' => now(),
            ],
        );
    }

    public function touchLastMessage(): void
    {
        $this->update(['last_message_at' => now()]);
    }
}
