<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HomePageController extends Controller
{
    /**
     * Get the Home page data.
     */
    public function show(): JsonResponse
    {
        $page = HomePage::first();

        if (!$page) {
            $defaultOffers = [
                [
                    'id' => 'offer-1',
                    'category' => 'holiday',
                    'title' => 'Early Bird Summer Special - Europe 2026',
                    'description' => 'Flat ₹25,000 OFF per couple on all premium 10+ days Europe group & customized tours.',
                    'discountBadge' => 'FLAT ₹25,000 OFF',
                    'validity' => 'Valid till 15th Aug 2026',
                    'bgImage' => 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
                    'ctaText' => 'Claim Offer',
                    'ctaLink' => '/holidays?offer=europe-summer',
                    'linkTo' => '/holidays?offer=europe-summer',
                    'code' => 'SUMMER2026',
                ],
                [
                    'id' => 'offer-2',
                    'category' => 'hotel',
                    'title' => 'Luxury Maldives Overwater Villa Upgrade',
                    'description' => 'Complimentary All-Inclusive Upgrade & Speedboat Transfers for 4+ Night stays.',
                    'discountBadge' => 'FREE ALL-INCLUSIVE',
                    'validity' => 'Limited Availability',
                    'bgImage' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
                    'ctaText' => 'View Resort Deals',
                    'ctaLink' => '/hotels?location=Maldives',
                    'linkTo' => '/hotels?location=Maldives',
                    'code' => 'MALDIVESVIP',
                ],
                [
                    'id' => 'offer-3',
                    'category' => 'visa',
                    'title' => 'Express Schengen & UK Visa Assistance',
                    'description' => 'Guaranteed document check and appointment booking within 48 hours.',
                    'discountBadge' => 'FAST TRACK 48H',
                    'validity' => 'Always Available',
                    'bgImage' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
                    'ctaText' => 'Apply Now',
                    'ctaLink' => '/visa',
                    'linkTo' => '/visa',
                    'code' => 'EXPRESSVISA',
                ],
                [
                    'id' => 'offer-4',
                    'category' => 'cruise',
                    'title' => 'Royal Caribbean & Costa Cruise Bonanza',
                    'description' => 'Kids sail FREE + Complimentary $200 onboard credit per stateroom.',
                    'discountBadge' => 'KIDS SAIL FREE',
                    'validity' => 'Valid on Select Sailings',
                    'bgImage' => 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1000&q=80',
                    'ctaText' => 'Book Cruise',
                    'ctaLink' => '/cruise',
                    'linkTo' => '/cruise',
                    'code' => 'SAILFREE',
                ],
            ];

            $defaultAbout = [
                'title' => 'About Dyna Tours India',
                'subtitle' => 'EXCELLENCE IN TRAVEL SINCE 2010',
                'description1' => 'Dyna Tours India is a premier luxury travel management company dedicated to curating extraordinary, customized international holidays, heritage domestic tours, express visas, and corporate travel experiences.',
                'description2' => 'With a passionate team of travel architects, 24/7 global concierge support, and direct partnerships with world-class airlines and luxury resorts, we ensure every journey is effortless, unforgettable, and tailored to your exact desires.',
                'video_thumbnail' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                'youtube_url' => 'https://youtu.be/oH89HVptUpY',
                'years_experience' => 16,
            ];

            $page = HomePage::create([
                'offers' => $defaultOffers,
                'about' => $defaultAbout,
            ]);
        } else {
            $dirty = false;
            $about = $page->about ?? [];
            if (empty($about['youtube_url']) || $about['youtube_url'] === 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') {
                $about['youtube_url'] = 'https://youtu.be/oH89HVptUpY';
                $dirty = true;
            }
            if (empty($about['video_thumbnail']) || str_contains($about['video_thumbnail'], 'unsplash.com')) {
                $about['video_thumbnail'] = 'https://img.youtube.com/vi/oH89HVptUpY/maxresdefault.jpg';
                $dirty = true;
            }
            if ($dirty) {
                $page->about = $about;
                $page->save();
            }
        }

        return response()->json($page);
    }

    /**
     * Update the Home page data.
     */
    public function update(Request $request): JsonResponse
    {
        $page = HomePage::first();
        if (!$page) {
            $page = new HomePage();
        }

        $validated = $request->validate([
            'hero_slides' => 'nullable|array',
            'offers' => 'nullable|array',
            'themes' => 'nullable|array',
            'stats' => 'nullable|array',
            'testimonials' => 'nullable|array',
            'blogs' => 'nullable|array',
            'about' => 'nullable|array',
            'cta' => 'nullable|array',
            'reviews_bottom_content' => 'nullable|array',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'Home page updated successfully',
            'page' => $page,
        ]);
    }
}
