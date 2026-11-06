<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsPdfSheet from './ClientsPdfSheet.vue';
import { CVUT_EXPERIMENTAL_CURVES  } from './cvutPhysics';
import type {SiteOfferSimulationResult} from './cvutPhysics';
import type { StationTelemetryBundle } from './pwsData';
import { cardinalCs, longDate, num, shortDate, tr  } from './stationApp';
import type {StationVariantOption} from './stationApp';

const props = defineProps<{
    campaign: StationTelemetryBundle;
    sim: SiteOfferSimulationResult;
    variant: StationVariantOption;
    clientName: string;
    sitePhoto?: string;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const TOTAL = 3;
const docLabel = computed(() => {
    const title = tr(props.variant.title, locale.value);

    return isEn.value ? `Technical Study · ${title}` : `Technická studie · ${title}`;
});

const agg = computed(() => props.campaign.aggregates);
const id = computed(() => props.campaign.identity);
const sys = computed(() => props.sim.system);
const unitQty = computed(() => props.sim.quantity);
const hubHeightM = computed(() => props.sim.hubHeightM);
const days = computed(() => props.campaign.aggregates.totalDays || props.campaign.dailyHistory.length);
const photoSrc = computed(() => props.sitePhoto || '/img/clients/site-before-ipragu1761.jpg');

const solarShare = computed(() => Math.round((props.sim.annualSolarKwh / props.sim.annualTotalKwh) * 100));

const dominant = computed(() => [...props.campaign.windRose16].sort((a, b) => b.pct - a.pct)[0]);
const topThreeSectors = computed(() => [...props.campaign.windRose16].sort((a, b) => b.pct - a.pct).slice(0, 3));
const topThreeShare = computed(() => topThreeSectors.value.reduce((t, s) => t + s.pct, 0));
const topThreeNames = computed(() => topThreeSectors.value.map((s) => cardinalCs(s.sector, locale.value)).join(', '));

function peakLabel(ts: string) {
    return `${longDate(ts, locale.value)}, ${ts.slice(11, 16)}`;
}

/* ------------------------------------------------------------------ */
/* Page 1: wind rose (share of time per 16 sectors)                    */
/* ------------------------------------------------------------------ */

const rose = computed(() => {
    const R = 26;
    const max = Math.max(...props.campaign.windRose16.map((s) => s.pct));
    const maxSpeed = Math.max(...props.campaign.windRose16.map((s) => s.avgSpeedMs));
    const petals = props.campaign.windRose16.map((s) => {
        const r = (s.pct / max) * R;
        const a0 = ((s.degCenter - 9) * Math.PI) / 180;
        const a1 = ((s.degCenter + 9) * Math.PI) / 180;
        const p = (a: number, rr: number) => `${(Math.sin(a) * rr).toFixed(2)},${(-Math.cos(a) * rr).toFixed(2)}`;

        return {
            d: `M0,0 L${p(a0, r)} A${r},${r} 0 0 1 ${p(a1, r)} Z`,
            opacity: 0.25 + 0.75 * (s.avgSpeedMs / maxSpeed),
        };
    });
    const rings = [0.25, 0.5, 0.75, 1].map((k) => ({ r: k * R, label: `${num(k * max, 0, locale.value)} %` }));

    return { R, petals, rings };
});

/* ------------------------------------------------------------------ */
/* Page 2: daily production (wind + sun) for every measured day        */
/* ------------------------------------------------------------------ */

const daily = computed(() => {
    const W = 178;
    const H = 52;
    const L = 9;
    const B = 6;
    const T = 3;
    const rows = props.sim.dailyRows;
    const isSparse = rows.length <= 10;
    const rawMax = Math.max(...rows.map((r) => r.totalKwh));
    const tick = rawMax > 200 ? 100 : rawMax > 80 ? 50 : rawMax > 40 ? 20 : 10;
    const max = Math.ceil(rawMax / tick) * tick;
    const step = (W - L) / rows.length;
    const barW = isSparse ? Math.min(12, step * 0.42) : step * 0.64;
    const y = (v: number) => T + (1 - v / max) * (H - T - B);
    const bars = rows.map((r, i) => ({
        x: L + i * step + (step - barW) / 2,
        w: barW,
        ySolar: y(r.solarKwh),
        hSolar: y(0) - y(r.solarKwh),
        yWind: y(r.solarKwh + r.windKwh),
        hWind: y(r.solarKwh) - y(r.solarKwh + r.windKwh),
    }));
    const ticks: number[] = [];

    for (let v = 0; v <= max; v += tick) {
ticks.push(v);
}

    const labelIndices = isSparse
        ? rows.map((_, i) => i)
        : Array.from(new Set([0, Math.floor(rows.length / 3), Math.floor((2 * rows.length) / 3), rows.length - 1]));
    const labels = labelIndices.map((i) => ({
        x: isSparse ? L + i * step + step / 2 : i === rows.length - 1 ? W - 0.5 : i === 0 ? L + 0.5 : L + i * step + step / 2,
        anchor: isSparse ? 'middle' : i === rows.length - 1 ? 'end' : i === 0 ? 'start' : 'middle',
        text: shortDate(rows[i].date, locale.value),
    }));

    return { W, H, L, y, bars, ticks, labels, isSparse };
});

/* ------------------------------------------------------------------ */
/* Page 3: cP(λ) characteristics from FS ČVUT                          */
/* ------------------------------------------------------------------ */

const cp = computed(() => {
    const W = 84;
    const H = 50;
    const L = 9;
    const B = 7;
    const T = 3;
    const R = 2;
    const lMax = 1.4;
    const cMax = 0.4;
    const x = (l: number) => L + (l / lMax) * (W - L - R);
    const y = (c: number) => T + (1 - c / cMax) * (H - T - B);
    const curve = (cid: string) => {
        const c = CVUT_EXPERIMENTAL_CURVES.find((k) => k.id === cid)!;
        const pts: string[] = [];

        for (let i = 0; i <= 70; i++) {
            const l = (i / 70) * lMax;
            pts.push(`${i ? 'L' : 'M'}${x(l).toFixed(2)},${y(Math.max(0, c.evalCp(l))).toFixed(2)}`);
        }

        return { d: pts.join(' '), c };
    };

    return {
        W,
        H,
        L,
        R,
        x,
        y,
        ansys: curve('ansys-d150-guided'),
        tunnel: curve('cvut-ref-small'),
        lTicks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4],
        cTicks: [0, 0.1, 0.2, 0.3, 0.4],
    };
});

