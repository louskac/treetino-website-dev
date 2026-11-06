/**
 * Centralized route definitions, Ziggy fallback configuration, and URL-to-page-component
 * resolution for both Laravel Inertia SSR/SPA mode and static Vercel mode.
 */

export const ZiggyConfig = {
    url: typeof window !== 'undefined' ? window.location.origin : '',
    port: null,
    defaults: {},
    routes: {
        home: { uri: '/', methods: ['GET', 'HEAD'] },
        'products.treeV1': {
            uri: 'products/treetino-v1',
            methods: ['GET', 'HEAD'],
        },
        'products.treeV2': {
            uri: 'products/treetino-v2',
            methods: ['GET', 'HEAD'],
        },
        'products.turbine': {
            uri: 'products/turbine',
            methods: ['GET', 'HEAD'],
        },
        configurator: { uri: 'configurator', methods: ['GET', 'HEAD'] },
        'configurator.product': {
            uri: 'configurator',
            methods: ['GET', 'HEAD'],
        },
        'sales.index': { uri: 'sales', methods: ['GET', 'HEAD'] },
        'pitch.index': { uri: 'pitch', methods: ['GET', 'HEAD'] },
        'pitch.hackathon': {
            uri: 'pitch-hackathon',
            methods: ['GET', 'HEAD'],
        },
        'pitch.fintech': {
            uri: 'pitch-fintech',
            methods: ['GET', 'HEAD'],
        },
        'pitch.refract': {
            uri: 'pitch-refract',
            methods: ['GET', 'HEAD'],
        },
        'collaboration.index': {
            uri: 'collaboration',
            methods: ['GET', 'HEAD'],
        },
        'media.index': { uri: 'media', methods: ['GET', 'HEAD'] },
        'web3.index': { uri: 'web3', methods: ['GET', 'HEAD'] },
        'investors.index': { uri: 'investors', methods: ['GET', 'HEAD'] },
        'clients.index': { uri: 'clients', methods: ['GET', 'HEAD'] },
        'contact.index': { uri: 'contact', methods: ['GET', 'HEAD'] },
        'contact.store': { uri: 'api/contact', methods: ['POST'] },
        'legal.tos': {
            uri: 'legal/terms-and-conditions',
            methods: ['GET', 'HEAD'],
        },
        'legal.pp': { uri: 'legal/privacy-policy', methods: ['GET', 'HEAD'] },
        'legal.nda': { uri: 'legal/nda', methods: ['GET', 'HEAD'] },
        'legal.nda.download': {
            uri: 'legal/nda/download',
            methods: ['GET', 'HEAD'],
        },
        'legal.mediation': {
            uri: 'legal/mediation',
            methods: ['GET', 'HEAD'],
        },
        'legal.mediation.download': {
            uri: 'legal/mediation/download',
            methods: ['GET', 'HEAD'],
        },
        'checkout-initiate': {
            uri: 'api/checkout',
            methods: ['POST'],
        },
        'preorders.success': {
            uri: 'preorders/{uuid}',
            methods: ['GET', 'HEAD'],
            parameters: ['uuid'],
        },
    },
};

export const staticRoutes: Record<string, string | ((param?: any) => string)> = {
    home: '/',
    'products.treeV1': '/products/treetino-v1',
    'products.treeV2': '/products/treetino-v2',
    'products.turbine': '/products/turbine',
    configurator: '/configurator',
    'configurator.product': (id?: string) =>
        id ? `/configurator?product=${id}` : '/configurator',
    'sales.index': '/sales',
    'pitch.index': '/pitch',
    'pitch.hackathon': '/pitch-hackathon',
    'pitch.fintech': '/pitch-fintech',
    'pitch.refract': '/pitch-refract',
    'collaboration.index': '/collaboration',
    'media.index': '/media',
    'web3.index': '/web3',
    'investors.index': '/investors',
    'clients.index': '/clients',
    'contact.index': '/contact',
    'contact.store': '/api/contact',
    'legal.tos': '/legal/terms-and-conditions',
    'legal.pp': '/legal/privacy-policy',
    'legal.nda': '/legal/nda',
    'legal.nda.download': '/legal/nda/download',
    'legal.mediation': '/legal/mediation',
    'legal.mediation.download': '/legal/mediation/download',
    'checkout-initiate': '/api/checkout',
    'preorders.success': (params?: any) => {
        const uuid =
            typeof params === 'string' || typeof params === 'number'
                ? String(params)
                : params?.uuid;
        return uuid ? `/preorders/${uuid}` : '/preorders';
    },
};

