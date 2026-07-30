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
        Schema::table('hotels', function (Blueprint $table) {
            if (!Schema::hasColumn('hotels', 'is_visible')) {
                $table->boolean('is_visible')->default(true);
            }
            if (!Schema::hasColumn('hotels', 'show_details')) {
                $table->boolean('show_details')->default(true);
            }
            if (!Schema::hasColumn('hotels', 'banner_heading')) {
                $table->string('banner_heading')->nullable();
            }
            if (!Schema::hasColumn('hotels', 'banner_tagline')) {
                $table->string('banner_tagline')->nullable();
            }
        });

        Schema::table('destinations', function (Blueprint $table) {
            if (!Schema::hasColumn('destinations', 'banner_heading')) {
                $table->string('banner_heading')->nullable();
            }
            if (!Schema::hasColumn('destinations', 'banner_tagline')) {
                $table->string('banner_tagline')->nullable();
            }
            if (!Schema::hasColumn('destinations', 'status')) {
                $table->string('status')->default('Active');
            }
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->text('image')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            if (Schema::hasColumn('hotels', 'is_visible')) {
                $table->dropColumn('is_visible');
            }
            if (Schema::hasColumn('hotels', 'show_details')) {
                $table->dropColumn('show_details');
            }
            if (Schema::hasColumn('hotels', 'banner_heading')) {
                $table->dropColumn('banner_heading');
            }
            if (Schema::hasColumn('hotels', 'banner_tagline')) {
                $table->dropColumn('banner_tagline');
            }
        });

        Schema::table('destinations', function (Blueprint $table) {
            if (Schema::hasColumn('destinations', 'banner_heading')) {
                $table->dropColumn('banner_heading');
            }
            if (Schema::hasColumn('destinations', 'banner_tagline')) {
                $table->dropColumn('banner_tagline');
            }
            if (Schema::hasColumn('destinations', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
