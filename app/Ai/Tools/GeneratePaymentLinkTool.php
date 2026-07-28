<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;
use App\Models\Payment;
use App\Models\WebsiteChatVisitor;
use App\Models\Order;
use App\Models\Staff;
use App\Models\Customer;
use App\Models\Service;
use Illuminate\Support\Str;

class GeneratePaymentLinkTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Generates a secure payment link for the customer when they are ready to book a tour or package.';
    }

    /**
     * Execute the tool.
     */
    public function handle(array|\Laravel\Ai\Tools\Request $request): Stringable|string
    {
        $amount = $request['amount'];
        $description = $request['description'];
        $visitorId = $request['visitor_id'] ?? null;
        // If the AI doesn't know the visitor ID, we might need a fallback or let it generate a generic link.
        
        // Find the most recent visitor or use a placeholder if not provided
        $visitor = WebsiteChatVisitor::latest('id')->first();
        if (!$visitor) {
            return "Error: Could not find visitor to attach payment to.";
        }
        
        // 1. Create or find Customer based on visitor
        $customer = Customer::firstOrCreate(
            ['email' => $visitor->email ?? 'guest_' . uniqid() . '@example.com'],
            [
                'name' => $visitor->name ?? 'Guest User',
                'phone' => $visitor->phone
            ]
        );

        // 2. Create a generic Service for this booking if we don't have one
        $serviceId = 'custom-' . Str::slug(substr($description, 0, 20)) . '-' . uniqid();
        Service::create([
            'id' => $serviceId,
            'name' => $description,
            'type' => 'package',
            'price' => $amount,
            'status' => 'active'
        ]);

        $staffId = $visitor->staff_id;

        // 4. Create Order
        $order = Order::create([
            'staff_id' => $staffId,
            'customer_id' => $customer->id,
            'service_id' => $serviceId,
            'amount' => $amount,
            'description' => $description,
            'status' => 'pending'
        ]);

        $payment = Payment::create([
            'visitor_id' => $visitor->id,
            'amount' => $amount,
            'description' => $description,
            'status' => 'pending',
            'order_id' => $order->id
        ]);

        
        $paymentUrl = config('app.url') . "/pay/" . $payment->id;

        return "Payment link generated successfully. VERY IMPORTANT: You must output this exact link to the customer. Do NOT add asterisks (**), periods, or parentheses around the link, because it will break the URL. Put the link on a new line by itself. Link: \n" . $paymentUrl;
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'amount' => $schema->number()->required()->description('The total cost of the tour package in INR (₹).'),
            'description' => $schema->string()->required()->description('A short description of the package being purchased (e.g. "3 Days Goa Package").'),
        ];
    }
}
