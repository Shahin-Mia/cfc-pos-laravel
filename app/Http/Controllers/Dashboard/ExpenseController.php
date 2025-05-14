<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with(['image'])->latest()->get();

        return Inertia::render("Expense/Expenses", [
            'expenses' => $expenses
        ]);
    }

    public function store(Request $request)
    {
        $v_data = $request->validate([
            'description' => 'required',
            'amount' => 'required',
            'expense_date' => 'required',
            'attachments' => 'nullable'
        ]);

        try {
            $expense = Expense::create([
                'description' => $v_data['description'],
                'amount' => $v_data['amount'],
                'expense_date' => $v_data['expense_date'],
            ]);

            if ($request->hasfile('attachments')) {
                $filepath = $request->file('attachments')->store('receipts', 'images');
                $expense->image()->create([
                    "image" => $filepath
                ]);
            }
        } catch (Exception $e) {
            return redirect()->back()->with(["error" => "Expense can't save!"]);
        }


        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $v_data = $request->validate([
            'description' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'expense_date' => 'nullable|date',
            'attachments' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240' // Optional file upload validation
        ]);

        try {
            // Find the expense by its ID
            $expense = Expense::findOrFail($id);

            // Update the fields if new values are provided
            $data = [
                'description' => isset($v_data['description']) ? $v_data['description'] : $expense->description,
                'amount' => isset($v_data['amount']) ? $v_data['amount'] : $expense->amount,
                'expense_date' => isset($v_data['expense_date']) ? $v_data['expense_date'] : $expense->expense_date,
            ];

            // Update the expense record
            $expense->update($data);

            // If an attachment is uploaded, handle the file upload
            if ($request->hasFile('attachments')) {
                // Delete the old image if it exists
                if ($expense->image) {
                    $oldImagePath = public_path('storage/' . $expense->image->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath); // Delete the old image file
                    }
                }

                // Store the new image file
                $filepath = $request->file('attachments')->store('receipts', 'images');

                $expense->image()->update([
                    'image' => $filepath
                ]);
            }

            // Return back with success message
            return redirect()->route('expense.index')->with('success', 'Expense updated successfully!');
        } catch (Exception $e) {
            // In case of error, return back with an error message
            return redirect()->back()->with('error', 'Failed to update expense!');
        }
    }


    public function getReceipt($id)
    {
        try {
            $expense = Expense::findOrFail($id); // Find the expense by ID
            $imagePath = public_path('storage/' . $expense->image->image); // Path to the image in the storage folder
            // dd($imagePath);
            // Return the file as a download response
            return response()->download($imagePath, 'receipt.jpg');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Receipt not found!');
        }
    }
}
