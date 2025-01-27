<?php

use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\UnitController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/", [HomeController::class, "index"])->name('home');
    Route::get("/checkout", [CheckoutController::class, "index"])->name('checkout');
    Route::get("/order-complete", [OrderController::class, "orderComplete"])->name('order.complete');
    Route::resource("/orders", OrderController::class);

    Route::group(["prefix" => "dashboard"], function () {
        Route::resource("/units", UnitController::class)->except(["create", "show", "edit"]);
        Route::resource("/categories", CategoryController::class)->except(["create", "show", "edit"]);
        Route::resource("/products", ProductController::class);
    });
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
