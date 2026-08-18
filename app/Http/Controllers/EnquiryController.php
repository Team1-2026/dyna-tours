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
            'type' => 'required|string|in:destination,hotel,package,flight,visa,cruise,custom',
            'target_id' => 'nullable|string',
            'name' => 'required|string|max:255',
            'phone' => ['required', 'string', 'min:6', 'max:50', 'regex:/^[0-9+\s\-\(\)]+$/'],
            'email' => 'required|email|max:255',
            'num_people' => 'nullable|integer|min:1',
            'travel_date' => 'nullable|string|max:100',
            'check_in' => 'nullable|string|max:100',
            'check_out' => 'nullable|string|max:100',
            'num_adults' => 'nullable|integer|min:0',
            'num_children' => 'nullable|integer|min:0',
            'children_ages' => 'nullable|string|max:255',
            'message' => 'nullable|string',

            // Optional Flight & Visa fields
            'trip_type' => 'nullable|string|max:100',
            'from' => 'nullable|string|max:255',
            'to' => 'nullable|string|max:255',
            'departure_date' => 'nullable|string|max:100',
            'return_date' => 'nullable|string|max:100',
            'num_infants' => 'nullable|integer|min:0',
            'cabin_class' => 'nullable|string|max:100',
            'preferred_airline' => 'nullable|string|max:255',
            'visa_type' => 'nullable|string|max:100',
            'destination_country' => 'nullable|string|max:255',
            'visaType' => 'nullable|string|max:100',
            'destinationCountry' => 'nullable|string|max:255',
            'fullName' => 'nullable|string|max:255',
            'mobileNumber' => 'nullable|string|max:50',
            'emailAddress' => 'nullable|email|max:255',
        ]);

        if ($request->filled('check_in') && $request->filled('check_out')) {
            $checkIn = strtotime($request->input('check_in'));
            $checkOut = strtotime($request->input('check_out'));
            if ($checkIn && $checkOut && $checkOut < $checkIn) {
                return response()->json([
                    'message' => 'Check-out date must be equal to or greater than Check-in date.'
                ], 422);
            }
        }

        if (empty($validated['target_id'])) {
            $validated['target_id'] = $validated['type'] . '_service';
        }

        // Build composite message for extra fields if present
        $details = [];
        if (!empty($validated['trip_type'])) $details[] = "Trip: " . $validated['trip_type'];
        if (!empty($validated['from']) || !empty($validated['to'])) {
            $details[] = "Route: " . ($validated['from'] ?? '') . " ➔ " . ($validated['to'] ?? '');
        }
        if (!empty($validated['departure_date'])) $details[] = "Departure: " . $validated['departure_date'];
        if (!empty($validated['return_date'])) $details[] = "Return: " . $validated['return_date'];
        if (!empty($validated['cabin_class'])) $details[] = "Class: " . $validated['cabin_class'];
        if (!empty($validated['preferred_airline'])) $details[] = "Airline: " . $validated['preferred_airline'];
        if (!empty($validated['num_infants'])) $details[] = "Infants: " . $validated['num_infants'];
        
        $vType = $validated['visa_type'] ?? $validated['visaType'] ?? null;
        if (!empty($vType)) $details[] = "Visa Type: " . $vType;
        
        $vCountry = $validated['destination_country'] ?? $validated['destinationCountry'] ?? null;
        if (!empty($vCountry)) $details[] = "Destination Country: " . $vCountry;

        $existingMessage = $validated['message'] ?? '';
        if (!empty($details)) {
            $summaryText = implode(' | ', $details);
            $validated['message'] = $existingMessage ? ($summaryText . "\nNote: " . $existingMessage) : $summaryText;
        }

        // Filter keys to standard database table columns
        $modelData = collect($validated)->only([
            'type', 'target_id', 'name', 'phone', 'email', 'num_people',
            'travel_date', 'check_in', 'check_out', 'num_adults', 'num_children',
            'children_ages', 'message'
        ])->toArray();

        $enquiry = Enquiry::create($modelData);

        return response()->json([
            'message' => 'Your enquiry has been submitted successfully!',
            'enquiry' => $enquiry
        ], 201);
    }
}
