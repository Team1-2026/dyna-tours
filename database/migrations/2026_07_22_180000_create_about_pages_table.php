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
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            
            // 1. Hero Banner
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_bg_image')->nullable();
            
            // 2. Company Overview
            $table->string('overview_title')->nullable();
            $table->text('overview_description')->nullable();
            $table->string('overview_image_1')->nullable();
            $table->string('overview_image_2')->nullable();
            $table->integer('years_experience')->default(16);
            
            // 3. Founder's Message
            $table->string('founder_name')->nullable();
            $table->string('founder_title')->nullable();
            $table->string('founder_image')->nullable();
            $table->text('founder_message')->nullable();
            $table->text('founder_quote')->nullable();
            $table->string('founder_signature')->nullable();
            
            // 4. Mission & Vision
            $table->string('mission_title')->nullable();
            $table->text('mission_text')->nullable();
            $table->string('vision_title')->nullable();
            $table->text('vision_text')->nullable();
            
            // 5. Why Choose Us
            $table->string('why_choose_title')->nullable();
            $table->json('why_choose_cards')->nullable();
            
            // 6. Our Services
            $table->string('services_title')->nullable();
            $table->json('services_list')->nullable();
            
            // 7. Trusted Partner
            $table->string('trusted_partner_title')->nullable();
            $table->text('trusted_partner_description')->nullable();
            $table->string('trusted_partner_bg_image')->nullable();
            $table->json('trust_badges')->nullable();
            
            // 8. Achievements
            $table->string('achievements_title')->nullable();
            $table->string('achievements_bg_image')->nullable();
            $table->json('achievement_counters')->nullable();
            
            // 9. Certifications & Memberships
            $table->string('certifications_title')->nullable();
            $table->json('certification_logos')->nullable();
            
            // 10. Call To Action (CTA)
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->string('cta_bg_image')->nullable();
            $table->string('cta_primary_btn_text')->nullable();
            $table->string('cta_primary_btn_url')->nullable();
            $table->string('cta_secondary_btn_text')->nullable();
            $table->string('cta_secondary_btn_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_pages');
    }
};
