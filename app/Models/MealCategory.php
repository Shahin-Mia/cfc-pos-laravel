<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "description",
        "created_by",
        "updated_by"
    ];

    // public function meals()
    // {
    //     $this->hasMany(Meal::class);
    // }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
