<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("UnitsManagement", [
            "units" => Unit::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable|max:255',
        ]);

        // Check if unit name already exists
        if (Unit::where('name', $request->name)->exists()) {
            return redirect()->back()->with('failed', 'Unit already exists.');
        }

        Unit::create($request->only(['name', 'description']));
        return redirect()->route('units.index')->with('success', 'Unit successfully created.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit)
    {
        $request->validate([
            'name' => 'required|max:255',
            'description' => 'nullable|max:255',
        ]);

        // Update unit attributes
        $unit->update($request->only(['name', 'description']));
        return redirect()->route('units.index')->with('success', 'Unit successfully updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        try {
            $unit->delete();
            return redirect()->route('units.index')->with('success', 'Unit successfully deleted.');
        } catch (\Throwable $th) {
            return redirect()->route('units.index')->with('failed', 'Failed! It\'s in use.');
        }
    }
}
