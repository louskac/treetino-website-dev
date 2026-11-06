export type AppLocale = 'cs' | 'en';

const SUPPORTED_LOCALES: readonly AppLocale[] = ['cs', 'en'];
const CZECH_SLOVAK_COUNTRIES = new Set(['CZ', 'SK']);
const CZECH_SLOVAK_TIMEZONES = new Set(['Europe/Prague', 'Europe/Bratislava']);
const CZECH_SLOVAK_LANG_PREFIXES = ['cs', 'sk', 'cz'];

function isSupportedLocale(val: unknown): val is AppLocale {
    return typeof val === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(val);
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined' || !document.cookie) {
        return null;
    }

    const match = document.cookie.match(
        new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
    );

    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Persists the chosen locale across localStorage, cookies, and the pricing app's key.
 */
export function persistLocale(locale: AppLocale): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem('app_locale', locale);
        localStorage.setItem('treetino_locale', locale);
    } catch {
        // Ignore storage errors in private browsing / restricted contexts
    }

    try {
        document.cookie = `app_locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
        document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
        // Ignore cookie errors
    }
}

/**
 * Checks if the user has an explicit locale preference via URL query (?lang= / ?locale=),
 * localStorage, or cookies.
 */
export function getExplicitLocale(): AppLocale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const queryLang = (params.get('lang') || params.get('locale'))?.toLowerCase();

        if (queryLang === 'cz') {
            persistLocale('cs');
            return 'cs';
        }

        if (isSupportedLocale(queryLang)) {
            persistLocale(queryLang);
            return queryLang;
        }
    } catch {
        // Ignore URL parsing errors
    }

    try {
        const stored =
            localStorage.getItem('app_locale') || localStorage.getItem('treetino_locale');
        if (isSupportedLocale(stored)) {
            return stored;
        }
    } catch {
        // Ignore localStorage access errors
    }

    const cookieLocale = getCookie('app_locale') || getCookie('locale');
    if (isSupportedLocale(cookieLocale)) {
        return cookieLocale;
    }

    return null;
}

/**
 * Synchronously resolves the best initial locale for the visitor:
 * 1. Explicit preference (URL param, localStorage, cookie)
 * 2. Domain hostname (.cz -> cs)
 * 3. Browser languages (navigator.languages / navigator.language)
 * 4. System timezone (Europe/Prague or Europe/Bratislava -> cs)
 * 5. Default fallback ('en' for international visitors)
 */
export function detectInitialLocale(serverLocale?: string | null): AppLocale {
    const explicit = getExplicitLocale();
    if (explicit) {
        return explicit;
    }

    if (typeof window !== 'undefined') {
        // Check if accessing via .cz or .sk TLD explicitly
        const host = window.location.hostname.toLowerCase();
        if (host.endsWith('.cz') || host.endsWith('.sk')) {
            return 'cs';
        }

        // Check browser language preferences
        const navLanguages =
            typeof navigator !== 'undefined'
                ? navigator.languages?.length
                    ? navigator.languages
                    : navigator.language
                      ? [navigator.language]
                      : []
                : [];

        for (const rawLang of navLanguages) {
            const code = rawLang.toLowerCase().trim();
            if (
                CZECH_SLOVAK_LANG_PREFIXES.some(
                    (prefix) => code === prefix || code.startsWith(`${prefix}-`) || code.startsWith(`${prefix}_`),
                )
            ) {
                return 'cs';
            }
            if (code === 'en' || code.startsWith('en-') || code.startsWith('en_')) {
                return 'en';
            }
        }

        // Check timezone (if someone in CZ/SK has an unusual non-en browser language or vice versa)
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && CZECH_SLOVAK_TIMEZONES.has(tz)) {
                return 'cs';
            }
            if (tz) {
                return 'en';
            }
        } catch {
            // Ignore Intl errors
        }
    }

    if (isSupportedLocale(serverLocale)) {
        return serverLocale;
    }

    return 'en';
}

/**
 * Optionally verifies visitor country via IP geolocation if no explicit preference was saved yet,
 * invoking the callback if the geo-detected locale differs from the initial synchronous guess.
 */
export async function detectGeoLocale(onDetected: (locale: AppLocale) => void): Promise<void> {
    if (typeof window === 'undefined' || getExplicitLocale() !== null) {
        return;
    }

    try {
        const cachedCountry = sessionStorage.getItem('treetino_geo_country');
        if (cachedCountry) {
            const geoLocale: AppLocale = CZECH_SLOVAK_COUNTRIES.has(cachedCountry.toUpperCase())
                ? 'cs'
                : 'en';
            onDetected(geoLocale);
            return;
        }
    } catch {
        // Ignore sessionStorage errors
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const res = await fetch('https://get.geojs.io/v1/ip/country.json', {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        });
        clearTimeout(timeout);

        if (!res.ok) {
            return;
        }

        const data = await res.json();
        const country = typeof data?.country === 'string' ? data.country.toUpperCase() : null;

        if (country) {
            try {
                sessionStorage.setItem('treetino_geo_country', country);
            } catch {
                // Ignore
            }

            // Re-check that the user hasn't manually switched language while fetch was in flight
            if (getExplicitLocale() === null) {
                const geoLocale: AppLocale = CZECH_SLOVAK_COUNTRIES.has(country) ? 'cs' : 'en';
                onDetected(geoLocale);
            }
        }
    } catch {
        // Silently ignore network/adblock errors; synchronous detection already handled fallback
    }
}
