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

    public function orderComplete(Request $request)
    {
        dd($request->all());
        return Inertia::render('OrderComplete');
    }
}
