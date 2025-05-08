<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PosSession;
use App\Services\PrinterService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public $orders = [];

    public function __construct(protected PrinterService $printerService) {}

    public function index()
    {
        $activeSession = PosSession::open()->get()->first();
        if ($activeSession) {
            $this->orders = $activeSession->orders()
                ->with(["orderItems"])
                ->get();
        }
        // $this->orders = Order::with(["orderItems"])->->latest()->get();

        return Inertia::render("Orders", [
            "orders" => $this->orders
        ]);
    }

    public function orderComplete(Request $request)
    {
        $v_data = $request->validate([
            "total_price" => "required",
            "order_type" => "required",
            "cart" => "required|Array",
            "payment_method" => "required",
            "tax" => "required",
            "subtotal" => "required",
            "discount_percentage" => "nullable",
            "discount_title" => "nullable",
            "pos_session_id" => "required",
        ]);
        $data = [...$v_data, "status" => "placed", "user_id" => Auth::id()];

        $order = Order::create($data);


        foreach ($v_data["cart"] as $orderItem) {
            $order->orderItems()->create([
                "meal_id" => $orderItem["id"],
                "varient_id" => $orderItem["varient_id"],
                "meal_title" => $orderItem["title"],
                "quantity" => $orderItem["quantity"],
                "sale_price" => $orderItem["sale_price"],
                "total_price" => $orderItem["quantity"] * $orderItem["sale_price"],
                "comments" => isset($orderItem["comment"]) ? $orderItem["comment"] : null,
            ]);
        }

        $this->printerService->printReceipt([...$v_data, "id" => $order->id]);
        session()->forget('cart');
        session()->forget('totalPrice');
        return Inertia::render('OrderComplete', [
            "order" => $order
        ]);
    }
}
