<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GroupTourEnquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class GroupTourEnquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = GroupTourEnquiry::with('groupTour')->orderBy('created_at', 'desc');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'num_travellers' => 'required|integer|min:1',
            'message' => 'nullable|string',
            'group_tour_id' => 'nullable|exists:group_tours,id',
        ]);

        $enquiry = GroupTourEnquiry::create($validated);

        // Send email to admin
        $adminEmail = env('ADMIN_EMAIL', 'admin@dynatours.com');
        try {
            Mail::raw("New Group Tour Enquiry from {$enquiry->name}\nEmail: {$enquiry->email}\nPhone: {$enquiry->phone}\nTravellers: {$enquiry->num_travellers}\nMessage: {$enquiry->message}", function($message) use ($adminEmail) {
                $message->to($adminEmail)
                        ->subject('New Group Tour Enquiry');
            });
        } catch (\Exception $e) {
            // Ignore email errors in development
        }

        return response()->json(['message' => 'Enquiry submitted successfully', 'enquiry' => $enquiry], 201);
    }

    public function update(Request $request, $id)
    {
        $enquiry = GroupTourEnquiry::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:New,Contacted,In Progress,Converted,Closed',
        ]);

        $enquiry->update($validated);
        return response()->json(['message' => 'Enquiry status updated successfully', 'enquiry' => $enquiry]);
    }
}
