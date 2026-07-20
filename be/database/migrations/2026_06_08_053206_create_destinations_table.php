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
        Schema::create('destinations', function (Blueprint $table) {
            $table->string('id')->primary(); // slug
            $table->string('name');
            $table->string('type'); // 'domestic' | 'international'
            $table->string('parent_id')->nullable(); // self-referencing for hierarchy
            $table->text('overview');
            $table->text('how_to_reach')->nullable();
            $table->text('best_time_to_visit')->nullable();
            $table->string('banner_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('top_attractions')->nullable();
            $table->boolean('show_packages')->default(true);
            $table->boolean('show_hotels')->default(true);
            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('url_slug')->nullable();
            $table->string('canonical_url')->nullable();
            // Location fields
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            // Related tour packages mapping
            $table->json('related_tours')->nullable();
            $table->integer('order_no')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
