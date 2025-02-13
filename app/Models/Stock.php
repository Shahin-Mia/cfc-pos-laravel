<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_unit_id',
        'purchase_price',
        'sale_unit_id',
        'sale_price',
        'conversion_rate',
        'opening_stock',
        'stock',
        'alert_quantity'
    ];

    public function stockable()
    {
        return $this->morphTo();
    }

    public function saleUnit()
    {
        return $this->hasOne(Unit::class, 'id', 'sale_unit_id');
    }

    public function purchaseUnit()
    {
        return $this->hasOne(Unit::class, 'id', 'purchase_unit_id');
    }

    public function stockAdds()
    {
        return $this->hasMany(StockAdd::class, 'stock_id');
    }
}
