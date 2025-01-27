<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id'
    ];

    public function categoryParent()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subCategories()
    {
        return $this->hasMany(Category::class, 'category_id');
    }

    public function categoryProducts()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    public function subCategoryProducts()
    {
        return $this->hasMany(Product::class, 'sub_category_id');
    }
}
