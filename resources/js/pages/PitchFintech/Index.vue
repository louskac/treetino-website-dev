<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Download, Maximize, NotebookText } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LogoType from '@/custom/LogoType.vue';
import InvestorPaymentScene from '@/custom/investors/InvestorPaymentScene.vue';
import PitchEuropeMap from '@/custom/pitch/PitchEuropeMap.vue';
import PitchHeadline from '@/custom/pitch/PitchHeadline.vue';
import '@/custom/pitch/deck.css';

/**
 * Treetino × Tapaya — unattended EV charger payments, partnership outline (/pitch-fintech).
 * Same presentation system as /pitch and /pitch-hackathon: fixed 1920×1080 slides scaled to the
 * screen, printed one slide per page. Design rule for this deck: one idea per slide, white type,
 * a single blue accent. Presenter-only extras (never printed): notes + timer (N / T).
 * Slide 15 holds an interactive revenue-split calculator; its defaults are what the PDF shows.
 */

const TOTAL = 21;
const CALC = 14; // zero-based index of the calculator slide
const TALK_SECONDS = 900;

const current = ref(0);
const scale = ref(1);
const uiVisible = ref(false);
const showNotes = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');

const go = (i: number) => {
    current.value = Math.max(0, Math.min(TOTAL - 1, i));
    history.replaceState(null, '', `#${current.value + 1}`);
};
const next = () => go(current.value + 1);
const prev = () => go(current.value - 1);

const state = (i: number) => ({ 'is-active': current.value === i });

const fit = () => {
    scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
};

const downloadPdf = () => {
    const a = document.createElement('a');
    a.href = `/treetino-fintech-pitchdeck.pdf?v=${Date.now()}`;
    a.download = 'Treetino-x-Tapaya-Partnership-Outline.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
};

// ---------- Revenue-split calculator (slide 15) ----------
const EUR_CZK = 25;
const chargerSteps = [1, 2, 5, 10, 25, 50, 100, 250, 760, 1500, 3800, 7600, 11500];
const chargerIdx = ref(6); // 100 chargers
const sessions = ref(1.7);
const ticket = ref(330);
const schemePct = ref(0.75);
const tapayaPct = ref(1.0);
const treetinoPct = ref(1.0);

const presets = [
    { label: 'First school', idx: 1 },
    { label: 'Year one', idx: 5 },
    { label: '10% of Czechia', idx: 8 },
    { label: '1% of the EU', idx: 12 },
];

const chargers = computed(() => chargerSteps[chargerIdx.value]);
const volume = computed(() => chargers.value * sessions.value * ticket.value * 365);
const feePct = computed(() => schemePct.value + tapayaPct.value + treetinoPct.value);

const parties = computed(() => {
    const v = volume.value;

    return [
        { key: 'treetino', name: 'Treetino', pct: treetinoPct.value, amount: (v * treetinoPct.value) / 100, color: '#4d8dff' },
        { key: 'tapaya', name: 'Tapaya', pct: tapayaPct.value, amount: (v * tapayaPct.value) / 100, color: 'rgba(255,255,255,0.72)' },
        {
            key: 'scheme',
            name: 'Visa / Mastercard + acquiring',
            pct: schemePct.value,
            amount: (v * schemePct.value) / 100,
            color: 'rgba(255,255,255,0.3)',
        },
    ];
});

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
const czk = (n: number) => `${compact.format(n)} Kč`;
const eur = (n: number) => `€${compact.format(n / EUR_CZK)}`;
const pctFill = (v: number, min: number, max: number) => ({ '--p': `${((v - min) / (max - min)) * 100}%` });

// ---------- Rehearsal timer ----------
const timerSeconds = ref(TALK_SECONDS);
const timerRunning = ref(false);
let timerInterval: ReturnType<typeof setInterval> | undefined;

const formattedTimer = computed(() => `${Math.floor(timerSeconds.value / 60)}:${pad(timerSeconds.value % 60)}`);

const toggleTimer = () => {
    if (timerRunning.value) {
        clearInterval(timerInterval);
        timerRunning.value = false;

        return;
    }

    timerRunning.value = true;
    timerInterval = setInterval(() => {
        if (timerSeconds.value > 0) {
            timerSeconds.value--;
        } else {
            clearInterval(timerInterval);
            timerRunning.value = false;
        }
    }, 1000);
};

const resetTimer = () => {
    clearInterval(timerInterval);
    timerRunning.value = false;
    timerSeconds.value = TALK_SECONDS;
};

const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;

    // Sliders own their arrow keys; focused buttons own Space/Enter.
    if (target?.tagName === 'INPUT') {
        return;
    }

    if (target?.tagName === 'BUTTON' && [' ', 'Enter'].includes(e.key)) {
        return;
    }

    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(e.key)) {
        e.preventDefault();
        next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        prev();
    } else if (e.key === 'Home') {
        go(0);
    } else if (e.key === 'End') {
        go(TOTAL - 1);
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    } else if (e.key === 'n' || e.key === 'N') {
        showNotes.value = !showNotes.value;
    } else if (e.key === 't' || e.key === 'T') {
        toggleTimer();
    } else if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey) {
        downloadPdf();
    }
};

let idle: ReturnType<typeof setTimeout> | undefined;
const onMove = () => {
    uiVisible.value = true;
    clearTimeout(idle);
    idle = setTimeout(() => (uiVisible.value = false), 2200);
};

let touchX = 0;
const onTouchStart = (e: TouchEvent) => (touchX = e.touches[0].clientX);
const onTouchEnd = (e: TouchEvent) => {
    if (current.value === CALC) {
        return;
    }

    const dx = e.changedTouches[0].clientX - touchX;

    if (Math.abs(dx) > 50) {
        if (dx < 0) {
            next();
        } else {
            prev();
        }
    }
};

onMounted(() => {
    const fromHash = parseInt(location.hash.replace('#', ''), 10);

    if (fromHash >= 1 && fromHash <= TOTAL) {
        current.value = fromHash - 1;
    }

    document.documentElement.classList.add('pitch-mode');
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMove);
});

onUnmounted(() => {
    document.documentElement.classList.remove('pitch-mode');
    window.removeEventListener('resize', fit);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('mousemove', onMove);
    clearTimeout(idle);
    clearInterval(timerInterval);
});

const stageStyle = computed(() => ({
    transform: `translate(-50%, -50%) scale(${scale.value})`,
}));

