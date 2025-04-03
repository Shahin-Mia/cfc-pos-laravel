<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        "order_id",
        "meal_id",
        "meal_title",
        "quantity",
        "sale_price",
        "total_price",
        "comments",
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
