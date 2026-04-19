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
        Schema::table('preorders', function (Blueprint $table) {
            // 1. Create the column as nullable first (so existing rows don't crash)
            $table->uuid('uuid')->after('id')->nullable();
        });

        // 2. Populate existing rows with UUIDs
        $preorders = DB::table('preorders')->whereNull('uuid')->get();
        foreach ($preorders as $preorder) {
            DB::table('preorders')
                ->where('id', $preorder->id)
                ->update(['uuid' => (string) Str::uuid()]);
        }

        Schema::table('preorders', function (Blueprint $table) {
            // 3. Now that every row has a value, make it unique and non-nullable
            $table->uuid('uuid')->unique()->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preorders', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
