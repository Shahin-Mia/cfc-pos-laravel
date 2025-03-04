<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\MealCategory;
use App\Models\Product;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $meals = Meal::with(["image", "mealCategory"])->paginate(15);
        return Inertia::render("Meals", [
            "meals" => $meals
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mealCategories = MealCategory::all();
        $units = Unit::all();
        $products = Product::with(['stock.saleUnit', 'stock.purchaseUnit', 'category'])->get();
        return Inertia::render("MealForm", [
            "mealCategories" => $mealCategories,
            "units" => $units,
            "products" => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable|max:2000',
            'sale_unit_id' => 'required',
            'meal_category_id' => 'required',
            'purchase_price' => 'required',
            'sale_price' => 'required',
            'image' => 'required|image|max:2048|mimes:png,webp,bmp',
            'is_available' => 'required',
            'products_selected' => 'nullable|array'
        ]);

        try {
            $imagePath = $request->file('image')->store('product_images', 'public');

            $meal = Meal::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'sale_unit_id' => $validatedData['sale_unit_id'],
                'meal_category_id' => $validatedData['meal_category_id'],
                'purchase_price' => $validatedData['purchase_price'],
                'sale_price' => $validatedData['sale_price'],
                'is_available' => $validatedData['is_available'],
                'created_by' => Auth::id(),
                'updated_by' => Auth::id()
            ]);

            $meal->image()->create(['image' => $imagePath]);

            foreach ($validatedData['products_selected'] as $product) {
                $meal->mealProducts()->create([
                    'product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'price' => $product['total_price'],
                ]);
            }


            return redirect()->route("meals.create")->with(["success" => "Meal created successfully!"]);
        } catch (Exception $e) {
            dd($e);
            return redirect()->route("meals.create")->with(["error" => "Meal not created!"]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Meal $meal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Meal $meal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Meal $meal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Meal $meal)
    {
        //
    }
}
