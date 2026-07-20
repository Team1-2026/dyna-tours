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
        Schema::create('services', function (Blueprint $table) {
            $table->string('id')->primary(); // slug, e.g. tour or package id
            $table->string('name');
            $table->string('type'); // tour | hotel | package | transfer
            $table->string('destination_id')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->foreign('destination_id')->references('id')->on('destinations')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
