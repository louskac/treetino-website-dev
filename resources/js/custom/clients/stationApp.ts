/**
 * Shared state helpers for the /clients station app and its two PDF documents.
 *
 * All production / ROI figures are computed from the verified measurement
 * campaign of each station and the official Treetino Technical Databook (2026),
 * so the app panel, the pre-rendered PDFs and the printed documents always show identical numbers.
 */
import type { AppLocale } from '@/lib/locale';
import { evaluateSiteOfferPerformance } from './cvutPhysics';
import type { SiteOfferSimulationResult, TreetinoSystemId } from './cvutPhysics';
import { buildIpragu1761Bundle, buildIstoch13Bundle, buildItebih6Bundle, buildIvesel85Bundle, buildMkovoBundle, latLonToCzMap } from './pwsData';
import type { StationTelemetryBundle } from './pwsData';

export type VariantQty = 1 | 2;

export const HUB_HEIGHT_M = 5.0;
export const TARIFF_CZK_PER_KWH = 6.2;
export const SUBSIDY_PCT = 50;
export const VAT_PCT = 21;

export type LocalizedText = {
    cs: string;
    en: string;
};

export function tr(val: LocalizedText | string, locale: string = 'cs'): string {
    if (typeof val === 'string') {
        return val;
    }

    return locale === 'en' ? val.en : val.cs;
}

export interface StationMediaItem {
    id: string;
    kind: 'image' | 'video';
    src: string;
    poster?: string;
    caption: LocalizedText;
}

export interface StationVariantOption {
    key: VariantQty;
    systemId: TreetinoSystemId;
    quantity: number;
    hubHeightM: number;
    buttonLabel: LocalizedText;
    title: LocalizedText;
    shortModel: LocalizedText;
    assembly: LocalizedText;
    capacity: LocalizedText;
    heightPermit: LocalizedText;
    studySlug: string;
}

export interface StationEntry {
    id: string;
    title: LocalizedText;
    clientName: LocalizedText;
    city: LocalizedText;
    status: 'live' | 'historic';
    statusNote: LocalizedText;
    listStatusSub: LocalizedText;
    chipSide: 'left' | 'right';
    sitePhoto: string;
    offerCoverPhoto: string;
    offerCoverCaption: LocalizedText;
    media: StationMediaItem[];
    variants: [StationVariantOption, StationVariantOption];
    /** The configuration counted in the portfolio totals (the one offered / contracted) */
    portfolioVariant: VariantQty;
    bundle: StationTelemetryBundle;
}

