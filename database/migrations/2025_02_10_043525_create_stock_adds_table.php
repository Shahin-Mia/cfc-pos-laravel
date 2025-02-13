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
        Schema::create('stock_adds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stock_id');
            $table->double('last_quantity', 10, 2);
            $table->double('quantity', 10, 2);
            $table->unsignedBigInteger('created_by');

            $table->foreign('stock_id')->references('id')->on('stocks');
            $table->foreign('created_by')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_adds');
    }
};
