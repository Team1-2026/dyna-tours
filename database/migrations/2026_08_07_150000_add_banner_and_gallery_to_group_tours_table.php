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
        Schema::table('group_tours', function (Blueprint $table) {
            if (!Schema::hasColumn('group_tours', 'banner_image')) {
                $table->longText('banner_image')->nullable();
            }
            if (!Schema::hasColumn('group_tours', 'banner_title')) {
                $table->string('banner_title')->nullable();
            }
            if (!Schema::hasColumn('group_tours', 'banner_tagline')) {
                $table->string('banner_tagline')->nullable();
            }
            if (!Schema::hasColumn('group_tours', 'gallery')) {
                $table->json('gallery')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_tours', function (Blueprint $table) {
            $table->dropColumn(['banner_image', 'banner_title', 'banner_tagline', 'gallery']);
        });
    }
};
