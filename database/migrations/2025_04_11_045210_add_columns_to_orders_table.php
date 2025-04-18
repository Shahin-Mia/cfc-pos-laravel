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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->after('total_price')->nullable();
            $table->decimal('tax', 10, 2)->after('subtotal')->nullable();
            $table->decimal('discount_percentage', 5, 2)->after('tax')->nullable();
            $table->string('discount_title')->after('discount_percentage')->nullable();
            $table->foreignId('pos_session_id')->after('user_id')->nullable()->constrained('pos_sessions')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal',
                'tax',
                'discount_percentage',
                'discount_title',
            ]);

            $table->dropForeign(['pos_session_id']);
            $table->dropColumn('pos_session_id');
        });
    }
};
