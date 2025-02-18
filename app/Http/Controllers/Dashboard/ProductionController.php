<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Element;
use App\Models\Production;
use App\Models\ProductionElement;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productions = Production::with(["productionElements", "unit", "products"])->paginate(15);
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
        // // production insert
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
            $production_element->element_id = $element['id'];
            $production_element->quantity = $element['quantity'];
            $production_element->price = $element['total_price'];
            $production_element->save();

            // deduct element stock & price
            $elementModel = Element::findOrFail($element['id']);
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
    public function edit($id)
    {
        try {
            $production = Production::with(["unit", "productionElements.element.stock"])->findOrFail($id);
            $elements = Element::with(["stock"])->get();
            $units = Unit::all();

            return Inertia::render("ProductionForm", [
                "production" => $production,
                "elements" => $elements,
                "units" => $units
            ]);
        } catch (Exception $e) {
            return redirect()->route("productions.index")->with('error', 'Production can\'t edit!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $vData = $request->validate([
                'title' => 'required|max:255',
                'description' => 'nullable|max:2000',
                'unit_id' => 'required|digits_between:1,9',
                'quantity' => 'required|between:1,9',
                'production_price' => 'required|between:1,9',
                'elements_selected' => 'nullable|Array',
                'deleted_elements' => 'nullable|Array'
            ]);
            $production = Production::with(["unit", "productionElements.element.stock"])->findOrFail($id);
            // production update
            $production->title = $vData["title"];
            $production->description = $vData["description"];
            $production->unit_id = $vData["unit_id"];
            $production->quantity = $vData["quantity"];
            $production->price = $vData["production_price"];
            $production->save();

            if (isset($vData["deleted_elements"])) {
                foreach ($vData["deleted_elements"] as $deleted_element) {
                    if (isset($deleted_element['production_element_id'])) {
                        // get the production element
                        $pe = ProductionElement::find($deleted_element['production_element_id']);
                        // adjust the stock
                        $stock = $pe->element->stock;
                        $current_stock = $stock->stock;
                        $stock->update([
                            'stock' => $current_stock + $pe->quantity
                        ]);

                        // now delete
                        $pe->delete();
                    }
                }
            }
            // elements update
            foreach ($vData["elements_selected"] as $production_element) {
                // if item_id key exists then update the item
                // if not, means it is a new item, then create the item
                if (isset($production_element['production_element_id'])) {
                    $productionElement = ProductionElement::find($production_element['production_element_id']);
                    // go back to last state of stock
                    $current_stock = $productionElement->element->stock->stock;
                    $productionElement->element->stock->update([
                        'stock' => $current_stock + $productionElement->quantity
                    ]);

                    // now adjust stock
                    $current_stock = $productionElement->element->stock->stock;
                    $productionElement->element->stock->update([
                        'stock' => $current_stock - $production_element['quantity']
                    ]);

                    $productionElement->update($production_element);
                } else {
                    $p_element = new ProductionElement();
                    $p_element->production_id = $id;
                    $p_element->element_id = $production_element['id'];
                    $p_element->quantity = $production_element['quantity'];
                    $p_element->price = $production_element['total_price'];
                    $p_element->save();

                    // deduct element stock & price
                    $elementModel = Element::findOrFail($production_element['id']);
                    $current_stock = $elementModel->stock->stock - $production_element['quantity'];
                    $elementModel->stock->update([
                        'stock' => $current_stock
                    ]);
                }
            }
            return redirect()->route("productions.index")->with('success', 'Production has Updated.');
        } catch (Exception $e) {
            dd($e);
            return redirect()->route("productions.edit", $id)->with('error', 'Production can\'t update');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $production = Production::findOrFail($id);

        // delete production child(elements)
        foreach ($production->productionElements as $productionElement) {
            // make element's stock in it's last state
            $stock = $productionElement->element->stock;
            $stock->update([
                'stock' => $stock->stock + $productionElement->quantity
            ]);

            try {
                // now delete the element
                $productionElement->delete();
            } catch (\Throwable $th) {
                return redirect()->route("productions.index")->with('failed', 'Failed! It\'s In use.');
                return;
            }
        }


        try {
            // delete production
            $production->delete();
        } catch (\Throwable $th) {
            return redirect()->route("productions.index")->with('failed', 'Failed! It\'s In use.');
            return;
        }

        return redirect()->route("productions.index")->with('success', 'Production Item deleted.');
    }
}
