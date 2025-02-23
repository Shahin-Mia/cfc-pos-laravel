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
        Schema::table('elements', function (Blueprint $table) {
            $table->unsignedBigInteger('element_category_id');
            // $table->foreign("element_category_id")->references("id")->on("element_categories")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('elements', function (Blueprint $table) {
            //
        });
    }
};
