<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Production extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'unit_id',
        'quantity',
        'price',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function productionElements()
    {
        return $this->hasMany(ProductionElement::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
