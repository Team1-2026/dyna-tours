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
        Schema::table('cruises', function (Blueprint $table) {
            $table->string('banner_title')->nullable()->after('banner_image');
            $table->string('banner_tagline')->nullable()->after('banner_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cruises', function (Blueprint $table) {
            $table->dropColumn(['banner_title', 'banner_tagline']);
        });
    }
};
