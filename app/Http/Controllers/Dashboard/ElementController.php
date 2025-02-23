<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Element;
use App\Models\ElementCategory;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $elements = Element::with(["stock", "stock.purchaseUnit", "elementCategory"])->paginate(15);
        return Inertia::render("Elements", [
            "elements" => $elements
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $units = Unit::all();
        $elementCategories = ElementCategory::all();
        return Inertia::render("ElementForm", [
            "units" => $units,
            "elementCategories" => $elementCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $vElement = $request->validate([
                'title' => 'required|max:255',
                'description' => 'nullable|max:2000',
                'element_category_id' => 'required',
            ]);

            $vStock = $request->validate([
                'purchase_unit_id' => 'nullable|digits_between:1,10',
                'purchase_price' => 'nullable|between:1,10',
                'opening_stock' => 'required|between:1,10',
                'alert_quantity' => 'nullable|between:1,10',
            ]);

            // store element
            $vElement['created_by'] = 1; // @edit
            $element = Element::create($vElement);

            // store stock
            $vStock['stock'] = $vStock['opening_stock'];
            $element->stock()->create($vStock);

            // return success msg
            return redirect()->route("elements.create")->with('success', 'Element successfully added.');
        } catch (Exception $e) {
            return redirect()->route("elements.create")->with('error', 'Element successfully added.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Element $element)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $element = Element::with(["stock"])->findOrFail($id);
            $units = Unit::all();
            $elementCategories = ElementCategory::all();

            return Inertia::render("ElementForm", [
                "element" => $element,
                "units" => $units,
                "elementCategories" => $elementCategories

            ]);
        } catch (Exception $e) {
            return redirect()->route("elements.index")->with("error", $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $element = Element::find($id);
            $vElement = $request->validate([
                'title' => 'required|max:255',
                'description' => 'nullable|max:2000',
                'element_category_id' => 'required',
            ]);

            $vStock = $request->validate([
                'purchase_unit_id' => 'nullable|digits_between:1,10',
                'purchase_price' => 'nullable|between:0,10',
                'opening_stock' => 'required|between:0,10',
                'stock' => 'required|between:0,10',
                'alert_quantity' => 'nullable|between:0,10',
            ]);

            // store element
            $element->update($vElement);

            // store stock
            $element->stock->update($vStock);

            // return success msg
            return redirect()->route("elements.index")->with("success", "Element updated!");
        } catch (Exception $e) {
            return redirect()->route("elements.edit", $id)->with("error", $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $element = Element::findOrFail($id);
        try {
            $element->delete();
            $element->stock->delete();
        } catch (\Throwable $th) {
            return redirect()->route("elements.index")->with('failed', 'Failed! It\'s In use.');
        }
        return redirect()->route("elements.index")->with('success', 'Element has deleted.');
    }
}