const params = computed(() => {
    const loc = locale.value;

    return [
        {
            k: isEn.value ? 'Sensor measurement height z<sub>ref</sub>' : 'Výška měření z<sub>ref</sub>',
            v: `${num(id.value.mastHeightM, 2, loc)} m`,
        },
        {
            k: isEn.value ? 'Rotor hub height z<sub>hub</sub>' : 'Výška rotorů z<sub>hub</sub>',
            v: `${num(hubHeightM.value, 1, loc)} m`,
        },
        {
            k: isEn.value
                ? 'Wind shear exponent α (EN 1991-1-4, cat. III)'
                : 'Exponent drsnosti α (ČSN EN 1991-1-4, kat. III)',
            v: num(0.28, 2, loc),
        },
        {
            k: isEn.value
                ? 'Power coefficient c<sub>P,max</sub> at λ = 1.0'
                : 'Součinitel výkonu c<sub>P,max</sub> při λ = 1,0',
            v: num(props.sim.activeCp, 3, loc),
        },
        {
            k: isEn.value ? 'Total rotor swept area A' : 'Plocha rotorů A',
            v: `${unitQty.value * sys.value.turbineCountPerUnit} × ${num(sys.value.sweptAreaPerTurbineM2, 2, loc)} m²`,
        },
        {
            k: isEn.value
                ? 'Generator & MPPT efficiency η<sub>el</sub>'
                : 'Účinnost generátoru a MPPT η<sub>el</sub>',
            v: num(0.88, 2, loc),
        },
        {
            k: isEn.value
                ? 'Crown rotor wake factor η<sub>array</sub>'
                : 'Vzájemné stínění rotorů η<sub>array</sub>',
            v: num(sys.value.arrayWakeEfficiency, 2, loc),
        },
        {
            k: isEn.value ? 'Cut-in wind speed' : 'Rozběhová rychlost',
            v: `${num(sys.value.cutInMs, 1, loc)} m/s`,
        },
        {
            k: isEn.value
                ? 'PVGIS solar yield × η<sub>canopy</sub>'
                : 'Solární výnos Praha (PVGIS) × η<sub>koruna</sub>',
            v: `${num(1085, 0, loc)} kWh/kWp × ${num(sys.value.solarCanopyFactor, 2, loc)}`,
        },
        {
            k: isEn.value
                ? 'Seasonal wind factor (autumn → annual)'
                : 'Sezónní faktor větru (podzim → rok)',
            v: num(1.18, 2, loc),
        },
    ];
});
</script>

