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
        if (!Schema::hasTable('home_pages')) {
            Schema::create('home_pages', function (Blueprint $table) {
                $table->id();
                $table->json('hero_slides')->nullable();
                $table->json('offers')->nullable();
                $table->json('themes')->nullable();
                $table->json('stats')->nullable();
                $table->json('testimonials')->nullable();
                $table->json('blogs')->nullable();
                $table->json('about')->nullable();
                $table->json('cta')->nullable();
                $table->json('reviews_bottom_content')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->string('og_title')->nullable();
                $table->text('og_description')->nullable();
                $table->string('og_image')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_pages');
    }
};