export const STATION_ENTRIES: StationEntry[] = [
    {
        id: 'ISTOCH13',
        title: { cs: 'Stochov', en: 'Stochov' },
        clientName: { cs: 'Město Stochov', en: 'City of Stochov' },
        city: { cs: 'Stochov', en: 'Stochov' },
        status: 'live',
        statusNote: { cs: 'Živé měření', en: 'Live telemetry' },
        listStatusSub: { cs: 'Živě', en: 'Live' },
        chipSide: 'left',
        sitePhoto: '/img/clients/stochov-mast-1.jpg',
        offerCoverPhoto: '/img/clients/site-after-v2-5m.jpg',
        offerCoverCaption: {
            cs: 'Vizualizace · 2× Treetino Strom (varianty V2 5 m / V1 11,5 m) pro Město Stochov',
            en: 'Visualization · 2× Treetino Tree (V2 5 m / V1 11.5 m options) for the City of Stochov',
        },
        media: [
            {
                id: 'stochov-video',
                kind: 'video',
                src: '/img/clients/stochov-site-video.mp4',
                poster: '/img/clients/stochov-mast-1.jpg',
                caption: {
                    cs: 'Stochov · Video z instalace meteostanice ve sportovním areálu',
                    en: 'Stochov · Installation video of the weather station at the sports complex',
                },
            },
            {
                id: 'stochov-1',
                kind: 'image',
                src: '/img/clients/stochov-mast-1.jpg',
                caption: {
                    cs: 'Stochov · Stožár meteostanice (3,5 m) u hřiště',
                    en: 'Stochov · Weather station mast (3.5 m) by the sports field',
                },
            },
            {
                id: 'stochov-2',
                kind: 'image',
                src: '/img/clients/stochov-areal-2.jpg',
                caption: {
                    cs: 'Stochov · Pohled na sportovní areál, in-line ovál a zázemí',
                    en: 'Stochov · View of the sports complex, inline oval and facilities',
                },
            },
            {
                id: 'stochov-3',
                kind: 'image',
                src: '/img/clients/stochov-kotveni-3.jpg',
                caption: {
                    cs: 'Stochov · Detail zemního kotvení a napínacích lan',
                    en: 'Stochov · Detail of ground anchoring and guy wires',
                },
            },
        ],
        variants: [
            {
                key: 1,
                systemId: 'strom-v2',
                quantity: 2,
                hubHeightM: 5.0,
                buttonLabel: { cs: '2× Strom V2', en: '2× Tree V2' },
                title: { cs: '2× Strom V2', en: '2× Tree V2' },
                shortModel: { cs: 'Strom V2', en: 'Tree V2' },
                assembly: { cs: '12× 1 kW Aero · 244 listů', en: '12× 1 kW Aero · 244 leaves' },
                capacity: { cs: '12,0 kW + 11,22 kWp', en: '12.0 kW + 11.22 kWp' },
                heightPermit: { cs: '5,0 m · bez povolení', en: '5.0 m · no permit needed' },
                studySlug: '2x_Strom_V2',
            },
            {
                key: 2,
                systemId: 'strom-v1',
                quantity: 2,
                hubHeightM: 8.5,
                buttonLabel: { cs: '2× Strom V1', en: '2× Tree V1' },
                title: { cs: '2× Strom V1', en: '2× Tree V1' },
                shortModel: { cs: 'Strom V1', en: 'Tree V1' },
                assembly: { cs: '24× 3 kW Aero · 600 listů', en: '24× 3 kW Aero · 600 leaves' },
                capacity: { cs: '72,0 kW + 27,60 kWp', en: '72.0 kW + 27.60 kWp' },
                heightPermit: { cs: '11,5 m · vč. 4× 22 kW EV + BESS', en: '11.5 m · incl. 4× 22 kW EV + BESS' },
                studySlug: '2x_Strom_V1',
            },
        ],
        portfolioVariant: 1,
        bundle: buildIstoch13Bundle(),
    },
    {
        id: 'ITEBIH6',
        title: { cs: 'Horní Dehtov', en: 'Horní Dehtov' },
        clientName: { cs: 'Horní Dehtov', en: 'Horní Dehtov' },
        city: { cs: 'Horní Dehtov', en: 'Horní Dehtov' },
        status: 'live',
        statusNote: { cs: 'Živé měření', en: 'Live telemetry' },
        listStatusSub: { cs: 'Živě', en: 'Live' },
        chipSide: 'right',
        sitePhoto: '/img/clients/dehtov/dehtov-site-1.jpg',
        offerCoverPhoto: '/img/clients/dehtov/dehtov-site-1.jpg',
        offerCoverCaption: {
            cs: 'Horní Dehtov · Měřicí stanice na stožáru 5,0 m',
            en: 'Horní Dehtov · Weather station on 5.0 m mast',
        },
        media: [
            {
                id: 'dehtov-1',
                kind: 'image',
                src: '/img/clients/dehtov/dehtov-site-1.jpg',
                caption: {
                    cs: 'Horní Dehtov · Měřicí stanice na stožáru 5,0 m',
                    en: 'Horní Dehtov · Weather station on 5.0 m mast',
                },
            },
            {
                id: 'dehtov-2',
                kind: 'image',
                src: '/img/clients/dehtov/dehtov-site-2.jpg',
                caption: {
                    cs: 'Horní Dehtov · Pohled na měřicí místo a terén',
                    en: 'Horní Dehtov · View of measurement site and terrain',
                },
            },
            {
                id: 'dehtov-3',
                kind: 'image',
                src: '/img/clients/dehtov/dehtov-mast-detail.jpg',
                caption: {
                    cs: 'Horní Dehtov · Detail kotvení stožáru a měřicí jednotky',
                    en: 'Horní Dehtov · Detail of mast anchoring and sensor unit',
                },
            },
            {
                id: 'dehtov-4',
                kind: 'image',
                src: '/img/clients/dehtov/dehtov-sensor.jpg',
                caption: {
                    cs: 'Horní Dehtov · Senzorová jednotka PWS na stožáru',
                    en: 'Horní Dehtov · PWS sensor unit on mast',
                },
            },
            {
                id: 'dehtov-video',
                kind: 'video',
                src: '/img/clients/dehtov/dehtov-site-video.mp4',
                poster: '/img/clients/dehtov/dehtov-site-1.jpg',
                caption: {
                    cs: 'Horní Dehtov · Videozáznam měřicí stanice na lokalitě',
                    en: 'Horní Dehtov · Site video recording of the weather station',
                },
            },
        ],
        variants: [
            {
                key: 1,
                systemId: 'strom-v2',
                quantity: 1,
                hubHeightM: 5.0,
                buttonLabel: { cs: '1× Strom V2', en: '1× Tree V2' },
                title: { cs: '1× Strom V2', en: '1× Tree V2' },
                shortModel: { cs: 'Strom V2', en: 'Tree V2' },
                assembly: { cs: '6 turbín · 122 listů', en: '6 turbines · 122 leaves' },
                capacity: { cs: '6,0 kW + 5,61 kWp', en: '6.0 kW + 5.61 kWp' },
                heightPermit: { cs: '5,0 m · bez povolení', en: '5.0 m · no permit needed' },
                studySlug: '1x_Strom_V2',
            },
            {
                key: 2,
                systemId: 'strom-v2',
                quantity: 2,
                hubHeightM: 5.0,
                buttonLabel: { cs: '2× Strom V2', en: '2× Tree V2' },
                title: { cs: '2× Strom V2', en: '2× Tree V2' },
                shortModel: { cs: 'Strom V2', en: 'Tree V2' },
                assembly: { cs: '12 turbín · 244 listů', en: '12 turbines · 244 leaves' },
                capacity: { cs: '12,0 kW + 11,22 kWp', en: '12.0 kW + 11.22 kWp' },
                heightPermit: { cs: '5,0 m · bez povolení', en: '5.0 m · no permit needed' },
                studySlug: '2x_Strom_V2',
            },
        ],
        portfolioVariant: 1,
        bundle: buildItebih6Bundle(),
    },
    {
        id: 'IVESEL85',
        title: { cs: 'Veselí nad Moravou', en: 'Veselí nad Moravou' },
        clientName: { cs: 'Veselí nad Moravou', en: 'Veselí nad Moravou' },
        city: { cs: 'Veselí nad Moravou', en: 'Veselí nad Moravou' },
        status: 'live',
        statusNote: { cs: 'Živé měření', en: 'Live telemetry' },
        listStatusSub: { cs: 'Živě', en: 'Live' },
        chipSide: 'left',
        sitePhoto: '/img/clients/morava/veseli-site-1.jpg',
        offerCoverPhoto: '/img/clients/morava/veseli-site-1.jpg',
        offerCoverCaption: {
            cs: 'Veselí nad Moravou · Měřicí stanice na stožáru 5,0 m',
            en: 'Veselí nad Moravou · Weather station on 5.0 m mast',
        },
        media: [
            {
                id: 'veseli-1',
                kind: 'image',
                src: '/img/clients/morava/veseli-site-1.jpg',
                caption: {
                    cs: 'Veselí nad Moravou · Měřicí stanice na stožáru 5,0 m',
                    en: 'Veselí nad Moravou · Weather station on 5.0 m mast',
                },
            },
            {
                id: 'veseli-2',
                kind: 'image',
                src: '/img/clients/morava/veseli-site-2.jpg',
                caption: {
                    cs: 'Veselí nad Moravou · Pohled na měřicí místo a terén',
                    en: 'Veselí nad Moravou · View of measurement site and terrain',
                },
            },
            {
                id: 'veseli-3',
                kind: 'image',
                src: '/img/clients/morava/veseli-site-3.jpg',
                caption: {
                    cs: 'Veselí nad Moravou · Detail instalace stožáru na lokalitě',
                    en: 'Veselí nad Moravou · Detail of mast installation on site',
                },
            },
            {
                id: 'veseli-video',
                kind: 'video',
                src: '/img/clients/morava/veseli-site-video.mp4',
                poster: '/img/clients/morava/veseli-site-1.jpg',
                caption: {
                    cs: 'Veselí nad Moravou · Videozáznam měřicí stanice v provozu',
                    en: 'Veselí nad Moravou · Site video recording of operating station',
                },
            },
        ],
        variants: [
            {
                key: 1,
                systemId: 'strom-v1',
                quantity: 1,
                hubHeightM: 11.5,
                buttonLabel: { cs: '1× Strom V1', en: '1× Tree V1' },
                title: { cs: '1× Strom V1', en: '1× Tree V1' },
                shortModel: { cs: 'Strom V1', en: 'Tree V1' },
                assembly: { cs: '12× 3 kW Aero · 300 listů', en: '12× 3 kW Aero · 300 leaves' },
                capacity: { cs: '36,0 kW + 13,80 kWp', en: '36.0 kW + 13.80 kWp' },
                heightPermit: { cs: '11,5 m · vč. 2× 22 kW EV + BESS', en: '11.5 m · incl. 2× 22 kW EV + BESS' },
                studySlug: '1x_Strom_V1',
            },
            {
                key: 2,
                systemId: 'strom-v1',
                quantity: 1,
                hubHeightM: 11.5,
                buttonLabel: { cs: '1× Strom V1', en: '1× Tree V1' },
                title: { cs: '1× Strom V1', en: '1× Tree V1' },
                shortModel: { cs: 'Strom V1', en: 'Tree V1' },
                assembly: { cs: '12× 3 kW Aero · 300 listů', en: '12× 3 kW Aero · 300 leaves' },
                capacity: { cs: '36,0 kW + 13,80 kWp', en: '36.0 kW + 13.80 kWp' },
                heightPermit: { cs: '11,5 m · vč. 2× 22 kW EV + BESS', en: '11.5 m · incl. 2× 22 kW EV + BESS' },
                studySlug: '1x_Strom_V1',
            },
        ],
        portfolioVariant: 1,
        bundle: buildIvesel85Bundle(),
    },
    {
        id: 'IPRAGU1761',
        title: { cs: 'Akademie řemesel', en: 'Academy of Crafts' },
        clientName: { cs: 'Akademie řemesel Praha', en: 'Academy of Crafts Prague' },
        city: { cs: 'Praha', en: 'Prague' },
        status: 'historic',
        statusNote: { cs: 'Ukončeno · přesunuto do Stochova', en: 'Completed · relocated to Stochov' },
        listStatusSub: { cs: 'přesunuto do Stochova', en: 'relocated to Stochov' },
        chipSide: 'right',
        sitePhoto: '/img/clients/site-before-ipragu1761.jpg',
        offerCoverPhoto: '/img/clients/site-after-v2-5m.jpg',
        offerCoverCaption: {
            cs: 'Vizualizace · Strom V2 v areálu, výška 5 m',
            en: 'Visualization · Tree V2 on campus, height 5 m',
        },
        media: [
            {
                id: 'praha-1',
                kind: 'image',
                src: '/img/clients/site-before-ipragu1761.jpg',
                caption: {
                    cs: 'Praha · Meteostanice IPRAGU1761 v areálu Akademie řemesel',
                    en: 'Prague · Weather station IPRAGU1761 at the Academy of Crafts campus',
                },
            },
            {
                id: 'praha-2',
                kind: 'image',
                src: '/img/clients/site-after-v2-5m.jpg',
                caption: {
                    cs: 'Praha · Vizualizace Stromu V2 (výška 5 m) na pozemku',
                    en: 'Prague · Visualization of Tree V2 (5 m height) on site',
                },
            },
            {
                id: 'praha-3',
                kind: 'image',
                src: '/img/clients/treetino-v2-studio.webp',
                caption: {
                    cs: 'Treetino Strom V2 · 6× 1 kW Aero + 122× solární list TopCon (5,61 kWp)',
                    en: 'Treetino Tree V2 · 6× 1 kW Aero + 122× TopCon solar leaves (5.61 kWp)',
                },
            },
        ],
        variants: [
            {
                key: 1,
                systemId: 'strom-v2',
                quantity: 1,
                hubHeightM: 5.0,
                buttonLabel: { cs: '1× Strom V2', en: '1× Tree V2' },
                title: { cs: '1× Strom V2', en: '1× Tree V2' },
                shortModel: { cs: 'Strom V2', en: 'Tree V2' },
                assembly: { cs: '6 turbín · 122 listů', en: '6 turbines · 122 leaves' },
                capacity: { cs: '6,0 kW + 5,61 kWp', en: '6.0 kW + 5.61 kWp' },
                heightPermit: { cs: '5,0 m · bez povolení', en: '5.0 m · no permit needed' },
                studySlug: '1x_Strom_V2',
            },
            {
                key: 2,
                systemId: 'strom-v2',
                quantity: 2,
                hubHeightM: 5.0,
                buttonLabel: { cs: '2× Strom V2', en: '2× Tree V2' },
                title: { cs: '2× Strom V2', en: '2× Tree V2' },
                shortModel: { cs: 'Strom V2', en: 'Tree V2' },
                assembly: { cs: '12 turbín · 244 listů', en: '12 turbines · 244 leaves' },
                capacity: { cs: '12,0 kW + 11,22 kWp', en: '12.0 kW + 11.22 kWp' },
                heightPermit: { cs: '5,0 m · bez povolení', en: '5.0 m · no permit needed' },
                studySlug: '2x_Strom_V2',
            },
        ],
        portfolioVariant: 2,
        bundle: buildIpragu1761Bundle(),
    },
    {
        id: 'D3882832837',
        title: { cs: 'Areál M-Kovo', en: 'M-Kovo Site' },
        clientName: { cs: 'M-Kovo s.r.o.', en: 'M-Kovo s.r.o.' },
        city: { cs: 'Rantířov u Jihlavy', en: 'Rantířov (Jihlava)' },
        status: 'historic',
        statusNote: { cs: 'Ukončeno · smlouva 3× Strom V1', en: 'Completed · 3× Tree V1 contracted' },
        listStatusSub: { cs: 'smlouva 3× V1', en: '3× V1 contracted' },
        chipSide: 'right',
        sitePhoto: '/img/im/mkovo-site-measurement.jpg',
        offerCoverPhoto: '/img/clients/treetino-v1-site-render.jpg',
        offerCoverCaption: {
            cs: 'Vizualizace · 3× Treetino Strom V1 (11,5 m, vč. EV hubu) pro M-Kovo s.r.o.',
            en: 'Visualization · 3× Treetino Tree V1 (11.5 m, incl. EV hub) for M-Kovo s.r.o.',
        },
        media: [
            {
                id: 'mkovo-1',
                kind: 'image',
                src: '/img/im/mkovo-site-measurement.jpg',
                caption: {
                    cs: 'Rantířov · Měřicí stožár CCL Electronics W100 (5,0 m) v průmyslovém areálu M-Kovo',
                    en: 'Rantířov · CCL Electronics W100 mast (5.0 m) at the M-Kovo industrial complex',
                },
            },
            {
                id: 'mkovo-2',
                kind: 'image',
                src: '/img/clients/mkovo-aerial-site.jpg',
                caption: {
                    cs: 'Rantířov · Letecký snímek areálu M-Kovo s vyznačeným umístěním 3× Strom V1 (parc. č. 53/4, 53/47)',
                    en: 'Rantířov · Aerial plan of the M-Kovo complex with marked 3× Tree V1 placement (plots 53/4, 53/47)',
                },
            },
            {
                id: 'mkovo-3',
                kind: 'image',
                src: '/img/clients/treetino-v1-site-render.jpg',
                caption: {
                    cs: 'Treetino Strom V1 · 12× 3 kW Aero + 300× solární list TopCon + 2× 22 kW EV stojan',
                    en: 'Treetino Tree V1 · 12× 3 kW Aero + 300× TopCon solar leaves + 2× 22 kW EV charger',
                },
            },
        ],
        variants: [
            {
                key: 1,
                systemId: 'strom-v1',
                quantity: 3,
                hubHeightM: 11.5,
                buttonLabel: { cs: '3× Strom V1', en: '3× Tree V1' },
                title: { cs: '3× Strom V1', en: '3× Tree V1' },
                shortModel: { cs: 'Strom V1', en: 'Tree V1' },
                assembly: { cs: '36× 3 kW Aero · 900 listů', en: '36× 3 kW Aero · 900 leaves' },
                capacity: { cs: '108,0 kW + 41,40 kWp', en: '108.0 kW + 41.40 kWp' },
                heightPermit: { cs: '11,5 m · vč. 6× 22 kW EV + BESS', en: '11.5 m · incl. 6× 22 kW EV + BESS' },
                studySlug: '3x_Strom_V1',
            },
            {
                key: 2,
                systemId: 'strom-v1',
                quantity: 1,
                hubHeightM: 11.5,
                buttonLabel: { cs: '1× Strom V1', en: '1× Tree V1' },
                title: { cs: '1× Strom V1', en: '1× Tree V1' },
                shortModel: { cs: 'Strom V1', en: 'Tree V1' },
                assembly: { cs: '12× 3 kW Aero · 300 listů', en: '12× 3 kW Aero · 300 leaves' },
                capacity: { cs: '36,0 kW + 13,80 kWp', en: '36.0 kW + 13.80 kWp' },
                heightPermit: { cs: '11,5 m · vč. 2× 22 kW EV + BESS', en: '11.5 m · incl. 2× 22 kW EV + BESS' },
                studySlug: '1x_Strom_V1',
            },
        ],
        portfolioVariant: 1,
        bundle: buildMkovoBundle(),
    },
];

