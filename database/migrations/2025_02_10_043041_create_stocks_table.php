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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stockable_id');
            $table->string('stockable_type');
            $table->unsignedBigInteger('purchase_unit_id');
            $table->double('purchase_price', 10, 2); // single purchase unit price
            $table->unsignedBigInteger('sale_unit_id')->nullable();
            $table->double('sale_price', 10, 2)->nullable(); // sale price in sale unit
            $table->double('conversion_rate', 10, 2)->nullable(); // 1 purchase unit how many in sale unit. eg: 1Box=12pcs. = 12
            $table->double('opening_stock', 10, 2); // opening stock in sale unit
            $table->double('stock', 10, 2); // stock in sale unit = purchase unit * rate 
            $table->double('alert_quantity', 10, 2)->nullable(); // in sale unit

            $table->foreign('purchase_unit_id')->references('id')->on('units');
            $table->foreign('sale_unit_id')->references('id')->on('units');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
