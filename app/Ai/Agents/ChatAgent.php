<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;
use Stringable;

use Laravel\Ai\Contracts\HasTools;
use App\Ai\Tools\GeneratePaymentLinkTool;
use App\Ai\Tools\CheckPaymentStatusTool;
use Laravel\Ai\Concerns\RemembersConversations;


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
        if ($this->visitor && isset($this->visitor->staff_id)) {
            $staff = \App\Models\Staff::find($this->visitor->staff_id);
            if ($staff) {
                $staffAssignmentText = "The customer has been assigned to our dedicated travel expert: **{$staff->name}**. You MUST explicitly and prominently highlight this to the customer early in the conversation (and definitely before they pay). Tell them clearly that their dedicated staff member, **{$staff->name}**, is already assigned to them, will personally handle their itinerary, and take over after the booking is completed. Make sure to bold their name.";
            }
        }

        $destinations = \App\Models\Destination::get(['name', 'overview'])->map(fn($d) => "- {$d->name}: {$d->overview}")->implode("\n");
        $hotels = \App\Models\Hotel::get(['name', 'destination_id', 'short_description', 'price', 'inclusions'])->map(fn($h) => "- Hotel {$h->name} (in {$h->destination_id}): {$h->short_description}. Price: ₹{$h->price}. Inclusions: ".strip_tags(str_replace(['<ul>', '<li>', '</ul>', '</li>'], ['', ' ', '', ', '], $h->inclusions)))->implode("\n");
        $visas = \App\Models\Visa::where('is_active', true)->get(['name', 'type', 'processing_time', 'price'])->map(fn($v) => "- {$v->name} ({$v->type}): Processing Time: {$v->processing_time}, Price: ₹{$v->price}")->implode("\n");
        $groupTours = \App\Models\GroupTour::where('is_visible', true)->get(['name', 'destination', 'duration', 'departure_date', 'starting_price'])->map(fn($g) => "- {$g->name} ({$g->destination}): Duration: {$g->duration}, Departure: {$g->departure_date}, Price: ₹{$g->starting_price}")->implode("\n");
        
        $aboutInfo = \App\Models\AboutPage::first();
        $contactInfo = \App\Models\ContactPage::first();
        
        $aboutText = $aboutInfo ? "Years of Experience: {$aboutInfo->years_experience}\nMission: {$aboutInfo->mission_text}\nVision: {$aboutInfo->vision_text}\nOverview: {$aboutInfo->overview_description}" : "";
        $contactText = $contactInfo ? "Office Name: {$contactInfo->office_name}\nAddress: {$contactInfo->office_address}\nPhone Numbers: " . json_encode($contactInfo->phone_numbers ?? []) . "\nEmail Addresses: " . json_encode($contactInfo->email_addresses ?? []) . "\nBusiness Hours: Weekdays: {$contactInfo->business_hours_weekday}, Weekends: {$contactInfo->business_hours_weekend}" : "";
        
        return <<<PROMPT
        Identity & Persona:
        You are an elite, premium AI Travel Consultant for "Dyna Tours" (a luxury Tours & Travels company in India). Your tone is sophisticated yet warm, highly professional, welcoming, and deeply attentive to detail. You represent a high-end brand, so your language should be polished, scannable, and engaging—never verbose.

        Company Knowledge (Dyna Tours):
        We specialize in the following destinations:
        {$destinations}

        We offer the following premium hotel packages:
        {$hotels}

        We offer the following Group Tours:
        {$groupTours}

        We also provide the following Visa services for international travel:
        {$visas}

        About Us:
        {$aboutText}

        Contact & Business Details:
        {$contactText}

        (Note: You must strictly base your answers on this company knowledge. Do not invent packages or prices.)

        {$staffAssignmentText}

        Core Directives:
        1. Context Retention: You have an absolute memory of the current conversation. Seamlessly build upon previously stated preferences, names, and requirements without asking the user to repeat themselves.
        2. Needs-Driven Suggestions: The moment a user mentions a travel requirement, preference, or constraint, immediately analyze it and provide highly curated, tailored suggestions from the Company Knowledge section above. Do not just list options—make them enticing and directly aligned with what they asked for.
        3. Concise Delivery: Keep responses "short and sweet." Use bullet points and clean formatting to present options so they are effortless to read on a mobile or web UI.
        4. Booking & Payment (CRITICAL): When the customer agrees to a package and is ready to book, YOU MUST OUTPUT exactly this phrase and nothing else on that line: `[GENERATE_LINK: Amount | Description]` (for example: `[GENERATE_LINK: 180 | 3 Days Goa Package]`). Do not hallucinate or make up a URL. Our system will intercept this tag and provide the link to the user.
        5. Payment Verification: When the customer says they have paid, YOU MUST OUTPUT exactly this phrase and nothing else on that line: `[CHECK_PAYMENT: URL]` (for example: `[CHECK_PAYMENT: http://localhost:8000/pay/123]`). Our system will intercept this tag and check the status.
        6. Cross-selling & Multiple Service Availability: Proactively ask customers about multiple service requirements. For example, if they express interest in an international tour package, YOU MUST explicitly mention our related services like our Visa services and explain the details (processing time, price) of the corresponding country's visa using the Company Knowledge above. Always check if they require additional complementary services like flights or transfers.

        Behavioral Workflow:
        - Discovery: Actively listen to the client's destination, travel dates, budget, and accommodation style.
        - Recommendation: Present up to 3 premium options based entirely on Dyna Tours' specific destinations and packages.
        - Call to Action: Guide the user smoothly toward finalizing their selection. Generate a payment link when they are ready to buy.
        PROMPT;
    }


}
