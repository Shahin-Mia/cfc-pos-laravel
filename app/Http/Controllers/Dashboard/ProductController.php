<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\ImagickEscposImage;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with([
            'stock',
            'category',
            'subCategory',
            'image',
            'stock.saleUnit',
            'stock.purchaseUnit'
        ])->paginate(15);
        return Inertia::render("Products", [
            "products" => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $categories = Category::where('category_id', null)->get();
        $subCategories = Category::whereNot('category_id', null)->get();
        $units = Unit::all();

        $production = null;

        // Check if "production_id" exists in the request
        // if ($request->has('production_id')) {
        //     $production = Production::find($request->input('production_id'));
        // }

        return Inertia::render("ProductForm", [
            'categories' => $categories,
            'subCategories' => $subCategories,
            'units' => $units,
            // 'production' => $production
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the form data
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'model' => 'nullable|max:255',
            'barcode' => 'nullable|max:255',
            'category' => 'nullable|digits_between:1,10|exists:categories,id',
            'sub_category' => 'nullable|digits_between:1,10|exists:categories,id',
            'purchase_unit' => 'required|digits_between:1,10|exists:units,id',
            'purchase_price' => 'required|numeric|between:0,99999999.99',
            'sale_unit' => 'required|digits_between:1,10|exists:units,id',
            'sale_price' => 'required|numeric|between:0,99999999.99',
            'conversion_rate' => 'required|numeric|gt:0',
            'opening_stock' => 'required|numeric',
            'availability' => 'nullable|boolean',
            'description' => 'nullable|max:2000',
            'alert_quantity' => 'nullable|numeric',
            'image' => 'required|image|max:2048|mimes:jpg,bmp,png',
            'production_id' => 'nullable|exists:productions,id'
        ]);

        // Check for production association
        $production = null;
        // if ($request->has('production_id')) {
        //     $production = Production::find($request->input('production_id'));
        //     if ($production && $production->quantity < $validatedData['opening_stock']) {
        //         return response()->json(['error' => 'Insufficient production quantity'], 400);
        //     }
        // }

        // Store the product image
        $imagePath = $request->file('image')->store('product_images', 'public');

        // Create the product
        $product = new Product();
        $product->title = $validatedData['title'];
        $product->model_no = $validatedData['model'];
        $product->barcode = $validatedData['barcode'];
        $product->category_id = $validatedData['category'];
        $product->sub_category_id = $validatedData['sub_category'];
        $product->description = $validatedData['description'];
        $product->is_available = $validatedData['availability'] ?? 1;
        $product->created_by = Auth::id();

        // If from production, reduce stock and associate production
        if ($production) {
            $product->production_id = $production->id;
            $production->decrement('quantity', $validatedData['opening_stock']);
        }

        $product->save();

        // Create stock entry
        $product->stock()->create([
            'purchase_unit_id' => $validatedData['purchase_unit'],
            'purchase_price' => $validatedData['purchase_price'],
            'sale_unit_id' => $validatedData['sale_unit'],
            'sale_price' => $validatedData['sale_price'],
            'conversion_rate' => $validatedData['conversion_rate'],
            'opening_stock' => $validatedData['opening_stock'],
            'stock' => $validatedData['opening_stock'],
            'alert_quantity' => $validatedData['alert_quantity'],
        ]);

        // Attach image to the product
        $product->image()->create(['image' => $imagePath]);

        return redirect()->route("products.create")->with("success", "Product successfully added!");
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit($product_id)
    {
        $product = Product::with(['stock', 'image', 'stock.stockAdds'])->findOrFail($product_id);

        $categories = Category::where('category_id', null)->get();
        $subCategories = [];
        if (!empty($product->sub_category_id)) {
            $subCategories = Category::where('id', $product->sub_category_id)->get();
        }
        $units = Unit::all();

        return Inertia::render('ProductForm', [
            'product' => $product,
            'categories' => $categories,
            'subCategories' => $subCategories,
            'units' => $units,
        ]);
    }

    public function update(Request $request, $product_id)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|max:255',
                'model' => 'nullable|max:255',
                'barcode' => 'nullable|max:255',
                'category' => 'bail|nullable',
                'sub_category' => 'bail|nullable',
                'purchase_unit' => 'bail|required|digits_between:1,10|exists:units,id',
                'purchase_price' => 'required|between:0,10',
                'sale_unit' => 'bail|required|digits_between:1,10|exists:units,id',
                'sale_price' => 'required|between:0,10',
                'conversion_rate' => 'required|between:1,10',
                'opening_stock' => 'required|between:0,10',
                'availability' => 'nullable|max:2',
                'description' => 'nullable|max:2000',
                'alert_quantity' => 'bail|nullable|between:0,10',
                'image' => 'bail|nullable|max:2048|image|mimes:jpg,bmp,png',
            ]);
            $product = Product::findOrFail($product_id);
            $product->title = $validatedData['title'];
            $product->model_no = $validatedData['model'];
            $product->barcode = $validatedData['barcode'];
            $product->is_available = $validatedData['availability'] ?? 1;
            $product->description = $validatedData['description'];
            $product->category_id = $validatedData['category'];
            $product->sub_category_id = $validatedData['sub_category'];
            $product->save();

            // Update stock details
            $stock = $product->stock;
            if (!$stock) {
                return redirect()->back()->withErrors(['error' => 'Stock not found.']);
            }
            $stock->update([
                'purchase_unit_id' => $validatedData['purchase_unit'],
                'purchase_price' => $validatedData['purchase_price'],
                'sale_unit_id' => $validatedData['sale_unit'],
                'sale_price' => $validatedData['sale_price'],
                'conversion_rate' => $validatedData['conversion_rate'],
                'opening_stock' => $validatedData['opening_stock'],
                'stock' => $validatedData['opening_stock'],
                'alert_quantity' => $validatedData['alert_quantity'],
            ]);

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $image = $product->image;
                if (!$image) {
                    return redirect()->back()->withErrors(['error' => 'Image model not found.']);
                }

                // Delete old image
                if ($image->image) {
                    Storage::disk('public')->delete($image->image);
                }

                // Store new image
                $imagePath = $request->file('image')->store('product_images', 'public');
                $image->update(['image' => $imagePath]);
            }

            return redirect()->route('products.index')->with('success', 'Product successfully updated.');
        } catch (ValidationException $th) {
            return redirect()->route('products.edit', $product_id)->with('error', $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $stock = $product->stock;
        if ($stock) {
            // check children
            try {
                $stock->delete();
            } catch (\Throwable $th) {
                return redirect()->route("products.index")->with('error', 'Failed! It\'s In use.');
                return;
            }
        }

        $image = $product->image;
        if ($image) {
            $image->delete();
            Storage::disk('public')->delete($product->image->image);
        }

        // check children
        try {
            $product->delete();
        } catch (\Throwable $th) {
            return redirect()->route("products.index")->with('error', 'Failed! It\'s In use.');
            return;
        }
        return redirect()->route("products.index")->with('success', 'Product successfully deleted.');
    }

    public function printReceipt()
    {
        try {
            $connector = new NetworkPrintConnector("192.168.1.23", 9100);  // Replace with your printer's IP
            $printer = new Printer($connector);

            // === HEADER ===
            $printer->setPrintLeftMargin(50);
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->setTextSize(2, 2); // Double size text for shop name
            $printer->text("My Laravel Shop\n");
            $printer->setTextSize(1, 1); // Reset text size
            $printer->text("123 Main St, City\n");
            $printer->text("Phone: (123) 456-7890\n");
            $printer->feed(1); // Line break

            // === TRANSACTION INFO ===
            $printer->setJustification(Printer::JUSTIFY_LEFT);
            $printer->text("Date: " . date('Y-m-d H:i:s') . "\n");
            $printer->text("Receipt #: 12345\n");
            $printer->feed(1);

            // === ITEM LIST ===
            $printer->setEmphasis(true);
            $printer->text(str_pad("Item", 20) . str_pad("Qty", 5) . "Price\n");
            $printer->setEmphasis(false);
            $printer->text(str_repeat("-", 32) . "\n");  // Separator line

            // Sample items
            $items = [
                ['name' => 'Coffee', 'qty' => 2, 'price' => 5.00],
                ['name' => 'Bagel', 'qty' => 1, 'price' => 3.50],
                ['name' => 'Donut', 'qty' => 3, 'price' => 4.50],
            ];

            $total = 0;

            foreach ($items as $item) {
                $line = str_pad($item['name'], 20) .
                    str_pad($item['qty'], 5) .
                    number_format($item['price'], 2) . "\n";
                $printer->text($line);
                $total += $item['price'] * $item['qty'];
            }

            $printer->text(str_repeat("-", 32) . "\n");

            // === TOTAL ===
            $printer->setEmphasis(true);
            $printer->text(str_pad("Total:", 25) . "$" . number_format($total, 2) . "\n");
            $printer->setEmphasis(false);

            $printer->feed(2);  // Line break

            // === FOOTER ===
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("Thank you for your purchase!\n");
            $printer->text("Visit us again at mylaravelshop.com\n");
            $printer->feed(3);  // Add space before cutting

            $printer->cut();
            $printer->close();
        } catch (Exception $e) {
            return "Couldn't print: " . $e->getMessage();
        }
    }
}