/** Speaker script, one entry per slide. */
const notes = [
    {
        time: 'Open',
        script: 'Thanks for having us. This isn’t an investor pitch — it’s our proposal for how Treetino and Tapaya could build unattended EV payments together. Story first, then the hardware, who brings what, the numbers, and a realistic timeline.',
    },
    {
        time: 'Story',
        script: 'Picture this. It’s raining, your battery is almost empty, you finally find a charger — and it asks you to download an app. Register. Add a card. Find signal. Every EV driver in Europe knows this moment.',
    },
    {
        time: 'Story',
        script: 'Europe decided this has to end. Under AFIR, new public fast chargers must accept card payments without an app or registration, and existing fast chargers on the main corridors must be retrofitted. It’s not a nice-to-have anymore.',
    },
    {
        time: 'Story',
        script: 'Online payments are easy — a QR code and a web page. A terminal standing outside, alone, in the rain, is a different world. Visa and Mastercard call it unattended: certified outdoor hardware, special scheme approval, and an amount nobody knows until the car is full.',
    },
    {
        time: 'Story',
        script: 'That’s why the market is empty. Charger makers build power electronics and don’t want to touch card schemes. Payment companies build terminals for shops and don’t understand kilowatt-hours. Nobody owns the gap.',
    },
    {
        time: 'Proposal',
        script: 'So here is the proposal: close that gap together. Tapaya’s regulated payment rails inside Treetino’s tree-shaped charger. One product, launched together, starting at one school in Prague within weeks.',
    },
    {
        time: 'Product',
        script: 'For the driver it’s three moments. Tap any card or phone — a small hold. Charge — every kWh read live from the charger. Unplug — exact capture, the rest released. Tapaya’s API already supports pre-auth, incremental auth and partial capture, which is exactly what EV needs.',
    },
    {
        time: 'Product',
        script: 'And it’s not a slide. We built the flow at The FinTechers Hackathon in 30 hours: the charger screen, live metering, and settlement to the site owner the moment the car unplugs.',
    },
    {
        time: 'Hardware',
        script: 'The hardware is deliberately boring where it should be: a SUNMI Android device — SUNMI is the Xiaomi-backed POS maker Tapaya distributes — with Tapaya’s Accept SDK preinstalled and the NFC reader at hand height. Around it, our sealed trunk enclosure, and an OCPP / Victron link so the terminal knows every kWh. The exact outdoor-certified model is Tapaya’s call.',
    },
    {
        time: 'Treetino',
        script: 'What we bring: a product people stop to photograph. A distribution engine — our energy arm has delivered 23+ MW, with €705k signed and €3.4M in letters of intent. Infrastructure partners — including peaq — who run other unattended outdoor assets that need revenue split per tap. And a first site that can go live within weeks.',
    },
    {
        time: 'Treetino',
        script: 'The first one goes in at a Prague high school we work with closely. The site is being built right now. Real cards, real cars, real data — and a story: students tapping a card on a tree.',
    },
    {
        time: 'Tapaya',
        script: 'What Tapaya brings: regulated payments — PCI MPoC SoftPOS, Visa, Mastercard and Amex, and acquiring through its partners. The SUNMI hardware channel. A strong fintech network — Mastercard Lighthouse, the new Nets Baltics partnership, Passion Capital behind them. And the Visa relationship that unattended approval and co-marketing need.',
    },
    {
        time: 'Visa',
        script: 'And this is the picture Visa gets: a tree that takes Visa. Visually impossible to scroll past, technically a first for unattended payments. Visa gets a contactless story at the charger, Tapaya a flagship unattended reference, Treetino a brand every host wants.',
    },
    {
        time: 'Market',
        script: 'The market: 7,574 public charging points across 3,738 stations in Czechia — ČEZ runs 1,000+ stations and PRE nearly 930 — and 1.15 million points across the EU. In 2025, ČEZ and PRE averaged 1.7 sessions per station per day (over 600k sessions on ČEZ, 565k on PRE), and 23.2 to 24 kWh per session. At ad-hoc card tariffs, an average session is around 330 Kč — roughly €9.4 billion a year across Europe and €62 million in Czechia.',
    },
    {
        time: 'Numbers',
        script: 'This is the split, live. Volume on the left: chargers, sessions, ticket. Split below: scheme and acquiring cost, Tapaya, Treetino. Everything else stays with the site owner. These are starting assumptions for discussion — move the sliders, let’s find a split that works for both of us.',
    },
    {
        time: 'Numbers',
        script: 'The transaction fee is only the start. Hardware kits with a margin, premium branding tiers using Tapaya’s white-label theming, installation by our EPC crews, and the biggest lever: retrofitting tap-to-pay into chargers already standing in PRE and ČEZ networks.',
    },
    {
        time: 'Traction',
        script: 'Neither of us is starting from zero. On our side: €705k in signed tree contracts, €3.4M in letters of intent from a single expo, backed by CzechInvest and SIC, and a signed MoU with peaq to fund our first Prague hub. On Tapaya’s side: €1M raised from Passion Capital, DEPO Ventures and BADideas.fund, PCI MPoC SoftPOS live in the field, Mastercard Lighthouse FINITIV 2026, and the Nets Baltics partnership launching across Estonia, Latvia and Lithuania.',
    },
    {
        time: 'Plan',
        script: 'The plan. November: Tapaya’s pre-approval with the schemes, terminal availability, our SDK integration. December–January: the first tree live at the school. Spring 2027: the certified unattended terminal and the Visa story. Second half of 2027: PRE / ČEZ retrofit pilot and the first fifty chargers. 2028: Europe, through Tapaya’s markets.',
    },
    {
        time: 'Plan',
        script: 'Honest expectations. The first six months are about proof, not revenue. Here is what each of us commits to, and what success looks like by spring: one tree taking real cards, a confirmed scheme path, a signed split, and the next sites lined up.',
    },
    {
        time: 'Team',
        script: 'Why us. I shipped card payments that open physical doors across Czech schools and municipalities. Dominik has built 23+ MW of energy and charging infrastructure. We’ve done both halves of this before.',
    },
    {
        time: 'Close',
        script: 'Let’s plant the first one. Next steps: intro with Monika, terminal availability, the scheme pre-approval, and a date at the school. Every charger in Europe — every card. Thank you.',
    },
];
</script>

