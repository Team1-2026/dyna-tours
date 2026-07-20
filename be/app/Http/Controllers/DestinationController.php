<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all destinations. Eager load subDestinations.
        $destinations = Destination::with('subDestinations')
            ->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC')
            ->get();
        return response()->json($destinations);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $destination = Destination::with(['subDestinations', 'hotels'])
            ->where('id', $id)
            ->orWhere('url_slug', $id)
            ->first();

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        return response()->json($destination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $destination = Destination::find($id);

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'overview' => 'sometimes|string',
            'how_to_reach' => 'sometimes|string|nullable',
            'best_time_to_visit' => 'sometimes|string|nullable',
            'show_packages' => 'sometimes|boolean',
            'show_hotels' => 'sometimes|boolean',
            'banner_image' => 'sometimes|string|nullable',
            'gallery' => 'sometimes|array',
            'top_attractions' => 'sometimes|array',
            // SEO fields
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'url_slug' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
            // Location fields
            'country' => 'sometimes|string|nullable',
            'state' => 'sometimes|string|nullable',
            'city' => 'sometimes|string|nullable',
            // Related tours mapping
            'related_tours' => 'sometimes|array|nullable',
            'order_no' => 'sometimes|integer|nullable',
        ]);

        $destination->update($validated);

        return response()->json([
            'message' => 'Destination updated successfully',
            'destination' => $destination
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:destinations,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:domestic,international',
            'parent_id' => 'nullable|string|exists:destinations,id',
            'overview' => 'required|string',
            'how_to_reach' => 'nullable|string',
            'best_time_to_visit' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'top_attractions' => 'nullable|array',
            'show_packages' => 'sometimes|boolean',
            'show_hotels' => 'sometimes|boolean',
            // SEO fields
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'url_slug' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            // Location fields
            'country' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            // Related tours mapping
            'related_tours' => 'nullable|array',
            'order_no' => 'nullable|integer',
        ]);

        $destination = Destination::create($validated);

        return response()->json([
            'message' => 'Destination created successfully',
            'destination' => $destination
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $destination = Destination::find($id);

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        $destination->delete();

        return response()->json([
            'message' => 'Destination deleted successfully'
        ]);
    }
}
