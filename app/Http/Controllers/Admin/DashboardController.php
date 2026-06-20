<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\TranslationService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(TranslationService $translations): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'keys' => TranslationKey::count(),
                'values' => Translation::count(),
                'locales' => count(config('localization.locales')),
            ],
            'translationStatus' => $translations->status(),
        ]);
    }
}