<template>
    <div class="pdf-doc">
        <!-- 01 · Site & measurement -->
        <ClientsPdfSheet :doc="docLabel" :page="1" :total="TOTAL">
            <p class="pdf-mark"><b>01</b><i></i>{{ isEn ? 'Site & Telemetry' : 'Lokalita a měření' }}</p>
            <h1 class="pdf-h1">
                {{
                    days === 1
                        ? isEn
                            ? 'Live telemetry.'
                            : 'Živé měření.'
                        : isEn
                          ? `${days} days measured.`
                          : `${days} dní měření.`
                }}<br />
                <span class="pdf-accent">{{ isEn ? 'Directly on site.' : 'Přímo na místě.' }}</span>
            </h1>
            <p class="pdf-lead">
                <template v-if="isEn">
                    Weather station {{ id.stationId }} at {{ clientName }} records wind speed, wind direction, temperature, and barometric pressure every
                    {{ id.softwareType === 'Weathercloud' ? '10' : '5' }} minutes
                    {{
                        agg.dateStart === agg.dateEnd
                            ? `since ${longDate(agg.dateStart, locale)}`
                            : `from ${longDate(agg.dateStart, locale)} to ${longDate(agg.dateEnd, locale)}`
                    }}, at {{ num(id.mastHeightM, 2, locale) }} m above ground level.
                </template>
                <template v-else>
                    Meteostanice {{ id.stationId }} v lokalitě {{ clientName }} zaznamenává rychlost a směr větru, teplotu a tlak
                    každých {{ id.softwareType === 'Weathercloud' ? '10' : '5' }} minut {{ agg.dateStart === agg.dateEnd ? `od ${longDate(agg.dateStart, locale)}` : `od ${longDate(agg.dateStart, locale)} do ${longDate(agg.dateEnd, locale)}` }},
                    ve výšce {{ num(id.mastHeightM, 2, locale) }} m nad zemí.
                </template>
            </p>

            <div class="site">
                <div class="site-photo">
                    <img :src="photoSrc" alt="" class="pdf-img" />
                </div>
                <table class="pdf-rows site-table">
                    <tbody>
                        <tr class="is-strong">
                            <td>{{ isEn ? 'Archived records' : 'Záznamů v archivu' }}</td>
                            <td>
                                {{
                                    id.stationId === 'D3882832837'
                                        ? isEn
                                            ? '232 bins · 92 extremes'
                                            : '232 binů · 92 extrémů'
                                        : num(agg.total5MinFrames, 0, locale)
                                }}
                            </td>
                        </tr>
                        <tr class="is-strong">
                            <td>{{ isEn ? 'Mean wind speed' : 'Průměrná rychlost větru' }}</td>
                            <td>{{ num(agg.meanWindMs, 2, locale) }} m/s</td>
                        </tr>
                        <tr class="is-strong">
                            <td>{{ isEn ? 'Peak wind gust' : 'Nejsilnější náraz' }}</td>
                            <td>{{ num(agg.peakGustMs, 2, locale) }} m/s</td>
                        </tr>
                        <tr>
                            <td>{{ isEn ? 'Peak gust timestamp' : 'Čas nejsilnějšího nárazu' }}</td>
                            <td>{{ peakLabel(agg.peakGustTimestamp) }}</td>
                        </tr>
                        <tr class="is-strong">
                            <td>{{ isEn ? 'Prevailing wind direction' : 'Převládající směr' }}</td>
                            <td>{{ cardinalCs(dominant.sector, locale) }} · {{ num(dominant.pct, 1, locale) }} %</td>
                        </tr>
                        <tr>
                            <td>{{ isEn ? 'Temperature (min / mean / max)' : 'Teplota (min / průměr / max)' }}</td>
                            <td>
                                {{ num(agg.tempMinC, 1, locale) }} / {{ num(agg.tempMeanC, 1, locale) }} / {{ num(agg.tempMaxC, 1, locale) }} °C
                            </td>
                        </tr>
                        <tr>
                            <td>{{ isEn ? 'Mean air density' : 'Průměrná hustota vzduchu' }}</td>
                            <td>{{ num(agg.meanAirDensityKgM3, 3, locale) }} kg/m³</td>
                        </tr>
                        <tr>
                            <td>{{ isEn ? 'Elevation · coordinates' : 'Nadmořská výška · souřadnice' }}</td>
                            <td>{{ id.elevationM }} m · {{ num(id.lat, 3, locale) }}° N, {{ num(id.lon, 3, locale) }}° E</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="rose-row">
                <svg viewBox="-34 -34 68 68" class="pdf-chart rose">
                    <circle v-for="r in rose.rings" :key="r.r" :r="r.r" fill="none" class="grid" />
                    <line x1="-30" x2="30" y1="0" y2="0" class="grid" />
                    <line y1="-30" y2="30" x1="0" x2="0" class="grid" />
                    <path v-for="(p, i) in rose.petals" :key="i" :d="p.d" fill="#8ec5ff" :fill-opacity="p.opacity" />
                    <text x="0" y="-30.5" text-anchor="middle">{{ isEn ? 'N' : 'S' }}</text>
                    <text x="31" y="0.8" text-anchor="start">{{ isEn ? 'E' : 'V' }}</text>
                    <text x="0" y="33" text-anchor="middle">{{ isEn ? 'S' : 'J' }}</text>
                    <text x="-31" y="0.8" text-anchor="end">{{ isEn ? 'W' : 'Z' }}</text>
                    <text :x="1" :y="-rose.rings[3].r + 2.4" style="font-size: 1.9px">{{ rose.rings[3].label }}</text>
                </svg>
                <div>
                    <p class="pdf-section-title">{{ isEn ? 'Wind Rose' : 'Větrná růžice' }}</p>
                    <p class="rose-text">
                        <template v-if="isEn">
                            Dominant airflow on site: sectors {{ topThreeNames }} account for
                            <b>{{ num(topThreeShare, 1, locale) }}%</b> of measured time. Petal length indicates time share, while color intensity shows
                            mean wind speed in that sector.
                        </template>
                        <template v-else>
                            Nejčastější proudění na pozemku: sektory {{ topThreeNames }} dohromady tvoří
                            <b>{{ num(topThreeShare, 1, locale) }} %</b> naměřeného času. Délka výseče ukazuje podíl času,
                            sytost barvy průměrnou rychlost větru v daném směru.
                        </template>
                    </p>
                    <p class="pdf-note" style="margin-top: 4mm">
                        <template v-if="isEn">
                            Source: {{ id.softwareType === 'Weathercloud' ? 'Weathercloud PWS' : 'Weather.com PWS API' }}, station {{ id.stationId }},
                            {{ id.stationType !== 'other' ? id.stationType : 'personal weather station' }}. Telemetry archive verified by SHA-256
                            {{ campaign.sha256Hash.slice(0, 16) }}…
                        </template>
                        <template v-else>
                            Zdroj: {{ id.softwareType === 'Weathercloud' ? 'Weathercloud PWS' : 'Weather.com PWS API' }}, stanice {{ id.stationId }},
                            {{ id.stationType !== 'other' ? id.stationType : 'osobní meteostanice' }}. Archiv dat ověřen otiskem SHA-256
                            {{ campaign.sha256Hash.slice(0, 16) }}…
                        </template>
                    </p>
                </div>
            </div>
        </ClientsPdfSheet>

        <!-- 02 · Production -->
        <ClientsPdfSheet :doc="docLabel" :page="2" :total="TOTAL">
            <p class="pdf-mark"><b>02</b><i></i>{{ isEn ? 'Energy Yield Calculation' : 'Výpočet výroby' }}</p>
            <h1 class="pdf-h1">
                {{ num(sim.annualTotalKwh, 0, locale) }} {{ isEn ? 'kWh per year.' : 'kWh ročně.' }}<br />
                <span class="pdf-accent">
                    {{
                        isEn
                            ? `${solarShare}% from sun, ${100 - solarShare}% from wind.`
                            : `${solarShare} % ze slunce, ${100 - solarShare} % z větru.`
                    }}
                </span>
            </h1>

            <div class="how">
                <div>
                    <span class="pdf-mono">{{ isEn ? '1 · Wind at hub height' : '1 · Vítr ve výšce rotorů' }}</span>
                    <p class="how-value">×{{ num(sim.shearMultiplierSpeed, 2, locale) }}</p>
                    <p class="how-text">
                        <template v-if="isEn">
                            Wind speed extrapolated from {{ num(id.mastHeightM, 2, locale) }} m to {{ num(hubHeightM, 1, locale) }} m via Hellmann power
                            law. Available wind power increases {{ num(sim.shearMultiplierPower, 2, locale) }}×.
                        </template>
                        <template v-else>
                            Rychlost větru přepočítaná z {{ num(id.mastHeightM, 2, locale) }} m na {{ num(hubHeightM, 1, locale) }} m Hellmannovým zákonem.
                            Dostupný výkon větru roste {{ num(sim.shearMultiplierPower, 2, locale) }}×.
                        </template>
                    </p>
                </div>
                <div>
                    <span class="pdf-mono">{{ isEn ? '2 · Turbine power' : '2 · Výkon turbín' }}</span>
                    <p class="how-value">c<sub>P</sub> {{ num(sim.activeCp, 3, locale) }}</p>
                    <p class="how-text">
                        <template v-if="isEn">
                            Dual-slot Scooplet barrel rotor (inner core + guide wings) measured and CFD-simulated at CTU Prague ({{
                                unitQty * sys.turbineCountPerUnit
                            }}× {{ num(sys.turbineUnitKw, 0, locale) }} kW Aero).
                        </template>
                        <template v-else>
                            Součinitel výkonu soudečkového rotoru Scooplet změřený a simulovaný na FS ČVUT ({{ unitQty * sys.turbineCountPerUnit }}×
                            {{ num(sys.turbineUnitKw, 0, locale) }} kW Aero).
                        </template>
                    </p>
                </div>
                <div>
                    <span class="pdf-mono">{{ isEn ? '3 · Solar canopy' : '3 · Slunce v koruně' }}</span>
                    <p class="how-value">{{ num(unitQty * sys.nominalSolarKwp, 2, locale) }} kWp</p>
                    <p class="how-text">
                        <template v-if="isEn">
                            {{ unitQty * sys.solarLeafCount }}× TopCon solar leaves (per Technical Databook). PVGIS specific yield modulated by daily
                            cloud cover.
                        </template>
                        <template v-else>
                            {{ unitQty * sys.solarLeafCount }}× solární list TopCon (dle Technického databooku). Výnos z dat PVGIS upravený denní oblačností.
                        </template>
                    </p>
                </div>
            </div>

            <div style="margin-top: 11mm">
                <div style="display: flex; align-items: baseline; justify-content: space-between">
                    <p class="pdf-section-title">
                        {{
                            daily.isSparse
                                ? isEn
                                    ? 'Certified campaign milestones'
                                    : 'Ověřené milníky kampaně'
                                : isEn
                                  ? 'Daily production'
                                  : 'Výroba po dnech'
                        }}
                        ·
                        {{
                            agg.dateStart === agg.dateEnd
                                ? longDate(agg.dateStart, locale)
                                : `${shortDate(agg.dateStart, locale)} – ${longDate(agg.dateEnd, locale)}`
                        }}
                    </p>
                    <div class="pdf-legend">
                        <span><i style="background: #8ec5ff"></i>{{ isEn ? 'Wind' : 'Vítr' }}</span>
                        <span><i style="background: rgba(255, 255, 255, 0.35)"></i>{{ isEn ? 'Solar' : 'Slunce' }}</span>
                    </div>
                </div>
                <svg :viewBox="`0 0 ${daily.W} ${daily.H}`" class="pdf-chart" style="width: 100%; margin-top: 3mm">
                    <g v-for="t in daily.ticks" :key="t">
                        <line :x1="daily.L" :x2="daily.W" :y1="daily.y(t)" :y2="daily.y(t)" :class="t === 0 ? 'axis' : 'grid'" />
                        <text :x="daily.L - 1.5" :y="daily.y(t) + 0.8" text-anchor="end">{{ t }}</text>
                    </g>
                    <g v-for="(b, i) in daily.bars" :key="i">
                        <rect :x="b.x" :y="b.ySolar" :width="b.w" :height="b.hSolar" fill="rgba(255,255,255,0.35)" />
                        <rect :x="b.x" :y="b.yWind" :width="b.w" :height="b.hWind" fill="#8ec5ff" />
                    </g>
                    <text v-for="l in daily.labels" :key="l.text" :x="l.x" :y="daily.H - 1" :text-anchor="l.anchor">{{ l.text }}</text>
                    <text :x="daily.L - 1.5" y="1.6" text-anchor="end">kWh</text>
                </svg>
            </div>

            <table class="pdf-rows" style="margin-top: 10mm">
                <thead>
                    <tr>
                        <th style="width: 46%"></th>
                        <th>
                            {{
                                sim.campaignDays === 1
                                    ? isEn
                                        ? 'Day 1 measured'
                                        : 'Za 1. den měření'
                                    : isEn
                                      ? `Over ${sim.campaignDays} measured days`
                                      : `Za ${sim.campaignDays} dní měření`
                            }}
                        </th>
                        <th>{{ isEn ? 'Annual projection (Year 1)' : 'Odhad za rok (1. rok)' }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ isEn ? 'Wind' : 'Vítr' }}</td>
                        <td>{{ num(sim.campaignWindKwh, 1, locale) }} kWh</td>
                        <td>{{ num(sim.annualWindKwh, 0, locale) }} kWh</td>
                    </tr>
                    <tr>
                        <td>{{ isEn ? 'Solar' : 'Slunce' }}</td>
                        <td>{{ num(sim.campaignSolarKwh, 1, locale) }} kWh</td>
                        <td>{{ num(sim.annualSolarKwh, 0, locale) }} kWh</td>
                    </tr>
                    <tr class="is-key">
                        <td>{{ isEn ? 'Total' : 'Celkem' }}</td>
                        <td>{{ num(sim.campaignTotalKwh, 1, locale) }} kWh</td>
                        <td>{{ num(sim.annualTotalKwh, 0, locale) }} kWh</td>
                    </tr>
                    <tr>
                        <td>{{ isEn ? 'Peak instantaneous output in campaign' : 'Nejvyšší okamžitý výkon v kampani' }}</td>
                        <td>{{ num(sim.campaignPeakPowerKw, 1, locale) }} kW</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ isEn ? 'CO₂ avoided (0.42 kg/kWh)' : 'Úspora CO₂ (0,42 kg/kWh)' }}</td>
                        <td>{{ num(sim.campaignCo2SavedKg, 0, locale) }} kg</td>
                        <td>{{ num(sim.annualCo2SavedTons, 2, locale) }} t</td>
                    </tr>
                </tbody>
            </table>

            <p class="pdf-note" style="margin-top: auto">
                <template v-if="isEn">
                    Annual wind = mean daily campaign yield × 365 × 1.18 (winter/spring seasonal factor). Annual solar =
                    {{ num(unitQty * sys.nominalSolarKwp, 2, locale) }} kWp (STC, ±3% tolerance per IEC 61215) × 1,085 kWh/kWp (PVGIS) ×
                    {{ num(sys.solarCanopyFactor, 2, locale) }} (3D canopy spatial factor). Linear PV output warranty is 25 years to 85% (2% in Year 1, max.
                    0.55%/yr thereafter).
                </template>
                <template v-else>
                    Roční vítr = průměrná denní výroba kampaně × 365 × 1,18 (sezónní koeficient zima/jaro).
                    Roční slunce = {{ num(unitQty * sys.nominalSolarKwp, 2, locale) }} kWp (STC, tolerance ±3 % dle IEC 61215) × 1 085 kWh/kWp (PVGIS) × {{ num(sys.solarCanopyFactor, 2, locale) }}
                    (prostorové rozložení listů v koruně). Záruka na lineární výkon FVE je 25 let na 85 % (pokles 2 % v 1. roce, dále max. 0,55 %/rok).
                </template>
            </p>
        </ClientsPdfSheet>

        <!-- 03 · Method & sources -->
        <ClientsPdfSheet :doc="docLabel" :page="3" :total="TOTAL">
            <p class="pdf-mark"><b>03</b><i></i>{{ isEn ? 'Methodology & Sources' : 'Metodika a zdroje' }}</p>
            <h1 class="pdf-h1">
                {{ isEn ? 'Every figure' : 'Každé číslo' }}<br />
                <span class="pdf-accent">{{ isEn ? 'is traceable.' : 'má svůj zdroj.' }}</span>
            </h1>

            <div class="method">
                <div class="eqs">
                    <p class="pdf-section-title">{{ isEn ? 'Governing equations' : 'Použité vztahy' }}</p>
                    <div class="eq">
                        <code>v<sub>hub</sub> = v<sub>ref</sub> · (z<sub>hub</sub> / z<sub>ref</sub>)<sup>α</sup></code>
                        <span>{{ isEn ? 'Wind speed extrapolated to rotor hub height' : 'Rychlost větru ve výšce rotorů' }}</span>
                    </div>
                    <div class="eq">
                        <code>ρ = p / (R · T)</code>
                        <span>{{ isEn ? 'Air density from measured daily pressure and temperature' : 'Hustota vzduchu z denního tlaku a teploty' }}</span>
                    </div>
                    <div class="eq">
                        <code>P = ½ · ρ · A · v³ · c<sub>P</sub> · η<sub>el</sub> · η<sub>array</sub></code>
                        <span>{{ isEn ? 'Turbine power output, capped at rated capacity' : 'Výkon turbín, omezený jmenovitým výkonem' }}</span>
                    </div>
                    <div class="eq">
                        <code>E<sub>day</sub> = 14 h · P(v₁) + 7 h · P(v₂) + 3 h · P(v₃)</code>
                        <span>{{ isEn ? 'Daily integration across base, convective, and gust regimes' : 'Den rozdělen na klidnou, denní a nárazovou složku' }}</span>
                    </div>
                </div>

                <div>
                    <div style="display: flex; align-items: baseline; justify-content: space-between">
                        <p class="pdf-section-title">{{ isEn ? 'Power coefficient' : 'Součinitel výkonu' }} c<sub>P</sub>(λ)</p>
                    </div>
                    <svg :viewBox="`0 0 ${cp.W} ${cp.H}`" class="pdf-chart" style="width: 100%; margin-top: 3mm">
                        <g v-for="c in cp.cTicks" :key="c">
                            <line :x1="cp.L" :x2="cp.W - cp.R" :y1="cp.y(c)" :y2="cp.y(c)" :class="c === 0 ? 'axis' : 'grid'" />
                            <text :x="cp.L - 1.2" :y="cp.y(c) + 0.8" text-anchor="end">{{ num(c, 1, locale) }}</text>
                        </g>
                        <text v-for="l in cp.lTicks" :key="l" :x="cp.x(l)" :y="cp.H - 3" text-anchor="middle">{{ num(l, 1, locale) }}</text>
                        <text :x="(cp.W + cp.L) / 2" :y="cp.H - 0.2" text-anchor="middle">
                            {{ isEn ? 'tip-speed ratio λ' : 'rychloběžnost λ' }}
                        </text>
                        <path :d="cp.tunnel.d" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.35" stroke-dasharray="1 0.7" />
                        <path :d="cp.ansys.d" fill="none" stroke="#8ec5ff" stroke-width="0.55" />
                        <circle :cx="cp.x(1)" :cy="cp.y(sim.activeCp)" r="0.8" fill="#8ec5ff" />
                        <text :x="cp.x(1) + 1.4" :y="cp.y(sim.activeCp) - 1.2" style="fill: #8ec5ff">{{ num(sim.activeCp, 3, locale) }}</text>
                    </svg>
                    <div class="pdf-legend" style="margin-top: 2mm">
                        <span><i style="background: #8ec5ff"></i>{{ isEn ? 'Scooplet D150 (ANSYS)' : 'Scooplet D150 (ANSYS)' }}</span>
                        <span><i style="background: rgba(255, 255, 255, 0.5)"></i>{{ isEn ? 'Model REF (wind tunnel)' : 'Model REF (tunel)' }}</span>
                    </div>
                </div>
            </div>

            <table class="pdf-rows params" style="margin-top: 9mm">
                <thead>
                    <tr>
                        <th>{{ isEn ? 'Input parameters' : 'Vstupní parametry' }}</th>
                        <th>{{ isEn ? 'Value' : 'Hodnota' }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in params" :key="p.k">
                        <td v-html="p.k"></td>
                        <td>{{ p.v }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="sources">
                <p class="pdf-section-title">{{ isEn ? 'Sources' : 'Zdroje' }}</p>
                <ol v-if="isEn">
                    <li>
                        {{ id.softwareType === 'Weathercloud' ? 'Weathercloud PWS' : 'Weather.com PWS API' }} — station {{ id.stationId }},
                        {{ num(agg.total5MinFrames, 0, locale) }} records, {{ longDate(agg.dateStart, locale) }} – {{ longDate(agg.dateEnd, locale) }}.
                    </li>
                    <li>
                        CTU in Prague, Dept. of Fluid Dynamics and Thermodynamics — ANSYS Fluent CFD simulation of Scooplet D150 dual-slot rotor (Oct 8,
                        2026).
                    </li>
                    <li>
                        CTU in Prague — Technical Report R00, wind tunnel testing, model REF 0.25 × 0.15 (Aug 27, 2026).
                    </li>
                    <li>PVGIS, EU Joint Research Centre — solar irradiation data for Czech Republic ({{ num(id.lat, 2, locale) }}° N).</li>
                    <li>EN 1991-1-4 — Eurocode wind actions on structures, terrain category III.</li>
                </ol>
                <ol v-else>
                    <li>
                        {{ id.softwareType === 'Weathercloud' ? 'Weathercloud PWS' : 'Weather.com PWS API' }} — stanice {{ id.stationId }},
                        {{ num(agg.total5MinFrames, 0, locale) }} záznamů, {{ longDate(agg.dateStart, locale) }} – {{ longDate(agg.dateEnd, locale) }}.
                    </li>
                    <li>FS ČVUT v Praze, Ústav mechaniky tekutin a termodynamiky — CFD simulace ANSYS Fluent dvouštěrbinového rotoru Scooplet D150 (8. 10. 2026).</li>
                    <li>FS ČVUT v Praze — Technická zpráva R00, měření v aerodynamickém tunelu, model REF 0,25 × 0,15 (27. 8. 2026).</li>
                    <li>PVGIS, Joint Research Centre EU — solární výnos pro ČR ({{ num(id.lat, 2, locale) }}° N).</li>
                    <li>ČSN EN 1991-1-4 — zatížení větrem, kategorie terénu III.</li>
                </ol>
            </div>
        </ClientsPdfSheet>
    </div>
</template>

<style scoped>
.site {
    display: grid;
    grid-template-columns: 58mm 1fr;
    gap: 8mm;
    align-items: start;
    margin-top: 10mm;
}

.site-table td {
    padding-top: 3.4mm;
    padding-bottom: 3.4mm;
}

.site-photo {
    height: 100mm;
    overflow: hidden;
    box-shadow: inset 0 0 0 0.25mm rgba(255, 255, 255, 0.1);
}

.site-photo img {
    height: 100%;
}

.rose-row {
    display: grid;
    grid-template-columns: 60mm 1fr;
    gap: 14mm;
    align-items: center;
    margin-top: auto;
    margin-bottom: 1mm;
    padding-top: 5mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.12);
}

.rose {
    width: 60mm;
    height: 60mm;
}

.rose text {
    font-size: 2.6px;
}

.rose-text {
    margin: 3mm 0 0;
    font-size: 9pt;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.6);
}

