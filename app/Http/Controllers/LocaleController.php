<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    public function __invoke(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'locale' => ['required', Rule::in(config('localization.locales'))],
        ]);

        $request->session()->put('locale', $validated['locale']);
        $cookie = cookie()->forever(config('localization.cookie'), $validated['locale']);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['locale' => $validated['locale']])->withCookie($cookie);
        }

        return back(fallback: $request->headers->get('referer', '/'))->withCookie($cookie);
    }
}
