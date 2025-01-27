<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Categories", [
            "categories" => Category::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // Validate input data
        $validated = $request->validate([
            'name' => 'required|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        // Check if category already exists
        if (Category::where('name', $validated['name'])->exists()) {
            return redirect()->route("categories.index")->with('failed', 'Category already exists.');
        }

        $validated['category_id'] = $validated['category_id'] ?: null;
        var_dump($validated);
        // Create the category
        Category::create($validated);

        return redirect()->route("categories.index")->with('success', 'Category successfully created.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        // Find the category
        $category = Category::findOrFail($id);

        // Validate input data
        $validated = $request->validate([
            'name' => 'required|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $category->name = $validated['name'];
        $category->category_id = $validated['category_id'] ?: null;
        $category->save();

        return redirect()->route("categories.index")->with('success', 'Category successfully updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        $category = Category::findOrFail($id);

        // Check if category has subcategories or is in use
        try {
            foreach ($category->subCategories as $subCategory) {
                $subCategory->delete();
            }
            $category->delete();
        } catch (\Throwable $th) {
            return redirect()->route("categories.index")->with('failed', "Failed! It's in use.");
        }

        return redirect()->route("categories.index")->with('success', 'Category successfully deleted.');
    }
}