.rose-text b {
    font-weight: 500;
    color: #8ec5ff;
}

.how {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6mm;
    margin-top: 11mm;
}

.how > div {
    padding-top: 3.5mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.12);
}

.how-value {
    margin: 3mm 0 0;
    font-size: 19pt;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.03em;
}

.how-text {
    margin: 2.5mm 0 0;
    font-size: 7.8pt;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.5);
}

.method {
    display: grid;
    grid-template-columns: 1fr 84mm;
    gap: 10mm;
    margin-top: 10mm;
}

.eq {
    padding: 2.6mm 0;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.08);
}

.eqs .pdf-section-title {
    margin-bottom: 2.4mm;
}

.eq code {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 10pt;
    color: #fff;
}

.eq sub,
.eq sup,
.pdf-section-title sub,
.how-value sub {
    font-size: 0.65em;
}

.eq span {
    display: block;
    margin-top: 1mm;
    font-size: 7.2pt;
    color: rgba(255, 255, 255, 0.42);
}

.sources {
    margin-top: auto;
    margin-bottom: 2mm;
    padding-top: 5mm;
}

.params td {
    padding-top: 1.7mm;
    padding-bottom: 1.7mm;
}

.params :deep(sub) {
    font-size: 70%;
}

.sources ol {
    margin: 2.5mm 0 0;
    padding-left: 0;
    list-style: none;
    font-size: 7.2pt;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
}
</style>
