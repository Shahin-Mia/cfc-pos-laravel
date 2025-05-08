<?php

use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\UnitController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Dashboard\MealCategoryController;
use App\Http\Controllers\Dashboard\MealController;
use App\Http\Controllers\Dashboard\SaleController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/", [HomeController::class, "index"])->name('home');
    Route::get("/checkout", [CheckoutController::class, "index"])->name('checkout');
    Route::post("/order-complete", [OrderController::class, "orderComplete"])->name('order.complete');
    Route::resource("/orders", OrderController::class);
    Route::get('/dashboard', [DashboardController::class, "index"])->name("dashboard");
    Route::post("/save-cart", [HomeController::class, "saveCart"])->name("save.cart");
    Route::post("/start-session", [HomeController::class, "startSession"])->name("start.session");
    Route::get("/end-session/{id}", [HomeController::class, "endSession"])->name("end.session");
    Route::get("/sales", [SaleController::class, "index"])->name("sales.index");
    Route::group(["prefix" => "dashboard"], function () {
        Route::resource("/units", UnitController::class)->except(["create", "show", "edit"]);
        Route::resource("/categories", CategoryController::class)->except(["create", "show", "edit"]);
        Route::resource("/products", ProductController::class)->except(["update"]);
        Route::resource("/meal-categories", MealCategoryController::class)->except(["create", "show", "edit", "update"]);
        Route::resource("/meals", MealController::class)->except(["update", "show"]);
        Route::post("/meals/{meal_id}", [MealController::class, "update"])->name("meals.update");

        Route::post("/products/{product_id}", [ProductController::class, "update"])
            ->name("products.update");
        Route::post("/products/{product_id}/stock", [ProductController::class, "stockAdd"])
            ->name("products.stock.add");
        Route::post("/meal-categories/{meal_category_id}", [MealCategoryController::class, "update"])
            ->name("meal-categories.update");

        Route::get("/sales", [SaleController::class, "getSales"])
            ->name("dashboard.sales");
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