export function getStationEntry(stationId?: string | null): StationEntry {
    const clean = (stationId || '').trim().toUpperCase();

    if (clean === 'MKOVO' || clean === 'M-KOVO' || clean === '3882832837') {
        return STATION_ENTRIES.find((s) => s.id === 'D3882832837') ?? STATION_ENTRIES[0];
    }

    return STATION_ENTRIES.find((s) => s.id === clean) ?? STATION_ENTRIES[0];
}

export function campaignBundle(stationId = 'IPRAGU1761'): StationTelemetryBundle {
    return getStationEntry(stationId).bundle;
}

export function simulateVariant(entry: StationEntry, variantKey: VariantQty): SiteOfferSimulationResult {
    const v = entry.variants[variantKey - 1] ?? entry.variants[0];

    return evaluateSiteOfferPerformance(
        entry.bundle,
        v.systemId,
        v.quantity,
        v.hubHeightM,
        'ansys-d150-guided',
        TARIFF_CZK_PER_KWH,
        SUBSIDY_PCT,
        false,
    );
}

export function simulateV2(telemetry: StationTelemetryBundle, qty: VariantQty): SiteOfferSimulationResult {
    return evaluateSiteOfferPerformance(telemetry, 'strom-v2', qty, HUB_HEIGHT_M, 'ansys-d150-guided', TARIFF_CZK_PER_KWH, SUBSIDY_PCT, false);
}

