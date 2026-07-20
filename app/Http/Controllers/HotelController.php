<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Hotel::query();

        // Filter by destination (e.g. 'munnar')
        if ($request->has('destination_id') && $request->destination_id) {
            $query->where('destination_id', $request->destination_id);
        }

        // Filter by category (e.g. '5-Star')
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by hotel name keyword
        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        $hotels = $query->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC')->with(['destination', 'facilities'])->get();
        return response()->json($hotels);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $hotel = Hotel::with(['rooms', 'destination', 'facilities'])
            ->where('id', $id)
            ->orWhere('url_slug', $id)
            ->first();

        if (!$hotel) {
            return response()->json(['message' => 'Hotel not found'], 404);
        }

        return response()->json($hotel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json(['message' => 'Hotel not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'short_description' => 'sometimes|string',
            'about' => 'sometimes|string',
            'location' => 'sometimes|string',
            'distance_from_attractions' => 'sometimes|string|nullable',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric|nullable',
            'offer_label' => 'sometimes|string|nullable',
            'featured' => 'sometimes|boolean',
            'show_rooms' => 'sometimes|boolean',
            'show_offer_label' => 'sometimes|boolean',
            'show_price' => 'sometimes|boolean',
            'gallery' => 'sometimes|array',
            'facilities' => 'sometimes|array',
            // Hotel management fields
            'order_no' => 'sometimes|integer|nullable',
            'status' => 'sometimes|string',
            // SEO fields
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'url_slug' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
            'og_title' => 'sometimes|string|nullable',
            'og_description' => 'sometimes|string|nullable',
            // Location fields
            'country' => 'sometimes|string|nullable',
            'state' => 'sometimes|string|nullable',
            'city' => 'sometimes|string|nullable',
            // Terms info
            'inclusions' => 'sometimes|string|nullable',
            'exclusions' => 'sometimes|string|nullable',
            'terms_conditions' => 'sometimes|string|nullable',
            // Related hotels mapping
            'related_hotels' => 'sometimes|array|nullable',
            'video_url' => 'sometimes|string|nullable',
        ]);

        $hotel->update($validated);

        if ($request->has('facilities')) {
            $hotel->facilities()->sync($request->facilities);
        }

        \Illuminate\Support\Facades\Log::info("Hotel update payload rooms:", ["rooms" => $request->rooms]);
        // Update rooms if provided
        if ($request->has('rooms') && is_array($request->rooms)) {
            // Simple approach: delete existing and recreate, or update by ID
            $hotel->rooms()->delete();
            foreach ($request->rooms as $roomData) {
                $hotel->rooms()->create($roomData);
            }
        }

        return response()->json([
            'message' => 'Hotel updated successfully',
            'hotel' => $hotel->load(['rooms', 'facilities'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:hotels,id',
            'name' => 'required|string|max:255',
            'destination_id' => 'required|string|exists:destinations,id',
            'short_description' => 'required|string',
            'about' => 'required|string',
            'location' => 'required|string|max:255',
            'distance_from_attractions' => 'nullable|string|max:255',
            'category' => 'required|string|max:255',
            'gallery' => 'nullable|array',
            'facilities' => 'nullable|array',
            'featured' => 'sometimes|boolean',
            'show_rooms' => 'sometimes|boolean',
            'show_offer_label' => 'sometimes|boolean',
            'show_price' => 'sometimes|boolean',
            'price' => 'nullable|numeric',
            'offer_label' => 'nullable|string|max:255',
            // Hotel management fields
            'order_no' => 'nullable|integer',
            'status' => 'sometimes|string',
            // SEO fields
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'url_slug' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            // Location fields
            'country' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            // Terms info
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
            'terms_conditions' => 'nullable|string',
            // Related hotels mapping
            'related_hotels' => 'nullable|array',
            'video_url' => 'nullable|string',
        ]);

        if (!isset($validated['gallery'])) {
            $validated['gallery'] = [];
        }
        if (!isset($validated['facilities'])) {
            $validated['facilities'] = [];
        }

        $hotel = Hotel::create($validated);

        if ($request->has('facilities')) {
            $hotel->facilities()->sync($request->facilities);
        }

        \Illuminate\Support\Facades\Log::info("Hotel update payload rooms:", ["rooms" => $request->rooms]);
        // Update rooms if provided at creation
        if ($request->has('rooms') && is_array($request->rooms)) {
            foreach ($request->rooms as $roomData) {
                $hotel->rooms()->create($roomData);
            }
        }

        return response()->json([
            'message' => 'Hotel created successfully',
            'hotel' => $hotel->load(['rooms', 'facilities'])
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json(['message' => 'Hotel not found'], 404);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully'
        ]);
    }
}
