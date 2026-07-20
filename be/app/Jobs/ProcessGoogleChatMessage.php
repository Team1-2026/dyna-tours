<?php

namespace App\Jobs;

use App\Models\GoogleChatConversation;
use App\Models\GoogleChatUser;
use App\Services\ChatConversationService;
use App\Services\GoogleChat\GoogleChatMessageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessGoogleChatMessage implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $timeout = 120;

    public function __construct(
        public GoogleChatUser $googleChatUser,
        public GoogleChatConversation $googleChatConversation,
        public string $messageText,
        public string $spaceName,
        public ?string $threadName,
    ) {}

    public function handle(
        ChatConversationService $chatConversationService,
        GoogleChatMessageService $googleChatMessageService,
    ): void {
        $response = $chatConversationService->prompt(
            $this->googleChatUser,
            $this->messageText,
            $this->googleChatConversation->agent_conversation_id,
        );

        if ($response->conversationId && ! $this->googleChatConversation->agent_conversation_id) {
            $this->googleChatConversation->update([
                'agent_conversation_id' => $response->conversationId,
            ]);
        }

        $this->googleChatConversation->touchLastMessage();

        if (! $this->googleChatUser->requirements) {
            $this->googleChatUser->update([
                'requirements' => $this->messageText,
                'status' => $this->googleChatUser->status ?: 'new',
            ]);
        }

        $googleChatMessageService->sendText(
            $this->spaceName,
            (string) $response,
            $this->threadName,
        );
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Google Chat message processing failed.', [
            'google_chat_user_id' => $this->googleChatUser->id,
            'google_chat_conversation_id' => $this->googleChatConversation->id,
            'message' => $exception?->getMessage(),
        ]);

        try {
            app(GoogleChatMessageService::class)->sendText(
                $this->spaceName,
                (string) config('google-chat.error_message'),
                $this->threadName,
            );
        } catch (Throwable $sendException) {
            Log::error('Failed to send Google Chat error message.', [
                'message' => $sendException->getMessage(),
            ]);
        }
    }
}
