<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);
        if (count($cart) <= 0) {
            return to_route('home');
        } else {
            return Inertia::render('Checkout');
        }
    }
}
