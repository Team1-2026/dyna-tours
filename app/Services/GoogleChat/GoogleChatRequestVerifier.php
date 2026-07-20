<?php

namespace App\Services\GoogleChat;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use UnexpectedValueException;

class GoogleChatRequestVerifier
{
    private const JWKS_URI = 'https://www.googleapis.com/service_accounts/v1/jwk/chat@system.gserviceaccount.com';

    private const ISSUER = 'chat@system.gserviceaccount.com';

    public function verify(Request $request): bool
    {
        if (! config('google-chat.verify_requests')) {
            return true;
        }

        $authorization = $request->header('Authorization');

        if (! is_string($authorization) || ! str_starts_with($authorization, 'Bearer ')) {
            return false;
        }

        $token = substr($authorization, 7);

        try {
            $jwks = $this->jwks();
            $decoded = JWT::decode($token, JWK::parseKeySet($jwks));
        } catch (UnexpectedValueException $exception) {
            Log::warning('Google Chat JWT verification failed.', [
                'message' => $exception->getMessage(),
            ]);

            return false;
        }

        if (($decoded->iss ?? null) !== self::ISSUER) {
            return false;
        }

        $audience = config('google-chat.audience');

        if (! $audience) {
            return false;
        }

        $tokenAudience = $decoded->aud ?? null;

        if (is_array($tokenAudience)) {
            return in_array($audience, $tokenAudience, true);
        }

        return $tokenAudience === $audience;
    }

    /**
     * @return array<string, mixed>
     */
    protected function jwks(): array
    {
        return Cache::remember('google_chat_jwks', now()->addHour(), function () {
            $response = Http::timeout(10)->get(self::JWKS_URI);

            if (! $response->successful()) {
                throw new UnexpectedValueException('Unable to fetch Google Chat JWKS.');
            }

            return $response->json();
        });
    }
}