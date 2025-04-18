<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MealCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MealCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mealCategories = MealCategory::with(["image"])->paginate(15);
        return Inertia::render("MealCategory", [
            "mealCategories" => $mealCategories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            "name" => "required|max:255",
            "description" => "required|max:2000",
            "image" => "required|image|max:2048|mimes:png,webp,bmp"
        ]);
        try {

            $imagePath = $request->file("image")->store("", "meal_images");

            $mealCategory = MealCategory::create([
                "name" => $validatedData["name"],
                "description" => $validatedData["description"],
                "created_by" => Auth::id(),
                "updated_by" => Auth::id(),
            ]);

            $mealCategory->image()->create(["image" => $imagePath]);
        } catch (Exception $e) {
            return redirect()->route("meal-categories.index")->with("error", $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $meal_category_id)
    {
        $validatedData = $request->validate([
            "name" => "nullable|max:255",
            "description" => "nullable|max:2000",
            "image" => "nullable|image|max:2048|mimes:png,webp,bmp"
        ]);
        try {

            $mealCategory = MealCategory::findOrFail($meal_category_id);

            $mealCategory->name = $validatedData["name"] ? $validatedData["name"] : $mealCategory->name;
            $mealCategory->description = $validatedData["description"] ?
                $validatedData["description"] :
                $mealCategory->description;

            $mealCategory->updated_by = Auth::id();

            $mealCategory->save();

            if ($request->hasFile("image")) { {
                    $image = $mealCategory->image;
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
            }

            return redirect()->route("meal-categories.index")->with("success", "Meal category updated!");
        } catch (Exception $e) {
            return redirect()->route("meal-categories.index")->with("error", "Meal category can't update!");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $category = MealCategory::findOrFail($id);
            $image = $category->image;

            Storage::disk("public")->delete($image->image);

            $category->delete();
            return redirect()->route("meal-categories.index")->with("success", "Meal category deleted!");
        } catch (Exception $e) {
            return redirect()->route("meal-categories.index")->with("error", "Meal category can't delete!");
        }
    }
}
