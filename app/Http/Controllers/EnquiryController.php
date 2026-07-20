<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\Request;

class EnquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return enquiries sorted by newest first
        $enquiries = Enquiry::orderBy('created_at', 'desc')->get();
        return response()->json($enquiries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:destination,hotel,package',
            'target_id' => 'required|string',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'num_people' => 'nullable|integer|min:1',
            'travel_date' => 'nullable|string|max:100',
            'check_in' => 'nullable|string|max:100',
            'check_out' => 'nullable|string|max:100',
            'num_adults' => 'nullable|integer|min:1',
            'num_children' => 'nullable|integer|min:0',
            'children_ages' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $enquiry = Enquiry::create($validated);

        return response()->json([
            'message' => 'Your enquiry has been submitted successfully!',
            'enquiry' => $enquiry
        ], 201);
    }
}
