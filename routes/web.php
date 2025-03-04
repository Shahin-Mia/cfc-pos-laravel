<?php

use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Dashboard\ElementController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ProductionController;
use App\Http\Controllers\Dashboard\UnitController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Dashboard\MealCategoryController;
use App\Http\Controllers\Dashboard\MealController;
use App\Http\Controllers\Dashboard\ElementCategoryController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/", [HomeController::class, "index"])->name('home');
    Route::get("/checkout", [CheckoutController::class, "index"])->name('checkout');
    Route::get("/order-complete", [OrderController::class, "orderComplete"])->name('order.complete');
    Route::resource("/orders", OrderController::class);
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name("dashboard");

    Route::group(["prefix" => "dashboard"], function () {
        Route::resource("/units", UnitController::class)->except(["create", "show", "edit"]);
        Route::resource("/categories", CategoryController::class)->except(["create", "show", "edit"]);
        Route::resource("/products", ProductController::class)->except(["update"]);
        Route::resource("/meal-categories", MealCategoryController::class)->except(["create", "show", "edit", "update"]);
        // Route::resource("/elements", ElementController::class);
        // Route::resource("/productions", ProductionController::class);
        Route::resource("/meals", MealController::class);
        // Route::resource("/element-categories", ElementCategoryController::class);

        Route::post("/products/{product_id}", [ProductController::class, "update"])
            ->name("products.update");
        Route::post("/meal-categories/{meal_category_id}", [MealCategoryController::class, "update"])
            ->name("meal-categories.update");

        Route::get("/print-receipt", [ProductController::class, "printReceipt"])->name("print.receipt");
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
