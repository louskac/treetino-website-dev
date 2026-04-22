import type CookieConsent from 'vanilla-cookieconsent';

declare global {
    interface Window {
        CookieConsent: CookieConsent;
    }
}
