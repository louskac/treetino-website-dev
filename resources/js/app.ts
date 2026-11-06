import CookieConsentPlugin from './Plugins/CookieConsent';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h, computed } from 'vue';
import { createI18n } from 'vue-i18n';
import '../css/app.css';
import { ZiggyVue } from 'ziggy-js';
import {
    initGA,
    updateGAConsent,
    trackPageView,
    trackEvent,
} from './analytics';
import i18nMessages from './i18n_messages.json';
import {
    detectGeoLocale,
    detectInitialLocale,
    getExplicitLocale,
    type AppLocale,
} from './lib/locale';
import {
    getComponentForPath,
    safeRoute,
    ZiggyConfig,
} from './lib/routes';

const appName = 'Treetino';

initGA();

if (typeof window !== 'undefined') {
    (window as any).Ziggy = ZiggyConfig;
    (window as any).route = safeRoute;
}

function makePageObject(url: string) {
    const comp = getComponentForPath(url);
    const lang = detectInitialLocale();
    const msgs =
        (i18nMessages as Record<string, any>)[lang] ||
        (i18nMessages as Record<string, any>)['en'];

    let initialProduct: string | null = null;
    if (typeof window !== 'undefined' && comp === 'Configurator/Index') {
        const params = new URLSearchParams(window.location.search);
        const pathMatch = window.location.pathname.match(
            /^\/configurator\/([^/?#]+)/,
        );
        initialProduct = params.get('product') || pathMatch?.[1] || null;
    }

    return {
        component: comp,
        props: {
            initialProduct,
            i18n: {
                locale: lang,
                fallbackLocale: 'en',
                locales: ['cs', 'en'],
                messages: msgs,
            },
            auth: { user: null, admin: null },
            flash: { success: null },
        },
        url: url,
        version: '1',
    };
}

const cookieConfig = (t: (key: string) => string): CookieConsentConfig => ({
    autoShow: false,
    guiOptions: {
        consentModal: { layout: 'box', position: 'bottom right' },
        preferencesModal: { layout: 'box', position: 'right' },
    },
    onConsent: ({ cookie }) => {
        updateGAConsent(cookie.categories.includes('analytics'));
    },
    onChange: ({ cookie }) => {
        updateGAConsent(cookie.categories.includes('analytics'));
    },
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
                    acceptAllBtn: t('common.cookie.accept_all'),
                    acceptNecessaryBtn: t('common.cookie.reject_all'),
                    savePreferencesBtn: t('common.cookie.save'),
                    sections: [
                        {
                            title: t('common.cookie.necessary_title'),
                            description: t('common.cookie.necessary_desc'),
                            linkedCategory: 'necessary',
                        },
                        {
                            title: t('common.cookie.analytics_title'),
                            description: t('common.cookie.analytics_desc'),
                            linkedCategory: 'analytics',
                            cookieTable: {
                                headers: {
                                    name: 'Cookie',
                                    domain: 'Domain',
                                    desc: 'Purpose',
                                },
                                body: [
                                    {
                                        name: '_ga, _ga_*',
                                        domain:
                                            typeof window !== 'undefined'
                                                ? window.location.hostname
                                                : 'treetino.cz',
                                        desc: 'Google Analytics 4',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        },
    },
});

const appEl = document.getElementById('app');
let initialPage: any = null;

if (appEl && appEl.dataset.page) {
    try {
        initialPage = JSON.parse(appEl.dataset.page);
    } catch (e) {
        // fallback
    }
}

const isStaticMode = !initialPage;

if (!initialPage) {
    initialPage = makePageObject(window.location.pathname);
}

createInertiaApp({
    page: initialPage,
    title: (title) => {
        if (!title || title === 'home.meta.title') {
            return `${appName} — Chytrý energetický strom | Smart Solar & Wind Energy Tree`;
        }
        return title.includes(appName) ? title : `${title} | ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const shared = computed(() => (props.initialPage.props as any)?.i18n);

        const activeLang = detectInitialLocale(shared.value?.locale);

        const i18n = createI18n({
            legacy: false,
            locale: activeLang,
            fallbackLocale: shared.value?.fallbackLocale || 'en',
            messages: {
                cs: (i18nMessages as any)['cs'] || {},
                en: (i18nMessages as any)['en'] || {},
            },
        });

        document.documentElement.lang = activeLang;

        const applyDetectedLocale = (targetLocale: AppLocale) => {
            if (i18n.global.locale.value === targetLocale) {
                return;
            }
            const msgs =
                (i18nMessages as Record<string, any>)[targetLocale] ||
                (i18nMessages as Record<string, any>)['en'];
            i18n.global.setLocaleMessage(targetLocale, msgs);
            i18n.global.locale.value = targetLocale;
            document.documentElement.lang = targetLocale;
            if ((props.initialPage.props as any)?.i18n) {
                (props.initialPage.props as any).i18n.locale = targetLocale;
                (props.initialPage.props as any).i18n.messages = msgs;
            }
            window.dispatchEvent(
                new CustomEvent('locale-changed', { detail: targetLocale }),
            );
        };

        void detectGeoLocale(applyDetectedLocale);

        if (isStaticMode) {
            router.on('before', (event) => {
                const method = (
                    event.detail.visit.method || 'get'
                ).toLowerCase();
                const targetUrl = event.detail.visit.url;
                const path =
                    typeof targetUrl === 'string'
                        ? targetUrl
                        : targetUrl?.pathname;

                // Never perform Inertia network requests in static mode for background POSTs (e.g. /locale)
                if (method !== 'get' || path === '/locale') {
                    event.preventDefault();
                    return;
                }

                const fullHref =
                    typeof targetUrl === 'string'
                        ? targetUrl
                        : targetUrl
                          ? targetUrl.pathname +
                            targetUrl.search +
                            targetUrl.hash
                          : '';

                if (
                    path &&
                    path.startsWith('/') &&
                    fullHref !==
                        window.location.pathname +
                            window.location.search +
                            window.location.hash
                ) {
                    event.preventDefault();
                    window.location.href = fullHref;
                }
            });

            router.on('invalid', (event) => {
                event.preventDefault();
            });
        } else {
            router.on('navigate', (event) => {
                const next = event.detail.page.props
                    .i18n as typeof shared.value;
                const explicit = getExplicitLocale();
                const resolvedLocale = explicit || next?.locale;

                if (resolvedLocale) {
                    const msgs =
                        (i18nMessages as Record<string, any>)[resolvedLocale] ||
                        next?.messages ||
                        (i18nMessages as Record<string, any>)['en'];
                    i18n.global.setLocaleMessage(resolvedLocale, msgs);
                    if (next?.fallbackLocale) {
                        i18n.global.fallbackLocale.value = next.fallbackLocale;
                    }
                    i18n.global.locale.value = resolvedLocale;
                    document.documentElement.lang = resolvedLocale;
                    if (next) {
                        next.locale = resolvedLocale;
                        next.messages = msgs;
                    }
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    trackPageView(
                        window.location.pathname + window.location.search,
                        document.title,
                    );
                }, 0);
            });
        }

        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(i18n)
            .use(
                CookieConsentPlugin,
                cookieConfig((key: string) =>
                    String((i18n.global as any).t(key)),
                ),
            )
            .use(ZiggyVue, ZiggyConfig as any);

        app.config.globalProperties.route = safeRoute;
        app.provide('route', safeRoute);
        app.config.globalProperties.$analytics = { trackEvent, trackPageView };
        app.provide('analytics', { trackEvent, trackPageView });

        app.mount(el);

        // Initial SPA page view tracking (deferred so Inertia <Head> updates document.title first)
        setTimeout(() => {
            trackPageView(
                window.location.pathname + window.location.search,
                document.title,
            );
        }, 0);
    },
    progress: { color: '#4B5563' },
});

document.documentElement.classList.remove('dark');
