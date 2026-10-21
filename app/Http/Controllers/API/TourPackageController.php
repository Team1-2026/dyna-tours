<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TourPackageController extends Controller
{
    /**
     * Display a listing of the tour packages.
     */
    public function index(Request $request)
    {
        $query = TourPackage::query();

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        if ($request->has('destination') && $request->destination) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $packages = $query->orderBy('created_at', 'desc')->get();

        return response()->json($packages);
    }

    /**
     * Display the specified tour package.
     */
    public function show(string $id)
    {
        $package = TourPackage::where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if (!$package) {
            return response()->json(['message' => 'Tour package not found'], 404);
        }

        return response()->json($package);
    }

    private function sanitizeArrayInputs(Request $request): void
    {
        $arrayFields = [
            'overview', 'route_overview', 'highlights', 'itinerary',
            'inclusions', 'exclusions', 'gallery', 'holiday_category',
            'terms_and_conditions', 'cancellation_policy', 'quick_info', 'related_tours'
        ];
        $updates = [];
        foreach ($arrayFields as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    $updates[$field] = is_array($decoded) ? $decoded : [];
                } elseif (is_null($val) || $val === '') {
                    $updates[$field] = [];
                } elseif (is_array($val)) {
                    $updates[$field] = $val;
                } else {
                    $updates[$field] = [];
                }
            }
        }
        if (!empty($updates)) {
            $request->merge($updates);
            if ($request->isJson()) {
                $request->json()->add($updates);
            }
        }
    }

    /**
     * Store a newly created tour package.
     */
    public function store(Request $request)
    {
        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'destination' => 'required|string|max:255',
            'category' => 'nullable|string',
            'tour_type' => 'nullable|string',
            'price' => 'nullable|numeric',
            'show_price' => 'sometimes|boolean',
            'show_price_breakdown' => 'sometimes|boolean',
            'tax' => 'nullable|numeric',
            'duration' => 'nullable|string',
            'duration_days' => 'nullable|integer',
            'duration_nights' => 'nullable|integer',
            'rating' => 'nullable|numeric',
            'reviews_count' => 'nullable|integer',
            'description' => 'nullable|string',
            'overview' => 'nullable',
            'route_overview' => 'nullable',
            'highlights' => 'nullable',
            'itinerary' => 'nullable',
            'inclusions' => 'nullable',
            'exclusions' => 'nullable',
            'image' => 'nullable|string',
            'gallery' => 'nullable',
            'holiday_category' => 'nullable',
            'terms_and_conditions' => 'nullable',
            'cancellation_policy' => 'nullable',
            'quick_info' => 'nullable',
            'featured' => 'sometimes|boolean',
            'related_tours' => 'nullable',
            'status' => 'sometimes|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'canonical_url' => 'nullable|string',
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        $id = !empty($validated['id']) ? $validated['id'] : $slug;

        $validated['id'] = $id;
        $validated['slug'] = $slug;

        // Ensure unique ID
        if (TourPackage::where('id', $id)->exists()) {
            $id = $id . '-' . time();
            $validated['id'] = $id;
            $validated['slug'] = $id;
        }

        $package = TourPackage::create($validated);

        return response()->json([
            'message' => 'Tour package created successfully',
            'package' => $package
        ], 201);
    }

    /**
     * Update the specified tour package.
     */
    public function update(Request $request, string $id)
    {
        $package = TourPackage::where('id', $id)->orWhere('slug', $id)->first();

        if (!$package) {
            return response()->json(['message' => 'Tour package not found'], 404);
        }

        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string',
            'destination' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|nullable',
            'tour_type' => 'sometimes|string|nullable',
            'price' => 'sometimes|numeric|nullable',
            'show_price' => 'sometimes|boolean',
            'show_price_breakdown' => 'sometimes|boolean',
            'tax' => 'sometimes|numeric|nullable',
            'duration' => 'sometimes|string|nullable',
            'duration_days' => 'sometimes|integer|nullable',
            'duration_nights' => 'sometimes|integer|nullable',
            'rating' => 'sometimes|numeric|nullable',
            'reviews_count' => 'sometimes|integer|nullable',
            'description' => 'sometimes|string|nullable',
            'overview' => 'sometimes|nullable',
            'route_overview' => 'sometimes|nullable',
            'highlights' => 'sometimes|nullable',
            'itinerary' => 'sometimes|nullable',
            'inclusions' => 'sometimes|nullable',
            'exclusions' => 'sometimes|nullable',
            'image' => 'sometimes|string|nullable',
            'gallery' => 'sometimes|nullable',
            'holiday_category' => 'sometimes|nullable',
            'terms_and_conditions' => 'sometimes|nullable',
            'cancellation_policy' => 'sometimes|nullable',
            'quick_info' => 'sometimes|nullable',
            'featured' => 'sometimes|boolean',
            'related_tours' => 'sometimes|nullable',
            'status' => 'sometimes|string',
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
        ]);

        if (isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $package->update($validated);

        return response()->json([
            'message' => 'Tour package updated successfully',
            'package' => $package
        ]);
    }

    /**
     * Remove package references from related_tours across Destinations and Tour Packages.
     */
    public static function cleanupDeletedPackageReferences(array $identifiers): void
    {
        $identifiers = array_unique(array_filter(array_map(function ($val) {
            return strtolower(trim((string)$val));
        }, $identifiers)));

        if (empty($identifiers)) {
            return;
        }

        // 1. Clean up Destination related_tours
        try {
            $destinations = \App\Models\Destination::whereNotNull('related_tours')->get();
            foreach ($destinations as $dest) {
                if (is_array($dest->related_tours) && !empty($dest->related_tours)) {
                    $originalCount = count($dest->related_tours);
                    $filtered = array_values(array_filter($dest->related_tours, function ($tId) use ($identifiers) {
                        return !in_array(strtolower(trim((string)$tId)), $identifiers, true);
                    }));
                    if (count($filtered) !== $originalCount) {
                        $dest->related_tours = $filtered;
                        $dest->save();
                    }
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Error cleaning related_tours from destinations: ' . $e->getMessage());
        }

        // 2. Clean up TourPackage related_tours
        try {
            $otherPackages = TourPackage::whereNotNull('related_tours')->get();
            foreach ($otherPackages as $otherPkg) {
                if (is_array($otherPkg->related_tours) && !empty($otherPkg->related_tours)) {
                    $originalCount = count($otherPkg->related_tours);
                    $filtered = array_values(array_filter($otherPkg->related_tours, function ($tId) use ($identifiers) {
                        return !in_array(strtolower(trim((string)$tId)), $identifiers, true);
                    }));
                    if (count($filtered) !== $originalCount) {
                        $otherPkg->related_tours = $filtered;
                        $otherPkg->save();
                    }
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Error cleaning related_tours from tour_packages: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified tour package.
     */
    public function destroy(string $id)
    {
        $packages = TourPackage::where('id', $id)
            ->orWhere('slug', $id)
            ->orWhereRaw('LOWER(id) = ?', [strtolower($id)])
            ->orWhereRaw('LOWER(slug) = ?', [strtolower($id)])
            ->get();

        $identifiers = [
            $id,
            strtolower($id),
            Str::slug($id),
        ];

        foreach ($packages as $pkg) {
            if ($pkg->id) {
                $identifiers[] = (string)$pkg->id;
                $identifiers[] = strtolower((string)$pkg->id);
            }
            if ($pkg->slug) {
                $identifiers[] = (string)$pkg->slug;
                $identifiers[] = strtolower((string)$pkg->slug);
            }
            if ($pkg->title) {
                $identifiers[] = (string)$pkg->title;
                $identifiers[] = strtolower((string)$pkg->title);
                $identifiers[] = Str::slug($pkg->title);
            }
            $pkg->delete();
        }

        self::cleanupDeletedPackageReferences($identifiers);

        return response()->json([
            'message' => 'Tour package deleted successfully'
        ]);
    }
}
