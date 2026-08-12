<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            DB::statement('ALTER TABLE group_tours MODIFY image LONGTEXT NULL');
            DB::statement('ALTER TABLE group_tours MODIFY full_details LONGTEXT NULL');
        } catch (\Throwable $e) {
            try {
                Schema::table('group_tours', function (Blueprint $table) {
                    $table->longText('image')->nullable()->change();
                    $table->longText('full_details')->nullable()->change();
                });
            } catch (\Throwable $ex) {
                // Ignore fallback error
            }
        }

        try {
            DB::statement('ALTER TABLE group_tour_pages MODIFY banner_image LONGTEXT NULL');
            DB::statement('ALTER TABLE group_tour_pages MODIFY overview_image LONGTEXT NULL');
        } catch (\Throwable $e) {
            try {
                Schema::table('group_tour_pages', function (Blueprint $table) {
                    $table->longText('banner_image')->nullable()->change();
                    $table->longText('overview_image')->nullable()->change();
                });
            } catch (\Throwable $ex) {
                // Ignore fallback error
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
