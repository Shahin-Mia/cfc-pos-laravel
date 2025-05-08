<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\PosSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public $opening_balance = 0;
    public $closing_balance = 0;
    public function index()
    {
        $activeSession = PosSession::open()->get()->first();
        if (!$activeSession) {
            $this->closing_balance = PosSession::latest()->first()->closing_cash;
        } else {
            $this->opening_balance = $activeSession->opening_cash;
        }
        $sales = OrderItem::select([
            'order_items.order_id',
            'order_items.meal_title',
            'order_items.quantity',
            'order_items.sale_price',
            'orders.discount_percentage',
        ])
            ->selectRaw('(order_items.sale_price * (1 - IFNULL(orders.discount_percentage, 0) / 100)) + (order_items.sale_price * 6 /100) AS gross_sale_price')
            ->selectRaw('order_items.sale_price * (1 - IFNULL(orders.discount_percentage, 0) / 100) AS net_sale_price')
            ->selectRaw('DATE(orders.created_at) as order_date')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'placed')
            // ->whereBetween('orders.created_at', [
            //     Carbon::today()->startOfDay(),
            //     Carbon::today()->now()
            // ])
            ->orderBy('orders.created_at', 'desc')
            ->get();
        $totalSale = round($sales->sum(function ($sale) {
            return $sale->gross_sale_price * $sale->quantity;
        }), 2);
        dd($totalSale);
        return Inertia::render("Sales", [
            "sales" => $sales,
            "totalSale" => $totalSale,
            "opening_balance" => $this->opening_balance,
            "closing_balance" => $this->closing_balance,
        ]);
    }

    public function getSales()
    {

        $sales = OrderItem::select([
            'order_items.meal_id',
            'order_items.meal_title',
        ])
            ->selectRaw('SUM(order_items.quantity) AS total_quantity')
            ->selectRaw('SUM(order_items.sale_price * order_items.quantity * (1 - IFNULL(orders.discount_percentage, 0) / 100)) AS total_net_sales')
            ->selectRaw('SUM((order_items.sale_price * order_items.quantity * (1 - IFNULL(orders.discount_percentage, 0) / 100)) + (order_items.sale_price * order_items.quantity * 6 / 100)) AS total_gross_sales')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'placed')
            ->whereBetween('orders.created_at', [
                Carbon::now()->startOfMonth(),
                Carbon::now(),
            ])
            ->groupBy('order_items.meal_id', 'order_items.meal_title')
            ->orderByDesc('total_quantity')
            ->get();
        $totalSale = round($sales->sum('total_gross_sales'), 2);
        $netSalePrice = round($sales->sum('total_net_sales'), 2);
        $taxCollection = round($totalSale - $netSalePrice, 2);
        $taxCollection = round($taxCollection, 2);
        return Inertia::render("DashboardSales", [
            "sales" => $sales,
            "totalSale" => $totalSale,
            "netSalePrice" => $netSalePrice,
            "taxCollection" => $taxCollection
        ]);
    }
}
