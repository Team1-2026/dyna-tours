<?php

namespace App\Http\Controllers;

use App\Services\ChatConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationalAgentController extends Controller
{
    public function __construct(
        protected ChatConversationService $chatConversationService,
    ) {}

    public function startConversation(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $message = $request->message;
        $response = $this->chatConversationService->prompt($user, $message);

        return response()->json([
            'conversation_id' => $response->conversationId,
            'user_message' => $message,
            'agent_response' => (string) $response,
            'hint' => 'Save the conversation_id for next message',
        ]);
    }

    public function continueConversation(Request $request): JsonResponse
    {
        $request->validate([
            'conversation_id' => 'required|string|max:1000',
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $conversationId = $request->input('conversation_id');
        $message = $request->input('message');
        $response = $this->chatConversationService->prompt($user, $message, $conversationId);

        return response()->json([
            'conversation_id' => $conversationId,
            'user_message' => $message,
            'agent_response' => (string) $response,
            'hint' => 'Save the conversation_id for next message',
        ]);
    }
}
