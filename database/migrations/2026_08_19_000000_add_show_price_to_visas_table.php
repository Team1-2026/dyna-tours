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
        if (Schema::hasTable('visas') && !Schema::hasColumn('visas', 'show_price')) {
            Schema::table('visas', function (Blueprint $table) {
                $table->boolean('show_price')->default(true)->after('price');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('visas') && Schema::hasColumn('visas', 'show_price')) {
            Schema::table('visas', function (Blueprint $table) {
                $table->dropColumn('show_price');
            });
        }
    }
};
