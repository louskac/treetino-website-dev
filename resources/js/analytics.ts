declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const GA_MEASUREMENT_ID =
    (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || 'G-97K6933LVC';

let lastTrackedPath = '';
let lastTrackedAt = 0;

/**
 * Determine whether analytics tracking should run in the current browser context.
 * Excludes local development hosts and automated headless browsers (Playwright/WebDriver).
 */
export function isAnalyticsEnabledEnvironment(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    if (typeof navigator !== 'undefined' && navigator.webdriver) {
        return false;
    }

    const host = window.location.hostname;

    if (
        !host ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]' ||
        host.endsWith('.local') ||
        host.endsWith('.test')
    ) {
        return false;
    }

    return true;
}

/**
 * Normalize document/page title so GA4 never records raw translation keys,
 * 'Laravel' fallbacks, or duplicated '| Treetino | Treetino' suffixes.
 */
export function normalizePageTitle(rawTitle?: string): string {
    const fallback =
        'Treetino — Chytrý energetický strom | Smart Solar & Wind Energy Tree';

    if (!rawTitle) {
        return fallback;
    }

    let cleaned = rawTitle
        .replace(/\bLaravel\b/gi, 'Treetino')
        .replace(/\bhome\.meta\.title\b/g, 'Treetino')
        .replace(/(?:\s*\|\s*Treetino)+/gi, ' | Treetino')
        .trim();

    if (!cleaned || cleaned === '| Treetino') {
        return fallback;
    }

    return cleaned;
}

/**
 * Initialize Google Analytics with Google Consent Mode v2.
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID): void {
    if (!isAnalyticsEnabledEnvironment() || !measurementId) {
        return;
    }

    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
        window.gtag = function () {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer.push(arguments);
        };
    }

    // Google Consent Mode v2 - default to denied until user gives consent
    window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
    });

    const scriptId = 'google-analytics-gtag';

    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');

        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        send_page_view: false, // Page views are tracked manually on Inertia navigation
    });
}

/**
 * Update Google Analytics consent based on cookie preferences.
 */
export function updateGAConsent(granted: boolean): void {
    if (!isAnalyticsEnabledEnvironment() || !window.gtag) {
        return;
    }

    window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
    });
}

/**
 * Track page view in GA4 SPA.
 */
export function trackPageView(url?: string, title?: string): void {
    if (!isAnalyticsEnabledEnvironment() || !window.gtag) {
        return;
    }

    const pagePath = url || window.location.pathname + window.location.search;
    const now = Date.now();

    if (pagePath === lastTrackedPath && now - lastTrackedAt < 500) {
        return;
    }

    lastTrackedPath = pagePath;
    lastTrackedAt = now;

    const pageTitle = normalizePageTitle(title || document.title);
    const pageLocation = pagePath.startsWith('http')
        ? pagePath
        : `${window.location.origin}${pagePath.startsWith('/') ? '' : '/'}${pagePath}`;

    window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
    });
}

/**
 * Track custom event in GA4.
 */
export function trackEvent(
    eventName: string,
    params: Record<string, any> = {},
): void {
    if (!isAnalyticsEnabledEnvironment() || !window.gtag) {
        return;
    }

    window.gtag('event', eventName, params);
}
