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
        Schema::create('contact_pages', function (Blueprint $table) {
            $table->id();
            
            // Hero Banner
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_bg_image')->nullable();
            $table->string('hero_cta_primary_text')->nullable();
            $table->string('hero_cta_primary_url')->nullable();
            $table->string('hero_cta_secondary_text')->nullable();
            $table->string('hero_cta_secondary_url')->nullable();
            
            // Contact Information
            $table->string('office_name')->nullable();
            $table->text('office_address')->nullable();
            $table->text('google_maps_url')->nullable();
            $table->json('phone_numbers')->nullable();
            $table->json('email_addresses')->nullable();
            $table->string('business_hours_weekday')->nullable();
            $table->string('business_hours_weekend')->nullable();
            
            // Brand & Social
            $table->string('brand_tagline')->nullable();
            $table->text('brand_description')->nullable();
            $table->json('social_links')->nullable();
            
            // Sections & Map
            $table->json('quick_contact_cards')->nullable();
            $table->json('why_contact_cards')->nullable();
            $table->text('map_embed_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_pages');
    }
};
