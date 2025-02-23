<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElementCategory extends Model
{
    protected $fillable = [
        "name",
        "created_by",
        "updated_by"
    ];

    public function elements()
    {
        $this->hasMany(Element::class);
    }
}
