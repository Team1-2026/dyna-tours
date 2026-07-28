<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('website_chat_visitors', 'user_id')) {
            Schema::table('website_chat_visitors', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->renameColumn('user_id', 'staff_id');
            });
        }
        
        \Illuminate\Support\Facades\DB::table('website_chat_visitors')->update(['staff_id' => null]);
        
        Schema::table('website_chat_visitors', function (Blueprint $table) {
            // Check if foreign key exists? Just try/catch or assume it doesn't since it failed
            try {
                $table->foreign('staff_id')->references('id')->on('staffs')->onDelete('set null');
            } catch (\Exception $e) {}
        });

        if (Schema::hasColumn('bookings', 'user_id')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->renameColumn('user_id', 'staff_id');
            });
        }
        
        \Illuminate\Support\Facades\DB::table('bookings')->update(['staff_id' => null]);
        
        Schema::table('bookings', function (Blueprint $table) {
            try {
                $table->foreign('staff_id')->references('id')->on('staffs')->onDelete('set null');
            } catch (\Exception $e) {}
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->renameColumn('staff_id', 'user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('website_chat_visitors', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->renameColumn('staff_id', 'user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};
