<?php

namespace App\Http\Middleware;

use App\Services\TranslationService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const CZECH_SLOVAK_COUNTRIES = ['CZ', 'SK'];

    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('localization.locales', ['cs', 'en']);
        $cookieName = config('localization.cookie', 'locale');

        $queryLocale = $request->query('lang') ?? $request->query('locale');
        if (is_string($queryLocale)) {
            $queryLocale = strtolower($queryLocale) === 'cz' ? 'cs' : strtolower($queryLocale);
        }

        $explicitQueryLocale = (is_string($queryLocale) && in_array($queryLocale, $supported, true))
            ? $queryLocale
            : null;

        if ($explicitQueryLocale !== null) {
            $request->session()->put('locale', $explicitQueryLocale);
        }

        $locale = $explicitQueryLocale
            ?? $request->cookie($cookieName)
            ?? $request->cookie('app_locale')
            ?? $request->session()->get('locale')
            ?? $this->detectFromRequest($request, $supported)
            ?? config('app.locale', 'cs');

        if (! in_array($locale, $supported, true)) {
            $locale = config('app.fallback_locale', 'en');
        }

        App::setLocale($locale);
        Lang::addLines(Arr::dot(app(TranslationService::class)->messages($locale)), $locale);

        return $next($request);
    }

    /**
     * @param  array<int, string>  $supported
     */
    private function detectFromRequest(Request $request, array $supported): ?string
    {
        $host = strtolower($request->getHost());
        if (str_ends_with($host, '.cz') || str_ends_with($host, '.sk')) {
            return 'cs';
        }

        $country = strtoupper((string) (
            $request->header('x-vercel-ip-country')
            ?? $request->header('cf-ipcountry')
            ?? $request->header('x-country-code')
            ?? ''
        ));

        if ($country !== '' && $country !== 'XX') {
            return in_array($country, self::CZECH_SLOVAK_COUNTRIES, true) ? 'cs' : 'en';
        }

        if ($request->headers->has('Accept-Language')) {
            foreach ($request->getLanguages() as $lang) {
                $code = strtolower(substr($lang, 0, 2));
                if (in_array($code, ['cs', 'sk', 'cz'], true)) {
                    return 'cs';
                }
                if (in_array($code, $supported, true)) {
                    return $code;
                }
            }

            return 'en';
        }

        return null;
    }
}
