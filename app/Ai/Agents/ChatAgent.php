<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;
use Laravel\Ai\Concerns\RemembersConversations;
use Illuminate\Support\Str;
use Stringable;
use Throwable;

class ChatAgent implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    public ?object $visitor = null;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        $staffAssignmentText = "";
        try {
            if ($this->visitor && isset($this->visitor->staff_id)) {
                $staff = \App\Models\Staff::find($this->visitor->staff_id);
                if ($staff) {
                    $staffAssignmentText = "The customer is assigned to our dedicated travel expert: **{$staff->name}**. You MUST explicitly and warmly highlight this to the customer early in the conversation. Tell them clearly: 'Your dedicated travel expert **{$staff->name}** has been assigned to you and will personally customize your itinerary and guide you.' ALWAYS enclose staff names in double asterisks like `**{$staff->name}**` so they render bold in a distinct accent color.";
                }
            }
        } catch (Throwable) {
            $staffAssignmentText = "";
        }

        // 1. Destinations & Packages
        try {
            $destinations = \App\Models\Destination::where(function ($q) {
                $q->whereNull('status')->orWhere('status', 'Active')->orWhere('status', 'active');
            })->get()
                ->map(function ($d) {
                    $text = "- {$d->name}";
                    $loc = array_filter([$d->city, $d->state, $d->country]);
                    if (!empty($loc)) {
                        $text .= " (" . implode(', ', $loc) . ")";
                    }
                    if ($d->overview) {
                        $text .= ": {$d->overview}";
                    }
                    if ($d->best_time_to_visit) {
                        $text .= " | Best time: {$d->best_time_to_visit}";
                    }
                    return $text;
                })->implode("\n");
        } catch (Throwable) {
            $destinations = "- Popular Destinations across India & Worldwide";
        }

        // 2. Hotels & Accommodations & Rooms
        try {
            $hotels = \App\Models\Hotel::with('rooms')->get()
                ->map(function ($h) {
                    $inclusions = strip_tags(str_replace(['<ul>', '<li>', '</ul>', '</li>'], ['', ' ', '', ', '], $h->inclusions ?? ''));
                    $text = "- Hotel {$h->name}";
                    if ($h->destination_id) {
                        $text .= " (Destination: {$h->destination_id})";
                    }
                    if ($h->short_description) {
                        $text .= ": {$h->short_description}";
                    }
                    if ($h->price) {
                        $text .= ". Price: ₹{$h->price}";
                    }
                    if ($inclusions) {
                        $text .= ". Inclusions: {$inclusions}";
                    }
                    if ($h->rooms && $h->rooms->count() > 0) {
                        $roomDetails = $h->rooms->map(fn($r) => "{$r->type}" . ($r->price ? " (₹{$r->price})" : ""))->implode(', ');
                        $text .= " | Available Rooms: {$roomDetails}";
                    }
                    return $text;
                })->implode("\n");
        } catch (Throwable) {
            $hotels = "- Luxury & Comfort Hotel Packages";
        }

        // Hotel Facilities
        try {
            $facilities = \App\Models\Facility::all(['name', 'description'])
                ->map(fn($f) => "- {$f->name}" . ($f->description ? ": {$f->description}" : ""))
                ->implode("\n");
        } catch (Throwable) {
            $facilities = "";
        }

        // 3. Visa Services
        try {
            $visas = \App\Models\Visa::where('is_active', true)->get()
                ->map(function ($v) {
                    $text = "- {$v->name} ({$v->type}): Processing Time: {$v->processing_time}, Price: ₹{$v->price}";
                    if ($v->requirements) {
                        $reqs = is_array($v->requirements) ? implode(', ', $v->requirements) : $v->requirements;
                        $text .= " | Documents: {$reqs}";
                    }
                    return $text;
                })->implode("\n");
        } catch (Throwable) {
            $visas = "- Visa Assistance available for worldwide destinations";
        }

        // 4. Group Tours
        try {
            $groupTours = \App\Models\GroupTour::where('is_visible', true)->get()
                ->map(function ($g) {
                    $text = "- {$g->name} ({$g->destination}): Duration: {$g->duration}, Departure: {$g->departure_date}, Starting Price: ₹{$g->starting_price}";
                    if ($g->full_details) {
                        $text .= " | Details: " . Str::limit(strip_tags($g->full_details), 120);
                    }
                    return $text;
                })->implode("\n");
        } catch (Throwable) {
            $groupTours = "- Curated Group Tours & Expeditions";
        }

        try {
            $groupTourPage = \App\Models\GroupTourPage::first();
            $groupTourPageText = $groupTourPage ? "Group Tour Services: {$groupTourPage->title} - {$groupTourPage->tagline}. Overview: {$groupTourPage->overview_description}" : "";
        } catch (Throwable) {
            $groupTourPageText = "";
        }

        // 5. Cruises
        try {
            $cruises = \App\Models\Cruise::all()
                ->map(function ($c) {
                    $text = "- {$c->name} ({$c->destination}): Duration: {$c->duration}, Price: ₹{$c->price}";
                    if ($c->short_description) {
                        $text .= " | {$c->short_description}";
                    }
                    if ($c->highlights) {
                        $hl = is_array($c->highlights) ? implode(', ', $c->highlights) : $c->highlights;
                        $text .= " | Highlights: {$hl}";
                    }
                    return $text;
                })->implode("\n");
        } catch (Throwable) {
            $cruises = "- Luxury Ocean & River Cruises";
        }

        try {
            $cruisePage = \App\Models\CruisePage::first();
            $cruisePageText = $cruisePage ? "Cruise Experience: {$cruisePage->banner_title} - {$cruisePage->banner_tagline}. Overview: {$cruisePage->overview_description}" : "";
        } catch (Throwable) {
            $cruisePageText = "";
        }

        // 6. Flight Services
        try {
            $flightPage = \App\Models\FlightPage::first();
            $flightPageText = "";
            if ($flightPage) {
                $benefits = is_array($flightPage->why_book_benefits) ? implode(', ', $flightPage->why_book_benefits) : "";
                $flightPageText = "Flight Booking Services: {$flightPage->hero_headline} - {$flightPage->hero_tagline}. Overview: {$flightPage->overview_description}. Key Benefits: {$benefits}";
            }
        } catch (Throwable) {
            $flightPageText = "";
        }

        // 7. About Us & Contact Info
        try {
            $aboutInfo = \App\Models\AboutPage::first();
            $contactInfo = \App\Models\ContactPage::first();

            $aboutText = $aboutInfo ? "Years of Experience: {$aboutInfo->years_experience}\nMission: {$aboutInfo->mission_text}\nVision: {$aboutInfo->vision_text}\nOverview: {$aboutInfo->overview_description}" : "";
            $contactText = $contactInfo ? "Office Name: {$contactInfo->office_name}\nAddress: {$contactInfo->office_address}\nPhone Numbers: " . json_encode($contactInfo->phone_numbers ?? []) . "\nEmail Addresses: " . json_encode($contactInfo->email_addresses ?? []) . "\nBusiness Hours: Weekdays: {$contactInfo->business_hours_weekday}, Weekends: {$contactInfo->business_hours_weekend}" : "";
        } catch (Throwable) {
            $aboutText = "";
            $contactText = "";
        }

        // 8. Staff / Team Knowledge
        try {
            $allStaffNames = \App\Models\Staff::pluck('name')->map(fn($n) => "**{$n}**")->implode(', ');
            $staffTeamText = $allStaffNames ? "Our Travel Experts Team includes: {$allStaffNames}." : "";
        } catch (Throwable) {
            $staffTeamText = "";
        }

        return <<<PROMPT
        Identity & Persona:
        You are an elite, premium AI Travel Consultant for "Dyna Tours" (a luxury Tours & Travels company in India). Your tone is sophisticated yet warm, highly professional, welcoming, and deeply attentive to detail. You represent a high-end brand, so your language should be polished, scannable, and engaging—never verbose.

        Company Knowledge (Dyna Tours - Complete Offerings):
        
        Destinations & Packages:
        {$destinations}

        Hotel Packages & Accommodations:
        {$hotels}

        Hotel Amenities & Facilities:
        {$facilities}

        Group Tours:
        {$groupTours}
        {$groupTourPageText}

        Cruises & Ocean Voyages:
        {$cruises}
        {$cruisePageText}

        Flight Booking Services:
        {$flightPageText}

        Visa Assistance & Processing:
        {$visas}

        About Dyna Tours:
        {$aboutText}

        Contact & Office Details:
        {$contactText}

        Team & Travel Experts:
        {$staffTeamText}

        (Note: You must strictly base your answers on this comprehensive company knowledge. Do not invent packages or prices.)

        {$staffAssignmentText}

        Core Directives:
        1. Context Retention: You have an absolute memory of the current conversation. Seamlessly build upon previously stated preferences, names, and requirements without asking the user to repeat themselves.
        2. Needs-Driven Suggestions: The moment a user mentions a travel requirement, preference, or constraint, immediately analyze it and provide highly curated, tailored suggestions from the Company Knowledge section above. Cover any related service (destinations, hotels, group tours, cruises, flights, or visas) as appropriate.
        3. Concise Delivery: Keep responses short, sweet, and elegant. Use bullet points and clean formatting to present options.
        4. Staff Name Formatting (CRITICAL): Always format staff/team member names in bold using double asterisks like `**Rahul Sharma**` or `**{$staffAssignmentText}**` so they render prominently in a distinct accent color.
        5. Booking & Payment (PAYMENT LINKS HIDDEN): Online payment links are currently DISABLED in chat. Do NOT generate payment URLs or [GENERATE_LINK] tags. When the customer is ready to book, guide them warmly and inform them that their dedicated travel expert will coordinate their customized itinerary and final payment/booking arrangements directly.
        6. Cross-selling & Multiple Service Availability: Proactively inform customers about all our offerings. If they ask about international packages, remind them of our Visa, Flight, Hotel, Cruise, or Group Tour services as relevant.
        7. Proactive Automatic Booking & Details Gathering: When a customer expresses intent to book or reserve a service/package, proactively ask for and confirm the mandatory booking details: (1) Selected package/service, (2) Travel/departure date, (3) Traveler/guest count, and (4) Contact info (Name & Email/Phone). Once confirmed, state clearly that their official order request is registered and queued.

        Behavioral Workflow:
        - Discovery: Listen to client's destination, travel dates, budget, and accommodation style.
        - Recommendation: Present up to 3 premium curated options based entirely on Dyna Tours' specific offerings.
        - Guided Confirmation: Confirm booking details (Service, Travel Date, Traveler Count, Contact Info) to automatically generate their official Order request.
        - Guided Follow-up: Connect them seamlessly with their assigned travel expert for final customization and confirmation.
        PROMPT;
    }
}


