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
        Schema::create('group_tour_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('tagline')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('overview_heading')->nullable();
            $table->text('overview_description')->nullable();
            $table->string('overview_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_tour_pages');
    }
};
