<?php

namespace App\Jobs;

use App\Models\WebsiteChatVisitor;
use App\Services\GoogleChat\WebsiteChatBridgeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class MirrorWebsiteChatToGoogleChat implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $timeout = 60;

    public function __construct(
        public int $visitorId,
        public string $userMessage,
        public string $aiResponse,
    ) {}

    public function handle(WebsiteChatBridgeService $bridgeService): void
    {
        $visitor = WebsiteChatVisitor::query()->find($this->visitorId);

        if (! $visitor) {
            return;
        }

        $bridgeService->mirrorTurn($visitor, $this->userMessage, $this->aiResponse);
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('MirrorWebsiteChatToGoogleChat failed.', [
            'visitor_id' => $this->visitorId,
            'message' => $exception?->getMessage(),
        ]);
    }
}
