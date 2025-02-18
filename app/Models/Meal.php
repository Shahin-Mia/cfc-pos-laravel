<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    protected $fillable = [
        "title",
        "meal_category_id",
        "purchase_price",
        "sale_price",
        "is_available",
        "description",
        "created_by",
        "updated_by"
    ];

    public function image()
    {
        $this->morphOne(Image::class, "imageable");
    }

    public function mealCategory()
    {
        $this->hasOne(MealCategory::class, "id", "meal_category_id");
    }

    public function mealProducts()
    {
        $this->hasMany(MealProduct::class);
    }
}
