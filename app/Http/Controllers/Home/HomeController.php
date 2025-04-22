<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\MealCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $meals = Meal::with(['image'])->get();
        $menus = MealCategory::all();
        return Inertia::render('Home', [
            "Menus" => $menus,
            "Meals" => $meals
        ]);
    }

    public function saveCart(Request $request)
    {
        $cart = $request->input('cart');
        $totalPrict = $request->input('totalPrice');
        session([
            'cart' => $cart,
            'totalPrice' => $totalPrict
        ]);
        return response()->noContent();
    }
}
