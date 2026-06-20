<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['required', Rule::in(config('localization.locales'))],
        ]);

        $request->session()->put('locale', $validated['locale']);

        return back()->withCookie(cookie()->forever(config('localization.cookie'), $validated['locale']));
    }
}