<template>
    <Head title="Treetino × Tapaya — unattended EV charger payments, partnership outline" />

    <div class="pitch-deck deck-viewport" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div class="deck-stage" :style="stageStyle">
            <!-- 01 · COVER -->
            <section class="slide" :class="state(0)">
                <div class="img-in absolute inset-0" style="--d: 0ms">
                    <PitchEuropeMap :cx="292" :cy="322" :w="330" />
                </div>
                <div
                    class="absolute inset-0"
                    style="
                        background:
                            linear-gradient(90deg, #09090b 8%, rgba(9, 9, 11, 0.75) 38%, rgba(9, 9, 11, 0) 72%),
                            linear-gradient(0deg, #09090b 0%, rgba(9, 9, 11, 0) 35%),
                            radial-gradient(ellipse 60% 70% at 72% 40%, rgba(24, 61, 137, 0.35), transparent 70%);
                    "
                ></div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[88px] pb-[112px]">
                    <div class="rise flex items-center justify-between" style="--d: 0ms">
                        <LogoType className="!h-[44px] w-auto fill-current text-white" />
                        <span class="text-[22px] text-white/45">Treetino × Tapaya · Partnership outline · 2026</span>
                    </div>

                    <div>
                        <PitchHeadline
                            tag="h1"
                            class="h-display"
                            :delay="200"
                            :segments="[
                                { text: 'Tap a card.', break: true },
                                { text: 'Charge a car.', tone: 'accent' },
                            ]"
                        />
                        <p class="rise mt-[56px] text-[28px] tracking-[-0.01em] text-white/55" style="--d: 900ms">
                            How Treetino and Tapaya can bring unattended card payments to Europe’s EV chargers.
                        </p>
                    </div>
                </div>
            </section>

            <!-- 02 · THE MOMENT -->
            <section class="slide" :class="state(1)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(2) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-center px-[128px]">
                    <PitchHeadline
                        class="h-display"
                        :stagger="90"
                        :segments="[
                            { text: 'It’s raining.', break: true },
                            { text: 'Your battery is at 4%.', break: true },
                            { text: 'The charger wants an app.', tone: 'accent' },
                        ]"
                    />
                    <p class="sub rise mt-[64px] max-w-[44ch]" style="--d: 1100ms">
                        Download. Register. Add a card. Find signal. Every EV driver in Europe knows this moment.
                    </p>
                </div>
            </section>

            <!-- 03 · THE LAW -->
            <section class="slide" :class="state(2)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(3) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">EU regulation · AFIR</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'Europe made card payment', break: true },
                                { text: 'the law.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="stats">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">Apr 2024</p>
                            <p class="stat-label">New public fast chargers must accept cards</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">2027</p>
                            <p class="stat-label">Existing fast chargers on main corridors must retrofit</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">No app</p>
                            <p class="stat-label">Ad-hoc payment, no account, no registration</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 04 · WHY IT'S HARD -->
            <section class="slide" :class="state(3)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(4) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'Online payments are easy.', break: true },
                            { text: 'Outdoor ones aren’t.', tone: 'accent' },
                        ]"
                    />

                    <div class="grid grid-cols-2 gap-[96px]">
                        <div class="rise" style="--d: 450ms">
                            <p class="eyebrow">A QR code needs</p>
                            <p class="mt-[16px] text-[44px] leading-[1.1] font-medium tracking-[-0.03em] text-white/45">
                                A web page.
                            </p>
                            <ul class="spec mt-[40px] text-white/40">
                                <li>Easy to build</li>
                                <li>Painful in the rain, without signal</li>
                                <li>Not enough for AFIR fast chargers</li>
                            </ul>
                        </div>
                        <div class="rise" style="--d: 600ms">
                            <p class="eyebrow !text-[#8ec5ff]">An unattended terminal needs</p>
                            <p class="mt-[16px] text-[44px] leading-[1.1] font-medium tracking-[-0.03em]">
                                Much more.
                            </p>
                            <ul class="spec mt-[40px] text-white/75">
                                <li>Certified outdoor, vandal-proof hardware</li>
                                <li>Special Visa &amp; Mastercard approval</li>
                                <li>An amount nobody knows until the car is full</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 05 · THE GAP -->
            <section class="slide" :class="state(4)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(5) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-center px-[128px]">
                    <PitchHeadline
                        class="h-slide"
                        :stagger="80"
                        :segments="[
                            { text: 'Charger makers do hardware.', break: true },
                            { text: 'Payment firms do shops.', break: true },
                            { text: 'Nobody owns the gap.', tone: 'accent' },
                        ]"
                    />
                    <p class="sub rise mt-[64px] max-w-[46ch]" style="--d: 1000ms">
                        Unattended EV payments sit exactly in between. Today, no one is building them.
                    </p>
                </div>
            </section>

            <!-- 06 · THE PROPOSAL -->
            <section class="slide" :class="state(5)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(6) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-center px-[128px]">
                    <p class="eyebrow rise" style="--d: 0ms">Treetino × Tapaya</p>
                    <PitchHeadline
                        class="h-display mt-[28px]"
                        :segments="[
                            { text: 'Let’s close the gap', break: true },
                            { text: 'together.', tone: 'accent' },
                        ]"
                    />
                    <p class="sub rise mt-[64px] max-w-[48ch]" style="--d: 800ms">
                        Tapaya’s regulated payment rails inside Treetino’s tree-shaped charger. One product, launched
                        together — starting with one school in Prague.
                    </p>
                </div>
            </section>

            <!-- 07 · HOW IT WORKS -->
            <section class="slide" :class="state(6)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(7) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div
                    class="img-in no-callouts pointer-events-none absolute top-[120px] right-[48px] bottom-[80px] w-[860px]"
                    style="--d: 200ms"
                >
                    <InvestorPaymentScene :tap="1" :settle="0" :scale="0" :orbit="0.15" :active="true" />
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide max-w-[14ch]"
                        :segments="[
                            { text: 'Tap. Charge.', break: true },
                            { text: 'Pay for exactly', tone: 'accent', break: true },
                            { text: 'what you used.', tone: 'accent' },
                        ]"
                    />

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">Tap</p>
                            <p class="stat-label">Any card or phone, small hold</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">Charge</p>
                            <p class="stat-label">Every kWh read live</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">Unplug</p>
                            <p class="stat-label">Exact amount, rest released</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 08 · WE BUILT IT -->
            <section class="slide" :class="state(7)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(8) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="img-in absolute top-[150px] right-[200px] bottom-[110px] w-[500px]" style="--d: 250ms">
                    <div class="kiosk flex h-full flex-col justify-between">
                        <div class="flex items-center justify-between">
                            <LogoType className="!h-[22px] w-auto fill-current text-white/80" />
                            <span class="text-[18px] text-white/40">Bay 01</span>
                        </div>

                        <div>
                            <p class="text-[56px] leading-[1.05] font-medium tracking-[-0.04em]">You’re charged.</p>
                            <p class="tone-accent text-[56px] leading-[1.05] font-medium tracking-[-0.04em]">721 Kč paid.</p>
                        </div>

                        <div class="grid grid-cols-3 border-t border-white/10 pt-[24px]">
                            <div>
                                <p class="text-[16px] text-white/40">Energy</p>
                                <p class="mt-[6px] text-[30px] font-medium tabular-nums">68 kWh</p>
                            </div>
                            <div>
                                <p class="text-[16px] text-white/40">Range</p>
                                <p class="mt-[6px] text-[30px] font-medium tabular-nums">+410 km</p>
                            </div>
                            <div>
                                <p class="text-[16px] text-white/40">Paid</p>
                                <p class="mt-[6px] text-[30px] font-medium tabular-nums">721 Kč</p>
                            </div>
                        </div>

                        <div class="rounded-[20px] border border-white/10 px-[24px] py-[20px]">
                            <p class="text-[22px] font-medium">Approved · Visa •••• 4242</p>
                            <p class="mt-[4px] text-[17px] text-white/45">Unused hold released · receipt on your phone</p>
                        </div>
                    </div>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Built at The FinTechers Hackathon</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'We already built it.', break: true },
                                { text: 'In 30 hours.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="flex w-[640px] flex-col gap-[40px]">
                        <div class="rise border-t border-white/10 pt-[28px]" style="--d: 650ms">
                            <p class="stat-value">Live metering</p>
                            <p class="stat-label">Every kWh read from the charger as it flows</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[28px]" style="--d: 750ms">
                            <p class="stat-value">Instant payout</p>
                            <p class="stat-label">The site owner is paid the moment the car unplugs</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 09 · THE HARDWARE -->
            <section class="slide" :class="state(8)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(9) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full gap-[96px] px-[128px] pt-[200px] pb-[112px]">
                    <div class="flex w-[760px] shrink-0 flex-col justify-between">
                        <div>
                            <p class="eyebrow rise" style="--d: 0ms">The hardware</p>
                            <PitchHeadline
                                class="h-slide mt-[28px]"
                                :segments="[
                                    { text: 'Proven hardware.', break: true },
                                    { text: 'A tree around it.', tone: 'accent' },
                                ]"
                            />
                        </div>
                        <p class="rise max-w-[36ch] text-[26px] leading-[1.5] text-white/55" style="--d: 700ms">
                            SUNMI — the Xiaomi-backed Android POS maker — ships through Tapaya with the payment app
                            preinstalled. Tapaya confirms the outdoor-certified model.
                        </p>
                    </div>

                    <ol class="layers flex-1 self-center">
                        <li class="rise" style="--d: 300ms">
                            <span>Screen &amp; reader</span>
                            <p>SUNMI Android display, contactless reader at hand height</p>
                        </li>
                        <li class="rise" style="--d: 400ms">
                            <span>Payment brain</span>
                            <p>Tapaya Accept SDK — hold, live top-ups, exact capture</p>
                        </li>
                        <li class="rise" style="--d: 500ms">
                            <span>Meter link</span>
                            <p>OCPP / Victron — the terminal knows every kWh</p>
                        </li>
                        <li class="rise" style="--d: 600ms">
                            <span>Enclosure</span>
                            <p>Sealed, vandal-resistant housing inside the trunk</p>
                        </li>
                        <li class="rise is-accent" style="--d: 700ms">
                            <span>Brand</span>
                            <p>White-label screen in the host’s colours</p>
                        </li>
                    </ol>
                </div>
            </section>

            <!-- 10 · WHAT TREETINO BRINGS -->
            <section class="slide" :class="state(9)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(10) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">What Treetino brings</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'The charger.', break: true },
                                { text: 'And where it goes.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="cols-4">
                        <div class="rise" style="--d: 500ms">
                            <p class="num">01</p>
                            <p class="col-title">The product</p>
                            <p class="col-body">A tree-shaped solar EV charger people stop to photograph. Payment flow already built.</p>
                        </div>
                        <div class="rise" style="--d: 600ms">
                            <p class="num">02</p>
                            <p class="col-title">Distribution</p>
                            <p class="col-body">23+ MW delivered by our energy arm. €705k signed, €3.4M in letters of intent.</p>
                        </div>
                        <div class="rise" style="--d: 700ms">
                            <p class="num">03</p>
                            <p class="col-title">Revenue-share partners</p>
                            <p class="col-body">
                                Partners like peaq run other unattended outdoor assets that split revenue per tap. Same
                                rails, more devices.
                            </p>
                        </div>
                        <div class="rise" style="--d: 800ms">
                            <p class="num">04</p>
                            <p class="col-title">A first site</p>
                            <p class="col-body">A Prague school we work closely with. Ready to go live within weeks.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 11 · FIRST SITE -->
            <section class="slide" :class="state(10)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(11) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="img-in absolute top-[150px] right-[128px] bottom-[112px] w-[620px]" style="--d: 200ms">
                    <div class="photo !aspect-auto h-full">
                        <img src="/img/im/prague-high-school-v2-site.jpg" alt="School site in Prague" />
                    </div>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">First installation · Prague</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :stagger="80"
                            :segments="[
                                { text: 'First tree.', break: true },
                                { text: 'First taps.', break: true },
                                { text: 'At a school.', tone: 'accent' },
                            ]"
                        />
                    </div>
                    <p class="sub rise max-w-[30ch]" style="--d: 700ms">
                        The site is being built right now. Real cards, real cars, real data — within weeks, not years.
                    </p>
                </div>
            </section>

            <!-- 12 · WHAT TAPAYA BRINGS -->
            <section class="slide" :class="state(11)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(12) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">What Tapaya brings</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'The rails.', break: true },
                                { text: 'And the right doors.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="cols-4">
                        <div class="rise" style="--d: 500ms">
                            <p class="num">01</p>
                            <p class="col-title">Regulated payments</p>
                            <p class="col-body">PCI MPoC SoftPOS. Visa, Mastercard and Amex. Acquiring and merchant onboarding.</p>
                        </div>
                        <div class="rise" style="--d: 600ms">
                            <p class="num">02</p>
                            <p class="col-title">SUNMI hardware</p>
                            <p class="col-body">Channel partner of the Xiaomi-backed POS maker. Devices arrive ready to take cards.</p>
                        </div>
                        <div class="rise" style="--d: 700ms">
                            <p class="num">03</p>
                            <p class="col-title">Fintech network</p>
                            <p class="col-body">Mastercard Lighthouse. Nets Baltics partnership. Backed by Passion Capital.</p>
                        </div>
                        <div class="rise" style="--d: 800ms">
                            <p class="num">04</p>
                            <p class="col-title">Visa relationship</p>
                            <p class="col-body">Close contacts for scheme approval of unattended EV — and for co-marketing.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 13 · VISA -->
            <section class="slide" :class="state(12)">
                <div class="img-in absolute inset-y-0 right-[-160px] w-[1340px]" style="--d: 0ms">
                    <img src="/img/hero-v1-cinematic.png" alt="Treetino tree" class="h-full w-full object-cover" />
                </div>
                <div class="product-fade"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(13) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Co-marketing · with Visa, via Tapaya</p>
                        <PitchHeadline
                            class="h-display mt-[28px]"
                            :segments="[
                                { text: 'A tree that', break: true },
                                { text: 'takes Visa.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <ul class="spec w-[640px] text-white/70">
                        <li class="rise" style="--d: 700ms"><b class="font-medium text-white">Visa</b> — a contactless story at the charger</li>
                        <li class="rise" style="--d: 800ms"><b class="font-medium text-white">Tapaya</b> — a flagship unattended reference</li>
                        <li class="rise" style="--d: 900ms"><b class="font-medium text-white">Treetino</b> — a charger every host wants</li>
                    </ul>
                </div>
            </section>

            <!-- 14 · MARKET -->
            <section class="slide" :class="state(13)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(14) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">The market</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'Small at home.', break: true },
                                { text: 'Huge across Europe.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div>
                        <div class="stats-4">
                            <div class="rise" style="--d: 500ms">
                                <p class="stat-value">7,574</p>
                                <p class="stat-label">Public points in Czechia (3,738 stations · ČEZ 1,000+, PRE 928)</p>
                            </div>
                            <div class="rise" style="--d: 600ms">
                                <p class="stat-value tone-accent">1.15M</p>
                                <p class="stat-label">Public charging points across the EU (81% AC, 19% DC)</p>
                            </div>
                            <div class="rise" style="--d: 700ms">
                                <p class="stat-value">1.7 / day</p>
                                <p class="stat-label">Avg. sessions per station (ČEZ 600k+ &amp; PRE 565k in 2025)</p>
                            </div>
                            <div class="rise" style="--d: 800ms">
                                <p class="stat-value">≈330 Kč</p>
                                <p class="stat-label">Avg. ad-hoc session: ~24 kWh (ČEZ ’25/’26) × ~14 Kč</p>
                            </div>
                        </div>
                        <p class="rise mt-[48px] text-[24px] text-white/45" style="--d: 950ms">
                            At 1.7 sessions a day and 330 Kč per session, ≈ <span class="text-white">€9.4B a year</span> flows through
                            Europe’s public points — and ≈ <span class="text-white">€62M</span> through Czechia’s.
                        </p>
                    </div>
                </div>
            </section>

            <!-- 15 · REVENUE SPLIT CALCULATOR -->
            <section class="slide" :class="state(14)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(15) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="calc relative flex h-full flex-col px-[128px] pt-[150px] pb-[48px]">
                    <p class="eyebrow">The split · move the sliders</p>
                    <h2 class="h-slide mt-[20px]">How every tap <span class="tone-accent">is shared.</span></h2>

                    <div class="mt-[40px] grid flex-1 grid-cols-[640px_1fr] gap-[112px]">
                        <!-- Inputs -->
                        <div class="flex flex-col gap-[16px]">
                            <div>
                                <div class="row-head">
                                    <span>Chargers</span>
                                    <b>{{ plain.format(chargers) }}</b>
                                </div>
                                <input
                                    v-model.number="chargerIdx"
                                    type="range"
                                    min="0"
                                    :max="chargerSteps.length - 1"
                                    step="1"
                                    :style="pctFill(chargerIdx, 0, chargerSteps.length - 1)"
                                />
                                <div class="mt-[14px] flex gap-[10px]">
                                    <button
                                        v-for="p in presets"
                                        :key="p.label"
                                        type="button"
                                        class="chip"
                                        :class="chargerIdx === p.idx && 'is-on'"
                                        @click="chargerIdx = p.idx"
                                    >
                                        {{ p.label }}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div class="row-head">
                                    <span>Sessions per charger, per day</span>
                                    <b>{{ sessions.toFixed(1) }}</b>
                                </div>
                                <input v-model.number="sessions" type="range" min="0.5" max="10" step="0.1" :style="pctFill(sessions, 0.5, 10)" />
                            </div>
                            <div>
                                <div class="row-head">
                                    <span>Average session</span>
                                    <b>{{ ticket }} Kč</b>
                                </div>
                                <input v-model.number="ticket" type="range" min="100" max="800" step="10" :style="pctFill(ticket, 100, 800)" />
                            </div>

                            <div class="mt-[8px] border-t border-white/10"></div>

                            <div>
                                <div class="row-head">
                                    <span>Visa / Mastercard + acquiring</span>
                                    <b>{{ schemePct.toFixed(2) }}%</b>
                                </div>
                                <input
                                    v-model.number="schemePct"
                                    type="range"
                                    min="0.2"
                                    max="1.5"
                                    step="0.05"
                                    class="is-scheme"
                                    :style="pctFill(schemePct, 0.2, 1.5)"
                                />
                            </div>
                            <div>
                                <div class="row-head">
                                    <span>Tapaya</span>
                                    <b>{{ tapayaPct.toFixed(1) }}%</b>
                                </div>
                                <input
                                    v-model.number="tapayaPct"
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    class="is-tapaya"
                                    :style="pctFill(tapayaPct, 0, 5)"
                                />
                            </div>
                            <div>
                                <div class="row-head">
                                    <span>Treetino</span>
                                    <b class="!text-[#8ec5ff]">{{ treetinoPct.toFixed(1) }}%</b>
                                </div>
                                <input
                                    v-model.number="treetinoPct"
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    class="is-treetino"
                                    :style="pctFill(treetinoPct, 0, 5)"
                                />
                            </div>
                        </div>

                        <!-- Output -->
                        <div class="flex flex-col">
                            <p class="text-[22px] text-white/45">Card volume per year</p>
                            <p class="mt-[8px] text-[88px] leading-none font-medium tracking-[-0.045em] tabular-nums">
                                {{ czk(volume) }}
                                <span class="text-[36px] tracking-[-0.02em] text-white/40">{{ eur(volume) }}</span>
                            </p>

                            <p class="mt-[44px] text-[20px] text-white/45">
                                Of every 100 Kč tapped, the site owner keeps
                                <span class="text-white">{{ (100 - feePct).toFixed(1) }} Kč</span>
                            </p>
                            <div class="bar mt-[14px] h-[16px]">
                                <div :style="{ width: `${100 - feePct}%`, background: 'rgba(255,255,255,0.1)' }"></div>
                                <div v-for="p in parties" :key="p.key" :style="{ width: `${p.pct}%`, background: p.color }"></div>
                            </div>

                            <p class="mt-[32px] text-[20px] text-white/45">
                                The {{ feePct.toFixed(1) }}% fee pool, zoomed in
                            </p>
                            <div class="bar mt-[14px] h-[52px]">
                                <div
                                    v-for="p in parties"
                                    :key="p.key"
                                    :style="{ width: `${feePct ? (p.pct / feePct) * 100 : 0}%`, background: p.color }"
                                ></div>
                            </div>

                            <div class="mt-[36px] flex flex-col">
                                <div v-for="p in parties" :key="p.key" class="party">
                                    <span class="dot" :style="{ background: p.color }"></span>
                                    <span class="flex-1" :class="p.key === 'treetino' ? 'text-white' : 'text-white/60'">{{ p.name }}</span>
                                    <span class="w-[160px] text-right" :class="p.key === 'treetino' && 'text-[#8ec5ff]'">{{ czk(p.amount) }}</span>
                                    <span class="w-[120px] text-right text-white/40">{{ eur(p.amount) }}</span>
                                </div>
                                <div class="party">
                                    <span class="dot" style="background: rgba(255, 255, 255, 0.1)"></span>
                                    <span class="flex-1 text-white/60">Site owner — energy &amp; margin</span>
                                    <span class="w-[160px] text-right">{{ czk(volume * (1 - feePct / 100)) }}</span>
                                    <span class="w-[120px] text-right text-white/40">{{ eur(volume * (1 - feePct / 100)) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="mt-[20px] text-[17px] text-white/30">
                        Starting assumptions for discussion. Scheme + acquiring cost depends on card mix (EU interchange
                        capped at 0.2% debit / 0.3% credit, plus scheme and processing fees). 1 € = {{ EUR_CZK }} Kč.
                    </p>
                </div>
            </section>

            <!-- 16 · BEYOND THE TAP -->
            <section class="slide" :class="state(15)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(16) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">More revenue, same partnership</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'The tap is', break: true },
                                { text: 'just the beginning.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div>
                        <div class="cols-4">
                            <div class="rise" style="--d: 500ms">
                                <p class="num">01</p>
                                <p class="col-title">Hardware</p>
                                <p class="col-body">Terminal and enclosure kits sold per bay, with a margin for both of us.</p>
                            </div>
                            <div class="rise" style="--d: 600ms">
                                <p class="num">02</p>
                                <p class="col-title">Premium branding</p>
                                <p class="col-body">Custom screen, colours and trunk branding for hosts and sponsors. Monthly tier.</p>
                            </div>
                            <div class="rise" style="--d: 700ms">
                                <p class="num">03</p>
                                <p class="col-title">Installation</p>
                                <p class="col-body">Mounting, wiring and commissioning by our own energy crews. Per site.</p>
                            </div>
                            <div class="rise" style="--d: 800ms">
                                <p class="num tone-accent">04</p>
                                <p class="col-title">PRE &amp; ČEZ retrofit</p>
                                <p class="col-body">
                                    Tap-to-pay for chargers already standing in their networks. No new tree needed.
                                </p>
                            </div>
                        </div>
                        <p class="rise mt-[48px] text-[20px] text-white/35" style="--d: 950ms">
                            Indicative structure — pricing and shares to be agreed together.
                        </p>
                    </div>
                </div>
            </section>

            <!-- 17 · OUR GREATEST WINS SO FAR -->
            <section class="slide" :class="state(16)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(17) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Treetino × Tapaya · traction to date</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'Neither of us is starting', break: true },
                                { text: 'from zero.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-[96px]">
                        <div class="rise" style="--d: 450ms">
                            <p class="eyebrow !text-[#8ec5ff]">Treetino</p>
                            <ul class="spec mt-[24px] text-white/80">
                                <li><b class="font-medium text-white">€705k signed</b> · 3× V1 delivering to MKovo, 2× V2 in construction</li>
                                <li><b class="font-medium text-white">€3.4M in LOIs</b> · from a single expo, backed by CzechInvest &amp; SIC</li>
                                <li><b class="font-medium text-white">23+ MW delivered</b> · MoU signed with peaq Ironyard for Prague hub</li>
                            </ul>
                        </div>
                        <div class="rise" style="--d: 600ms">
                            <p class="eyebrow">Tapaya</p>
                            <ul class="spec mt-[24px] text-white/80">
                                <li><b class="font-medium text-white">€1M pre-seed</b> · led by Passion Capital with DEPO Ventures &amp; BADideas</li>
                                <li><b class="font-medium text-white">3 channels live</b> · PCI MPoC SoftPOS, SUNMI terminals &amp; online gateway</li>
                                <li><b class="font-medium text-white">Mastercard Lighthouse</b> · plus Nets Baltics deal across 3 countries</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 18 · ROADMAP -->
            <section class="slide" :class="state(17)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(18) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">The plan</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'From one school', break: true },
                                { text: 'to every charger.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <ol class="timeline">
                        <li class="rise is-now" style="--d: 450ms">
                            <p class="when">Nov 2026</p>
                            <p class="what">Pre-approval</p>
                            <p class="how">Visa / Mastercard check, terminal availability, SDK integration</p>
                        </li>
                        <li class="rise" style="--d: 550ms">
                            <p class="when">Dec – Jan</p>
                            <p class="what">First tree live</p>
                            <p class="how">The Prague school. Real cards, first sessions, first story</p>
                        </li>
                        <li class="rise" style="--d: 650ms">
                            <p class="when">Spring 2027</p>
                            <p class="what">Certified &amp; public</p>
                            <p class="how">Outdoor-certified terminal. Visa co-marketing launch</p>
                        </li>
                        <li class="rise" style="--d: 750ms">
                            <p class="when">H2 2027</p>
                            <p class="what">Czech scale</p>
                            <p class="how">PRE / ČEZ retrofit pilot. First 50 chargers across Czechia</p>
                        </li>
                        <li class="rise" style="--d: 850ms">
                            <p class="when">2028</p>
                            <p class="what">Europe</p>
                            <p class="how">Roll out through Tapaya’s markets</p>
                        </li>
                    </ol>
                </div>
            </section>

            <!-- 19 · EXPECTATIONS -->
            <section class="slide" :class="state(18)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(19) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Honest expectations</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'The first six months', break: true },
                                { text: 'are about proof.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="grid grid-cols-3 gap-[64px]">
                        <div class="rise" style="--d: 450ms">
                            <p class="eyebrow">Treetino commits to</p>
                            <ul class="spec mt-[20px] text-white/70">
                                <li>Integrate the SDK and metering</li>
                                <li>Build, install and run the first tree</li>
                                <li>Bring sites, partners and crews</li>
                            </ul>
                        </div>
                        <div class="rise" style="--d: 550ms">
                            <p class="eyebrow">Tapaya commits to</p>
                            <ul class="spec mt-[20px] text-white/70">
                                <li>Scheme pre-approval for EV</li>
                                <li>Source the outdoor terminal</li>
                                <li>Onboard sites, run acquiring</li>
                            </ul>
                        </div>
                        <div class="rise" style="--d: 650ms">
                            <p class="eyebrow !text-[#8ec5ff]">Success by spring</p>
                            <ul class="spec mt-[20px] text-white">
                                <li>One tree taking real cards</li>
                                <li>A signed revenue split</li>
                                <li>Next sites and Visa lined up</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 20 · WHY US -->
            <section class="slide" :class="state(19)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(20) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'We’ve built both halves', break: true },
                            { text: 'of this before.', tone: 'accent' },
                        ]"
                    />

                    <div class="grid grid-cols-2 gap-[64px]">
                        <div class="rise flex items-end gap-[40px]" style="--d: 450ms">
                            <div class="portrait !h-[280px] !w-[220px]">
                                <img src="/img/founders/jakub-portrait.jpg" alt="Jakub Lustyk" style="object-position: 50% 14%" />
                            </div>
                            <div class="pb-[8px]">
                                <p class="text-[22px] text-white/45">Payments · CTO</p>
                                <p class="mt-[10px] text-[44px] leading-none font-medium tracking-[-0.035em]">Jakub Lustyk</p>
                                <p class="mt-[20px] max-w-[26ch] text-[22px] leading-[1.45] text-white/60">
                                    Shipped card payments that open physical doors across Czech schools and cities.
                                </p>
                            </div>
                        </div>
                        <div class="rise flex items-end gap-[40px]" style="--d: 570ms">
                            <div class="portrait !h-[280px] !w-[220px]">
                                <img src="/img/founders/dominik-portrait.jpg" alt="Dominik Mašek" style="object-position: 50% 8%" />
                            </div>
                            <div class="pb-[8px]">
                                <p class="text-[22px] text-white/45">Energy · CEO</p>
                                <p class="mt-[10px] text-[44px] leading-none font-medium tracking-[-0.035em]">Dominik Mašek</p>
                                <p class="mt-[20px] max-w-[26ch] text-[22px] leading-[1.45] text-white/60">
                                    Built 23+ MW of energy and EV charging infrastructure in Central Europe.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="rise flex items-baseline gap-[56px] border-t border-white/10 pt-[32px]" style="--d: 750ms">
                        <p class="text-[22px] text-white/45">First sites already signed</p>
                        <p class="text-[40px] font-medium tracking-[-0.03em]">€705k <span class="text-[22px] font-normal text-white/45">contracts</span></p>
                        <p class="text-[40px] font-medium tracking-[-0.03em]">€3.4M <span class="text-[22px] font-normal text-white/45">letters of intent</span></p>
                    </div>
                </div>
            </section>

            <!-- 21 · CLOSE -->
            <section class="slide" :class="state(20)">
                <div class="img-in absolute inset-0" style="--d: 0ms">
                    <PitchEuropeMap :cx="345" :cy="318" :w="300" :strength="0.7" />
                </div>
                <div
                    class="absolute inset-0"
                    style="
                        background: radial-gradient(
                            ellipse 50% 55% at 50% 50%,
                            rgba(9, 9, 11, 0.92) 0%,
                            rgba(9, 9, 11, 0.6) 55%,
                            rgba(9, 9, 11, 0.2) 100%
                        );
                    "
                ></div>

                <div class="relative flex h-full flex-col items-center justify-center text-center">
                    <LogoType className="rise !h-[72px] w-auto fill-current text-white" style="--d: 0ms" />
                    <PitchHeadline
                        class="mt-[56px] text-[72px] leading-[1.1] font-medium tracking-[-0.04em]"
                        :delay="300"
                        :segments="[
                            { text: 'Let’s plant', break: true },
                            { text: 'the first one.', tone: 'accent' },
                        ]"
                    />
                    <p class="rise mt-[40px] text-[24px] text-white/50" style="--d: 750ms">
                        Next: intro with Monika · terminal availability · scheme pre-approval · a date at the school
                    </p>
                    <p class="rise mt-[48px] text-[26px] text-white/65" style="--d: 850ms">
                        Jakub Lustyk&nbsp;&nbsp;·&nbsp;&nbsp;Dominik Mašek
                    </p>
                    <p class="rise mt-[14px] text-[24px] text-white/35" style="--d: 920ms">
                        info@treetino.com&nbsp;&nbsp;·&nbsp;&nbsp;treetino.eu
                    </p>
                </div>
            </section>
        </div>

        <!-- ============== Presenter UI (never printed) ============== -->
        <template v-if="current !== CALC">
            <button type="button" aria-label="Previous slide" class="deck-ui nav-zone left-0" @click="prev"></button>
            <button type="button" aria-label="Next slide" class="deck-ui nav-zone right-0" @click="next"></button>
        </template>

        <div class="deck-ui fixed inset-x-0 top-0 z-30 h-[2px] bg-white/5">
            <div
                class="h-full bg-[#4d8dff] transition-[width] duration-500 ease-out"
                :style="{ width: `${((current + 1) / TOTAL) * 100}%` }"
            ></div>
        </div>

        <div
            v-if="showNotes"
            class="deck-ui fixed bottom-6 left-6 z-40 w-[480px] max-w-[calc(100vw-3rem)] rounded-xl border border-white/10 bg-zinc-950/90 p-4 text-white backdrop-blur-md"
        >
            <div class="flex items-center justify-between text-xs text-white/40 tabular-nums">
                <span>{{ pad(current + 1) }} · {{ notes[current]?.time }}</span>
                <span class="flex items-center gap-3">
                    <button type="button" class="hover:text-white" :class="timerRunning && 'text-white'" @click="toggleTimer">
                        {{ formattedTimer }}
                    </button>
                    <button type="button" class="hover:text-white" @click="resetTimer">Reset</button>
                </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-white/80">{{ notes[current]?.script }}</p>
        </div>

        <div
            class="deck-ui fixed right-6 bottom-6 z-40 flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/80 p-1 text-white/70 backdrop-blur-md transition-opacity duration-300"
            :class="uiVisible ? 'opacity-100' : 'pointer-events-none opacity-0'"
        >
            <button type="button" class="ui-btn" aria-label="Previous slide" @click="prev">
                <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="px-2 text-xs tabular-nums">{{ pad(current + 1) }} / {{ TOTAL }}</span>
            <button type="button" class="ui-btn" aria-label="Next slide" @click="next">
                <ChevronRight class="h-4 w-4" />
            </button>
            <span class="mx-1 h-4 w-px bg-white/10"></span>
            <button
                type="button"
                class="ui-btn"
                :class="showNotes && 'bg-white/10 text-white'"
                aria-label="Speaker notes (N)"
                @click="showNotes = !showNotes"
            >
                <NotebookText class="h-4 w-4" />
            </button>
            <button type="button" class="ui-btn" aria-label="Fullscreen (F)" @click="toggleFullscreen">
                <Maximize class="h-4 w-4" />
            </button>
            <button type="button" class="ui-btn gap-1.5 px-2.5 text-xs" aria-label="Download PDF (P)" @click="downloadPdf">
                <Download class="h-4 w-4" />
                PDF
            </button>
        </div>
    </div>
</template>

<style>
/* Same quiet spec list as /pitch-hackathon. */
.slide .spec {
    font-size: 24px;
    line-height: 1.4;
    letter-spacing: -0.01em;
}
.slide .spec li {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px 0;
}
.slide .no-callouts .will-change-transform {
    display: none !important;
}
/* Charger screen mock on slide 08 */
.slide .kiosk {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 40px;
    padding: 44px 40px;
    background: linear-gradient(180deg, rgba(24, 61, 137, 0.18), rgba(9, 9, 11, 0.6));
    box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.9);
}

/* Four quiet columns (who brings what, revenue streams) */
.slide .cols-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 56px;
}
.slide .cols-4 > div {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 28px;
}
.slide .cols-4 .num {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.3);
    font-variant-numeric: tabular-nums;
}
.slide .cols-4 .col-title {
    margin-top: 18px;
    font-size: 38px;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: -0.03em;
}
.slide .cols-4 .col-body {
    margin-top: 18px;
    font-size: 22px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.55);
}

