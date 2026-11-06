<script setup lang="ts">
/**
 * Measurement → kWh → CZK calculation chain for the selected station + variant.
 * Mirrors `computeSingleSystemTotals` in cvutPhysics.ts step by step so every
 * number in the offer can be traced back to the measurement.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SiteOfferSimulationResult } from '../cvutPhysics';
import { czk, num, tr } from '../stationApp';
import type { StationEntry, StationVariantOption } from '../stationApp';

const props = defineProps<{
    entry: StationEntry;
    sim: SiteOfferSimulationResult;
    variant: StationVariantOption;
    active: boolean;
    reducedMotion?: boolean;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

/* ------------------------------------------------------------------ */
/* Count-up timeline                                                   */
/* ------------------------------------------------------------------ */

const STEP_COUNT = 6;
const STAGGER = 0.22;
const STEP_DUR = 1.1;
const TOTAL = STAGGER * (STEP_COUNT - 1) + STEP_DUR;

const elapsed = ref(0);
let raf = 0;
let t0 = 0;

function tick(t: number) {
    if (!t0) {
        t0 = t;
    }

    elapsed.value = (t - t0) / 1000;

    if (elapsed.value < TOTAL) {
        raf = requestAnimationFrame(tick);
    } else {
        elapsed.value = TOTAL;
        raf = 0;
    }
}

function run() {
    if (props.reducedMotion) {
        elapsed.value = TOTAL;

        return;
    }

    if (raf || elapsed.value > 0) {
        return;
    }

    t0 = 0;
    raf = requestAnimationFrame(tick);
}

watch(
    () => props.active,
    (v) => {
        if (v) {
            run();
        }
    },
    { immediate: true },
);

/* Re-play the count when the user switches station / variant while on screen */
watch(
    () => [props.entry.id, props.variant.key],
    () => {
        if (raf) {
            cancelAnimationFrame(raf);
        }

        raf = 0;
        elapsed.value = 0;

        if (props.active) {
            run();
        }
    },
);

onBeforeUnmount(() => {
    if (raf) {
        cancelAnimationFrame(raf);
    }
});

function stepP(i: number): number {
    const t = Math.min(1, Math.max(0, (elapsed.value - i * STAGGER) / STEP_DUR));

    return 1 - Math.pow(1 - t, 3);
}

const railP = computed(() => Math.min(1, elapsed.value / TOTAL));

function cu(v: number, i: number): number {
    return v * stepP(i);
}

/* ------------------------------------------------------------------ */
/* Formula renderer: `_{sub}` and `^{sup}` markers → <sub>/<sup>        */
/* ------------------------------------------------------------------ */

interface FormulaToken {
    t: string;
    k: 'text' | 'sub' | 'sup';
}

function tokens(src: string): FormulaToken[] {
    return src
        .split(/(_\{[^}]*\}|\^\{[^}]*\})/g)
        .filter(Boolean)
        .map((part) => {
            if (part.startsWith('_{')) {
                return { t: part.slice(2, -1), k: 'sub' as const };
            }

            if (part.startsWith('^{')) {
                return { t: part.slice(2, -1), k: 'sup' as const };
            }

            return { t: part, k: 'text' as const };
        });
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const L = computed(() => locale.value);
const f = (v: number, d = 0) => num(v, d, L.value);

const identity = computed(() => props.entry.bundle.identity);
const agg = computed(() => props.entry.bundle.aggregates);
const isSheltered = computed(() => identity.value.stationId === 'D3882832837');
const zRef = computed(() => (isSheltered.value ? 1.55 : Math.max(1.0, identity.value.mastHeightM || 1.524)));
const vHub = computed(() => agg.value.meanWindMs * props.sim.shearMultiplierSpeed);
const sweptArea = computed(() => props.sim.system.totalSweptAreaPerUnitM2 * props.sim.quantity);
const kWp = computed(() => props.sim.system.nominalSolarKwp * props.sim.quantity);
const nominalWindKw = computed(() => props.sim.system.nominalWindKw * props.sim.quantity);
const frames = computed(() => agg.value.total5MinFrames || agg.value.totalHourlyBins);

