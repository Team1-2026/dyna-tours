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
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'destination' | 'hotel'
            $table->string('target_id'); // e.g. destination slug or hotel slug
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->integer('num_people')->nullable(); // destination form
            $table->string('travel_date')->nullable(); // destination form
            $table->string('check_in')->nullable(); // hotel form
            $table->string('check_out')->nullable(); // hotel form
            $table->integer('num_adults')->nullable(); // hotel form
            $table->integer('num_children')->nullable(); // hotel form
            $table->string('children_ages')->nullable(); // hotel form, e.g. '5, 8'
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
