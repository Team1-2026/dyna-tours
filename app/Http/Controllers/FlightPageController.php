<?php

namespace App\Http\Controllers;

use App\Models\FlightPage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FlightPageController extends Controller
{
    /**
     * Get the Flight Page data.
     */
    public function get(): JsonResponse
    {
        $page = FlightPage::first();
        if (!$page) {
            $page = FlightPage::create([
                'hero_headline' => 'Book Domestic & International Flights at the Best Prices',
                'hero_tagline' => 'Fast, Secure & Hassle-Free Flight Booking with Dyna Tours India.',
                'overview_title' => 'Your Trusted Partner for Domestic & International Air Travel',
                'why_book_title' => 'Why Book Your Flight with Dyna Tours?',
                'cta_heading' => 'Ready to Fly?',
                'cta_text' => 'Book your domestic and international flights at the best available prices with Dyna Tours India.',
                'why_book_benefits' => [
                    [
                        'title' => 'Expert Guidance',
                        'description' => 'Our experienced travel consultants help you choose the best flight options based on your travel plans, preferences, and budget.',
                        'icon' => 'UserCheck'
                    ],
                    [
                        'title' => 'Competitive Pricing',
                        'description' => 'Enjoy affordable airfares and exclusive deals on domestic and international flights without compromising on quality.',
                        'icon' => 'Tag'
                    ],
                    [
                        'title' => 'Extensive Airline Network',
                        'description' => 'Access a wide range of trusted domestic and international airlines, giving you more flight choices and flexible schedules.',
                        'icon' => 'Globe'
                    ],
                    [
                        'title' => '24/7 Customer Support',
                        'description' => 'Our dedicated support team is available to assist you with bookings, changes, cancellations, and travel-related queries whenever you need help.',
                        'icon' => 'PhoneCall'
                    ],
                    [
                        'title' => 'Transparent Pricing',
                        'description' => 'We believe in complete transparency with no hidden charges or unexpected fees.',
                        'icon' => 'Shield'
                    ],
                    [
                        'title' => 'Hassle-Free Booking Process',
                        'description' => 'From your initial enquiry to receiving your e-ticket, we ensure a smooth, quick, and stress-free booking experience.',
                        'icon' => 'CheckCircle'
                    ],
                    [
                        'title' => 'Integrated Travel Solutions',
                        'description' => 'Plan your entire journey in one place by combining flight tickets with hotel bookings, visa assistance, holiday packages, travel insurance, and other travel services.',
                        'icon' => 'Briefcase'
                    ]
                ],
                'faqs' => [
                    ['question' => 'How do I book a flight?', 'answer' => 'You can book a flight by filling out the enquiry form on our website or by contacting our support team via WhatsApp.'],
                    ['question' => 'Can I book international flights?', 'answer' => 'Yes, we offer both domestic and international flight bookings across a wide network of airlines.'],
                    ['question' => 'Can I reschedule my ticket?', 'answer' => 'Yes, ticket rescheduling is possible depending on the airline\'s policy. Please contact our support team for assistance.'],
                    ['question' => 'What documents are required?', 'answer' => 'For domestic flights, a valid government-issued photo ID is required. For international flights, a valid passport and visa (if applicable) are mandatory.'],
                    ['question' => 'Do you provide group bookings?', 'answer' => 'Yes, we offer group booking services with special rates and dedicated assistance. Contact us with your requirements.'],
                    ['question' => 'How can I contact support?', 'answer' => 'You can reach our 24/7 customer support team via phone, email, or WhatsApp.']
                ]
            ]);
        }
        return response()->json($page);
    }

    /**
     * Update the Flight Page data.
     */
    public function update(Request $request): JsonResponse
    {
        $page = FlightPage::first();
        if (!$page) {
            $page = new FlightPage();
        }

        $validated = $request->validate([
            'hero_headline' => 'nullable|string',
            'hero_tagline' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'overview_title' => 'nullable|string',
            'overview_description' => 'nullable|string',
            'overview_image' => 'nullable|string',
            'gallery_images' => 'nullable|array',
            'why_book_title' => 'nullable|string',
            'why_book_benefits' => 'nullable|array',
            'cta_heading' => 'nullable|string',
            'cta_text' => 'nullable|string',
            'cta_bg_image' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'Flight Page updated successfully',
            'page' => $page
        ]);
    }
}