interface Chip {
    label: string;
    value: string;
    accent?: string;
}

interface ChainStep {
    key: string;
    kicker: string;
    title: string;
    value: string;
    unit: string;
    color: string;
    meta: string;
    chips: Chip[];
    formula: string[];
}

const steps = computed<ChainStep[]>(() => {
    const s = props.sim;
    const en = isEn.value;

    return [
        {
            key: 'measured',
            kicker: en ? 'Measured on site' : 'Naměřeno na místě',
            title: en ? `Weather station ${identity.value.stationId}` : `Meteostanice ${identity.value.stationId}`,
            value: f(cu(agg.value.meanWindMs, 0), 2),
            unit: 'm/s',
            color: '#8ec5ff',
            meta: en
                ? `mean wind at ${f(identity.value.mastHeightM, 1)} m mast · ${f(s.campaignDays)} days · ${f(frames.value)} records`
                : `průměrný vítr na stožáru ${f(identity.value.mastHeightM, 1)} m · ${f(s.campaignDays)} dní · ${f(frames.value)} záznamů`,
            chips: [
                { label: en ? 'Peak gust' : 'Max. náraz', value: `${f(agg.value.peakGustMs, 1)} m/s` },
                { label: en ? 'Mean air density' : 'Prům. hustota vzduchu', value: `${f(agg.value.meanAirDensityKgM3, 3)} kg/m³` },
            ],
            formula: [
                'v̄_{ref} = Σ v_{i} / N',
                en ? 'ρ = p / (R_{d} · T)   per measured day' : 'ρ = p / (R_{d} · T)   pro každý naměřený den',
            ],
        },
        {
            key: 'shear',
            kicker: en ? 'Lifted to hub height' : 'Přepočet na výšku rotoru',
            title: en ? `Hellmann wind shear · ${f(zRef.value, 2)} m → ${f(s.hubHeightM, 1)} m` : `Hellmannův výškový profil · ${f(zRef.value, 2)} m → ${f(s.hubHeightM, 1)} m`,
            value: f(cu(vHub.value, 1), 2),
            unit: 'm/s',
            color: '#8ec5ff',
            meta: isSheltered.value
                ? en
                    ? 'mean wind at hub · sheltered courtyard, effective reference height 1.55 m'
                    : 'průměrný vítr v ose rotoru · závětří dvora, efektivní výška 1,55 m'
                : en
                  ? 'mean wind at the rotor hub'
                  : 'průměrný vítr v ose rotoru',
            chips: [
                { label: en ? 'Speed' : 'Rychlost', value: `×${f(cu(s.shearMultiplierSpeed, 1), 2)}` },
                { label: en ? 'Power (v³)' : 'Výkon (v³)', value: `×${f(cu(s.shearMultiplierPower, 1), 2)}`, accent: '#8ec5ff' },
                { label: 'α', value: f(0.28, 2) },
            ],
            formula: [
                `v_{hub} = v_{ref} · (z_{hub} / z_{ref})^{α}`,
                `= v_{ref} · (${f(s.hubHeightM, 1)} / ${f(zRef.value, 2)})^{${f(0.28, 2)}}`,
                en ? 'α = 0.28 · ČSN EN 1991-1-4, terrain cat. III' : 'α = 0,28 · ČSN EN 1991-1-4, kat. terénu III',
            ],
        },
        {
            key: 'rotor',
            kicker: en ? 'Rotor physics' : 'Fyzika rotoru',
            title: en ? `${s.quantity}× ${s.system.shortName} · ${f(s.system.turbineCountPerUnit * s.quantity)} rotors` : `${s.quantity}× ${s.system.shortName} · ${f(s.system.turbineCountPerUnit * s.quantity)} rotorů`,
            value: f(cu(sweptArea.value, 2), 2),
            unit: 'm²',
            color: '#34d399',
            meta: en ? 'total swept area of all rotors' : 'celková průtočná plocha všech rotorů',
            chips: [
                { label: 'c_P (CFD)', value: f(s.activeCp, 3), accent: '#34d399' },
                { label: 'η_array', value: f(s.system.arrayWakeEfficiency, 2) },
                { label: 'η_el', value: f(0.88, 2) },
                { label: 'P_nom', value: `${f(nominalWindKw.value, 1)} kW` },
            ],
            formula: [
                'P = ½ · ρ · A · v^{3} · c_{P} · η_{el} · η_{array}   ≤ P_{nom}',
                en ? 'day = 14 h · P(v̄) + 7 h · P(v_{conv}) + 3 h · P(v_{gust})' : 'den = 14 h · P(v̄) + 7 h · P(v_{konv}) + 3 h · P(v_{náraz})',
            ],
        },
        {
            key: 'wind',
            kicker: en ? 'Wind energy' : 'Energie z větru',
            title: en ? `${f(s.campaignWindKwh, 1)} kWh in ${f(s.campaignDays)} measured days` : `${f(s.campaignWindKwh, 1)} kWh za ${f(s.campaignDays)} naměřených dní`,
            value: f(cu(s.annualWindKwh, 3)),
            unit: en ? 'kWh / yr' : 'kWh / rok',
            color: '#8ec5ff',
            meta: en ? 'annualised wind yield' : 'roční výroba z větru',
            chips: [{ label: en ? 'Seasonal factor' : 'Sezónní faktor', value: `×${f(1.18, 2)}` }],
            formula: [`E_{wind} = ${f(s.campaignWindKwh, 1)} kWh / ${f(s.campaignDays)} d × 365 × ${f(1.18, 2)}`],
        },
        {
            key: 'solar',
            kicker: en ? 'Solar leaves' : 'Solární listy',
            title: en ? `${f(kWp.value, 2)} kWp TopCon canopy` : `${f(kWp.value, 2)} kWp koruna TopCon`,
            value: f(cu(s.annualSolarKwh, 4)),
            unit: en ? 'kWh / yr' : 'kWh / rok',
            color: '#fbbf24',
            meta: en ? 'PVGIS specific yield × 3D canopy factor' : 'měrná výroba PVGIS × faktor 3D koruny',
            chips: [
                { label: 'η_canopy', value: f(s.system.solarCanopyFactor, 2), accent: '#fbbf24' },
                { label: en ? 'Specific yield' : 'Měrná výroba', value: `${f(1085, 0)} kWh/kWp` },
            ],
            formula: [`E_{sun} = ${f(kWp.value, 2)} kWp × ${f(1085, 0)} kWh/kWp × ${f(s.system.solarCanopyFactor, 2)}`],
        },
        {
            key: 'money',
            kicker: en ? 'Energy & money' : 'Energie a peníze',
            title: en ? `${tr(props.variant.title, L.value)} · ${tr(props.entry.title, L.value)}` : `${tr(props.variant.title, L.value)} · ${tr(props.entry.title, L.value)}`,
            value: f(cu(s.annualTotalKwh, 5)),
            unit: en ? 'kWh / yr' : 'kWh / rok',
            color: '#ffffff',
            meta: en ? 'total yearly production, wind + sun' : 'celková roční výroba, vítr + slunce',
            chips: [
                { label: en ? 'Savings / yr' : 'Úspora / rok', value: czk(cu(s.annualSavingsCzk, 5), L.value), accent: '#34d399' },
                { label: en ? `Net CAPEX (−${f(s.subsidyPct)} % grant)` : `Investice po dotaci ${f(s.subsidyPct)} %`, value: czk(cu(s.netCapexAfterSubsidyCzk, 5), L.value) },
                { label: en ? 'Payback' : 'Návratnost', value: `${f(cu(s.paybackYears, 5), 1)} ${en ? 'yrs' : 'let'}`, accent: '#8ec5ff' },
            ],
            formula: [
                `${f(s.annualTotalKwh)} kWh × ${f(s.electricityTariffCzkPerKwh, 1)} ${en ? 'CZK/kWh' : 'Kč/kWh'} = ${czk(s.annualSavingsCzk, L.value)}`,
                en ? 'payback: Σ E_{t} · tariff · 1.03^{t−1} ≥ CAPEX_{net}' : 'návratnost: Σ E_{t} · tarif · 1,03^{t−1} ≥ CAPEX_{net}',
                en ? 'PV degradation −2 % yr 1, −0.55 %/yr after' : 'degradace FVE −2 % 1. rok, dále −0,55 %/rok',
            ],
        },
    ];
});
</script>

