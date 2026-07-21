<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;



class GoogleIdentityService
{
    /**
     * @return array{name: string, email: string, picture: string|null, google_sub: string}
     */
    public function verifyIdToken(string $credential): array
    {
        $clientId = config('services.google.client_id');

        if (! filled($clientId)) {
            throw new RuntimeException('GOOGLE_OAUTH_CLIENT_ID is not configured.');
        }

        try {
            $client = new GoogleClient(['client_id' => $clientId]);
            $payload = $client->verifyIdToken($credential);
        } catch (Throwable $exception) {
            Log::warning('Google ID token verification failed.', [
                'message' => $exception->getMessage(),
            ]);

            throw new RuntimeException('Invalid Google credential.', 0, $exception);
        }

        if (! is_array($payload)) {
            throw new RuntimeException('Invalid Google credential.');
        }

        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? null;
        $sub = $payload['sub'] ?? null;

        if (! is_string($email) || $email === '' || ! is_string($sub) || $sub === '') {
            throw new RuntimeException('Google account is missing required profile fields.');
        }

        if (($payload['email_verified'] ?? false) !== true && ($payload['email_verified'] ?? '') !== 'true') {
            throw new RuntimeException('Google email is not verified.');
        }

        if (! is_string($name) || trim($name) === '') {
            $name = strstr($email, '@', true) ?: $email;
        }

        return [
            'name' => trim($name),
            'email' => $email,
            'picture' => is_string($payload['picture'] ?? null) ? $payload['picture'] : null,
            'google_sub' => $sub,
        ];
    }
}
