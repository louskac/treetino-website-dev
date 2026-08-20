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
import i18nMessages from './i18n_messages.json';
import { initGA, updateGAConsent, trackPageView, trackEvent } from './analytics';

const appName = 'Treetino';

initGA();

const ZiggyConfig = {
    url: typeof window !== 'undefined' ? window.location.origin : '',
    port: null,
    defaults: {},
    routes: {
        'home': { uri: '/', methods: ['GET', 'HEAD'] },
        'products.treeV1': { uri: 'products/treetino-v1', methods: ['GET', 'HEAD'] },
        'products.treeV2': { uri: 'products/treetino-v2', methods: ['GET', 'HEAD'] },
        'products.turbine': { uri: 'products/turbine', methods: ['GET', 'HEAD'] },
        'configurator': { uri: 'configurator', methods: ['GET', 'HEAD'] },
        'configurator.product': { uri: 'configurator', methods: ['GET', 'HEAD'] },
        'sales.index': { uri: 'sales', methods: ['GET', 'HEAD'] },
        'collaboration.index': { uri: 'collaboration', methods: ['GET', 'HEAD'] },
        'media.index': { uri: 'media', methods: ['GET', 'HEAD'] },
        'contact.index': { uri: 'contact', methods: ['GET', 'HEAD'] },
        'contact.store': { uri: 'contact', methods: ['POST'] },
        'legal.tos': { uri: 'legal/terms-and-conditions', methods: ['GET', 'HEAD'] },
        'legal.pp': { uri: 'legal/privacy-policy', methods: ['GET', 'HEAD'] },
        'checkout-initiate': { uri: 'api/checkout/initiate', methods: ['POST'] },
        'preorders.success': { uri: 'preorders/success', methods: ['GET', 'HEAD'] },
    },
};

if (typeof window !== 'undefined') {
    (window as any).Ziggy = ZiggyConfig;
}

const staticRoutes: Record<string, string | ((param?: string) => string)> = {
    'home': '/',
    'products.treeV1': '/products/treetino-v1',
    'products.treeV2': '/products/treetino-v2',
    'products.turbine': '/products/turbine',
    'configurator': '/configurator',
    'configurator.product': (id?: string) => (id ? `/configurator?product=${id}` : '/configurator'),
    'sales.index': '/sales',
    'pitch.index': '/pitch',
    'collaboration.index': '/collaboration',
    'media.index': '/media',
    'contact.index': '/contact',
    'contact.store': '/contact',
    'legal.tos': '/legal/terms-and-conditions',
    'legal.pp': '/legal/privacy-policy',
};

function safeRoute(name?: string, params?: any): string {
    if (!name) return window.location.pathname;
    const r = staticRoutes[name];
    if (typeof r === 'function') return r(typeof params === 'string' || typeof params === 'number' ? String(params) : params?.id);
    if (typeof r === 'string') return r;
    return '/' + name.replace(/\./g, '/');
}

(window as any).route = safeRoute;

function getComponentForPath(path: string): string {
    const p = path.split('?')[0].replace(/\/$/, '') || '/';
    if (p === '/' || p === '/home') return 'Home/Index';
    if (p === '/products/treetino-v1' || p === '/products/strom-v1' || p === '/products/v1') return 'Products/V1';
    if (p === '/products/treetino-v2' || p === '/products/strom-v2' || p === '/products/v2') return 'Products/V2';
    if (p === '/products/turbine' || p === '/products/turbina') return 'Products/Turbine';
    if (p.startsWith('/configurator')) return 'Configurator/Index';
    if (p === '/sales' || p === '/crm' || p === '/cmr' || p === '/prodejci' || p === '/partners') return 'Sales/Index';
    if (p === '/pitch' || p === '/pitchdeck' || p === '/deck' || p === '/presentation') return 'Pitch/Index';
    if (p === '/collaboration') return 'Collaboration/Index';
    if (p === '/media') return 'Media/Index';
    if (p === '/contact') return 'Contact/Index';
    if (p === '/legal/terms-and-conditions') return 'Legal/Tos';
    if (p === '/legal/privacy-policy') return 'Legal/Pp';
    return 'Home/Index';
}

function makePageObject(url: string) {
    const comp = getComponentForPath(url);
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('app_locale') : null;
    const lang = savedLang || document.documentElement.lang || 'cs';
    const msgs = (i18nMessages as Record<string, any>)[lang] || (i18nMessages as Record<string, any>)['cs'];
    return {
        component: comp,
        props: {
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
                                        domain: typeof window !== 'undefined' ? window.location.hostname : 'treetino.cz',
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
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const shared = computed(() => (props.initialPage.props as any)?.i18n);

        const savedLang = typeof window !== 'undefined' ? localStorage.getItem('app_locale') : null;
        const activeLang = savedLang || shared.value?.locale || 'cs';
        const activeMsgs = (i18nMessages as any)[activeLang] || shared.value?.messages || (i18nMessages as any)['cs'];

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

        if (isStaticMode) {
            router.on('before', (event) => {
                const targetUrl = event.detail.visit.url;
                const path = typeof targetUrl === 'string' ? targetUrl : targetUrl?.pathname;
                if (path && path.startsWith('/') && path !== window.location.pathname) {
                    trackPageView(path);
                    event.preventDefault();
                    window.location.href = path;
                }
            });

            router.on('invalid', (event) => {
                event.preventDefault();
                const detailUrl = (event.detail as any)?.response?.config?.url || (event.detail as any)?.url;
                const targetUrl = detailUrl ? new URL(detailUrl, window.location.origin).pathname : window.location.pathname;
                if (targetUrl !== window.location.pathname) {
                    window.location.href = targetUrl;
                }
            });
        } else {
            router.on('navigate', (event) => {
                const next = event.detail.page.props.i18n as typeof shared.value;
                if (next && next.locale) {
                    i18n.global.setLocaleMessage(next.locale, next.messages);
                    i18n.global.fallbackLocale.value = next.fallbackLocale;
                    i18n.global.locale.value = next.locale;
                    document.documentElement.lang = next.locale;
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                trackPageView(window.location.pathname + window.location.search, document.title);
            });
        }

        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(i18n)
            .use(CookieConsentPlugin, cookieConfig((key: string) => String(i18n.global.t(key))))
            .use(ZiggyVue, ZiggyConfig as any);

        app.config.globalProperties.route = safeRoute;
        app.provide('route', safeRoute);
        app.config.globalProperties.$analytics = { trackEvent, trackPageView };
        app.provide('analytics', { trackEvent, trackPageView });

        app.mount(el);

        // Initial SPA page view tracking
        trackPageView(window.location.pathname + window.location.search, document.title);
    },
    progress: { color: '#4B5563' },
});

document.documentElement.classList.remove('dark');
