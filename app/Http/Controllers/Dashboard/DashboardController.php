<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $yesterdaySales = Order::whereDate("created_at", now()->subDay())->sum("total_price");
        return Inertia::render("Dashboard", [
            "yesterdaySales" => $yesterdaySales
        ]);
    }
}
