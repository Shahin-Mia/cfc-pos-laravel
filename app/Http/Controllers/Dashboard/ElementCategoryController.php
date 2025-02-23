<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ElementCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ElementCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $elementCategories = ElementCategory::paginate(15);
        return Inertia::render("ElementCategories", [
            "elementCategories" => $elementCategories
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $vData = $request->validate([
                "name" => "required|max:255"
            ]);

            ElementCategory::create([
                "name" => $vData["name"],
                "created_by" => Auth::id(),
                "updated_by" => Auth::id()
            ]);

            return redirect()->route("element-categories.index")->with("success", "Element Category created!");
        } catch (Exception $e) {
            return redirect()->route("element-categories.index")->with("error", $e->getMessage());
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $vData = $request->validate([
                "name" => "required|max:255"
            ]);

            $elementCategory = ElementCategory::findOrFail($id);
            $elementCategory->update([
                "name" => $vData["name"],
                "updated_by" => Auth::id()
            ]);

            return redirect()->route("element-categories.index")->with("success", "Element Category updated!");
        } catch (Exception $e) {
            return redirect()->route("element-categories.index")->with("error", $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $elementCategory = ElementCategory::findOrFail($id);
            $elementCategory->delete();
            return redirect()->route("element-categories.index")->with("success", "Element Category deleted");
        } catch (Exception $e) {
            return redirect()->route("element-categories.index")->with("error", $e->getMessage());
        }
    }
}
