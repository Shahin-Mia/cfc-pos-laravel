<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        "user_id",
        "order_type",
        "payment_method",
        "status",
        "total_price",
        "pos_session_id",
        "subtotal",
        "tax",
        "discount_percentage",
        "discount_title",
    ];

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, "order_id");
    }

    public function session()
    {
        return $this->belongsTo(PosSession::class, "pos_session_id");
    }
}