export interface PendingStation {
    slot: number;
    label: LocalizedText;
}

/* ------------------------------------------------------------------ */
/* Portfolio: every number computed from the same engine as the PDFs   */
/* ------------------------------------------------------------------ */

export interface PortfolioRow {
    entry: StationEntry;
    variant: StationVariantOption;
    sim: SiteOfferSimulationResult;
}

export interface PortfolioTotals {
    rows: PortfolioRow[];
    clients: number;
    trees: number;
    annualKwh: number;
    capexCzk: number;
    netCapexCzk: number;
    annualSavingsCzk: number;
    profit25Czk: number;
    co2TonsPerYear: number;
    measuredDays: number;
    records: number;
}

export function computePortfolio(entries: StationEntry[] = STATION_ENTRIES): PortfolioTotals {
    const rows = entries.map((entry) => {
        const variant = entry.variants[entry.portfolioVariant - 1] ?? entry.variants[0];

        return { entry, variant, sim: simulateVariant(entry, entry.portfolioVariant) };
    });
    const sum = (f: (r: PortfolioRow) => number) => rows.reduce((acc, r) => acc + f(r), 0);

    return {
        rows,
        clients: rows.length,
        trees: sum((r) => r.variant.quantity),
        annualKwh: sum((r) => r.sim.annualTotalKwh),
        capexCzk: sum((r) => r.sim.totalCapexCzk),
        netCapexCzk: sum((r) => r.sim.netCapexAfterSubsidyCzk),
        annualSavingsCzk: sum((r) => r.sim.annualSavingsCzk),
        profit25Czk: sum((r) => r.sim.netProfit25YrCzk),
        co2TonsPerYear: sum((r) => r.sim.annualCo2SavedTons),
        measuredDays: sum((r) => r.entry.bundle.aggregates.totalDays || r.entry.bundle.dailyHistory.length),
        records: sum((r) => r.entry.bundle.aggregates.total5MinFrames),
    };
}

