<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class PosSession extends Model
{
    protected $fillable = [
        'user_id',
        'opening_cash',
        'closing_cash',
        'opened_at',
        'closed_at',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'pos_session_id');
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeCurrentUser($query)
    {
        return $query->where('user_id', Auth::id());
    }
}
