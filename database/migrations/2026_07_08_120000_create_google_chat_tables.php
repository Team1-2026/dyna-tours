<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('google_chat_users', function (Blueprint $table) {
            $table->id();
            $table->string('google_user_name')->unique();
            $table->string('display_name')->nullable();
            $table->string('email')->nullable();
            $table->string('avatar_url')->nullable();
            $table->timestamps();
        });

        Schema::create('google_chat_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('google_chat_user_id')->constrained()->cascadeOnDelete();
            $table->string('space_name');
            $table->string('thread_name')->nullable();
            $table->string('agent_conversation_id', 36)->nullable()->index();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['google_chat_user_id', 'space_name', 'thread_name'], 'google_chat_conversations_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('google_chat_conversations');
        Schema::dropIfExists('google_chat_users');
    }
};
