<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'production_id',
        'category_id',
        'sub_category_id',
        'title',
        'description',
        'model_no',
        'barcode',
        'created_by',
        'is_available',
    ];

    public function stock()
    {
        return $this->morphOne(Stock::class, 'stockable');
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function category()
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function SubCategory()
    {
        return $this->hasOne(Category::class, 'id', 'sub_category_id');
    }
}
