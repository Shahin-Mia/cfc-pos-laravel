<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render("Orders");
    }

    public function orderComplete()
    {
        return Inertia::render('OrderComplete');
    }
}
