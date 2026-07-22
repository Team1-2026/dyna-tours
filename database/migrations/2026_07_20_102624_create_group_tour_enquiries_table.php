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
        Schema::create('group_tour_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->integer('num_travellers')->nullable();
            $table->text('message')->nullable();
            $table->foreignId('group_tour_id')->nullable()->constrained('group_tours')->nullOnDelete();
            $table->enum('status', ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'])->default('New');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_tour_enquiries');
    }
};
