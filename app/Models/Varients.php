<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Varients extends Model
{
    protected $fillable = [
        'meal_id',
        'name',
        'extra_price'
    ];

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }
}
