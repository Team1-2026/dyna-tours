<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Models\Payment;
use Illuminate\Http\Request;

Route::get('/pay/{payment}', function (Payment $payment) {
    return view('checkout', ['payment' => $payment]);
});

use App\Models\Order;
use App\Models\Booking;

Route::post('/pay/{payment}/process', function (Payment $payment) {
    $payment->update(['status' => 'paid']);
    
    if ($payment->order_id) {
        $order = Order::find($payment->order_id);
        if ($order && $order->status !== 'paid') {
            $order->update(['status' => 'paid']);
            
            Booking::create([
                'reference' => 'BKG-' . strtoupper(uniqid()),
                'customer_id' => $order->customer_id,
                'service_id' => $order->service_id,
                'num_travelers' => 1,
                'price_paid' => $order->amount,
                'status' => 'confirmed',
                'staff_id' => $order->staff_id,
                'notes' => 'Auto-generated from Order #' . $order->id
            ]);
        }
    }
    
    return redirect("/pay/{$payment->id}");
});

