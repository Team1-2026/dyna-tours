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
        Schema::create('cruises', function (Blueprint $table) {
            $table->string('id')->primary(); // slug e.g. 'mediterranean-escape'
            $table->string('name');
            $table->string('destination');
            $table->string('duration');
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('show_price')->default(true);
            $table->text('short_description');
            $table->text('about')->nullable();
            $table->longText('banner_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('highlights')->nullable();
            $table->json('itinerary')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('need_to_know')->nullable();
            $table->json('faqs')->nullable();
            $table->json('reviews')->nullable();
            $table->boolean('featured')->default(true);
            $table->integer('order_no')->nullable();
            $table->string('status')->default('Active');
            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('url_slug')->nullable();
            $table->string('canonical_url')->nullable();
            $table->timestamps();
        });

        Schema::create('cruise_pages', function (Blueprint $table) {
            $table->id();
            $table->string('banner_title')->default('Cruise Holidays');
            $table->string('banner_tagline')->default("Sail in Luxury – Discover the World's Most Spectacular Cruise Journeys");
            $table->string('banner_image')->nullable();
            $table->string('overview_heading')->default('Experience Unrivalled Luxury on the Seas');
            $table->text('overview_description')->nullable();
            $table->string('overview_image')->nullable();
            $table->string('overview_cta_text')->default('View Cruise Packages');
            $table->string('cta_heading')->default('Ready to Set Sail?');
            $table->text('cta_description')->default('Book your dream cruise holiday with Dyna Tours India.');
            $table->string('cta_image')->nullable();
            $table->string('cta_button1_text')->default('Enquire Now');
            $table->string('cta_button2_text')->default('Talk to Expert');
            $table->json('faqs')->nullable();
            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cruise_pages');
        Schema::dropIfExists('cruises');
    }
};