export function safeRoute(name?: string, params?: any): string {
    if (!name) {
        return typeof window !== 'undefined' ? window.location.pathname : '/';
    }

    const r = staticRoutes[name];

    if (typeof r === 'function') {
        return r(
            typeof params === 'string' || typeof params === 'number'
                ? String(params)
                : params?.id,
        );
    }

    if (typeof r === 'string') {
        return r;
    }

    return '/' + name.replace(/\./g, '/');
}

const PATH_TO_COMPONENT_MAP: Record<string, string> = {
    '/': 'Home/Index',
    '/home': 'Home/Index',
    '/products': 'Products/V1',
    '/products/treetino-v1': 'Products/V1',
    '/products/strom-v1': 'Products/V1',
    '/products/v1': 'Products/V1',
    '/products/treetino-v2': 'Products/V2',
    '/products/strom-v2': 'Products/V2',
    '/products/v2': 'Products/V2',
    '/products/turbine': 'Products/Turbine',
    '/products/turbina': 'Products/Turbine',
    '/sales': 'Sales/Index',
    '/crm': 'Sales/Index',
    '/cmr': 'Sales/Index',
    '/prodejci': 'Sales/Index',
    '/partners': 'Sales/Index',
    '/pitch-hackathon': 'PitchHackathon/Index',
    '/hackathon-pitch': 'PitchHackathon/Index',
    '/pitch-fintech': 'PitchFintech/Index',
    '/fintech-pitch': 'PitchFintech/Index',
    '/pitch-refract': 'PitchRefract/Index',
    '/refract-pitch': 'PitchRefract/Index',
    '/pitch': 'Pitch/Index',
    '/pitchdeck': 'Pitch/Index',
    '/deck': 'Pitch/Index',
    '/presentation': 'Pitch/Index',
    '/collaboration': 'Collaboration/Index',
    '/media': 'Media/Index',
    '/contact': 'Contact/Index',
    '/legal/terms-and-conditions': 'Legal/Tos',
    '/legal/privacy-policy': 'Legal/Pp',
    '/legal/nda': 'Legal/Nda',
    '/sales/nda': 'Legal/Nda',
    '/legal/mediation': 'Legal/Mediation',
    '/sales/mediation': 'Legal/Mediation',
    '/legal/smlouva-o-zprostredkovani': 'Legal/Mediation',
    '/web3': 'Web3/Index',
    '/investors': 'Investors/Index',
    '/investor': 'Investors/Index',
    '/vc': 'Investors/Index',
    '/technology': 'Investors/Index',
    '/architecture': 'Investors/Index',
    '/clients': 'Clients/Index',
    '/client': 'Clients/Index',
    '/klienti': 'Clients/Index',
    '/telemetry': 'Clients/Index',
    '/stations': 'Clients/Index',
};

export function getComponentForPath(path: string): string {
    const p = path.split('?')[0].replace(/\/$/, '') || '/';

    if (PATH_TO_COMPONENT_MAP[p]) {
        return PATH_TO_COMPONENT_MAP[p];
    }

    if (p.startsWith('/configurator')) {
        return 'Configurator/Index';
    }

    if (p === '/preorders/success' || p.startsWith('/preorders/')) {
        return 'Preorders/Success';
    }

    return 'Home/Index';
}
