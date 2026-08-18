declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || 'G-97K6933LVC';

/**
 * Initialize Google Analytics with Google Consent Mode v2.
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID): void {
    if (typeof window === 'undefined' || !measurementId) {
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
    if (typeof window === 'undefined' || !window.gtag) {
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
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }

    const pagePath = url || window.location.pathname + window.location.search;
    const pageTitle = title || document.title;

    window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: pageTitle,
    });
}

/**
 * Track custom event in GA4.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }

    window.gtag('event', eventName, params);
}
