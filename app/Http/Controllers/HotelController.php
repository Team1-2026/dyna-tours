<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $hotels = $query->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC, id ASC')->with(['destination', 'facilities'])->get();
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
            'order_no' => 'sometimes|integer|min:0|nullable',
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
            'is_visible' => 'sometimes|boolean',
            'show_details' => 'sometimes|boolean',
            'banner_heading' => 'sometimes|string|nullable',
            'banner_tagline' => 'sometimes|string|nullable',
            'rooms' => 'sometimes|array|nullable',
        ]);

        return DB::transaction(function () use ($request, $validated, $hotel, $id) {
            if (isset($validated['order_no']) && $validated['order_no'] !== null && $validated['order_no'] != $hotel->order_no) {
                $newOrder = (int) $validated['order_no'];
                Hotel::where('id', '!=', $id)
                    ->where('order_no', '>=', $newOrder)
                    ->increment('order_no');
            }

            $rooms = $validated['rooms'] ?? null;
            unset($validated['rooms']);

            $hotel->update($validated);

            if ($request->has('facilities')) {
                $hotel->facilities()->sync($request->facilities);
            }

            if ($rooms !== null && is_array($rooms)) {
                $hotel->rooms()->delete();
                foreach ($rooms as $roomData) {
                    if (is_array($roomData) && !empty($roomData['type'])) {
                        unset($roomData['id'], $roomData['hotel_id'], $roomData['created_at'], $roomData['updated_at']);
                        if (isset($roomData['price']) && ($roomData['price'] === '' || $roomData['price'] === null)) {
                            $roomData['price'] = null;
                        } elseif (isset($roomData['price']) && is_numeric($roomData['price'])) {
                            $roomData['price'] = (float) $roomData['price'];
                        }
                        if (isset($roomData['remaining_rooms']) && ($roomData['remaining_rooms'] === '' || $roomData['remaining_rooms'] === null)) {
                            $roomData['remaining_rooms'] = null;
                        } elseif (isset($roomData['remaining_rooms']) && is_numeric($roomData['remaining_rooms'])) {
                            $roomData['remaining_rooms'] = (int) $roomData['remaining_rooms'];
                        }
                        if (!isset($roomData['images']) || !is_array($roomData['images'])) {
                            $roomData['images'] = !empty($roomData['image']) ? [$roomData['image']] : [];
                        }
                        if (!isset($roomData['amenities']) || !is_array($roomData['amenities'])) {
                            $roomData['amenities'] = [];
                        }
                        $roomData['hotel_id'] = $hotel->id;
                        Room::create($roomData);
                    }
                }
            }

            return response()->json([
                'message' => 'Hotel updated successfully',
                'hotel' => $hotel->fresh(['rooms', 'facilities'])
            ]);
        });
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
            'short_description' => 'nullable|string',
            'about' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'distance_from_attractions' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'gallery' => 'nullable|array',
            'facilities' => 'nullable|array',
            'featured' => 'sometimes|boolean',
            'show_rooms' => 'sometimes|boolean',
            'show_offer_label' => 'sometimes|boolean',
            'show_price' => 'sometimes|boolean',
            'price' => 'nullable|numeric',
            'offer_label' => 'nullable|string|max:255',
            // Hotel management fields
            'order_no' => 'nullable|integer|min:0',
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
            'is_visible' => 'sometimes|boolean',
            'show_details' => 'sometimes|boolean',
            'banner_heading' => 'nullable|string',
            'banner_tagline' => 'nullable|string',
            'rooms' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            if (!isset($validated['short_description'])) $validated['short_description'] = '';
            if (!isset($validated['about'])) $validated['about'] = '';
            if (!isset($validated['location'])) $validated['location'] = '';
            if (!isset($validated['category'])) $validated['category'] = '4-Star';
            if (!isset($validated['gallery'])) $validated['gallery'] = [];
            if (!isset($validated['facilities'])) $validated['facilities'] = [];

            if (!isset($validated['order_no']) || $validated['order_no'] === null) {
                $maxOrder = Hotel::max('order_no');
                $validated['order_no'] = ($maxOrder !== null) ? $maxOrder + 1 : 1;
            } else {
                $newOrder = (int) $validated['order_no'];
                Hotel::where('order_no', '>=', $newOrder)
                    ->increment('order_no');
            }

            $rooms = $validated['rooms'] ?? [];
            unset($validated['rooms']);

            $hotel = Hotel::create($validated);

            if ($request->has('facilities')) {
                $hotel->facilities()->sync($request->facilities);
            }

            if (!empty($rooms) && is_array($rooms)) {
                foreach ($rooms as $roomData) {
                    if (is_array($roomData) && !empty($roomData['type'])) {
                        unset($roomData['id'], $roomData['hotel_id'], $roomData['created_at'], $roomData['updated_at']);
                        if (isset($roomData['price']) && ($roomData['price'] === '' || $roomData['price'] === null)) {
                            $roomData['price'] = null;
                        } elseif (isset($roomData['price']) && is_numeric($roomData['price'])) {
                            $roomData['price'] = (float) $roomData['price'];
                        }
                        if (isset($roomData['remaining_rooms']) && ($roomData['remaining_rooms'] === '' || $roomData['remaining_rooms'] === null)) {
                            $roomData['remaining_rooms'] = null;
                        } elseif (isset($roomData['remaining_rooms']) && is_numeric($roomData['remaining_rooms'])) {
                            $roomData['remaining_rooms'] = (int) $roomData['remaining_rooms'];
                        }
                        if (!isset($roomData['images']) || !is_array($roomData['images'])) {
                            $roomData['images'] = !empty($roomData['image']) ? [$roomData['image']] : [];
                        }
                        if (!isset($roomData['amenities']) || !is_array($roomData['amenities'])) {
                            $roomData['amenities'] = [];
                        }
                        $roomData['hotel_id'] = $hotel->id;
                        Room::create($roomData);
                    }
                }
            }

            return response()->json([
                'message' => 'Hotel created successfully',
                'hotel' => $hotel->fresh(['rooms', 'facilities'])
            ], 201);
        });
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
