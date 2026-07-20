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
        Schema::table('website_chat_visitors', function (Blueprint $table) {
            if (! Schema::hasColumn('website_chat_visitors', 'email')) {
                $table->string('email')->nullable()->after('name');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'requirements')) {
                $table->text('requirements')->nullable()->after('phone');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'notes')) {
                $table->text('notes')->nullable()->after('requirements');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'status')) {
                $table->string('status')->default('new')->after('notes'); // new | in_progress | contacted | qualified | closed
            }

            if (! Schema::hasColumn('website_chat_visitors', 'agent_conversation_id')) {
                $table->string('agent_conversation_id', 36)->nullable()->index()->after('status');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'last_message_at')) {
                $table->timestamp('last_message_at')->nullable()->after('agent_conversation_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_chat_visitors', function (Blueprint $table) {
            $columns = [
                'email',
                'phone',
                'requirements',
                'notes',
                'status',
                'agent_conversation_id',
                'last_message_at',
            ];

            $existing = array_values(array_filter(
                $columns,
                fn (string $column) => Schema::hasColumn('website_chat_visitors', $column),
            ));

            if ($existing !== []) {
                $table->dropColumn($existing);
            }
        });
    }
};
