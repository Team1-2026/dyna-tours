<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationalAgentController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\GoogleChatWebhookController;
use App\Http\Controllers\PublicChatController;
use App\Http\Controllers\CrmChatController;
use App\Http\Controllers\FlightPageController;
use App\Http\Controllers\API\VisaController;
use App\Http\Controllers\API\GroupTourController;
use App\Http\Controllers\API\GroupTourPageController;
use App\Http\Controllers\API\GroupTourEnquiryController;
use App\Http\Controllers\API\AboutPageController;
use App\Http\Controllers\API\ContactPageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);

Route::get('/visas', [VisaController::class, 'index']);
Route::get('/visas/{id}', [VisaController::class, 'show']);

Route::get('/group-tours/page', [GroupTourPageController::class, 'show']);
Route::get('/group-tours', [GroupTourController::class, 'index']);
Route::get('/group-tours/{id}', [GroupTourController::class, 'show']);
Route::post('/group-tours/enquiries', [GroupTourEnquiryController::class, 'store']);

Route::get('/flights/page', [FlightPageController::class, 'get']);
Route::get('/about-page', [AboutPageController::class, 'show']);
Route::get('/contact-page', [ContactPageController::class, 'show']);
Route::post('/contact/submit', [ContactPageController::class, 'submit']);

Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);

Route::get('/facilities', [FacilityController::class, 'index']);

Route::post('/enquiries', [EnquiryController::class, 'store']);

Route::post('/chat/start', [PublicChatController::class, 'start']);
Route::post('/chat/continue', [PublicChatController::class, 'continue']);
Route::get('/chat/messages', [PublicChatController::class, 'messages']);
Route::post('/chat/google-identity', [PublicChatController::class, 'googleIdentity']);
Route::post('/chat/identify', [PublicChatController::class, 'identify']);

Route::post('/google-chat/webhook', GoogleChatWebhookController::class)
    ->middleware('verify.google.chat');

    
// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/conversations/start', [ConversationalAgentController::class, 'startConversation']);
    Route::post('/conversations/continue', [ConversationalAgentController::class, 'continueConversation']);

    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::put('/destinations/{id}', [DestinationController::class, 'update']);
    Route::delete('/destinations/{id}', [DestinationController::class, 'destroy']);

    Route::post('/visas', [VisaController::class, 'store']);
    Route::put('/visas/{id}', [VisaController::class, 'update']);
    Route::delete('/visas/{id}', [VisaController::class, 'destroy']);

    Route::post('/hotels', [HotelController::class, 'store']);
    Route::put('/hotels/{id}', [HotelController::class, 'update']);
    Route::delete('/hotels/{id}', [HotelController::class, 'destroy']);

    Route::post('/facilities', [FacilityController::class, 'store']);
    Route::put('/facilities/{id}', [FacilityController::class, 'update']);
    Route::delete('/facilities/{id}', [FacilityController::class, 'destroy']);

    Route::get('/enquiries', [EnquiryController::class, 'index']);
    Route::delete('/enquiries/{id}', [EnquiryController::class, 'destroy']);
    Route::put('/enquiries/{id}/status', [EnquiryController::class, 'updateStatus']);

    Route::get('/crm/chats', [CrmChatController::class, 'index']);
    Route::get('/crm/chats/{source}/{id}', [CrmChatController::class, 'show'])
        ->whereIn('source', ['website', 'google_chat']);
    Route::put('/crm/chats/{source}/{id}', [CrmChatController::class, 'update'])
        ->whereIn('source', ['website', 'google_chat']);
    Route::delete('/crm/chats/{source}/{id}', [CrmChatController::class, 'destroy'])
        ->whereIn('source', ['website', 'google_chat']);

    // Group Tours Admin Routes
    Route::post('/group-tours/page', [GroupTourPageController::class, 'update']);
    Route::post('/group-tours', [GroupTourController::class, 'store']);
    Route::put('/group-tours/{id}', [GroupTourController::class, 'update']);
    Route::delete('/group-tours/{id}', [GroupTourController::class, 'destroy']);
    Route::get('/group-tours/enquiries', [GroupTourEnquiryController::class, 'index']);
    Route::put('/group-tours/enquiries/{id}', [GroupTourEnquiryController::class, 'update']);

    // Flight Page Admin Routes
    Route::post('/flights/page', [FlightPageController::class, 'update']);
    Route::put('/flights/page', [FlightPageController::class, 'update']);

    // About Us Page Admin Routes
    Route::post('/about-page', [AboutPageController::class, 'update']);
    Route::put('/about-page', [AboutPageController::class, 'update']);

    // Contact Us Page Admin Routes
    Route::post('/contact-page', [ContactPageController::class, 'update']);
    Route::put('/contact-page', [ContactPageController::class, 'update']);
});
