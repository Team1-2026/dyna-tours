<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class WebsiteChatVisitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_uuid',
        'name',
        'email',
        'phone',
        'requirements',
        'notes',
        'status',
        'agent_conversation_id',
        'last_message_at',
        'bridge_thread_key',
        'bridge_thread_name',
        'bridge_space_name',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public static function findOrCreateByUuid(string $visitorUuid, array $attributes = []): self
    {
        $visitor = static::query()->firstOrCreate(
            ['visitor_uuid' => $visitorUuid],
            array_merge(['status' => 'new'], $attributes),
        );

        if ($attributes !== []) {
            $visitor->fill($attributes);
            $visitor->save();
        }

        return $visitor->fresh();
    }

    /**
     * @return list<array{id: string, role: string, content: string, created_at: mixed}>
     */
    public function chatMessages(): array
    {
        if (! $this->agent_conversation_id) {
            return [];
        }

        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');

        return DB::table($messagesTable)
            ->where('conversation_id', $this->agent_conversation_id)
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
