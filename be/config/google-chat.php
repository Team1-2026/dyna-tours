<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Google Chat Project Number
    |--------------------------------------------------------------------------
    |
    | Your Google Cloud project number. Used as the JWT audience when your Chat
    | app authentication audience is set to "Project Number" in Google Cloud.
    |
    */

    'project_number' => env('GOOGLE_CHAT_PROJECT_NUMBER'),

    /*
    |--------------------------------------------------------------------------
    | Authentication Audience
    |--------------------------------------------------------------------------
    |
    | The expected JWT audience claim. Use your project number when the Chat app
    | uses project-number authentication, or your full webhook URL when using
    | HTTP endpoint URL authentication.
    |
    */

    'audience' => env('GOOGLE_CHAT_AUDIENCE', env('GOOGLE_CHAT_PROJECT_NUMBER')),

    /*
    |--------------------------------------------------------------------------
    | Verify Incoming Requests
    |--------------------------------------------------------------------------
    |
    | When enabled, webhook requests must include a valid Google-signed JWT in
    | the Authorization header. Disable only for local development.
    |
    */

    'verify_requests' => env('GOOGLE_CHAT_VERIFY_REQUESTS', true),

    /*
    |--------------------------------------------------------------------------
    | Service Account Credentials
    |--------------------------------------------------------------------------
    |
    | Credentials used to call the Google Chat API for asynchronous replies.
    | Provide either a JSON string or a path to a service account key file.
    |
    */

    'service_account_credentials' => env('GOOGLE_CHAT_SERVICE_ACCOUNT_JSON')
        ? json_decode((string) env('GOOGLE_CHAT_SERVICE_ACCOUNT_JSON'), true)
        : (env('GOOGLE_CHAT_SERVICE_ACCOUNT_PATH') && is_readable(env('GOOGLE_CHAT_SERVICE_ACCOUNT_PATH'))
            ? env('GOOGLE_CHAT_SERVICE_ACCOUNT_PATH')
            : null),

    /*
    |--------------------------------------------------------------------------
    | Bot Messages
    |--------------------------------------------------------------------------
    */

    'welcome_message' => env('GOOGLE_CHAT_WELCOME_MESSAGE', 'Welcome! I am your premium AI Travel Consultant. Tell me your destination, travel dates, and preferences — I will curate tailored recommendations for you.'),

    'processing_message' => env('GOOGLE_CHAT_PROCESSING_MESSAGE', 'One moment while I prepare your travel recommendations...'),

    'error_message' => env('GOOGLE_CHAT_ERROR_MESSAGE', 'Sorry, I encountered an issue processing your request. Please try again in a moment.'),

    /*
    |--------------------------------------------------------------------------
    | Website ↔ Google Chat Bridge
    |--------------------------------------------------------------------------
    |
    | When set, website chat turns are mirrored into this Google Chat space
    | (one thread per visitor). Staff replies in those threads are delivered
    | back to the website chat widget.
    |
    | Example: spaces/AAAAAAAAAAA
    |
    */

    'bridge_space' => env('GOOGLE_CHAT_BRIDGE_SPACE'),

    'bridge_enabled' => (bool) env('GOOGLE_CHAT_BRIDGE_ENABLED', true),

];
