<?php

use App\Http\Controllers\Api\PreorderController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\ConfiguratorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SalesController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LegalController;

Route::get('/home', function () {
    return redirect('/');
});
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/locale', LocaleController::class)->name('locale.update');
Route::get('/configurator', [ConfiguratorController::class, 'index'])->name('configurator');
Route::get('/configurator/{product}', [ConfiguratorController::class, 'index'])->name('configurator.product');

Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
Route::get('/crm', [SalesController::class, 'index']);
Route::get('/cmr', [SalesController::class, 'index']);

Route::prefix('products')->name('products.')->group(function () {
    Route::get('/treetino-v1', [ProductsController::class, 'treeV1'])->name('treeV1');
    Route::get('/treetino-v2', [ProductsController::class, 'treeV2'])->name('treeV2');
    Route::get('/turbine', [ProductsController::class, 'turbine'])->name('turbine');
});

// Spolupráce
Route::prefix('collaboration')->name('collaboration.')->group(function () {
    Route::get('/', [CollaborationController::class, 'index'])->name('index');
});

// Media
Route::prefix('media')->name('media.')->group(function () {
    Route::get('/', [MediaController::class, 'index'])->name('index');
});

// Kontakt
Route::prefix('contact')->name('contact.')->group(function () {
    Route::get('/', [ContactController::class, 'index'])->name('index');
    Route::post('/', [ContactController::class, 'store'])->name('store');
});

// Legal
Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/terms-and-conditions', [LegalController::class, 'tos'])->name('tos');
    Route::get('/privacy-policy', [LegalController::class, 'pp'])->name('pp');
});

// Checkout
Route::post('/checkout', [PreorderController::class, 'initiate'])->name('checkout-initiate');

// Orders
Route::prefix('preorders')->name('preorders.')->group(function () {
    Route::post('/invoice', [PreorderController::class, 'invoice'])->name('invoice');
    Route::get('/invoicetest', [PreorderController::class, 'invoicetest'])->name('invoicetest');

    Route::get('/{uuid}', [OrderController::class, 'success'])->name('success');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

// Webhooks
Route::post('/webhook', [WebhookController::class, 'webhook'])->name('webhook');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
