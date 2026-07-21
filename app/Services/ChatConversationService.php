<?php

namespace App\Services;

use App\Ai\Agents\ChatAgent;
use Laravel\Ai\Responses\AgentResponse;


class ChatConversationService
{
    /**
     * Send a message to the travel consultant agent and return the response.
     * Uses the same ChatAgent as the website chatbot.
     */
    public function prompt(object $participant, string $message, ?string $conversationId = null): AgentResponse
    {
        $agent = new ChatAgent;

        if ($conversationId) {
            $agent->continue($conversationId, as: $participant);
        } else {
            $agent->forUser($participant);
        }

        $provider = (string) config('ai.default', 'webui');

        return $agent->prompt(
            $message,
            provider: $provider,
            model: config("ai.providers.{$provider}.models.text.default"),
            timeout: 300,
        );
    }
}
