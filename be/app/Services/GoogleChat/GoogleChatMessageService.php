<?php

namespace App\Services\GoogleChat;

use Google\Client as GoogleClient;
use Google\Service\HangoutsChat;
use Google\Service\HangoutsChat\Message;
use Google\Service\HangoutsChat\Thread;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GoogleChatMessageService
{
    /**
     * @return Message Created Google Chat message (includes thread name when available).
     */
    public function sendText(
        string $spaceName,
        string $text,
        ?string $threadName = null,
        ?string $threadKey = null,
    ): Message {
        $credentials = config('google-chat.service_account_credentials');

        if (empty($credentials)) {
            throw new RuntimeException('Google Chat service account credentials are not configured.');
        }

        $client = new GoogleClient;
        $client->setAuthConfig($credentials);
        $client->addScope('https://www.googleapis.com/auth/chat.bot');

        $chat = new HangoutsChat($client);

        $message = new Message;
        $message->setText($text);

        $optParams = [];

        if ($threadName || $threadKey) {
            $thread = new Thread;

            if ($threadName) {
                $thread->setName($threadName);
            }

            if ($threadKey) {
                $thread->setThreadKey($threadKey);
                $optParams['messageReplyOption'] = 'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD';
            }

            $message->setThread($thread);
        }

        try {
            return $chat->spaces_messages->create($spaceName, $message, $optParams);
        } catch (\Throwable $exception) {
            Log::error('Failed to send Google Chat message.', [
                'space' => $spaceName,
                'thread' => $threadName,
                'thread_key' => $threadKey,
                'message' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}
