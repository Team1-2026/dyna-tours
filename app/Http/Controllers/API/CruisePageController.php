<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CruisePage;
use Illuminate\Http\Request;

class CruisePageController extends Controller
{
    /**
     * Display Cruise Page settings.
     */
    public function show()
    {
        $page = CruisePage::first();

        if (!$page) {
            $page = CruisePage::create([
                'banner_title' => 'Cruise Holidays',
                'banner_tagline' => "Sail in Luxury – Discover the World's Most Spectacular Cruise Journeys",
                'banner_image' => 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=1920&q=80',
                'overview_heading' => 'Experience Unrivalled Luxury on the High Seas',
                'overview_description' => 'Embark on unforgettable ocean and river cruise journeys tailored for comfort, romance, and adventure. From dramatic Mediterranean coastlines to pristine Caribbean beaches and exotic Asian rivers, Dyna Tours offers handpicked cruise experiences with world-class dining, opulent cabins, and curated shore excursions.',
                'overview_image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
                'overview_cta_text' => 'View Cruise Packages',
                'cta_heading' => 'Ready to Set Sail?',
                'cta_description' => 'Book your dream cruise holiday with Dyna Tours India and enjoy exclusive perks, onboard credits, and 24x7 travel assistance.',
                'cta_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
                'cta_button1_text' => 'Enquire Now',
                'cta_button2_text' => 'Talk to Expert',
                'faqs' => [
                    [
                        'question' => 'What is included in a cruise holiday package?',
                        'answer' => 'Most cruise packages include luxury stateroom accommodation, all daily gourmet meals, onboard entertainment, access to pools & fitness facilities, and port taxes.'
                    ],
                    [
                        'question' => 'Do I need a visa for international cruise itineraries?',
                        'answer' => 'Visa requirements depend on the cruise ports of call and your passport nationality. Our travel experts assist with all required transit and destination visas.'
                    ],
                    [
                        'question' => 'Are cruise holidays suitable for families with children?',
                        'answer' => 'Absolutely! Modern cruise liners offer dedicated youth clubs, water parks, kids entertainment, and family-friendly dining options.'
                    ]
                ]
            ]);
        }

        return response()->json($page);
    }

    /**
     * Update Cruise Page settings.
     */
    public function update(Request $request)
    {
        $page = CruisePage::first();
        if (!$page) {
            $page = new CruisePage();
        }

        if ($request->has('faqs')) {
            $val = $request->input('faqs');
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                $val = is_array($decoded) ? $decoded : [];
            } elseif (is_null($val) || $val === '') {
                $val = [];
            } elseif (!is_array($val)) {
                $val = [];
            }
            $request->merge(['faqs' => $val]);
            if ($request->isJson()) {
                $request->json()->add(['faqs' => $val]);
            }
        }

        $validated = $request->validate([
            'banner_title' => 'sometimes|string',
            'banner_tagline' => 'sometimes|string',
            'banner_image' => 'sometimes|string|nullable',
            'overview_heading' => 'sometimes|string',
            'overview_description' => 'sometimes|string|nullable',
            'overview_image' => 'sometimes|string|nullable',
            'overview_cta_text' => 'sometimes|string',
            'cta_heading' => 'sometimes|string',
            'cta_description' => 'sometimes|string|nullable',
            'cta_image' => 'sometimes|string|nullable',
            'cta_button1_text' => 'sometimes|string',
            'cta_button2_text' => 'sometimes|string',
            'faqs' => 'sometimes|nullable|array',
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'Cruise page settings updated successfully',
            'page' => $page
        ]);
    }
}