/* Hardware layers on slide 09 — a cross-section of the trunk */
.slide .layers {
    position: relative;
    padding-left: 48px;
}
.slide .layers::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 24px;
    bottom: 24px;
    width: 2px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.06));
}
.slide .layers li {
    position: relative;
    padding: 26px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.slide .layers li:first-child {
    border-top: 0;
}
.slide .layers li::before {
    content: '';
    position: absolute;
    left: -48px;
    top: 36px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #09090b;
    border: 2px solid rgba(255, 255, 255, 0.45);
}
.slide .layers li.is-accent::before {
    border-color: #4d8dff;
    background: #4d8dff;
}
.slide .layers span {
    display: block;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: -0.03em;
}
.slide .layers p {
    margin-top: 6px;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.5);
}

/* Roadmap on slide 18 */
.slide .timeline {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 40px;
}
.slide .timeline li {
    position: relative;
    border-top: 2px solid rgba(255, 255, 255, 0.12);
    padding-top: 32px;
}
.slide .timeline li::before {
    content: '';
    position: absolute;
    top: -9px;
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #09090b;
    border: 2px solid rgba(255, 255, 255, 0.45);
}
.slide .timeline li.is-now {
    border-top-color: #4d8dff;
}
.slide .timeline li.is-now::before {
    border-color: #4d8dff;
    background: #4d8dff;
}
.slide .timeline .when {
    font-size: 22px;
    color: rgba(255, 255, 255, 0.45);
    font-variant-numeric: tabular-nums;
}
.slide .timeline li.is-now .when {
    color: #8ec5ff;
}
.slide .timeline .what {
    margin-top: 14px;
    font-size: 36px;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: -0.03em;
}
.slide .timeline .how {
    margin-top: 16px;
    font-size: 21px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.5);
}

