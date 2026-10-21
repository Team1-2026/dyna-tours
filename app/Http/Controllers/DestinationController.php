<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Hotel;
use App\Models\TourPackage;
use App\Http\Controllers\HotelController;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Destination::query();

        if ($request->has('status')) {
            if ($request->status !== 'all') {
                $query->where('status', $request->status);
            }
        } else {
            // Default for public frontend requests: only Active or null status
            $query->where(function ($q) {
                $q->whereNull('status')
                  ->orWhere('status', 'Active')
                  ->orWhere('status', 'active');
            });
        }

        if ($request->has('status') && $request->status === 'all') {
            $query->with('subDestinations');
        } else {
            $query->with(['subDestinations' => function ($sq) {
                $sq->where(function ($q) {
                    $q->whereNull('status')
                      ->orWhere('status', 'Active')
                      ->orWhere('status', 'active');
                });
            }]);
        }

        $destinations = $query->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC')
            ->get();

        return response()->json($destinations);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $includeInactive = $request->has('status') && $request->status === 'all';

        $query = Destination::with(['subDestinations' => function ($sq) use ($includeInactive) {
            if (!$includeInactive) {
                $sq->where(function ($q) {
                    $q->whereNull('status')
                      ->orWhere('status', 'Active')
                      ->orWhere('status', 'active');
                });
            }
        }, 'hotels']);

        $destination = $query->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('url_slug', $id);
        })->first();

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        if (!$includeInactive && $destination->status && strtolower($destination->status) === 'inactive') {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        // 1. Resolve matching hotels from database
        $subDestIds = $destination->subDestinations ? $destination->subDestinations->pluck('id')->filter()->toArray() : [];
        $hotelsQuery = Hotel::query();
        if (!$includeInactive) {
            $hotelsQuery->where(function ($q) {
                $q->whereNull('status')
                  ->orWhere('status', 'Active')
                  ->orWhere('status', 'active');
            });
        }
        $hotelsQuery->where(function ($q) use ($destination, $subDestIds) {
            $q->where('destination_id', $destination->id)
              ->orWhere('destination_id', $destination->url_slug);

            if (!empty($destination->name)) {
                $q->orWhere('state', $destination->name)
                  ->orWhere('city', $destination->name);
            }

            if (!empty($subDestIds)) {
                $q->orWhereIn('destination_id', $subDestIds);
            }

            if (!empty($destination->related_hotels) && is_array($destination->related_hotels)) {
                $q->orWhereIn('id', $destination->related_hotels);
            }
        });
        $matchedHotels = $hotelsQuery->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC, id ASC')->get();
        $destination->setRelation('hotels', $matchedHotels);

        // 2. Resolve matching tour packages from database
        $packageQuery = TourPackage::query();
        if (!$includeInactive) {
            $packageQuery->where(function ($q) {
                $q->whereNull('status')
                  ->orWhere('status', 'active')
                  ->orWhere('status', 'Active');
            });
        }
        $hasExplicitTours = !empty($destination->related_tours) && is_array($destination->related_tours);
        if ($hasExplicitTours) {
            $packageQuery->where(function ($q) use ($destination) {
                $q->whereIn('id', $destination->related_tours)
                  ->orWhereIn('slug', $destination->related_tours)
                  ->orWhere('destination', 'like', '%' . $destination->name . '%');
            });
        } else {
            $packageQuery->where(function ($q) use ($destination) {
                $q->where('destination', 'like', '%' . $destination->name . '%');
                if (strtolower($destination->name) === 'kerala') {
                    $q->orWhere('destination', 'like', '%munnar%')
                      ->orWhere('destination', 'like', '%alleppey%')
                      ->orWhere('destination', 'like', '%thekkady%');
                }
            });
        }
        $matchedPackages = $packageQuery->orderByRaw('case when rating is null then 1 else 0 end, rating DESC, id ASC')->get();
        $destination->tour_packages = $matchedPackages;

        return response()->json($destination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $destination = Destination::where('id', $id)->orWhere('url_slug', $id)->first();

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'overview' => 'sometimes|string|nullable',
            'how_to_reach' => 'sometimes|string|nullable',
            'best_time_to_visit' => 'sometimes|string|nullable',
            'show_packages' => 'sometimes|boolean',
            'show_hotels' => 'sometimes|boolean',
            'banner_image' => 'sometimes|string|nullable',
            'gallery' => 'sometimes|nullable|array',
            'top_attractions' => 'sometimes|nullable|array',
            // SEO fields
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'url_slug' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
            // Location fields
            'country' => 'sometimes|string|nullable',
            'state' => 'sometimes|string|nullable',
            'parent_id' => 'sometimes|string|nullable',
            // Related tours and hotels mapping
            'related_tours' => 'sometimes|nullable|array',
            'related_hotels' => 'sometimes|nullable|array',
            'order_no' => 'sometimes|integer|min:0|nullable',
            'banner_heading' => 'sometimes|string|nullable',
            'banner_tagline' => 'sometimes|string|nullable',
            'status' => 'sometimes|string|nullable',
        ]);

        if (array_key_exists('parent_id', $validated) && empty($validated['parent_id'])) {
            $validated['parent_id'] = null;
        }

        if (isset($validated['order_no']) && $validated['order_no'] !== null && $validated['order_no'] != $destination->order_no) {
            $newOrder = (int) $validated['order_no'];
            Destination::where('id', '!=', $id)
                ->where('order_no', '>=', $newOrder)
                ->increment('order_no');
        }

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
            'parent_id' => 'nullable|string',
            'overview' => 'nullable|string',
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
            // Related tours and hotels mapping
            'related_tours' => 'nullable|array',
            'related_hotels' => 'nullable|array',
            'order_no' => 'nullable|integer|min:0',
            'banner_heading' => 'nullable|string',
            'banner_tagline' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        if (empty($validated['parent_id'])) {
            $validated['parent_id'] = null;
        }

        if (!isset($validated['overview'])) $validated['overview'] = '';
        if (!isset($validated['status'])) $validated['status'] = 'Active';

        if (!isset($validated['order_no']) || $validated['order_no'] === null) {
            $maxOrder = Destination::max('order_no');
            $validated['order_no'] = ($maxOrder !== null) ? $maxOrder + 1 : 1;
        } else {
            $newOrder = (int) $validated['order_no'];
            Destination::where('order_no', '>=', $newOrder)
                ->increment('order_no');
        }

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
        $destination = Destination::where('id', $id)->orWhere('url_slug', $id)->first();

        if (!$destination) {
            // Even if already deleted or not found, return success so client state stays synchronized
            return response()->json([
                'message' => 'Destination deleted successfully'
            ]);
        }

        try {
            // Cascade delete associated hotels and their rooms & facilities
            if ($destination->hotels) {
                $deletedHotelIdentifiers = [];
                foreach ($destination->hotels as $hotel) {
                    if ($hotel->id) {
                        $deletedHotelIdentifiers[] = (string)$hotel->id;
                        $deletedHotelIdentifiers[] = strtolower((string)$hotel->id);
                    }
                    if ($hotel->url_slug) {
                        $deletedHotelIdentifiers[] = (string)$hotel->url_slug;
                        $deletedHotelIdentifiers[] = strtolower((string)$hotel->url_slug);
                    }
                    if ($hotel->name) {
                        $deletedHotelIdentifiers[] = (string)$hotel->name;
                        $deletedHotelIdentifiers[] = strtolower((string)$hotel->name);
                    }
                    if (method_exists($hotel, 'rooms')) {
                        $hotel->rooms()->delete();
                    }
                    if (method_exists($hotel, 'facilities')) {
                        $hotel->facilities()->detach();
                    }
                    $hotel->delete();
                }
                if (!empty($deletedHotelIdentifiers)) {
                    HotelController::cleanupDeletedHotelReferences($deletedHotelIdentifiers);
                }
            }

            // Remove parent reference from any sub-destinations
            Destination::where('parent_id', $destination->id)->update(['parent_id' => null]);

            // Detach any services referencing this destination
            if (class_exists(\App\Models\Service::class)) {
                \App\Models\Service::where('destination_id', $destination->id)->update(['destination_id' => null]);
            }

            $destination->delete();

            return response()->json([
                'message' => 'Destination deleted successfully'
            ]);
        } catch (\Throwable $e) {
            // If any constraint error occurred, force delete
            \Log::error('Error deleting destination ' . $id . ': ' . $e->getMessage());
            $destination->delete();
            return response()->json([
                'message' => 'Destination deleted successfully'
            ]);
        }
    }
}
