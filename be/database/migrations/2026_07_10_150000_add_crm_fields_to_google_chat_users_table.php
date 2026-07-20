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
        Schema::table('google_chat_users', function (Blueprint $table) {
            if (! Schema::hasColumn('google_chat_users', 'requirements')) {
                $table->text('requirements')->nullable()->after('avatar_url');
            }

            if (! Schema::hasColumn('google_chat_users', 'notes')) {
                $table->text('notes')->nullable()->after('requirements');
            }

            if (! Schema::hasColumn('google_chat_users', 'status')) {
                $table->string('status', 32)->default('new')->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('google_chat_users', function (Blueprint $table) {
            $columns = array_values(array_filter(
                ['requirements', 'notes', 'status'],
                fn (string $column) => Schema::hasColumn('google_chat_users', $column),
            ));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
