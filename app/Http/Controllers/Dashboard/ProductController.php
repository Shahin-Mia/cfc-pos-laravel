<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::paginate(15);
        return Inertia::render("Products", [
            "products" => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    { {
            $categories = Category::where('category_id', null)->get();
            $units = Unit::all();

            $production = null;

            // Check if "production_id" exists in the request
            // if ($request->has('production_id')) {
            //     $production = Production::find($request->input('production_id'));
            // }

            return Inertia::render("ProductsCreate", [
                'categories' => $categories,
                'units' => $units,
                'production' => $production
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
