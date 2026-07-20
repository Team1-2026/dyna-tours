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
            if (! Schema::hasColumn('website_chat_visitors', 'bridge_thread_key')) {
                $table->string('bridge_thread_key')->nullable()->unique()->after('last_message_at');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'bridge_thread_name')) {
                $table->string('bridge_thread_name')->nullable()->index()->after('bridge_thread_key');
            }

            if (! Schema::hasColumn('website_chat_visitors', 'bridge_space_name')) {
                $table->string('bridge_space_name')->nullable()->after('bridge_thread_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_chat_visitors', function (Blueprint $table) {
            $columns = array_values(array_filter(
                ['bridge_thread_key', 'bridge_thread_name', 'bridge_space_name'],
                fn (string $column) => Schema::hasColumn('website_chat_visitors', $column),
            ));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
