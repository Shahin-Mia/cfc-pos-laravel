<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockAdd extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'last_quantity',
        'created_by',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
