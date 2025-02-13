<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('production_elements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('production_id');
            $table->unsignedBigInteger('element_id');
            $table->double('quantity', 10, 2);
            $table->double('price', 10, 2);

            $table->foreign('production_id')->references('id')->on('productions');
            $table->foreign('element_id')->references('id')->on('elements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_elements');
    }
};
