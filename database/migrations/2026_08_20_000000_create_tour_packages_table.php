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
        Schema::create('tour_packages', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('destination');
            $table->string('category')->nullable();
            $table->string('tour_type')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->boolean('show_price')->default(true);
            $table->boolean('show_price_breakdown')->default(true);
            $table->decimal('tax', 12, 2)->default(0);
            $table->string('duration')->nullable();
            $table->integer('duration_days')->default(1);
            $table->integer('duration_nights')->default(0);
            $table->float('rating')->default(5.0);
            $table->integer('reviews_count')->default(0);
            $table->longText('description')->nullable();
            $table->json('overview')->nullable();
            $table->json('route_overview')->nullable();
            $table->json('highlights')->nullable();
            $table->json('itinerary')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->longText('image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('holiday_category')->nullable();
            $table->json('terms_and_conditions')->nullable();
            $table->json('cancellation_policy')->nullable();
            $table->json('quick_info')->nullable();
            $table->boolean('featured')->default(false);
            $table->json('related_tours')->nullable();
            $table->string('status')->default('active');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_packages');
    }
};
