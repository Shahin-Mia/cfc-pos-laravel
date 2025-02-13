<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'production_id',
        'element_id',
        'quantity',
        'price',
    ];

    public function element()
    {
        return $this->belongsTo(Element::class, 'element_id');
    }
}
