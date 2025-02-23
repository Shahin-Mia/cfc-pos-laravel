<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'element_category_id',
        'description',
        'created_by'
    ];

    public function stock()
    {
        return $this->morphOne(Stock::class, 'stockable');
    }
    public function elementCategory()
    {
        return $this->hasOne(ElementCategory::class, "id", "element_category_id");
    }
}