/** Chronological campaign links drawn on the map (the Prague station was physically moved to Stochov) */
export const STATION_LINKS: { from: string; to: string; label?: LocalizedText }[] = [];

/** Physically purchased units ready for deployment — listed, never pinned on the map */
export const PENDING_STATIONS: PendingStation[] = [4, 5].map((slot) => ({
    slot,
    label: {
        cs: `Stanice ${String(slot).padStart(2, '0')}`,
        en: `Station ${String(slot).padStart(2, '0')}`,
    },
}));

/** Pre-rendered documents for stations */
export function documentUrls(entry: StationEntry, variantKey: VariantQty): { offer: string; study: string } | null {
    const id = entry.id.toUpperCase();

    if (id !== 'IPRAGU1761' && id !== 'ISTOCH13' && id !== 'D3882832837' && id !== 'ITEBIH6' && id !== 'IVESEL85') {
        return null;
    }

    const v = entry.variants[variantKey - 1] ?? entry.variants[0];
    const offerName =
        id === 'ISTOCH13'
            ? `Treetino_${id}_Cenova_nabidka_2x_V2_V1.pdf`
            : id === 'D3882832837'
              ? `Treetino_${id}_Cenova_nabidka_3x_Strom_V1.pdf`
              : id === 'IVESEL85'
                ? `Treetino_${id}_Cenova_nabidka_Strom_V1.pdf`
                : `Treetino_${id}_Cenova_nabidka_Strom_V2.pdf`;

    return {
        offer: `/docs/${offerName}`,
        study: `/docs/Treetino_${id}_Technicka_studie_${v.studySlug}.pdf`,
    };
}

