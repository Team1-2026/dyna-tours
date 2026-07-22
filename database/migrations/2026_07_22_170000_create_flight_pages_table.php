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
        Schema::create('flight_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_headline')->nullable();
            $table->string('hero_tagline')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('overview_title')->nullable();
            $table->text('overview_description')->nullable();
            $table->string('overview_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('why_book_title')->nullable();
            $table->json('why_book_benefits')->nullable();
            $table->string('cta_heading')->nullable();
            $table->text('cta_text')->nullable();
            $table->string('cta_bg_image')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->json('faqs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_pages');
    }
};
