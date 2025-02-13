<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Element;
use App\Models\Production;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productions = Production::paginate(15);
        return Inertia::render("Production", [
            "productions" => $productions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $elements = Element::with(["stock"])->get();
        $units = Unit::all();

        return Inertia::render("ProductionForm", [
            "elements" => $elements,
            "units" => $units,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $vData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable|max:2000',
            'unit_id' => 'required|digits_between:1,9',
            'quantity' => 'required|between:1,9',
            'production_price' => 'required|between:1,9',
            'elements_selected' => 'nullable|Array',
        ]);
        // production insert
        $production = new Production();
        $production->title = $vData["title"];
        $production->description = $vData["description"];
        $production->unit_id = $vData["unit_id"];
        $production->quantity = $vData["quantity"];
        $production->price = $vData["production_price"];
        $production->save();

        // elements insert that used to make the production item
        foreach ($vData["elements_selected"] as $element) {
            $production_element = new ProductionElement();
            $production_element->production_id = $production->id;
            $production_element->element_id = $element['element_id'];
            $production_element->quantity = $element['quantity'];
            $production_element->price = $element['total_price'];
            $production_element->save();

            // deduct element stock & price
            $elementModel = Element::findOrFail($element['element_id']);
            $current_stock = $elementModel->stock->stock - $element['quantity'];
            $elementModel->stock->update([
                'stock' => $current_stock
            ]);
        }

        return redirect()->route("productions.create")->with('success', 'Production created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Production $production)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Production $production)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Production $production)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Production $production)
    {
        //
    }
}
