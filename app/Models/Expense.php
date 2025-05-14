<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'description',
        'amount',
        'expense_date'
    ];

    public function image()
    {
        return $this->morphOne(Image::class, "imageable");
    }
}
