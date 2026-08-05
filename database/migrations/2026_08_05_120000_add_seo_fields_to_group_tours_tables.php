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
        Schema::table('group_tour_pages', function (Blueprint $table) {
            if (!Schema::hasColumn('group_tour_pages', 'meta_title')) {
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->string('url_slug')->nullable();
                $table->string('og_title')->nullable();
                $table->text('og_description')->nullable();
                $table->text('og_image')->nullable();
                $table->string('canonical_url')->nullable();
                $table->text('structured_data')->nullable();
            }
        });

        Schema::table('group_tours', function (Blueprint $table) {
            if (!Schema::hasColumn('group_tours', 'meta_title')) {
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->string('url_slug')->nullable();
                $table->string('og_title')->nullable();
                $table->text('og_description')->nullable();
                $table->text('og_image')->nullable();
                $table->string('canonical_url')->nullable();
                $table->text('structured_data')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_tour_pages', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title', 'meta_description', 'meta_keywords', 'url_slug',
                'og_title', 'og_description', 'og_image', 'canonical_url', 'structured_data'
            ]);
        });

        Schema::table('group_tours', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title', 'meta_description', 'meta_keywords', 'url_slug',
                'og_title', 'og_description', 'og_image', 'canonical_url', 'structured_data'
            ]);
        });
    }
};
