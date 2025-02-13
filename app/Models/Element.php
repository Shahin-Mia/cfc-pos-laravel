<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'created_by'
    ];

    public function stock()
    {
        return $this->morphOne(Stock::class, 'stockable');
    }
}
