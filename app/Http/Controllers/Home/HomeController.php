<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\MealCategory;
use App\Models\PosSession;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $meals = Meal::with(['image', 'varients'])->get();
        $menus = MealCategory::all();
        $pos_session = PosSession::where('status', 'open')->first();
        return Inertia::render('Home', [
            "Menus" => $menus,
            "Meals" => $meals,
            "pos_session" => $pos_session
        ]);
    }

    public function saveCart(Request $request)
    {
        $cart = $request->input('cart');
        $totalPrice = $request->input('totalPrice');
        session()->put('cart', $cart);
        session()->put('totalPrice', $totalPrice);
        return response()->noContent();
    }

    public function startSession(Request $request)
    {
        $validated_data = $request->validate([
            'opening_cash' => "required"
        ]);

        try {
            PosSession::create([
                ...$validated_data,
                "user_id" => Auth::id(),
            ]);

            return redirect()->route("home")->with(["success" => "Session created!"]);
        } catch (Exception $e) {
            return redirect()->route("home")->with(["error" => "Session not created!"]);
        }
    }
    public function endSession($id)
    {
        $activeSession = PosSession::with('orders')->findOrFail($id);

        if ($activeSession->status === 'open') {
            $closing_cash = $activeSession->orders->sum('total_price');
            $activeSession->update([
                'closing_cash' => $closing_cash,
                'status' => 'closed',
                'closed_at' => DB::raw('CURRENT_TIMESTAMP'),
            ]);

            return redirect()->route('home')->with('success', 'Session ended!');
        }

        return redirect()->route('home')->with('error', "Session can't be ended!");
    }
}
