<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider Names
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the AI providers below should be the
    | default for AI operations when no explicit provider is provided
    | for the operation. This should be any provider defined below.
    |
    */

    // Open WebUI + Ollama is the default chatbot backend
    'default' => env('AI_PROVIDER', 'webui'),
    'default_for_images' => 'gemini',
    'default_for_audio' => 'openai',
    'default_for_transcription' => 'openai',
    'default_for_embeddings' => 'openai',
    'default_for_reranking' => 'cohere',

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    |
    | Below you may configure caching strategies for AI related operations
    | such as embedding generation. You are free to adjust these values
    | based on your application's available caching stores and needs.
    |
    */

    'caching' => [
        'embeddings' => [
            'cache' => false,
            'store' => env('CACHE_STORE', 'database'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Providers
    |--------------------------------------------------------------------------
    |
    | Below are each of your AI providers defined for this application. Each
    | represents an AI provider and API key combination which can be used
    | to perform tasks like text, image, and audio creation via agents.
    |
    */

    'providers' => [
        'anthropic' => [
            'driver' => 'anthropic',
            'key' => env('ANTHROPIC_API_KEY'),
            'url' => env('ANTHROPIC_URL', 'https://api.anthropic.com/v1'),
        ],

        'azure' => [
            'driver' => 'azure',
            'key' => env('AZURE_OPENAI_API_KEY'),
            'url' => env('AZURE_OPENAI_URL'),
            'api_version' => env('AZURE_OPENAI_API_VERSION', '2025-04-01-preview'),
            'deployment' => env('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o'),
            'embedding_deployment' => env('AZURE_OPENAI_EMBEDDING_DEPLOYMENT', 'text-embedding-3-small'),
            'image_deployment' => env('AZURE_OPENAI_IMAGE_DEPLOYMENT', 'gpt-image-1'),
            'store' => env('AZURE_OPENAI_STORE', true),
        ],

        'bedrock' => [
            'driver' => 'bedrock',
            'region' => env('AWS_BEDROCK_REGION', 'us-east-1'),
            'key' => env('AWS_BEARER_TOKEN_BEDROCK'),
            'access_key_id' => env('AWS_ACCESS_KEY_ID'),
            'secret_access_key' => env('AWS_SECRET_ACCESS_KEY'),
            'session_token' => env('AWS_SESSION_TOKEN'),
            'use_default_credential_provider' => env('AWS_USE_DEFAULT_CREDENTIALS', true),
        ],

        'cohere' => [
            'driver' => 'cohere',
            'key' => env('COHERE_API_KEY'),
        ],

        'deepseek' => [
            'driver' => 'deepseek',
            'key' => env('DEEPSEEK_API_KEY'),
        ],

        /*
         * Open WebUI (already wired to Ollama).
         * Uses the DeepSeek driver because it speaks /chat/completions,
         * which Open WebUI exposes. Laravel's openai driver uses /responses
         * and will not work against WebUI.
         */
        'webui' => [
            'driver' => 'deepseek',
            'key' => env('WEBUI_API_KEY'),
            'url' => env('WEBUI_URL')
                ? rtrim((string) env('WEBUI_URL'), '/').'/api/v1'
                : 'http://localhost:8080/api/v1',
            'models' => [
                'text' => [
                    'default' => env('AI_MODEL', 'llama3.2'),
                    'cheapest' => env('AI_MODEL_CHEAPEST', env('AI_MODEL', 'llama3.2')),
                    'smartest' => env('AI_MODEL_SMARTEST', env('AI_MODEL', 'llama3.2')),
                ],
            ],
        ],

        'eleven' => [
            'driver' => 'eleven',
            'key' => env('ELEVENLABS_API_KEY'),
        ],

        'gemini' => [
            'driver' => 'gemini',
            'key' => env('GEMINI_API_KEY'),
            'url' => env('GEMINI_URL', 'https://generativelanguage.googleapis.com/v1beta/'),
        ],

        'groq' => [
            'driver' => 'groq',
            'key' => env('GROQ_API_KEY'),
        ],

        'jina' => [
            'driver' => 'jina',
            'key' => env('JINA_API_KEY'),
        ],

        'mistral' => [
            'driver' => 'mistral',
            'key' => env('MISTRAL_API_KEY'),
        ],

        'ollama' => [
            'driver' => 'ollama',
            'key' => env('OLLAMA_API_KEY', ''),
            'url' => env('OLLAMA_URL', 'http://localhost:11434'),
        ],

        'nvidia' => [
            'driver' => 'deepseek',
            'key' => env('NVIDIA_API_KEY'),
            'url' => env('NVIDIA_URL', 'https://integrate.api.nvidia.com/v1'),
            'models' => [
                'text' => [
                    'default' => env('AI_MODEL', 'z-ai/glm-5.2'),
                    'cheapest' => env('AI_MODEL_CHEAPEST', env('AI_MODEL', 'z-ai/glm-5.2')),
                    'smartest' => env('AI_MODEL_SMARTEST', env('AI_MODEL', 'z-ai/glm-5.2')),
                ],
            ],
        ],

        'openai' => [
            'driver' => 'openai',
            'key' => env('OPENAI_API_KEY', env('WEBUI_API_KEY')),
            'url' => env(
                'OPENAI_URL',
                env('WEBUI_URL')
                    ? rtrim((string) env('WEBUI_URL'), '/').'/api/v1'
                    : 'https://api.openai.com/v1'
            ),
            'store' => env('OPENAI_STORE', false),
            'models' => [
                'text' => [
                    'default' => env('AI_MODEL', 'gpt-4o'),
                    'cheapest' => env('AI_MODEL_CHEAPEST', env('AI_MODEL', 'gpt-4o')),
                    'smartest' => env('AI_MODEL_SMARTEST', env('AI_MODEL', 'gpt-4o')),
                ],
            ],
        ],

        'openrouter' => [
            'driver' => 'openrouter',
            'key' => env('OPENROUTER_API_KEY'),
        ],

        'voyageai' => [
            'driver' => 'voyageai',
            'key' => env('VOYAGEAI_API_KEY'),
        ],

        'xai' => [
            'driver' => 'xai',
            'key' => env('XAI_API_KEY'),
        ],
    ],

];
