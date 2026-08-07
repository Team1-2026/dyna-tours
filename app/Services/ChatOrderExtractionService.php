<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\WebsiteChatVisitor;
use App\Models\GroupTour;
use App\Models\Hotel;
use App\Models\Visa;
use App\Models\Cruise;
use App\Models\Destination;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ChatOrderExtractionService
{
    /**
     * Analyze conversation and automatically create an order if criteria met.
     *
     * @param WebsiteChatVisitor $visitor
     * @param string|null $conversationId
     * @return array|null Order data if created/exists, null otherwise
     */
    public function extractAndCreateOrder(WebsiteChatVisitor $visitor, ?string $conversationId = null): ?array
    {
        if (!$conversationId) {
            $conversationId = $visitor->agent_conversation_id;
        }

        if (!$conversationId) {
            return null;
        }

        // Check if an order has already been created for this conversation
        $existingOrder = Order::where('conversation_id', $conversationId)->first();
        if ($existingOrder) {
            return $this->formatOrderPayload($existingOrder);
        }

        // Retrieve messages for transcript analysis
        $messagesTable = config('ai.conversations.tables.messages', 'agent_conversation_messages');
        $messages = DB::table($messagesTable)
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at')
            ->get(['role', 'content']);

        if ($messages->isEmpty()) {
            return null;
        }

        $transcript = $messages->map(fn($m) => "{$m->role}: {$m->content}")->implode("\n");

        // Step 1: Extract criteria from visitor profile & transcript
        $extracted = $this->extractBookingCriteria($visitor, $transcript);

        // Verify mandatory criteria:
        // 1. Contact Info (Name & Email/Phone)
        // 2. Selected Service/Package
        // 3. Travel Date
        // 4. Passenger / Guest Count
        if (
            empty($extracted['customer_name']) ||
            (empty($extracted['customer_email']) && empty($extracted['customer_phone'])) ||
            empty($extracted['service_name']) ||
            empty($extracted['travel_date']) ||
            empty($extracted['num_travelers']) ||
            $extracted['num_travelers'] < 1
        ) {
            return null;
        }

        // Step 2: DB Transaction to create Customer & Order
        return DB::transaction(function () use ($visitor, $conversationId, $extracted) {
            // Re-check existing order inside lock to prevent race condition
            $existingOrder = Order::where('conversation_id', $conversationId)->first();
            if ($existingOrder) {
                return $this->formatOrderPayload($existingOrder);
            }

            // Find or create customer
            $customer = null;
            if (!empty($extracted['customer_email'])) {
                $customer = Customer::where('email', $extracted['customer_email'])->first();
            }

            if (!$customer && !empty($extracted['customer_name'])) {
                $customer = Customer::create([
                    'name' => $extracted['customer_name'],
                    'email' => $extracted['customer_email'] ?? '',
                    'phone' => $extracted['customer_phone'] ?? null,
                ]);
            } elseif ($customer) {
                // Update phone if provided and not set
                if (empty($customer->phone) && !empty($extracted['customer_phone'])) {
                    $customer->phone = $extracted['customer_phone'];
                    $customer->save();
                }
            }

            $amount = $extracted['total_amount'] ?? 0;
            if ($amount <= 0) {
                $amount = 5000 * ($extracted['num_travelers'] ?? 1); // Default estimated price if catalog price unlisted
            }

            $serviceId = null;
            if (!empty($extracted['service_id'])) {
                $serviceId = (string) $extracted['service_id'];
                \App\Models\Service::firstOrCreate(
                    ['id' => $serviceId],
                    [
                        'name' => $extracted['service_name'],
                        'price' => $extracted['unit_price'] ?? 0,
                        'type' => strtolower($extracted['service_type'] ?? 'package'),
                        'description' => 'Automatically generated service entry from chat enquiry',
                        'status' => 'active',
                    ]
                );
            }

            $description = sprintf(
                "Chat Order Creation: %s for %d traveler(s) on %s. Customer: %s (%s, %s)",
                $extracted['service_name'],
                $extracted['num_travelers'],
                $extracted['travel_date'],
                $extracted['customer_name'],
                $extracted['customer_email'] ?? 'N/A',
                $extracted['customer_phone'] ?? 'N/A'
            );

            $order = Order::create([
                'staff_id' => $visitor->staff_id,
                'customer_id' => $customer?->id,
                'visitor_uuid' => $visitor->visitor_uuid,
                'conversation_id' => $conversationId,
                'service_id' => $serviceId,
                'amount' => $amount,
                'status' => 'confirmed',
                'source' => 'website_chat',
                'description' => $description,
            ]);

            Log::info("AI Chat Automatic Order Created: Order #{$order->id} for {$extracted['customer_name']}");

            return $this->formatOrderPayload($order, $extracted);
        });
    }

    /**
     * Extract structured criteria from visitor and conversation transcript.
     */
    protected function extractBookingCriteria(WebsiteChatVisitor $visitor, string $transcript): array
    {
        $name = $visitor->name;
        $email = $visitor->email;
        $phone = $visitor->phone;

        // Service extraction by matching database items
        $serviceName = null;
        $serviceId = null;
        $unitPrice = 0;
        $serviceType = null;

        // Check Group Tours
        $groupTours = GroupTour::where('is_visible', true)->get();
        foreach ($groupTours as $gt) {
            if (
                Str::contains(strtolower($transcript), strtolower($gt->name)) ||
                (Str::contains(strtolower($transcript), strtolower($gt->destination)) && Str::contains(strtolower($transcript), 'tour'))
            ) {
                $serviceName = $gt->name . " (" . $gt->destination . ")";
                $serviceId = "tour_" . $gt->id;
                $unitPrice = (float) $gt->starting_price;
                $serviceType = 'GroupTour';
                break;
            }
        }

        // Check Hotels
        if (!$serviceName) {
            $hotels = Hotel::all();
            foreach ($hotels as $hotel) {
                if (Str::contains(strtolower($transcript), strtolower($hotel->name))) {
                    $serviceName = "Hotel " . $hotel->name;
                    $serviceId = "hotel_" . $hotel->id;
                    $unitPrice = (float) ($hotel->price ?? 0);
                    $serviceType = 'Hotel';
                    break;
                }
            }
        }

        // Check Visas
        if (!$serviceName) {
            $visas = Visa::where('is_active', true)->get();
            foreach ($visas as $visa) {
                if (Str::contains(strtolower($transcript), strtolower($visa->name)) || Str::contains(strtolower($transcript), strtolower($visa->country ?? ''))) {
                    $serviceName = $visa->name . " Visa";
                    $serviceId = "visa_" . $visa->id;
                    $unitPrice = (float) ($visa->price ?? 0);
                    $serviceType = 'Visa';
                    break;
                }
            }
        }

        // Check Cruises
        if (!$serviceName) {
            $cruises = Cruise::all();
            foreach ($cruises as $cruise) {
                if (Str::contains(strtolower($transcript), strtolower($cruise->name))) {
                    $serviceName = "Cruise " . $cruise->name;
                    $serviceId = "cruise_" . $cruise->id;
                    $unitPrice = (float) ($cruise->price ?? 0);
                    $serviceType = 'Cruise';
                    break;
                }
            }
        }

        // Check Destinations / General Tours
        if (!$serviceName) {
            $destinations = Destination::all();
            foreach ($destinations as $dest) {
                if (Str::contains(strtolower($transcript), strtolower($dest->name))) {
                    $serviceName = $dest->name . " Tour Package";
                    $serviceId = "dest_" . $dest->id;
                    $unitPrice = 15000;
                    $serviceType = 'Destination';
                    break;
                }
            }
        }

        // Fallback service matching if mentioned booking intent with keyword
        if (!$serviceName) {
            if (preg_match('/book(?:ing)?\s+(?:the\s+)?([A-Za-z0-9\s]{3,30}?)(?:\s+for|\s+on|\s+departing|$|\.|\,)/i', $transcript, $matches)) {
                $serviceName = trim($matches[1]);
                $serviceId = Str::slug($serviceName);
                $unitPrice = 12000;
                $serviceType = 'Package';
            }
        }

        // Extract passenger / guest count
        $numTravelers = null;
        if (preg_match('/(\d+)\s*(?:people|person|traveler|travelers|passenger|passengers|adult|adults|guest|guests)/i', $transcript, $matches)) {
            $numTravelers = (int) $matches[1];
        } elseif (preg_match('/for\s+(\d+)/i', $transcript, $matches)) {
            $numTravelers = (int) $matches[1];
        } elseif (preg_match('/for\s+(two|three|four|five|six|one)/i', $transcript, $matches)) {
            $wordMap = ['one' => 1, 'two' => 2, 'three' => 3, 'four' => 4, 'five' => 5, 'six' => 6];
            $numTravelers = $wordMap[strtolower($matches[1])] ?? 1;
        }

        // Extract travel date
        $travelDate = null;
        if (preg_match('/(?:departing|depart|check-in|leaving|on|date:?)\s*([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+[0-9]{4})?|[A-Za-z]+\s+[0-9]{1,2}(?:st|nd|rd|th)?(?:\s+[0-9]{4})?|[0-9]{4}-[0-9]{2}-[0-9]{2})/i', $transcript, $matches)) {
            $travelDate = trim($matches[1]);
        } elseif (preg_match('/([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4})/i', $transcript, $matches)) {
            $travelDate = trim($matches[1]);
        }

        // Total amount calculation
        $totalAmount = $unitPrice * ($numTravelers ?? 1);

        return [
            'customer_name' => $name,
            'customer_email' => $email,
            'customer_phone' => $phone,
            'service_type' => $serviceType,
            'service_name' => $serviceName,
            'service_id' => $serviceId,
            'travel_date' => $travelDate,
            'num_travelers' => $numTravelers,
            'unit_price' => $unitPrice,
            'total_amount' => $totalAmount,
        ];
    }

    /**
     * Format Order object into clean frontend payload.
     */
    protected function formatOrderPayload(Order $order, ?array $extracted = null): array
    {
        $ref = '#ORD-' . date('Y') . '-' . str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);
        
        $serviceName = $extracted['service_name'] ?? null;
        if (!$serviceName && $order->description) {
            if (preg_match('/Chat Order Creation:\s*(.*?)\s*for/i', $order->description, $matches)) {
                $serviceName = $matches[1];
            } else {
                $serviceName = $order->description;
            }
        }

        $travelDate = $extracted['travel_date'] ?? null;
        if (!$travelDate && $order->description) {
            if (preg_match('/on\s+(.*?)\.\s*Customer/i', $order->description, $matches)) {
                $travelDate = $matches[1];
            }
        }

        $numTravelers = $extracted['num_travelers'] ?? null;
        if (!$numTravelers && $order->description) {
            if (preg_match('/for\s+(\d+)\s+traveler/i', $order->description, $matches)) {
                $numTravelers = (int) $matches[1];
            }
        }

        return [
            'id' => $order->id,
            'order_ref' => $ref,
            'service_name' => $serviceName ?? 'Tour Package',
            'travel_date' => $travelDate ?? 'Confirmed',
            'num_travelers' => $numTravelers ?? 1,
            'amount' => (float) $order->amount,
            'status' => $order->status,
            'created_at' => $order->created_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }
}
