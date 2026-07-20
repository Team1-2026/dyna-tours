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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('hotel_id'); // refers to hotels.id
            $table->string('type'); // e.g. 'Deluxe Room'
            $table->string('size')->nullable(); // e.g. '350 sq.ft'
            $table->string('view')->nullable(); // e.g. 'Garden View'
            $table->string('bed_type')->nullable(); // e.g. 'King Bed'
            $table->string('breakfast')->nullable(); // e.g. 'Included'
            $table->string('occupancy')->nullable(); // e.g. '2 Adults'
            $table->string('image')->nullable();
            // New fields for room category management
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->json('amenities')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('video_url')->nullable();
            $table->integer('remaining_rooms')->nullable();
            $table->timestamps();

            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
