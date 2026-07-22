<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContactPage;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactPageController extends Controller
{
    /**
     * Get Contact Us page settings.
     */
    public function show(): JsonResponse
    {
        $page = ContactPage::first();

        if (!$page) {
            $page = ContactPage::create([
                // Hero Banner
                'hero_title' => 'Contact Us',
                'hero_subtitle' => "We're here to help you plan your next journey. Get in touch with our travel experts today.",
                'hero_bg_image' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80',
                'hero_cta_primary_text' => 'Enquire Now',
                'hero_cta_primary_url' => '#enquiry-form',
                'hero_cta_secondary_text' => 'Call Us',
                'hero_cta_secondary_url' => 'tel:+919846665005',

                // Office Details
                'office_name' => 'Dyna Tours India Head Office',
                'office_address' => 'First Floor, Marks Square Building, M C Road, Above Yes Bank, Ruby Nagar, P.O. Vazhappally, Changanassery, Kerala – 686103',
                'google_maps_url' => 'https://maps.google.com/?q=Dyna+Tours+India+Changanassery',
                
                'phone_numbers' => [
                    ['label' => 'Primary Support', 'number' => '+91 98466 65005'],
                    ['label' => 'Reservations', 'number' => '+91 98461 50005'],
                    ['label' => 'Customer Care', 'number' => '+91 94952 02727']
                ],

                'email_addresses' => [
                    ['label' => 'General Enquiries', 'email' => 'info@dynatours.com'],
                    ['label' => 'Bookings', 'email' => 'explore@dynatours.com']
                ],

                'business_hours_weekday' => 'Monday – Saturday: 9:00 AM – 6:00 PM',
                'business_hours_weekend' => 'Sunday: Closed / By Appointment',

                // Brand Card
                'brand_tagline' => 'Dream Your Next Adventure',
                'brand_description' => "Travel with confidence. Whether you're planning a holiday, business trip, honeymoon, visa application, or group tour, our experts are ready to assist you every step of the way.",
                
                'social_links' => [
                    ['platform' => 'Instagram', 'url' => 'https://instagram.com/dynatours', 'icon' => 'Instagram'],
                    ['platform' => 'Facebook', 'url' => 'https://facebook.com/dynatours', 'icon' => 'Facebook'],
                    ['platform' => 'YouTube', 'url' => 'https://youtube.com/@dynatours', 'icon' => 'Youtube'],
                    ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/company/dynatours', 'icon' => 'Linkedin'],
                    ['platform' => 'X (Twitter)', 'url' => 'https://x.com/dynatours', 'icon' => 'Twitter']
                ],

                // Quick Contact Cards
                'quick_contact_cards' => [
                    [
                        'title' => 'Call Us Directly',
                        'description' => 'Speak directly with our dedicated travel consultants for instant guidance.',
                        'action_text' => 'Call +91 98466 65005',
                        'action_url' => 'tel:+919846665005',
                        'icon' => 'PhoneCall'
                    ],
                    [
                        'title' => 'WhatsApp Chat',
                        'description' => 'Instant chat assistance for itinerary planning, quotes, and quick queries.',
                        'action_text' => 'Chat on WhatsApp',
                        'action_url' => 'https://wa.me/919846665005',
                        'icon' => 'MessageCircle'
                    ],
                    [
                        'title' => 'Email Support',
                        'description' => 'Send us your detailed travel requirements anytime and receive a custom quote.',
                        'action_text' => 'Email info@dynatours.com',
                        'action_url' => 'mailto:info@dynatours.com',
                        'icon' => 'Mail'
                    ]
                ],

                // Why Contact Cards
                'why_contact_cards' => [
                    ['title' => 'Holiday Packages', 'description' => 'Tailor-made domestic and international vacation itineraries.', 'icon' => 'Sun'],
                    ['title' => 'Flight Bookings', 'description' => 'Best airfare deals across global and domestic airlines.', 'icon' => 'Plane'],
                    ['title' => 'Hotel Reservations', 'description' => 'Handpicked luxury resorts, star hotels & boutique stays.', 'icon' => 'Building'],
                    ['title' => 'Visa Assistance', 'description' => 'Fast-track eVisa & passport documentation processing.', 'icon' => 'FileText'],
                    ['title' => 'Cruise Holidays', 'description' => 'Ocean & river cruises in Europe, Asia & Americas.', 'icon' => 'Anchor'],
                    ['title' => 'Corporate Travel', 'description' => 'Tailored MICE, corporate retreats & business flights.', 'icon' => 'Briefcase'],
                    ['title' => 'Group Tours', 'description' => 'Escorted fixed departures with professional tour managers.', 'icon' => 'Users'],
                    ['title' => 'Travel Insurance', 'description' => 'Comprehensive international medical & baggage coverage.', 'icon' => 'Shield'],
                    ['title' => 'Certificate Attestation', 'description' => 'MEA, Embassy & Apostille document attestation services.', 'icon' => 'CheckCircle']
                ],

                // Map Embed
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.574488349272!2d76.5412!3d9.4442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b062548ad7281f7%3A0x6b44c8033ef6691c!2sChanganassery%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
            ]);
        }

        return response()->json($page);
    }

    /**
     * Update Contact Us page settings.
     */
    public function update(Request $request): JsonResponse
    {
        $page = ContactPage::first();
        if (!$page) {
            $page = new ContactPage();
        }

        $validated = $request->validate([
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'hero_bg_image' => 'nullable|string',
            'hero_cta_primary_text' => 'nullable|string',
            'hero_cta_primary_url' => 'nullable|string',
            'hero_cta_secondary_text' => 'nullable|string',
            'hero_cta_secondary_url' => 'nullable|string',
            'office_name' => 'nullable|string',
            'office_address' => 'nullable|string',
            'google_maps_url' => 'nullable|string',
            'phone_numbers' => 'nullable|array',
            'email_addresses' => 'nullable|array',
            'business_hours_weekday' => 'nullable|string',
            'business_hours_weekend' => 'nullable|string',
            'brand_tagline' => 'nullable|string',
            'brand_description' => 'nullable|string',
            'social_links' => 'nullable|array',
            'quick_contact_cards' => 'nullable|array',
            'why_contact_cards' => 'nullable|array',
            'map_embed_url' => 'nullable|string',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'Contact Us page settings updated successfully',
            'page' => $page
        ]);
    }

    /**
     * Submit Contact Form (Public Endpoint).
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'num_people' => 'nullable|integer|min:1',
            'travel_date' => 'nullable|string',
            'message' => 'required|string',
        ]);

        // Save into Enquiries table
        $enquiry = Enquiry::create([
            'type' => 'contact_us',
            'target_id' => 'contact_us_form',
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'num_people' => $validated['num_people'] ?? 1,
            'travel_date' => $validated['travel_date'] ?? null,
            'message' => $validated['message'],
        ]);

        // Optional Email Notification to Admin
        $adminEmail = env('ADMIN_EMAIL', 'info@dynatours.com');
        try {
            Mail::raw(
                "New Contact Us Enquiry Received!\n\n".
                "Name: {$enquiry->name}\n".
                "Email: {$enquiry->email}\n".
                "Phone: {$enquiry->phone}\n".
                "Travellers: {$enquiry->num_people}\n".
                "Travel Date: {$enquiry->travel_date}\n\n".
                "Message:\n{$enquiry->message}\n",
                function ($message) use ($adminEmail) {
                    $message->to($adminEmail)->subject('New Contact Us Enquiry - Dyna Tours');
                }
            );
        } catch (\Exception $e) {
            // Ignore mail delivery failure in dev
        }

        return response()->json([
            'message' => 'Thank you for getting in touch! Our travel experts will respond shortly.',
            'enquiry' => $enquiry
        ], 201);
    }
}