<template>
    <ol class="relative">
        <!-- Rail -->
        <span class="absolute top-4 bottom-4 left-[15px] w-px bg-white/10" aria-hidden="true"></span>
        <span
            class="absolute top-4 bottom-4 left-[15px] w-px origin-top bg-gradient-to-b from-[#8ec5ff] via-[#34d399] to-white shadow-[0_0_10px_rgba(142,197,255,0.7)]"
            :style="{ transform: `scaleY(${railP})` }"
            aria-hidden="true"
        ></span>

        <li
            v-for="(s, i) in steps"
            :key="s.key"
            class="relative grid gap-4 pb-10 pl-12 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-8 md:pb-12"
        >
            <!-- Node -->
            <span
                class="absolute top-0 left-0 flex h-[31px] w-[31px] items-center justify-center rounded-full border font-mono text-[11px] tabular-nums transition-all duration-500"
                :class="stepP(i) > 0 ? 'border-transparent text-zinc-950' : 'border-white/15 bg-zinc-950 text-white/40'"
                :style="stepP(i) > 0 ? { background: s.color, boxShadow: `0 0 18px ${s.color}88` } : undefined"
            >
                {{ String(i + 1).padStart(2, '0') }}
            </span>

            <div class="min-w-0" :style="{ opacity: 0.25 + 0.75 * stepP(i) }">
                <p class="text-[11px] font-medium tracking-[0.2em] uppercase" :style="{ color: s.color }">{{ s.kicker }}</p>
                <p class="mt-1.5 text-sm text-white/60">{{ s.title }}</p>
                <p class="mt-3 text-[2.25rem] leading-none font-medium tracking-[-0.04em] text-white tabular-nums sm:text-5xl">
                    {{ s.value }}<span class="ml-2 text-base tracking-normal text-white/40 sm:text-lg">{{ s.unit }}</span>
                </p>
                <p class="mt-2 text-xs text-white/45">{{ s.meta }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                    <span
                        v-for="c in s.chips"
                        :key="c.label"
                        class="inline-flex items-baseline gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs"
                    >
                        <span class="text-white/45">
                            <template v-for="(tk, j) in tokens(c.label.replace(/_([a-z]+)/i, '_{$1}'))" :key="j">
                                <sub v-if="tk.k === 'sub'">{{ tk.t }}</sub>
                                <template v-else>{{ tk.t }}</template>
                            </template>
                        </span>
                        <span class="font-medium tabular-nums" :style="{ color: c.accent ?? '#fff' }">{{ c.value }}</span>
                    </span>
                </div>
            </div>

            <div
                class="self-start rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-opacity duration-700"
                :style="{ opacity: stepP(i) > 0.3 ? 1 : 0.2 }"
            >
                <p class="text-[10px] font-medium tracking-[0.2em] text-white/35 uppercase">{{ isEn ? 'Formula' : 'Výpočet' }}</p>
                <p
                    v-for="(line, j) in s.formula"
                    :key="j"
                    class="mt-2 font-mono text-[12px] leading-relaxed break-words"
                    :class="j === 0 ? 'text-white/85' : 'text-white/50'"
                >
                    <template v-for="(tk, k) in tokens(line)" :key="k">
                        <sub v-if="tk.k === 'sub'" class="text-[0.8em]">{{ tk.t }}</sub>
                        <sup v-else-if="tk.k === 'sup'" class="text-[0.8em]">{{ tk.t }}</sup>
                        <template v-else>{{ tk.t }}</template>
                    </template>
                </p>
            </div>
        </li>
    </ol>
</template>
