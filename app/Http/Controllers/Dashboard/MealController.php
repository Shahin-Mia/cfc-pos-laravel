<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\MealCategory;
use App\Models\MealProduct;
use App\Models\Product;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $meals = Meal::with(["image", "mealCategory", "mealProducts.product.stock"])->paginate(15);
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
            'sale_unit_id' => 'required|digits_between:1,10|exists:units,id',
            'meal_category_id' => 'required|digits_between:1,10|exists:meal_categories,id',
            'purchase_price' => 'required',
            'sale_price' => 'required',
            'image' => 'required|image|max:2048|mimes:png,webp,bmp',
            'is_available' => 'required',
            'products_selected' => 'nullable|array'
        ]);

        try {
            $imagePath = $request->file('image')->store('meal_images', 'images');

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

            if (!empty($validatedData['products_selected'])) {
                foreach ($validatedData['products_selected'] as $product) {
                    $meal->mealProducts()->create([
                        'product_id' => $product['id'],
                        'quantity' => $product['quantity'],
                        'price' => $product['total_price'],
                    ]);
                }
            }


            return redirect()->route("meals.create")->with(["success" => "Meal created successfully!"]);
        } catch (Exception $e) {
            dd($e);
            return redirect()->route("meals.create")->with(["error" => "Meal not created!"]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $meal = Meal::with(['mealCategory', 'mealProducts.product.stock.purchaseUnit'])->findOrFail($id);
        $mealCategories = MealCategory::all();
        $units = Unit::all();
        $products = Product::with(['stock.saleUnit', 'stock.purchaseUnit', 'category'])->get();
        return Inertia::render("MealForm", [
            "mealCategories" => $mealCategories,
            "units" => $units,
            "products" => $products,
            "meal" => $meal
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable|max:2000',
            'sale_unit_id' => 'required|digits_between:1,10|exists:units,id',
            'meal_category_id' => 'required|digits_between:1,10|exists:meal_categories,id',
            'purchase_price' => 'required',
            'sale_price' => 'required',
            'image' => 'nullable|image|max:2048|mimes:png,webp,bmp',
            'is_available' => 'required',
            'products_selected' => 'nullable|array',
            'deleted_products' => 'nullable|array'
        ]);

        try {
            $meal = Meal::findOrFail($id);

            if (!empty($validatedData['deleted_products'])) {
                foreach ($validatedData['deleted_products'] as $product) {
                    if (isset($product["meal_product_id"])) {
                        $mealProduct = MealProduct::findOrFail($product["meal_product_id"]);
                        $mealProduct->delete();
                    }
                }
            }

            if (!empty($validatedData['products_selected'])) {
                foreach ($validatedData['products_selected'] as $product) {
                    if (isset($product["meal_product_id"])) {
                        $mealProduct = MealProduct::find($product["meal_product_id"]);
                        $mealProduct->update([
                            'quantity' => $product['quantity'],
                            'price' => $product['total_price']
                        ]);
                    } else {
                        $meal->mealProducts()->create([
                            'product_id' => $product['id'],
                            'quantity' => $product['quantity'],
                            'price' => $product['total_price'],
                        ]);
                    }
                }
            }

            $meal->update([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'sale_unit_id' => $validatedData['sale_unit_id'],
                'meal_category_id' => $validatedData['meal_category_id'],
                'purchase_price' => $validatedData['purchase_price'],
                'sale_price' => $validatedData['sale_price'],
                'is_available' => $validatedData['is_available'],
                'updated_by' => Auth::id()
            ]);

            if ($request->hasFile('image')) {
                $image = $meal->image;
                if (!$image) {
                    return redirect()->back()->withErrors(['error' => 'Image model not found.']);
                }

                // Delete old image
                if ($image->image) {
                    Storage::disk('images')->delete($image->image);
                }

                // Store new image
                $imagePath = $request->file('image')->store('meal_images', 'images');
                $image->update(['image' => $imagePath]);
            }

            return redirect()->route("meals.index")->with("success", "Meal updated!");
        } catch (Exception $e) {
            return redirect()->route("meals.edit", $id)->with("error", "Meal can't update!");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $meal = Meal::findOrFail($id);

            if ($meal) {
                // Delete image
                if ($meal->image) {
                    Storage::disk('images')->delete($meal->image->image);
                    $meal->image()->delete();
                }
                MealProduct::where('meal_id', $meal->id)->delete();
                $meal->delete();

                return redirect()->route("meals.index")->with(["success" => "Meal deleted successfully!"]);
            }
        } catch (Exception $e) {
            return redirect()->route("meals.index")->with(["error" => "Meal not deleted!"]);
        }
    }
}
