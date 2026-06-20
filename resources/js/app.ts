import CookieConsentPlugin from './Plugins/CookieConsent';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import '../css/app.css';
import { ZiggyVue } from 'ziggy-js';

const appName = 'Treetino';

const cookieConfig = (t: (key: string) => string): CookieConsentConfig => ({
    autoShow: false,
    guiOptions: { consentModal: { layout: 'box', position: 'bottom right' } },
    categories: {
        necessary: { readOnly: true, enabled: true },
        analytics: { enabled: false },
    },
    language: {
        default: 'current',
        translations: {
            current: {
                consentModal: {
                    title: t('common.cookie.title'),
                    description: t('common.cookie.description'),
                    acceptAllBtn: t('common.cookie.accept_all'),
                    acceptNecessaryBtn: t('common.cookie.reject_all'),
                    showPreferencesBtn: t('common.cookie.settings'),
                },
                preferencesModal: {
                    title: t('common.cookie.settings'),
                    sections: [
                        { title: t('common.cookie.reject_all'), linkedCategory: 'necessary' },
                        { title: 'Analytics', linkedCategory: 'analytics' },
                    ],
                },
            },
        },
    },
});

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const shared = props.initialPage.props as unknown as {
            i18n: { locale: string; fallbackLocale: string; messages: Record<string, any> };
        };
        const i18n = createI18n({
            legacy: false,
            locale: shared.i18n.locale,
            fallbackLocale: shared.i18n.fallbackLocale,
            messages: { [shared.i18n.locale]: shared.i18n.messages },
        });

        document.documentElement.lang = shared.i18n.locale;

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(i18n)
            .use(CookieConsentPlugin, cookieConfig((key) => String(i18n.global.t(key))))
            .use(ZiggyVue)
            .mount(el);
    },
    progress: { color: '#4B5563' },
});

document.documentElement.classList.remove('dark');
