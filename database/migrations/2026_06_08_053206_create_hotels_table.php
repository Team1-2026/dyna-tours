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
        Schema::create('hotels', function (Blueprint $table) {
            $table->string('id')->primary(); // slug
            $table->string('name');
            $table->string('destination_id'); // refers to destinations.id
            $table->text('short_description');
            $table->text('about');
            $table->string('location');
            $table->string('distance_from_attractions')->nullable();
            $table->string('category'); // e.g. '5-Star'
            $table->json('gallery')->nullable();
            $table->json('facilities')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('show_rooms')->default(true);
            $table->boolean('show_offer_label')->default(true);
            $table->boolean('show_price')->default(true);
            $table->decimal('price', 10, 2)->nullable();
            $table->string('offer_label')->nullable();
            // Hotel management fields
            $table->integer('order_no')->nullable();
            $table->string('status')->default('Active');
            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('url_slug')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            // Location fields
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            // Terms information
            $table->text('inclusions')->nullable();
            $table->text('exclusions')->nullable();
            $table->text('terms_conditions')->nullable();
            // Related hotels mapping
            $table->json('related_hotels')->nullable();
            $table->string('video_url')->nullable();
            $table->timestamps();

            $table->foreign('destination_id')->references('id')->on('destinations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
