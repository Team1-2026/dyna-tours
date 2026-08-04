<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cruise;
use Illuminate\Http\Request;

class CruiseController extends Controller
{
    /**
     * Display a listing of the cruises.
     */
    public function index(Request $request)
    {
        $query = Cruise::query();

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('destination') && $request->destination) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $cruises = $query->orderByRaw('case when order_no is null then 1 else 0 end, order_no ASC, id ASC')->get();

        return response()->json($cruises);
    }

    /**
     * Display the specified cruise package.
     */
    public function show(string $id)
    {
        $cruise = Cruise::where('id', $id)
            ->orWhere('url_slug', $id)
            ->first();

        if (!$cruise) {
            return response()->json(['message' => 'Cruise package not found'], 404);
        }

        return response()->json($cruise);
    }

    private function sanitizeArrayInputs(Request $request): void
    {
        $arrayFields = ['gallery', 'highlights', 'itinerary', 'inclusions', 'exclusions', 'need_to_know', 'faqs', 'reviews'];
        $updates = [];
        foreach ($arrayFields as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    $updates[$field] = is_array($decoded) ? $decoded : [];
                } elseif (is_null($val) || $val === '') {
                    $updates[$field] = [];
                } elseif (!is_array($val)) {
                    $updates[$field] = [];
                }
            }
        }
        if (!empty($updates)) {
            $request->merge($updates);
        }
    }

    /**
     * Store a newly created cruise package.
     */
    public function store(Request $request)
    {
        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'id' => 'required|string|unique:cruises,id',
            'name' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'price' => 'nullable|numeric',
            'show_price' => 'sometimes|boolean',
            'short_description' => 'required|string',
            'about' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'inclusions' => 'nullable|array',
            'exclusions' => 'nullable|array',
            'need_to_know' => 'nullable|array',
            'faqs' => 'nullable|array',
            'reviews' => 'nullable|array',
            'featured' => 'sometimes|boolean',
            'order_no' => 'nullable|integer|min:0',
            'status' => 'sometimes|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'url_slug' => 'nullable|string',
            'canonical_url' => 'nullable|string',
        ]);

        if (isset($validated['order_no']) && $validated['order_no'] !== null) {
            $newOrder = (int) $validated['order_no'];
            Cruise::where('order_no', '>=', $newOrder)->increment('order_no');
        }

        $cruise = Cruise::create($validated);

        return response()->json([
            'message' => 'Cruise package created successfully',
            'cruise' => $cruise
        ], 201);
    }

    /**
     * Update the specified cruise package.
     */
    public function update(Request $request, string $id)
    {
        $cruise = Cruise::find($id);

        if (!$cruise) {
            return response()->json(['message' => 'Cruise package not found'], 404);
        }

        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'destination' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|nullable',
            'show_price' => 'sometimes|boolean',
            'short_description' => 'sometimes|string',
            'about' => 'sometimes|string|nullable',
            'banner_image' => 'sometimes|string|nullable',
            'gallery' => 'sometimes|nullable|array',
            'highlights' => 'sometimes|nullable|array',
            'itinerary' => 'sometimes|nullable|array',
            'inclusions' => 'sometimes|nullable|array',
            'exclusions' => 'sometimes|nullable|array',
            'need_to_know' => 'sometimes|nullable|array',
            'faqs' => 'sometimes|nullable|array',
            'reviews' => 'sometimes|nullable|array',
            'featured' => 'sometimes|boolean',
            'order_no' => 'sometimes|integer|min:0|nullable',
            'status' => 'sometimes|string',
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'url_slug' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
        ]);

        if (isset($validated['order_no']) && $validated['order_no'] !== null && $validated['order_no'] != $cruise->order_no) {
            $newOrder = (int) $validated['order_no'];
            Cruise::where('id', '!=', $id)->where('order_no', '>=', $newOrder)->increment('order_no');
        }

        $cruise->update($validated);

        return response()->json([
            'message' => 'Cruise package updated successfully',
            'cruise' => $cruise
        ]);
    }

    /**
     * Remove the specified cruise package.
     */
    public function destroy(string $id)
    {
        $cruise = Cruise::find($id);

        if (!$cruise) {
            return response()->json(['message' => 'Cruise package not found'], 404);
        }

        $cruise->delete();

        return response()->json([
            'message' => 'Cruise package deleted successfully'
        ]);
    }
}