/* Revenue-split calculator on slide 15 */
.slide .calc {
    user-select: none;
}
.slide .calc .row-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.6);
}
.slide .calc .row-head b {
    font-weight: 500;
    color: #fff;
    font-variant-numeric: tabular-nums;
}
.slide .calc input[type='range'] {
    --fill: rgba(255, 255, 255, 0.85);
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 28px;
    margin-top: 6px;
    background: transparent;
    cursor: pointer;
}
.slide .calc input.is-scheme {
    --fill: rgba(255, 255, 255, 0.4);
}
.slide .calc input.is-tapaya {
    --fill: rgba(255, 255, 255, 0.8);
}
.slide .calc input.is-treetino {
    --fill: #4d8dff;
}
.slide .calc input[type='range']::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--fill) var(--p), rgba(255, 255, 255, 0.12) var(--p));
}
.slide .calc input[type='range']::-moz-range-track {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--fill) var(--p), rgba(255, 255, 255, 0.12) var(--p));
}
.slide .calc input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    margin-top: -9px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 0 0 6px rgba(9, 9, 11, 0.9);
}
.slide .calc input[type='range']::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 999px;
    background: #fff;
}
.slide .calc input[type='range']:focus-visible {
    outline: none;
}
.slide .calc .chip {
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 17px;
    color: rgba(255, 255, 255, 0.55);
    transition:
        background 0.2s,
        color 0.2s;
}
.slide .calc .chip:hover {
    color: #fff;
}
.slide .calc .chip.is-on {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
}
.slide .calc .bar {
    display: flex;
    gap: 3px;
    overflow: hidden;
    border-radius: 8px;
}
.slide .calc .bar > div {
    height: 100%;
    min-width: 0;
    transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide .calc .party {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 24px;
    font-variant-numeric: tabular-nums;
}
.slide .calc .dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    flex-shrink: 0;
}
</style>
