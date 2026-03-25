<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_opnames', function (Blueprint $table) {

            if (Schema::hasColumn('stock_opnames', 'stock_total_id')) {

                try {
                    $table->dropForeign(['stock_total_id']);
                } catch (\Exception $e) {
                    // ignore jika FK tidak ada
                }

                $table->dropColumn('stock_total_id');
            }

        });
    }

    public function down(): void
    {
        Schema::table('stock_opnames', function (Blueprint $table) {

            if (!Schema::hasColumn('stock_opnames', 'stock_total_id')) {

                $table->foreignId('stock_total_id')
                    ->nullable()
                    ->constrained()
                    ->cascadeOnDelete();

            }

        });
    }
};