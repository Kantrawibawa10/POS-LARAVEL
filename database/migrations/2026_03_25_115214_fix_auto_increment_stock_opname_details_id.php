<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("
            ALTER TABLE stock_opname_details
            MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        ");
    }

    public function down()
    {
        DB::statement("
            ALTER TABLE stock_opname_details
            MODIFY id BIGINT UNSIGNED NOT NULL
        ");
    }
};