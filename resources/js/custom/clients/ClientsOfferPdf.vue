<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsPdfSheet from './ClientsPdfSheet.vue';
import { TREETINO_SYSTEM_SPECS, type SiteOfferSimulationResult } from './cvutPhysics';
import type { StationTelemetryBundle } from './pwsData';
import {
    czk,
    longDate,
    millions,
    num,
    SUBSIDY_PCT,
    TARIFF_CZK_PER_KWH,
    tr,
    VAT_PCT,
    type StationVariantOption,
    type VariantQty,
} from './stationApp';

const props = defineProps<{
    campaign: StationTelemetryBundle;
    variants: [StationVariantOption, StationVariantOption];
    sims: Record<VariantQty, SiteOfferSimulationResult>;
    clientName: string;
    coverPhoto?: string;
    coverCaption?: string;
    /** ISO date the offer is issued */
    issuedIso: string;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const TOTAL = 3;
const docLabel = computed(() => (isEn.value ? 'Price Offer' : 'Cenová nabídka'));
const specV1 = TREETINO_SYSTEM_SPECS['strom-v1'];
const specV2 = TREETINO_SYSTEM_SPECS['strom-v2'];
const v1 = computed(() => props.variants[0]);
const v2 = computed(() => props.variants[1]);
const s1 = computed(() => props.sims[1]);
const s2 = computed(() => props.sims[2]);

const isSingleOffer = computed(() => v1.value.quantity === v2.value.quantity && v1.value.systemId === v2.value.systemId);
const isMixedModels = computed(() => !isSingleOffer.value && v1.value.systemId !== v2.value.systemId);
const isAllV1 = computed(() => !isSingleOffer.value && v1.value.systemId === 'strom-v1' && v2.value.systemId === 'strom-v1');

const validUntil = computed(() => {
    const d = new Date(props.issuedIso);
    d.setDate(d.getDate() + 30);

    return longDate(d.toISOString(), locale.value);
});

const samePayback = computed(() => s1.value.paybackYears === s2.value.paybackYears);

const page1TitleLine1 = computed(() => {
    if (isSingleOffer.value) {
        return isEn.value ? `${v1.value.quantity}× Treetino ${tr(v1.value.shortModel, locale.value)}` : `${v1.value.quantity}× Treetino ${tr(v1.value.shortModel, locale.value)}`;
    }
    if (isMixedModels.value) {
        return isEn.value ? '2× Treetino Tree V2 / V1' : '2× Treetino Strom V2 / V1';
    }
    if (isAllV1.value) {
        return isEn.value ? '3× Treetino Tree V1' : '3× Treetino Strom V1';
    }

    return isEn.value ? 'Treetino Tree V2' : 'Treetino Strom V2';
});

const page2HeadlineLine1 = computed(() => {
    if (isSingleOffer.value) {
        return isEn.value ? `${v1.value.quantity}× Treetino ${tr(v1.value.shortModel, locale.value)}.` : `${v1.value.quantity}× Treetino ${tr(v1.value.shortModel, locale.value)}.`;
    }
    if (isMixedModels.value) {
        return isEn.value ? 'Two V2 trees, or two V1s.' : 'Dva stromy V2, nebo dva V1.';
    }
    if (isAllV1.value) {
        return isEn.value ? 'Three V1 trees, or one V1.' : 'Tři stromy V1, nebo jeden V1.';
    }

    return isEn.value ? 'One or two trees.' : 'Jeden, nebo dva stromy.';
});

const page2HeadlineLine2 = computed(() => {
    const loc = locale.value;
    if (isSingleOffer.value) {
        return isEn.value
            ? `Payback ${num(s1.value.paybackYears, 1, loc)} yrs. Net profit +${millions(s1.value.netProfit25YrCzk, 2, loc)}.`
            : `Návratnost ${num(s1.value.paybackYears, 1, loc)} let. Čistý zisk +${millions(s1.value.netProfit25YrCzk, 2, loc)}.`;
    }
    if (samePayback.value) {
        return isEn.value
            ? `Payback ${num(s1.value.paybackYears, 1, loc)} years.`
            : `Návratnost ${num(s1.value.paybackYears, 1, loc)} let.`;
    }
    const minPb = Math.min(s1.value.paybackYears, s2.value.paybackYears);
    const maxPb = Math.max(s1.value.paybackYears, s2.value.paybackYears);

    return isEn.value
        ? `Payback ${num(minPb, 1, loc)} – ${num(maxPb, 1, loc)} years.`
        : `Návratnost ${num(minPb, 1, loc)} – ${num(maxPb, 1, loc)} let.`;
});

/* ------------------------------------------------------------------ */
/* Page 2: comparison rows                                             */
/* ------------------------------------------------------------------ */

function vat(v: number) {
    return Math.round((v * VAT_PCT) / 100);
}

type Row = { label: string; a: string; b: string; cls?: string };

const rows = computed<Row[]>(() => {
    const loc = locale.value;
    const a = s1.value;
    const b = s2.value;

    const baseRows: Row[] = [
        {
            label: isEn.value ? 'Configuration' : 'Sestava',
            a: tr(v1.value.assembly, loc),
            b: tr(v2.value.assembly, loc),
        },
        {
            label: isEn.value ? 'Installed capacity (wind + solar STC)' : 'Instalovaný výkon (vítr + slunce STC)',
            a: tr(v1.value.capacity, loc),
            b: tr(v2.value.capacity, loc),
        },
    ];

    if (isMixedModels.value) {
        baseRows.push({
            label: isEn.value ? 'Tree height · equipment' : 'Výška stromu · výbava',
            a: tr(v1.value.heightPermit, loc),
            b: tr(v2.value.heightPermit, loc),
        });
    }

    return [
        ...baseRows,
        { label: '', a: '', b: '', cls: 'is-gap' },
        {
            label: isEn.value ? 'Turnkey price excl. VAT' : 'Cena na klíč bez DPH',
            a: czk(a.totalCapexCzk, loc),
            b: czk(b.totalCapexCzk, loc),
            cls: 'is-strong',
        },
        {
            label: isEn.value ? `VAT ${VAT_PCT}%` : `DPH ${VAT_PCT} %`,
            a: czk(vat(a.totalCapexCzk), loc),
            b: czk(vat(b.totalCapexCzk), loc),
        },
        {
            label: isEn.value ? 'Total price incl. VAT' : 'Cena s DPH',
            a: czk(a.totalCapexCzk + vat(a.totalCapexCzk), loc),
            b: czk(b.totalCapexCzk + vat(b.totalCapexCzk), loc),
        },
        {
            label: isEn.value ? `Indicative grant ${SUBSIDY_PCT}%` : `Předpokládaná dotace ${SUBSIDY_PCT} %`,
            a: `− ${czk(a.subsidyGrantCzk, loc)}`,
            b: `− ${czk(b.subsidyGrantCzk, loc)}`,
        },
        {
            label: isEn.value ? 'Your net investment (excl. VAT)' : 'Vaše investice (bez DPH)',
            a: czk(a.netCapexAfterSubsidyCzk, loc),
            b: czk(b.netCapexAfterSubsidyCzk, loc),
            cls: 'is-key',
        },
        { label: '', a: '', b: '', cls: 'is-gap' },
        {
            label: isEn.value ? 'Annual energy yield (Year 1)' : 'Roční výroba (1. rok)',
            a: `${num(a.annualTotalKwh, 0, loc)} kWh`,
            b: `${num(b.annualTotalKwh, 0, loc)} kWh`,
            cls: 'is-strong',
        },
        {
            label: isEn.value
                ? `Annual electricity savings (CZK ${num(TARIFF_CZK_PER_KWH, 2, 'en')}/kWh)`
                : `Roční úspora elektřiny (${num(TARIFF_CZK_PER_KWH, 2, 'cs')} Kč/kWh)`,
            a: czk(a.annualSavingsCzk, loc),
            b: czk(b.annualSavingsCzk, loc),
        },
        {
            label: isEn.value ? 'Payback (25-year performance warranty)' : 'Návratnost (dle 25leté záruky výkonu)',
            a: isEn.value ? `${num(a.paybackYears, 1, loc)} years` : `${num(a.paybackYears, 1, loc)} let`,
            b: isEn.value ? `${num(b.paybackYears, 1, loc)} years` : `${num(b.paybackYears, 1, loc)} let`,
        },
        {
            label: isEn.value ? '25-year net profit (after net investment)' : 'Čistý zisk za 25 let (po odečtení investice)',
            a: millions(a.netProfit25YrCzk, 2, loc),
            b: millions(b.netProfit25YrCzk, 2, loc),
            cls: 'is-key',
        },
    ];
});

/* ------------------------------------------------------------------ */
/* Page 2: 25-year cumulative cashflow                                 */
/* ------------------------------------------------------------------ */

const cash = computed(() => {
    const W = 178;
    const H = 50;
    const L = 14;
    const R = 2;
    const T = 4;
    const B = 7;
    const p1 = s1.value.cashflow25Years;
    const p2 = s2.value.cashflow25Years;
    const all = [...p1, ...p2].map((p) => p.cumulativeCashflowCzk);
    const maxAbs = Math.max(...all.map(Math.abs));
    const step = maxAbs > 12_000_000 ? 5_000_000 : 1_000_000;
    const lo = Math.floor(Math.min(...all) / step) * step;
    const hi = Math.ceil(Math.max(...all) / step) * step;
    const x = (yr: number) => L + (yr / 25) * (W - L - R);
    const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B);
    const path = (pts: typeof p1) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.year).toFixed(2)},${y(p.cumulativeCashflowCzk).toFixed(2)}`).join(' ');
    const ticks: number[] = [];
    for (let v = lo; v <= hi; v += step) ticks.push(v);

    return {
        W,
        H,
        L,
        R,
        B,
        x,
        y,
        line1: path(p1),
        line2: path(p2),
        ticks,
        years: [0, 5, 10, 15, 20, 25],
        pb: x(s2.value.paybackYears),
        zero: y(0),
        end1: { x: x(25), y: y(p1[p1.length - 1].cumulativeCashflowCzk) },
        end2: { x: x(25), y: y(p2[p2.length - 1].cumulativeCashflowCzk) },
    };
});

/* ------------------------------------------------------------------ */
/* Page 3: scope of supply & warranties (from Technical Databook)      */
/* ------------------------------------------------------------------ */

const bomSingleV2 = computed(() => [
    {
        name: isEn.value ? '6× Treetino Aero 1 kW wind turbines' : '6 větrných turbín Treetino Aero 1 kW',
        spec: isEn.value
            ? 'Rotor height 1.2–1.5 m · cut-in from 1.8 m/s · silent operation'
            : 'Výška rotoru 1,2–1,5 m · samonáběh od 1,8 m/s · tichý chod',
        price: 360000,
    },
    {
        name: isEn.value ? '122× TopCon solar leaves' : '122 solárních listů TopCon',
        spec: isEn.value
            ? '5.61 kWp STC · 20.2% cell efficiency · 3D organic canopy'
            : '5,61 kWp STC · účinnost článků 20,2 % · rozložení v 3D koruně',
        price: 210000,
    },
    {
        name: isEn.value ? 'Victron Energy & MPPT control core' : 'Řízení Victron Energy a MPPT',
        spec: isEn.value
            ? 'Hybrid inverters & wiring for wind and solar · 24/7 monitoring'
            : 'Hybridní střídače a kabeláž pro vítr i slunce · monitoring 24/7',
        price: 145000,
    },
    {
        name: isEn.value ? '5 m steel trunk & turnkey install (1 week)' : 'Kmen 5 m a montáž na klíč (1 týden)',
        spec: isEn.value
            ? 'Steel skeleton & cladding · electrical installation · ČSN inspection'
            : 'Ocelový skelet a obal · elektroinstalace · revize ČSN · předání',
        price: 155000,
    },
]);

const bomSingleV1 = computed(() => [
    {
        name: isEn.value ? '12× Treetino Aero 3 kW wind turbines' : '12 větrných turbín Treetino Aero 3 kW',
        spec: isEn.value
            ? 'Rotor height 2.8 m (Ø 1.4 m) · 36.0 kW VTE · cut-in from 1.8 m/s'
            : 'Výška rotoru 2,8 m (Ø 1,4 m) · 36,0 kW VTE · samonáběh od 1,8 m/s',
        price: 1980000,
    },
    {
        name: isEn.value ? '300× TopCon bifacial solar leaves' : '300 bifaciálních solárních listů TopCon',
        spec: isEn.value
            ? '13.80 kWp STC · 20.2% cell efficiency · 3D organic canopy'
            : '13,80 kWp STC · účinnost článků 20,2 % · rozložení v 3D koruně',
        price: 890000,
    },
    {
        name: isEn.value ? 'PCS 50 kW inverter, BESS & 2× 22 kW EV charger' : 'Střídač PCS 50 kW, BESS a 2× 22 kW EV stojan',
        spec: isEn.value
            ? 'Peak shaving, SCADA telemetry & Apple Pay EV charging terminals'
            : 'Řízení špiček (Peak Shaving), SCADA telemetrie a EV terminály Apple Pay',
        price: 1400000,
    },
    {
        name: isEn.value ? '11.5 m steel trunk & turnkey install (1 month)' : 'Kmen 11,5 m a montáž na klíč (1 měsíc)',
        spec: isEn.value
            ? 'Hot-dip galvanized skeleton (1.0 m² base) · crane install · ČSN inspection'
            : 'Žárově zinkovaný skelet (patka 1,0 m²) · jeřábová montáž · revize ČSN',
        price: 630000,
    },
]);

const bomSingleTree = computed(() => (isAllV1.value ? bomSingleV1.value : bomSingleV2.value));
const singleTreeBasePriceCzk = computed(() => (isAllV1.value ? specV1.basePriceCzk : specV2.basePriceCzk));

const bomMixedPair = computed(() => [
    {
        name: isEn.value ? 'Vertical wind turbines Treetino Aero (VTE)' : 'Větrné turbíny Treetino Aero (VTE)',
        spec: isEn.value
            ? 'V2: 12× 1.0 kW Aero (12 kW) · V1: 24× 3.0 kW Aero (72 kW, 2.8 m rotors)'
            : 'V2: 12× 1,0 kW Aero (12 kW) · V1: 24× 3,0 kW Aero (72 kW, rotory 2,8 m)',
        priceA: 720000,
        priceB: 3960000,
    },
    {
        name: isEn.value ? '3D organic solar leaf canopy TopCon (FVE)' : 'Solární koruna TopCon v 3D rozložení (FVE)',
        spec: isEn.value
            ? 'V2: 244 leaves (11.22 kWp STC) · V1: 600 bifacial leaves (27.60 kWp STC)'
            : 'V2: 244 listů (11,22 kWp STC) · V1: 600 bifaciálních listů (27,60 kWp STC)',
        priceA: 420000,
        priceB: 1780000,
    },
    {
        name: isEn.value ? 'Power electronics, BESS & EV charging' : 'Řízení výkonu, BESS a EV dobíjení',
        spec: isEn.value
            ? 'V2: 2× Victron MPPT · V1: 2× 50 kW PCS + BESS + 4× 22 kW EV (Apple Pay)'
            : 'V2: 2× Victron MPPT · V1: 2× 50 kW PCS + BESS + 4× 22 kW EV stojan (Apple Pay)',
        priceA: 290000,
        priceB: 2800000,
    },
    {
        name: isEn.value ? 'Steel trunks & turnkey installation' : 'Ocelové kmeny a montáž na klíč',
        spec: isEn.value
            ? 'V2: 2× 5.0 m trunk (1 week) · V1: 2× 11.5 m hot-dip galvanized trunk (1 month)'
            : 'V2: 2× kmen 5,0 m (1 týden) · V1: 2× kmen 11,5 m žárový zinek (1 měsíc)',
        priceA: 310000,
        priceB: 1260000,
    },
]);

const facts = computed(() => {
    if (isMixedModels.value) {
        return [
            { value: '5 / 11,5 m', label: isEn.value ? 'Tree height (V2 / V1)' : 'Výška stromu (V2 / V1)' },
            { value: '≤ 1 m²', label: isEn.value ? 'Footprint per tree' : 'Půdorys patky stromu' },
            { value: '23 / 100 kW', label: isEn.value ? 'Total power (2× V2 / 2× V1)' : 'Celkový výkon (2× V2 / 2× V1)' },
            { value: isEn.value ? '1–4 wks' : '1–4 týdny', label: isEn.value ? 'On-site installation' : 'Montáž na místě' },
        ];
    }
    if (isAllV1.value) {
        return [
            { value: '11,5 m', label: isEn.value ? 'Tree height (V1)' : 'Výška stromu V1' },
            { value: '1,0 m²', label: isEn.value ? 'Footprint per tree' : 'Půdorys patky stromu' },
            { value: '149,4 kW', label: isEn.value ? 'Total power (3× V1)' : 'Celkový výkon (3× V1)' },
            { value: isEn.value ? '1 month' : '1 měsíc', label: isEn.value ? 'On-site installation' : 'Montáž na místě' },
        ];
    }

    return [
        { value: '5 m', label: isEn.value ? 'Tree height' : 'Výška stromu' },
        { value: '< 1 m²', label: isEn.value ? 'Base footprint' : 'Plocha patky' },
        { value: '0', label: isEn.value ? 'Building permits' : 'Stavebních povolení' },
        { value: isEn.value ? '1 week' : '1 týden', label: isEn.value ? 'On-site installation' : 'Montáž na místě' },
    ];
});

const warranties = computed(() => [
    {
        period: isEn.value ? '15 years' : '15 let',
        part: isEn.value ? 'Steel skeleton' : 'Ocelový skelet',
        detail: isEn.value
            ? 'Trunk & internal structural branch tubes (5 years outer cladding)'
            : 'Kmen a vnitřní nosné trubky větví (obal konstrukce 5 let)',
    },
    {
        period: isEn.value ? '12 / 25 yrs' : '12 / 25 let',
        part: isEn.value ? 'PV solar canopy' : 'FVE solární část',
        detail: isEn.value
            ? '12 yrs product warranty · 25 yrs 85% linear power output'
            : '12 let na fyzický produkt · 25 let na 85 % lineárního výkonu',
    },
    {
        period: isEn.value ? '5 years' : '5 let',
        part: isEn.value ? 'Power electronics' : 'Energo část',
        detail: isEn.value ? 'Hybrid inverters, MPPT & power cabling' : 'Střídače Victron Energy / PCS a kabeláže',
    },
    {
        period: isEn.value ? '2 years' : '2 roky',
        part: isEn.value ? 'Wind turbine section' : 'VTE větrná část',
        detail: isEn.value
            ? 'Wind turbines, positioning mechanics, controllers & sensors'
            : 'Větrné turbíny, polohovací mechanika, řídicí jednotky a senzory',
    },
]);
</script>

<template>
    <div class="pdf-doc">
        <!-- 01 · Cover -->
        <ClientsPdfSheet :doc="docLabel" :page="1" :total="TOTAL">
            <p class="pdf-mark"><b>01</b><i></i>{{ docLabel }}</p>
            <h1 class="pdf-h1">
                {{ page1TitleLine1 }}<br />
                <span class="pdf-accent">{{ isEn ? `for ${clientName.replace(/\.$/, '')}.` : `pro ${clientName.replace(/\.$/, '')}.` }}</span>
            </h1>
            <p class="pdf-lead">
                <template v-if="isEn">
                    Patented hybrid energy tree generating electricity from both wind and sun. Performance figures are calculated from
                    {{
                        s1.campaignDays === 1
                            ? 'live on-site wind telemetry measured directly at your property'
                            : `${s1.campaignDays} days of on-site wind telemetry measured directly at your property`
                    }}, the Treetino Technical Databook, and wind-tunnel &amp; CFD measurements by CTU in Prague (Faculty of Mechanical Engineering).
                </template>
                <template v-else>
                    Hybridní strom, který vyrábí elektřinu z větru i ze slunce. Výpočet vychází z
                    {{ s1.campaignDays === 1 ? 'měření větru přímo na vašem pozemku' : `${s1.campaignDays} dní měření větru přímo na vašem pozemku` }},
                    z Technického databooku Treetino a z aerodynamických měření Fakulty strojní ČVUT v Praze.
                </template>
            </p>

            <div class="cover-visual">
                <img :src="coverPhoto || '/img/clients/site-after-v2-5m.jpg'" alt="" class="pdf-img" />
                <span class="cover-caption">
                    {{ coverCaption || (isEn ? 'Visualization · Tree V2 on site, height 5 m' : 'Vizualizace · Strom V2 v areálu, výška 5 m') }}
                </span>
            </div>

            <div class="pdf-stats" style="grid-template-columns: repeat(4, 1fr); margin-top: 9mm">
                <div>
                    <p class="pdf-stat-value">{{ num(s1.annualTotalKwh, 0, locale) }}<small>kWh</small></p>
                    <p class="pdf-stat-label">
                        {{ isEn ? `Annual yield (${tr(v1.title, locale)})` : `Výroba za rok (${tr(v1.title, locale)})` }}
                    </p>
                </div>
                <div>
                    <p class="pdf-stat-value">
                        {{ num(s1.netCapexAfterSubsidyCzk / 1000, 0, locale) }}<small>{{ isEn ? 'k CZK' : 'tis. Kč' }}</small>
                    </p>
                    <p class="pdf-stat-label">{{ isEn ? 'Net investment after grant' : 'Investice po dotaci' }}</p>
                </div>
                <div>
                    <p class="pdf-stat-value pdf-accent">
                        {{ num(s1.paybackYears, 1, locale) }}<small>{{ isEn ? 'yrs' : 'let' }}</small>
                    </p>
                    <p class="pdf-stat-label">{{ isEn ? 'Payback period' : 'Návratnost' }}</p>
                </div>
                <div>
                    <p class="pdf-stat-value">
                        {{ num(s1.netProfit25YrCzk / 1_000_000, 2, locale) }}<small>{{ isEn ? 'M CZK' : 'mil. Kč' }}</small>
                    </p>
                    <p class="pdf-stat-label">{{ isEn ? '25-year net profit' : 'Čistý zisk za 25 let' }}</p>
                </div>
            </div>

            <div class="cover-meta">
                <div>
                    <span>{{ isEn ? 'Client' : 'Objednatel' }}</span>{{ clientName }}
                </div>
                <div>
                    <span>{{ isEn ? 'Weather station' : 'Měřicí stanice' }}</span>
                    {{ campaign.identity.stationId }} ·
                    {{ campaign.identity.city === 'Prague' ? (isEn ? 'Prague' : 'Praha') : campaign.identity.city }}
                </div>
                <div>
                    <span>{{ isEn ? 'Issued on' : 'Vystaveno' }}</span>{{ longDate(issuedIso, locale) }}
                </div>
                <div>
                    <span>{{ isEn ? 'Valid until' : 'Platnost do' }}</span>{{ validUntil }}
                </div>
            </div>
        </ClientsPdfSheet>

        <!-- 02 · Variants & price -->
        <ClientsPdfSheet :doc="docLabel" :page="2" :total="TOTAL">
            <p class="pdf-mark"><b>02</b><i></i>{{ isEn ? 'Options & Pricing' : 'Varianty a cena' }}</p>
            <h1 class="pdf-h1">
                {{ page2HeadlineLine1 }}<br />
                <span class="pdf-accent">{{ page2HeadlineLine2 }}</span>
            </h1>

            <table class="pdf-rows" style="margin-top: 9mm">
                <thead>
                    <tr>
                        <th style="width: 46%"></th>
                        <th>{{ tr(v1.title, locale) }}</th>
                        <th>{{ tr(v2.title, locale) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(r, i) in rows" :key="i" :class="r.cls">
                        <td>{{ r.label }}</td>
                        <td>{{ r.a }}</td>
                        <td>{{ r.b }}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 8mm">
                <div style="display: flex; align-items: baseline; justify-content: space-between">
                    <p class="pdf-section-title">
                        {{
                            isEn
                                ? 'Cumulative cashflow · 25 years (incl. linear PV degradation to 85%)'
                                : 'Kumulovaný peněžní tok · 25 let (vč. lineární degradace FVE na 85 %)'
                        }}
                    </p>
                    <div class="pdf-legend">
                        <span><i style="background: #8ec5ff"></i>{{ tr(v2.title, locale) }}</span>
                        <span><i style="background: rgba(255, 255, 255, 0.6)"></i>{{ tr(v1.title, locale) }}</span>
                    </div>
                </div>
                <svg :viewBox="`0 0 ${cash.W} ${cash.H}`" class="pdf-chart" style="width: 100%; margin-top: 2.5mm">
                    <g v-for="t in cash.ticks" :key="t">
                        <line :x1="cash.L" :x2="cash.W - cash.R" :y1="cash.y(t)" :y2="cash.y(t)" :class="t === 0 ? 'axis' : 'grid'" />
                        <text :x="cash.L - 1.5" :y="cash.y(t) + 0.8" text-anchor="end">
                            {{ t === 0 ? '0' : `${num(t / 1_000_000, 0, locale)} ${isEn ? 'M' : 'mil.'}` }}
                        </text>
                    </g>
                    <text v-for="yr in cash.years" :key="yr" :x="cash.x(yr)" :y="cash.H - 1.5" text-anchor="middle">
                        {{ yr === 0 ? (isEn ? 'Yr 0' : 'Rok 0') : yr }}
                    </text>

                    <path :d="cash.line1" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="0.45" stroke-dasharray="1.2 0.8" />
                    <path :d="cash.line2" fill="none" stroke="#8ec5ff" stroke-width="0.6" />

                    <line :x1="cash.pb" :x2="cash.pb" :y1="4" :y2="cash.zero" stroke="rgba(142,197,255,0.35)" stroke-width="0.2" stroke-dasharray="0.6 0.6" />
                    <circle :cx="cash.pb" :cy="cash.zero" r="0.9" fill="#8ec5ff" />
                    <text :x="cash.pb + 1.6" :y="cash.zero + 4" style="fill: #8ec5ff">
                        {{
                            isEn
                                ? `Payback ${num(s2.paybackYears, 1, locale)} yrs`
                                : `Návratnost ${num(s2.paybackYears, 1, locale)} let`
                        }}
                    </text>

                    <text :x="cash.end2.x" :y="cash.end2.y - 1.6" text-anchor="end" style="fill: #fff">+{{ millions(s2.netProfit25YrCzk, 2, locale) }}</text>
                    <text :x="cash.end1.x" :y="cash.end1.y - 1.6" text-anchor="end">+{{ millions(s1.netProfit25YrCzk, 2, locale) }}</text>
                </svg>
            </div>

            <p class="pdf-note" style="margin-top: auto; padding-top: 4mm">
                <template v-if="isEn">
                    Legal &amp; calculation notice: Annual savings are based strictly on direct displacement of purchased grid electricity at CZK
                    {{ num(TARIFF_CZK_PER_KWH, 2, 'en') }}/kWh with 3% annual tariff indexation. The 25-year projection incorporates the contractual PV
                    degradation curve from the Treetino Technical Databook (2% in Year 1, then max. 0.55%/yr to a guaranteed 85% in Year 25; Pmax tolerance ±3%
                    per IEC 61215:2021). Actual output depends on real meteorological conditions. The {{ SUBSIDY_PCT }}% grant is indicative and subject to
                    grant authority approval.
                </template>
                <template v-else>
                    Právní a výpočtová doložka: Roční přínos vychází výhradně z přímé úspory nakupované elektřiny při ceně
                    {{ num(TARIFF_CZK_PER_KWH, 2, 'cs') }} Kč/kWh a meziroční indexaci tarifu o 3 %. Projekce na 25 let již započítává smluvní pokles výkonu
                    FVE dle Technického databooku Treetino (2 % v 1. roce, následně max. 0,55 %/rok na garantovaných 85 % v 25. roce; tolerance Pmax ±3 % dle
                    IEC 61215:2021). Skutečná výroba závisí na reálných povětrnostních podmínkách v daném roce. Dotace {{ SUBSIDY_PCT }} % je kalkulována jako
                    indikativní a podléhá schválení poskytovatelem dotace.
                </template>
            </p>
        </ClientsPdfSheet>

        <!-- 03 · Scope of supply, warranties & acceptance -->
        <ClientsPdfSheet :doc="docLabel" :page="3" :total="TOTAL">
            <p class="pdf-mark"><b>03</b><i></i>{{ isEn ? 'Scope of Supply & Warranties' : 'Rozsah dodávky a záruky' }}</p>
            <h1 class="pdf-h1">
                {{ isEn ? 'Turnkey delivery.' : 'Na klíč.' }}<br />
                <span class="pdf-accent">
                    {{
                        isSingleOffer
                            ? isEn
                                ? `Single ${tr(v1.shortModel, locale)} tree installation.`
                                : `Instalace 1 stromu ${tr(v1.shortModel, locale)}.`
                            : isMixedModels
                              ? isEn
                                  ? 'Complete 2-tree installation.'
                                  : 'Kompletní dodávka 2 stromů.'
                              : isAllV1
                                ? isEn
                                    ? 'Industrial 3-tree installation.'
                                    : 'Průmyslová instalace 3 stromů.'
                                : isEn
                                  ? 'Installed in one week.'
                                  : 'Montáž za jeden týden.'
                    }}
                </span>
            </h1>

            <div class="scope">
                <div class="scope-visual">
                    <img :src="v1.systemId === 'strom-v1' ? '/img/clients/treetino-v1-site-render.jpg' : '/img/clients/treetino-v2-studio.webp'" alt="" class="pdf-img" loading="lazy" decoding="async" />
                </div>

                <!-- Mixed-model scope table (Stochov: 2x V2 vs 2x V1) -->
                <table v-if="isMixedModels" class="pdf-rows scope-list">
                    <thead>
                        <tr>
                            <th>{{ isEn ? 'Scope of supply (2 trees)' : 'Rozsah dodávky (2 stromy)' }}</th>
                            <th>{{ tr(v1.title, locale) }}</th>
                            <th>{{ tr(v2.title, locale) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in bomMixedPair" :key="b.name">
                            <td>
                                <span class="scope-name">{{ b.name }}</span>
                                <span class="scope-spec">{{ b.spec }}</span>
                            </td>
                            <td style="vertical-align: top">{{ czk(b.priceA, locale) }}</td>
                            <td style="vertical-align: top">{{ czk(b.priceB, locale) }}</td>
                        </tr>
                        <tr class="is-key">
                            <td>{{ isEn ? 'Total for 2 trees excl. VAT' : 'Celkem za 2 stromy bez DPH' }}</td>
                            <td>{{ czk(s1.totalCapexCzk, locale) }}</td>
                            <td>{{ czk(s2.totalCapexCzk, locale) }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Single-model scope table (Prague V2 or M-Kovo V1) -->
                <table v-else class="pdf-rows scope-list">
                    <thead>
                        <tr>
                            <th>{{ isEn ? 'Each tree includes' : 'Jeden strom obsahuje' }}</th>
                            <th>{{ isEn ? 'Price' : 'Cena' }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in bomSingleTree" :key="b.name">
                            <td>
                                <span class="scope-name">{{ b.name }}</span>
                                <span class="scope-spec">{{ b.spec }}</span>
                            </td>
                            <td style="vertical-align: top">{{ czk(b.price, locale) }}</td>
                        </tr>
                        <tr class="is-key">
                            <td>{{ isEn ? 'Total per tree excl. VAT' : 'Celkem za strom bez DPH' }}</td>
                            <td>{{ czk(singleTreeBasePriceCzk, locale) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pdf-stats" style="grid-template-columns: repeat(4, 1fr); margin-top: 7mm">
                <div v-for="f in facts" :key="f.label">
                    <p class="pdf-stat-value">{{ f.value }}</p>
                    <p class="pdf-stat-label">{{ f.label }}</p>
                </div>
            </div>

            <!-- Official Warranties from Technical Databook -->
            <div class="warranties">
                <p class="pdf-section-title" style="margin-bottom: 2.5mm">
                    {{
                        isEn
                            ? 'Warranty terms (per Treetino Technical Databook)'
                            : 'Záruční podmínky (dle Technického databooku Treetino)'
                    }}
                </p>
                <div class="warranties-grid">
                    <div v-for="w in warranties" :key="w.part" class="warranty-item">
                        <span class="warranty-period pdf-accent">{{ w.period }}</span>
                        <span class="warranty-part">{{ w.part }}</span>
                        <span class="warranty-detail">{{ w.detail }}</span>
                    </div>
                </div>
            </div>

            <div class="steps">
                <div>
                    <span class="pdf-mono">{{ isEn ? 'Step 1' : 'Krok 1' }}</span>
                    <p>{{ isEn ? 'Offer signature and grant application filing' : 'Podpis nabídky a podání žádosti o dotaci' }}</p>
                </div>
                <div>
                    <span class="pdf-mono">{{ isEn ? 'Step 2' : 'Krok 2' }}</span>
                    <p>
                        {{
                            isMixedModels
                                ? isEn
                                    ? 'Manufacturing & delivery: 2 months (V2) / 3 months (V1)'
                                    : 'Výroba a dodání: 2 měsíce (V2) / 3 měsíce (V1)'
                                : isEn
                                  ? 'Manufacturing and site delivery: 2 months'
                                  : 'Výroba a dodání na místo: 2 měsíce'
                        }}
                    </p>
                </div>
                <div>
                    <span class="pdf-mono">{{ isEn ? 'Step 3' : 'Krok 3' }}</span>
                    <p>
                        {{
                            isEn
                                ? 'Installation (Tree V2: 1 week, Tree V1: 1 month) and inspection'
                                : 'Montáž Stromu V2 za 1 týden (V1 za 1 měsíc) a revize ČSN'
                        }}
                    </p>
                </div>
            </div>

            <div class="sign">
                <div>
                    <p class="pdf-section-title">{{ isEn ? 'For Supplier' : 'Za dodavatele' }}</p>
                    <p class="sign-name">Treetino Corp s.r.o.</p>
                    <div class="sign-line">{{ isEn ? 'Signature and date' : 'Podpis a datum' }}</div>
                </div>
                <div>
                    <p class="pdf-section-title">{{ isEn ? 'For Client' : 'Za objednatele' }}</p>
                    <p class="sign-name">
                        <span class="box"></span> {{ tr(v1.title, locale) }}
                        <span class="box" style="margin-left: 5mm"></span> {{ tr(v2.title, locale) }}
                    </p>
                    <div class="sign-line">{{ isEn ? 'Signature and date' : 'Podpis a datum' }}</div>
                </div>
            </div>
        </ClientsPdfSheet>
    </div>
</template>

<style scoped>
.cover-visual {
    position: relative;
    flex: 1 1 auto;
    min-height: 100mm;
    margin-top: 9mm;
    overflow: hidden;
}

.cover-visual img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 57%;
}

.cover-visual::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 0.25mm rgba(255, 255, 255, 0.1);
}

.cover-caption {
    position: absolute;
    left: 4mm;
    bottom: 3.5mm;
    padding: 1mm 2.5mm;
    border-radius: 1mm;
    background: rgba(9, 9, 11, 0.72);
    font-size: 6.8pt;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.8);
}

.cover-meta {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6mm;
    margin-top: 8mm;
    margin-bottom: 4mm;
    font-size: 8.2pt;
    color: rgba(255, 255, 255, 0.85);
}

.cover-meta span {
    display: block;
    margin-bottom: 1.2mm;
    font-size: 6.8pt;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.38);
}

.scope {
    display: grid;
    grid-template-columns: 48mm 1fr;
    gap: 6mm;
    align-items: start;
    margin-top: 8mm;
}

.scope-visual {
    height: 56mm;
    overflow: hidden;
    background: #000;
}

.scope-visual img {
    height: 100%;
    object-position: 50% 50%;
    transform: scale(1.35);
}

.scope-name {
    display: block;
    color: #fff;
    font-weight: 500;
}

.scope-spec {
    display: block;
    margin-top: 0.6mm;
    font-size: 6.8pt;
    color: rgba(255, 255, 255, 0.45);
}

.warranties {
    margin-top: 7mm;
    padding-top: 4mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.12);
}

.warranties-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5mm;
}

.warranty-item {
    display: flex;
    flex-direction: column;
}

.warranty-period {
    font-size: 11.5pt;
    font-weight: 500;
    letter-spacing: -0.02em;
}

.warranty-part {
    margin-top: 0.8mm;
    font-size: 7.8pt;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
}

.warranty-detail {
    margin-top: 0.6mm;
    font-size: 6.6pt;
    line-height: 1.38;
    color: rgba(255, 255, 255, 0.42);
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6mm;
    margin-top: 7mm;
}

.steps > div {
    padding-top: 3mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.12);
}

.steps p {
    margin: 1.8mm 0 0;
    font-size: 8.2pt;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.75);
}

.sign {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16mm;
    margin-top: auto;
    padding-top: 4mm;
}

.sign-name {
    margin: 2mm 0 0;
    font-size: 9pt;
    color: rgba(255, 255, 255, 0.85);
}

.sign-line {
    margin-top: 10mm;
    padding-top: 2mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.22);
    font-size: 7pt;
    color: rgba(255, 255, 255, 0.4);
}

.box {
    display: inline-block;
    width: 3mm;
    height: 3mm;
    margin-right: 1.5mm;
    vertical-align: -0.4mm;
    border: 0.3mm solid rgba(255, 255, 255, 0.55);
}
</style>
