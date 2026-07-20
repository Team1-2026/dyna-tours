<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $facilities = Facility::orderBy('name', 'asc')->get();
        return response()->json($facilities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $facility = Facility::create($validated);

        return response()->json([
            'message' => 'Facility created successfully',
            'facility' => $facility
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $facility->update($validated);

        return response()->json([
            'message' => 'Facility updated successfully',
            'facility' => $facility
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }

        $facility->delete();

        return response()->json([
            'message' => 'Facility deleted successfully'
        ]);
    }
}
