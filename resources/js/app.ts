import CookieConsent from '@/Plugins/CookieConsent';
import CookieConsentPlugin from './Plugins/CookieConsent';
import { type CookieConsentConfig } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import '../css/app.css';
import { ZiggyVue } from 'ziggy-js';
// import { initializeTheme } from '@/composables/useAppearance';

const appName = 'Treetino';

// Cookie Consent Config
const ccConfig: CookieConsentConfig = {
    guiOptions: {
        consentModal: {
            layout: 'box',
            position: 'bottom right',
        },
    },
    categories: {
        necessary: { readOnly: true, enabled: true },
        analytics: { enabled: false },
    },
    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'Cookie Consent',
                    description: 'We use cookies...',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    showPreferencesBtn: 'Settings',
                },
                preferencesModal: {
                    title: 'Preferences',
                    sections: [
                        { title: 'Necessary', linkedCategory: 'necessary' },
                        { title: 'Analytics', linkedCategory: 'analytics' },
                    ],
                },
            },
        },
    },
};

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(CookieConsentPlugin, ccConfig)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
// initializeTheme();
document.documentElement.classList.remove('dark');
