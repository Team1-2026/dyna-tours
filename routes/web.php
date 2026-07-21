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

Route::post('/pay/{payment}/process', function (Payment $payment) {
    $payment->update(['status' => 'paid']);
    return redirect("/pay/{$payment->id}");
});