/* ------------------------------------------------------------------ */
/* Formatting (locale-aware: Czech vs English)                         */
/* ------------------------------------------------------------------ */

export function num(v: number, digits = 0, locale: AppLocale | string = 'cs'): string {
    const tag = locale === 'en' ? 'en-US' : 'cs-CZ';

    return v.toLocaleString(tag, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function czk(v: number, locale: AppLocale | string = 'cs'): string {
    const rounded = Math.round(v);

    return locale === 'en' ? `CZK ${num(rounded, 0, 'en')}` : `${num(rounded, 0, 'cs')} Kč`;
}

export function millions(v: number, digits = 2, locale: AppLocale | string = 'cs'): string {
    return locale === 'en'
        ? `CZK ${num(v / 1_000_000, digits, 'en')}M`
        : `${num(v / 1_000_000, digits, 'cs')} mil. Kč`;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(iso: string, locale: AppLocale | string = 'cs'): string {
    const [, m, d] = iso.slice(0, 10).split('-').map(Number);

    if (!m || !d) {
        return iso;
    }

    return locale === 'en' ? `${MONTHS_EN[m - 1]} ${d}` : `${d}. ${m}.`;
}

export function longDate(iso: string, locale: AppLocale | string = 'cs'): string {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);

    if (!y || !m || !d) {
        return iso;
    }

    return locale === 'en' ? `${MONTHS_EN[m - 1]} ${d}, ${y}` : `${d}. ${m}. ${y}`;
}

export const CARDINAL_CS: Record<string, string> = {
    N: 'S',
    NNE: 'SSV',
    NE: 'SV',
    ENE: 'VSV',
    E: 'V',
    ESE: 'VJV',
    SE: 'JV',
    SSE: 'JJV',
    S: 'J',
    SSW: 'JJZ',
    SW: 'JZ',
    WSW: 'ZJZ',
    W: 'Z',
    WNW: 'ZSZ',
    NW: 'SZ',
    NNW: 'SSZ',
};

export function cardinalCs(code: string, locale: AppLocale | string = 'cs'): string {
    if (locale === 'en') {
        return code;
    }

    return CARDINAL_CS[code] ?? code;
}

/* ------------------------------------------------------------------ */
/* Map geometry                                                        */
/* ------------------------------------------------------------------ */

/** Bounding box of the Czech Republic in the shared Europe viewBox (680 × 520) */
export const CZ_BBOX = { x0: 324.97, x1: 379.53, y0: 324.96, y1: 355.48 };

export interface MapCity {
    name: string;
    nameEn: string;
    x: number;
    y: number;
}

const CITY_COORDS: [string, string, number, number][] = [
    ['Praha', 'Prague', 50.0755, 14.4378],
    ['Brno', 'Brno', 49.1951, 16.6068],
    ['Ostrava', 'Ostrava', 49.8209, 18.2625],
    ['Plzeň', 'Pilsen', 49.7384, 13.3736],
    ['Liberec', 'Liberec', 50.7663, 15.0543],
    ['Olomouc', 'Olomouc', 49.5938, 17.2509],
    ['České Budějovice', 'České Budějovice', 48.9745, 14.4743],
    ['Hradec Králové', 'Hradec Králové', 50.2104, 15.8252],
    ['Ústí nad Labem', 'Ústí nad Labem', 50.6611, 14.0531],
    ['Pardubice', 'Pardubice', 50.0343, 15.7812],
    ['Zlín', 'Zlín', 49.2265, 17.6707],
    ['Jihlava', 'Jihlava', 49.3961, 15.5912],
    ['Karlovy Vary', 'Karlovy Vary', 50.2319, 12.8713],
];

export const MAP_CITIES: MapCity[] = CITY_COORDS.map(([name, nameEn, lat, lon]) => ({
    name,
    nameEn,
    ...latLonToCzMap(lat, lon),
}));
