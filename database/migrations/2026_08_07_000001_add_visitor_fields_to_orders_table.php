<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('visitor_uuid')->nullable()->after('customer_id');
            $table->string('conversation_id')->nullable()->after('visitor_uuid');
            $table->string('source')->default('website_chat')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['visitor_uuid', 'conversation_id', 'source']);
        });
    }
};
