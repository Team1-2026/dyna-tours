<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AboutPageController extends Controller
{
    /**
     * Get the About Us page data.
     */
    public function show(): JsonResponse
    {
        $page = AboutPage::first();

        if (!$page) {
            $page = AboutPage::create([
                // 1. Hero Banner
                'hero_title' => 'About Dyna Tours India',
                'hero_subtitle' => 'Creating unforgettable travel experiences with trusted expertise, personalized service, and world-class travel solutions.',
                'hero_bg_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',

                // 2. Company Overview
                'overview_title' => 'Your Trusted Travel Partner Across India & Overseas',
                'overview_description' => '<p><strong>DYNA TOURS INDIA</strong> is a premier travel management company with over <strong>16 years</strong> of dedicated experience in the tourism and hospitality industry.</p><p>Headquartered in Changanassery, Kottayam, Kerala, with operational offices in Kochi, Trivandrum, and Bangalore, we deliver comprehensive, bespoke travel services for leisure, corporate, and group travelers across India and internationally.</p><p>Our established partnerships with luxury hotels, global airlines, tourism boards, and ground transport networks enable us to curate seamless journeys at competitive pricing without compromising on quality or safety.</p>',
                'overview_image_1' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
                'overview_image_2' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
                'years_experience' => 16,

                // 3. Founder's Message
                'founder_name' => 'Management & Leadership',
                'founder_title' => 'Dyna Tours India',
                'founder_image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
                'founder_message' => '<p>Travel is more than visiting new places—it is about creating lifelong memories, discovering diverse cultures, and connecting people with extraordinary destinations.</p><p>Since our inception 16 years ago, our customer-first philosophy, transparent operations, and passionate travel advisors have earned the trust of over 25,000 satisfied travelers. We look forward to crafting your next extraordinary journey.</p>',
                'founder_quote' => 'Our commitment is to turn your travel dreams into seamless, enriching realities.',
                'founder_signature' => 'Dyna Tours Team',

                // 4. Mission & Vision
                'mission_title' => 'Our Mission',
                'mission_text' => 'Our mission at Dyna Tours is to provide unforgettable, personalized travel experiences while promoting responsible and sustainable tourism. We strive to create meaningful connections between travelers and destinations, supporting local communities while preserving environmental integrity.',
                'vision_title' => 'Our Vision',
                'vision_text' => 'Our vision is to stand among India\'s most trusted and recognized travel brands by consistently delivering innovative, ethical, and seamless travel solutions that exceed customer expectations and generate lasting value for global travelers.',

                // 5. Why Choose Us (6 Cards)
                'why_choose_title' => 'Why Choose Dyna Tours India',
                'why_choose_cards' => [
                    [
                        'icon' => 'Award',
                        'title' => '16+ Years Experience',
                        'description' => 'Reliable travel expertise built on over a decade and a half of customer trust and industry accolades.'
                    ],
                    [
                        'icon' => 'Compass',
                        'title' => 'Customized Solutions',
                        'description' => 'Bespoke, tailor-made itineraries crafted around your specific preferences, schedule, and budget.'
                    ],
                    [
                        'icon' => 'Grid',
                        'title' => 'Complete Travel Services',
                        'description' => 'Holiday packages, visa processing, flights, hotels, cruises, insurance, and attestation—all under one roof.'
                    ],
                    [
                        'icon' => 'Users',
                        'title' => 'Dedicated Experts',
                        'description' => 'Personalized guidance from experienced travel consultants available before, during, and after your trip.'
                    ],
                    [
                        'icon' => 'DollarSign',
                        'title' => 'Competitive Pricing',
                        'description' => 'Complete pricing transparency with exclusive airline/hotel deals and maximum value for every rupee spent.'
                    ],
                    [
                        'icon' => 'Headphones',
                        'title' => '24/7 Customer Support',
                        'description' => 'Round-the-clock emergency support and on-ground assistance whenever you need help anywhere in the world.'
                    ]
                ],

                // 6. Our Services (10 Cards)
                'services_title' => 'Our Comprehensive Services',
                'services_list' => [
                    [
                        'title' => 'International Holidays',
                        'description' => 'Handcrafted international vacation packages to Europe, Asia, Americas, Africa & the Far East.',
                        'icon' => 'Globe',
                        'link' => '/holidays/international-tour-packages'
                    ],
                    [
                        'title' => 'Domestic Holidays',
                        'description' => 'Curated domestic packages covering Kerala backwaters, Himalayan treks, Goa beaches & cultural circuits.',
                        'icon' => 'MapPin',
                        'link' => '/holidays/domestic-tour-packages'
                    ],
                    [
                        'title' => 'Flight Ticket Booking',
                        'description' => 'Best rates for domestic & international air tickets across leading global airlines.',
                        'icon' => 'Plane',
                        'link' => '/flights'
                    ],
                    [
                        'title' => 'Visa Assistance',
                        'description' => 'End-to-end eVisa & traditional visa documentation support with high approval success rate.',
                        'icon' => 'FileText',
                        'link' => '/visa'
                    ],
                    [
                        'title' => 'Hotel Booking',
                        'description' => 'Exclusive rates at luxury 5-star resorts, boutique stays, and budget hotels worldwide.',
                        'icon' => 'Building',
                        'link' => '/hotels'
                    ],
                    [
                        'title' => 'Cruise Holidays',
                        'description' => 'Unforgettable ocean and river cruises across Europe, Asia, and international waters.',
                        'icon' => 'Anchor',
                        'link' => '/holidays'
                    ],
                    [
                        'title' => 'Group Tours',
                        'description' => 'Escorted domestic and international group departure tours with dedicated tour managers.',
                        'icon' => 'Users',
                        'link' => '/group-tours'
                    ],
                    [
                        'title' => 'Corporate Travel',
                        'description' => 'Tailored MICE, business travel management, conference arrangements, and team retreats.',
                        'icon' => 'Briefcase',
                        'link' => '/holidays'
                    ],
                    [
                        'title' => 'Travel Insurance',
                        'description' => 'Comprehensive medical, baggage, and trip cancellation coverage for safe journeys.',
                        'icon' => 'Shield',
                        'link' => '/visa'
                    ],
                    [
                        'title' => 'Certificate Attestation',
                        'description' => 'Hassle-free MEA, HRD, Embassy, and Apostille certificate attestation services.',
                        'icon' => 'CheckCircle',
                        'link' => '/visa'
                    ]
                ],

                // 7. Trusted Partner
                'trusted_partner_title' => 'Your Journey Begins With Trust',
                'trusted_partner_description' => 'For over 16 years, Dyna Tours India has helped thousands of travelers create unforgettable memories through carefully planned holidays, corporate travel solutions, visa assistance, and world-class customer service.',
                'trusted_partner_bg_image' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80',
                'trust_badges' => [
                    ['title' => 'Verified Travel Company', 'icon' => 'CheckCircle'],
                    ['title' => '100% Secure Booking', 'icon' => 'Lock'],
                    ['title' => 'Expert Travel Consultants', 'icon' => 'UserCheck'],
                    ['title' => '24/7 Dedicated Support', 'icon' => 'PhoneCall']
                ],

                // 8. Achievements (4 Counters)
                'achievements_title' => 'Our Milestones & Achievements',
                'achievements_bg_image' => 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2000&q=80',
                'achievement_counters' => [
                    ['number' => 16, 'suffix' => '+', 'label' => 'Years Experience', 'icon' => 'Calendar'],
                    ['number' => 25000, 'suffix' => '+', 'label' => 'Happy Customers', 'icon' => 'Smile'],
                    ['number' => 100, 'suffix' => '+', 'label' => 'Destinations Covered', 'icon' => 'Globe'],
                    ['number' => 20, 'suffix' => '+', 'label' => 'Travel Experts', 'icon' => 'UserCheck']
                ],

                // 9. Certifications & Memberships
                'certifications_title' => 'Certifications & Industry Memberships',
                'certification_logos' => [
                    [
                        'name' => 'IATA Accredited',
                        'code' => 'IATA',
                        'description' => 'International Air Transport Association Recognized Agency',
                        'image' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80'
                    ],
                    [
                        'name' => 'Kerala Travel Mart (KTM)',
                        'code' => 'KTM',
                        'description' => 'Member of Kerala Travel Mart Society',
                        'image' => 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80'
                    ],
                    [
                        'name' => 'Govt. Approved Tourism Provider',
                        'code' => 'KERALA TOURISM',
                        'description' => 'Department of Tourism, Government of Kerala Accredited',
                        'image' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'
                    ],
                    [
                        'name' => 'Global Airline Partners',
                        'code' => 'AIRLINES',
                        'description' => 'Direct Ticketing Partner for Major Domestic & International Airlines',
                        'image' => 'https://images.unsplash.com/photo-1519074069444-1ba4eff56024?auto=format&fit=crop&w=300&q=80'
                    ]
                ],

                // 10. Call To Action (CTA)
                'cta_title' => "Let's Plan Your Next Adventure",
                'cta_description' => 'Connect with our travel experts today and let us create a customized travel experience tailored to your exact needs and preferences.',
                'cta_bg_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
                'cta_primary_btn_text' => 'Enquire Now',
                'cta_primary_btn_url' => '/#enquiry',
                'cta_secondary_btn_text' => 'WhatsApp Us',
                'cta_secondary_btn_url' => 'https://wa.me/919946461999'
            ]);
        }

        return response()->json($page);
    }

    /**
     * Update the About Us page data.
     */
    public function update(Request $request): JsonResponse
    {
        $page = AboutPage::first();
        if (!$page) {
            $page = new AboutPage();
        }

        $validated = $request->validate([
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'hero_bg_image' => 'nullable|string',
            'overview_title' => 'nullable|string',
            'overview_description' => 'nullable|string',
            'overview_image_1' => 'nullable|string',
            'overview_image_2' => 'nullable|string',
            'years_experience' => 'nullable|integer',
            'founder_name' => 'nullable|string',
            'founder_title' => 'nullable|string',
            'founder_image' => 'nullable|string',
            'founder_message' => 'nullable|string',
            'founder_quote' => 'nullable|string',
            'founder_signature' => 'nullable|string',
            'mission_title' => 'nullable|string',
            'mission_text' => 'nullable|string',
            'vision_title' => 'nullable|string',
            'vision_text' => 'nullable|string',
            'why_choose_title' => 'nullable|string',
            'why_choose_cards' => 'nullable|array',
            'services_title' => 'nullable|string',
            'services_list' => 'nullable|array',
            'trusted_partner_title' => 'nullable|string',
            'trusted_partner_description' => 'nullable|string',
            'trusted_partner_bg_image' => 'nullable|string',
            'trust_badges' => 'nullable|array',
            'achievements_title' => 'nullable|string',
            'achievements_bg_image' => 'nullable|string',
            'achievement_counters' => 'nullable|array',
            'certifications_title' => 'nullable|string',
            'certification_logos' => 'nullable|array',
            'cta_title' => 'nullable|string',
            'cta_description' => 'nullable|string',
            'cta_bg_image' => 'nullable|string',
            'cta_primary_btn_text' => 'nullable|string',
            'cta_primary_btn_url' => 'nullable|string',
            'cta_secondary_btn_text' => 'nullable|string',
            'cta_secondary_btn_url' => 'nullable|string',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'About Us page updated successfully',
            'page' => $page
        ]);
    }
}
