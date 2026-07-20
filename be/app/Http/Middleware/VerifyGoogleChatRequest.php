<?php

namespace App\Http\Middleware;

use App\Services\GoogleChat\GoogleChatRequestVerifier;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyGoogleChatRequest
{
    public function __construct(
        protected GoogleChatRequestVerifier $verifier,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->verifier->verify($request)) {
            abort(Response::HTTP_UNAUTHORIZED, 'Invalid Google Chat request.');
        }

        return $next($request);
    }
}
