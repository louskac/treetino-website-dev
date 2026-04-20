<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ContactController;

use App\Http\Controllers\Api\PreorderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\ConfiguratorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/configurator', [ConfiguratorController::class, 'index'])->name('configurator');

// Spolupráce
Route::prefix('collaboration')->name('collaboration.')->group( function () {
    Route::get('/', [CollaborationController::class, 'index'])->name('index');
});

// Media
Route::prefix('media')->name('media.')->group( function () {
    Route::get('/', [MediaController::class, 'index'])->name('index');
});

// Kontakt
Route::prefix('contact')->name('contact.')->group( function () {
    Route::get('/', [ContactController::class, 'index'])->name('index');
    Route::post('/', [ContactController::class, 'store'])->name('store');
});

// Checkout
Route::post('/checkout', [PreorderController::class, 'initiate'])->name('checkout-initiate');

// Orders
Route::prefix('preorders')->name('preorders.')->group( function () {
    Route::post('/invoice',  [PreorderController::class, 'invoice'])->name('invoice');
    Route::get ('/invoicetest',  [PreorderController::class, 'invoicetest'])->name('invoicetest');

    Route::get('/{uuid}', [OrderController::class, 'success'])->name('success');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

// Webhooks
Route::post('/webhook', [WebhookController::class, 'webhook'])->name('webhook');

require __DIR__.'/settings.php';
