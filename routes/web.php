<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ConfiguratorController;
use App\Http\Controllers\Api\PreorderController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/configurator', [ConfiguratorController::class, 'index'])->name('configurator');

Route::post('/checkout', [PreorderController::class, 'initiate'])->name('checkout-initiate');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
