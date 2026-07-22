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
        Schema::create('group_tours', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('destination');
            $table->enum('type', ['domestic', 'international']);
            $table->string('image')->nullable();
            $table->string('duration');
            $table->date('departure_date')->nullable();
            $table->decimal('starting_price', 10, 2);
            $table->enum('status', ['Filling Fast', 'Limited Seats', 'Available', 'Sold Out'])->default('Available');
            $table->text('full_details')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('featured_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_tours');
    }
};
