<?php

use App\Http\Controllers\Api\PreorderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\ConfiguratorController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/configurator', [ConfiguratorController::class, 'index'])->name('configurator');

// Checkout
Route::post('/checkout', [PreorderController::class, 'initiate'])->name('checkout-initiate');

// Orders
Route::prefix('preorders')->name('preorders.')->group( function () {
    Route::get('/{uuid}', [OrderController::class, 'success'])->name('success');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

// Webhooks
Route::post('/webhook', [WebhookController::class, 'webhook'])->name('webhook');

require __DIR__.'/settings.php';
