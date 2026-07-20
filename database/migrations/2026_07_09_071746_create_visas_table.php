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
        Schema::create('visas', function (Blueprint $table) {
            $table->string('id')->primary(); // Using string for ID since they use slugs like 'singapore'
            $table->string('name');
            $table->string('flag');
            $table->enum('type', ['e-visa', 'stamped']);
            $table->string('price')->nullable();
            $table->string('processing_time');
            $table->string('validity');
            $table->string('biometric');
            $table->string('entry_type')->nullable();
            $table->string('stay_period')->nullable();
            $table->text('description')->nullable();
            $table->json('requirements')->nullable();
            $table->json('important_notes')->nullable();
            $table->json('terms')->nullable();
            $table->json('faqs')->nullable();
            $table->string('region')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visas');
    }
};
