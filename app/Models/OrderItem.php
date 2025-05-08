<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderItem extends Model
{
    protected $fillable = [
        "order_id",
        "meal_id",
        "meal_title",
        "varient_id",
        "quantity",
        "sale_price",
        "total_price",
        "comments",
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function varient(): HasOne
    {
        return $this->hasOne(Varients::class, 'id', 'varient_id');
    }
}
