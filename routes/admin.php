<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TranslationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('admin.guest')->group(function () {
        Route::get('/login', [AuthController::class, 'create'])->name('login');
        Route::post('/login', [AuthController::class, 'store'])->name('login.store');
    });

    Route::middleware('admin.auth')->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');
        Route::get('/translations', [TranslationController::class, 'index'])->name('translations.index');
        Route::post('/translations/sync', [TranslationController::class, 'sync'])->name('translations.sync');
        Route::put('/translations/{translationKey}', [TranslationController::class, 'update'])->name('translations.update');
        Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    });
});
