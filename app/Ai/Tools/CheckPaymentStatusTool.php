<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;
use App\Models\Payment;


class CheckPaymentStatusTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Checks if a specific payment link has been successfully paid by the customer. Use this when the customer says they have completed the payment.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $paymentUrl = $request['payment_url_or_id'];
        
        // Extract ID if a full URL was provided
        $paymentId = basename($paymentUrl);

        $payment = Payment::find($paymentId);

        if (!$payment) {
            return "Error: Payment link not found in the database. Are you sure you generated it?";
        }

        if ($payment->status === 'paid') {
            return "SUCCESS! The payment of $" . $payment->amount . " for " . $payment->description . " has been completed. You can now thank the customer and confirm their booking.";
        }

        return "PENDING: The payment has not been completed yet. The customer still needs to click the link and pay.";
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'payment_url_or_id' => $schema->string()->required()->description('The unique payment ID or the full payment URL that was generated earlier.'),
        ];
    }
}
