<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GroupTour;
use Illuminate\Http\Request;

class GroupTourController extends Controller
{
    public function index(Request $request)
    {
        $query = GroupTour::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('destination')) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true)->orderBy('featured_order', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        if ($request->has('visible_only') || !request()->user()) {
            $query->where('is_visible', true);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'type' => 'required|in:domestic,international',
            'image' => 'nullable|string',
            'duration' => 'required|string|max:255',
            'departure_date' => 'nullable|date',
            'starting_price' => 'required|numeric|min:0',
            'status' => 'required|in:Filling Fast,Limited Seats,Available,Sold Out',
            'full_details' => 'nullable|string',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'featured_order' => 'integer',
        ]);

        $tour = GroupTour::create($validated);
        return response()->json(['message' => 'Group Tour created successfully', 'tour' => $tour], 201);
    }

    public function show($id)
    {
        return response()->json(GroupTour::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tour = GroupTour::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'destination' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:domestic,international',
            'image' => 'nullable|string',
            'duration' => 'sometimes|required|string|max:255',
            'departure_date' => 'nullable|date',
            'starting_price' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:Filling Fast,Limited Seats,Available,Sold Out',
            'full_details' => 'nullable|string',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'featured_order' => 'integer',
        ]);

        $tour->update($validated);
        return response()->json(['message' => 'Group Tour updated successfully', 'tour' => $tour]);
    }

    public function destroy($id)
    {
        GroupTour::findOrFail($id)->delete();
        return response()->json(['message' => 'Group Tour deleted successfully']);
    }
}
