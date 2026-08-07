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
            DB::statement('ALTER TABLE cruises MODIFY banner_image LONGTEXT NULL');
            DB::statement('ALTER TABLE cruises MODIFY meta_description LONGTEXT NULL');
            DB::statement('ALTER TABLE cruises MODIFY canonical_url TEXT NULL');
        } catch (\Throwable $e) {
            try {
                Schema::table('cruises', function (Blueprint $table) {
                    $table->longText('banner_image')->nullable()->change();
                });
            } catch (\Throwable $ex) {
                // Ignore fallback error
            }
        }

        try {
            DB::statement('ALTER TABLE cruise_pages MODIFY banner_image LONGTEXT NULL');
            DB::statement('ALTER TABLE cruise_pages MODIFY overview_image LONGTEXT NULL');
            DB::statement('ALTER TABLE cruise_pages MODIFY cta_image LONGTEXT NULL');
        } catch (\Throwable $e) {
            // Ignore if cruise_pages columns are already text
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
