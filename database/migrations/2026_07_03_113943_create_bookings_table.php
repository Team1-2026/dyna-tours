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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('service_id');
            $table->string('requirements')->nullable();
            $table->date('from_date')->nullable();
            $table->date('to_date')->nullable();
            $table->unsignedInteger('num_travelers');
            $table->decimal('price_paid', 10, 2);
            $table->string('status')->default('pending'); // pending | confirmed | cancelled
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('booked_at')->useCurrent();
            $table->timestamps();

            $table->foreign('service_id')->references('id')->on('services')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
