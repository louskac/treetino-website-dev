<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Models\TranslationKey;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'keys' => TranslationKey::count(),
                'values' => Translation::count(),
                'locales' => count(config('localization.locales')),
            ],
        ]);
    }
}
