<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Download, Maximize, NotebookText } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LogoType from '@/custom/LogoType.vue';
import PitchEuropeMap from '@/custom/pitch/PitchEuropeMap.vue';
import PitchHeadline from '@/custom/pitch/PitchHeadline.vue';
import Web3Ecosystem from '@/custom/web3/Web3Ecosystem.vue';
import Web3PhoneWallet from '@/custom/web3/Web3PhoneWallet.vue';
import '@/custom/pitch/deck.css';

/**
 * FinTechers Hackathon 2026 pitch (/pitch-hackathon). Same presentation system as /pitch:
 * fixed 1920×1080 slides scaled to the screen, printed one slide per page.
 * Presenter-only extras (never printed): speaker notes + 4-minute timer, toggle with N / T.
 */

const TOTAL = 11;
const DEMO_URL = 'http://localhost:5173';
const TALK_SECONDS = 240;

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

const printDeck = () => window.print();

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
        printDeck();
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

/** 4-minute script, one entry per slide. */
const notes = [
    {
        time: '0:00–0:15',
        script: 'Hi everyone, I’m Jakub from Treetino. We build patented trees that produce clean energy, paired with battery storage and EV chargers. Today at The FinTechers we’re connecting that physical infrastructure to real-time fiat rails.',
    },
    {
        time: '0:15–0:35',
        script: 'This is our flagship Treetino V1: 49 kilowatts of solar and wind power on a single square metre of ground — 300 solar leaves and 12 silent wind turbines.',
    },
    {
        time: '0:35–1:00',
        script: 'This is not a whitepaper. We’re backed by CzechInvest and SIC, R&D is done and we’re building: €705k in signed contracts — two V2 trees under construction at a Prague high school and three V1 trees for MKovo. And last week, at a single expo, we walked away with €3.4M in signed LOIs.',
    },
    {
        time: '1:00–1:25',
        script: 'To scale across Europe we built an RWA protocol on Solana. At Solana CZE we won 2nd place overall and 1st in the Marinade track — great to see Marinade judging today. Since then we signed an MoU with peaq and their Ironyard liquidity pools. peaq tokenizes real-world assets for futuristic machine economies — they loved our product, and we’re in deep talks with RockawayX along the same vertical.',
    },
    {
        time: '1:25–1:55',
        script: 'Specifically for peaq, we designed 4 tiers of funding — from $100k up to $1M — so we build trust step by step. We start with Tier 1 right here in Prague at SIC Smíchov: a $100k hub ($60k after grant) with one V2 tree, a 150 kWh battery and two EV chargers. And this exact Tier 1 project is what we have completely simulated in this hackathon.',
    },
    {
        time: '1:55–2:20',
        script: 'To be transparent about scope: before Monday we had the Solana contracts, the Victron telemetry oracle and the dashboard. What was missing was the fintech bridge. EV drivers don’t pay with Phantom — they tap Apple Pay in CZK or EUR. That on-ramp and the card-to-chain settlement is what we built here.',
    },
    {
        time: '2:20–2:45',
        script: 'Here’s the whole loop. Energy flows in amber from the tree into the battery and out to the charger. Every card payment flows back in blue as EURTree, through our on-ramp, into the on-chain vault.',
    },
    {
        time: '2:45–3:10',
        script: 'Why it matters: in traditional RWA — solar farms, real estate, bonds — investors wait a month or a year for off-chain accounting. Here, the second a driver taps their card, we convert the fiat into EURTree and settle on Solana. Investors can claim yield while the car is still charging.',
    },
    {
        time: '3:10–3:35',
        script: 'And at 3 AM with no car plugged in? The capital doesn’t sleep. The battery shaves 35 kW of peak demand for the SIC building and trades the 15-minute OTE spot market. Three fiat revenue streams, one vault.',
    },
    {
        time: '3:35–3:50',
        script: 'Under the hood: a fiat on-ramp for retail and institutions, live hardware and POS data feeding the settlement engine, and a 1:1 reserve proof for every EURTree minted.',
    },
    {
        time: '3:50–4:00',
        script: 'Let’s switch to the live app: we’ll on-ramp fiat, buy a share of the Prague tree, simulate a driver paying by card, and watch the yield land in the wallet.',
    },
];
</script>

<template>
    <Head title="FinTechers Hackathon Pitch — Treetino" />

    <div class="pitch-deck deck-viewport" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div class="deck-stage" :style="stageStyle">
            <!-- ============================================================ -->
            <!-- 01 · COVER                                                   -->
            <!-- ============================================================ -->
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
                        <span class="text-[22px] text-white/45">The FinTechers Hackathon 2026</span>
                    </div>

                    <div>
                        <PitchHeadline
                            tag="h1"
                            class="h-display"
                            :delay="200"
                            :segments="[
                                { text: 'Real trees. Real energy.', break: true },
                                { text: 'Real-time yield.', tone: 'accent' },
                            ]"
                        />
                        <p class="rise mt-[56px] text-[24px] tracking-[-0.01em] text-white/45" style="--d: 900ms">
                            Track 4&nbsp;&nbsp;·&nbsp;&nbsp;FinTech &amp; Real-World Assets
                        </p>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 02 · TREETINO V1                                             -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(1)">
                <div class="img-in absolute inset-y-0 right-[-120px] w-[1340px]" style="--d: 0ms">
                    <img src="/img/hero-v1-cinematic.png" alt="Treetino V1" class="h-full w-full object-cover" />
                </div>
                <div class="product-fade"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(2) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Treetino V1</p>
                        <PitchHeadline
                            class="h-slide mt-[28px] max-w-[11ch]"
                            :segments="[
                                { text: '49 kW of wind and sun' },
                                { text: 'on one square metre.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">300</p>
                            <p class="stat-label">Solar leaves</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">12</p>
                            <p class="stat-label">Wind turbines</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">40.4%</p>
                            <p class="stat-label">Gross margin at €235k</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 03 · TRACTION                                                -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(2)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(3) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Backed by CzechInvest and SIC</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'We build real trees.', break: true },
                                { text: '€3.4M in LOIs last week.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="grid grid-cols-3 gap-[48px]">
                        <figure class="rise" style="--d: 450ms">
                            <div class="photo !aspect-[16/10]">
                                <img src="/img/im/prague-high-school-v2-site.jpg" alt="Prague high school site" />
                            </div>
                            <figcaption>
                                <p class="caption-value">2× V2 in construction</p>
                                <p class="stat-label !mt-[8px]">Prague high school</p>
                            </figcaption>
                        </figure>
                        <figure class="rise" style="--d: 570ms">
                            <div class="photo !aspect-[16/10]">
                                <img src="/img/im/mkovo-site-measurement.jpg" alt="MKovo site measurement" />
                            </div>
                            <figcaption>
                                <p class="caption-value">3× V1 · €705k signed</p>
                                <p class="stat-label !mt-[8px]">Delivering to MKovo</p>
                            </figcaption>
                        </figure>
                        <figure class="rise" style="--d: 690ms">
                            <div class="photo !aspect-[16/10]">
                                <img
                                    src="/img/pitch/expo-booth-lois.jpg"
                                    alt="Treetino expo booth"
                                    style="object-position: 50% 42%"
                                />
                            </div>
                            <figcaption>
                                <p class="caption-value">€3.4M in signed LOIs</p>
                                <p class="stat-label !mt-[8px]">From a single expo</p>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 04 · SOLANA + PEAQ                                           -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(3)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(4) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div
                    class="img-in pointer-events-none absolute top-[96px] right-[40px] bottom-[32px] w-[920px]"
                    style="--d: 250ms"
                >
                    <Web3PhoneWallet :draw="1" :ui="0.62" :orbit="0.72" :active="true" />
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <PitchHeadline
                            class="h-slide max-w-[13ch]"
                            :segments="[
                                { text: 'Proven on' },
                                { text: 'Solana.', tone: 'solana', break: true },
                                { text: 'Funded by peaq.' },
                            ]"
                        />
                        <p class="sub rise mt-[36px] max-w-[34ch]" style="--d: 600ms">
                            Our hackathon wins turned into an MoU with peaq’s Ironyard pools. RockawayX is in talks.
                        </p>
                    </div>

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">2nd</p>
                            <p class="stat-label">Place · Solana CZE</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">1st</p>
                            <p class="stat-label">Place · Marinade track</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">MoU</p>
                            <p class="stat-label">Signed · peaq Ironyard</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 05 · TIER 1 · SIC SMÍCHOV                                    -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(4)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(5) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Tier 1 · SIC Smíchov, Prague</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'The first hub', break: true },
                                { text: 'peaq is funding.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="flex items-end justify-between gap-[96px]">
                        <div class="grid flex-1 grid-cols-2 gap-x-[48px] gap-y-[48px]">
                            <div class="rise border-t border-white/10 pt-[28px]" style="--d: 600ms">
                                <p class="stat-value">$100k</p>
                                <p class="stat-label">Turnkey · $60k after grant</p>
                            </div>
                            <div class="rise border-t border-white/10 pt-[28px]" style="--d: 700ms">
                                <p class="stat-value">3.3 yrs</p>
                                <p class="stat-label">Payback with the grant</p>
                            </div>
                            <div class="rise border-t border-white/10 pt-[28px]" style="--d: 800ms">
                                <p class="stat-value">$18.3k</p>
                                <p class="stat-label">Net EBITDA per year</p>
                            </div>
                            <div class="rise border-t border-white/10 pt-[28px]" style="--d: 900ms">
                                <p class="stat-value">12 kW</p>
                                <p class="stat-label">Tree V2 · 150 kWh · 2 chargers</p>
                            </div>
                        </div>

                        <div class="img-in photo h-[480px] w-[860px] shrink-0 !aspect-auto" style="--d: 200ms">
                            <img
                                src="/img/pitch/sic-tier1-render.jpg"
                                alt="Treetino Tier 1 hub at SIC Smíchov"
                                style="object-position: 45% 60%"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 06 · WHAT WE BUILT HERE                                      -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(5)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(6) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'Drivers tap cards,', break: true },
                            { text: 'not crypto wallets.', tone: 'accent' },
                        ]"
                    />

                    <div class="grid grid-cols-2 gap-[96px]">
                        <div class="rise" style="--d: 450ms">
                            <p class="eyebrow">Before the hackathon</p>
                            <p class="mt-[16px] text-[44px] leading-[1.1] font-medium tracking-[-0.03em] text-white/50">
                                Solana protocol + live hardware oracle
                            </p>
                            <ul class="spec mt-[40px] text-white/45">
                                <li>Fractional tree shares, EURTree mint and reward vaults</li>
                                <li>Live kWh from Victron inverters and batteries</li>
                                <li>But: needed a crypto wallet and manual invoicing</li>
                            </ul>
                        </div>
                        <div class="rise" style="--d: 600ms">
                            <p class="eyebrow !text-[#8ec5ff]">Built here, in 30 hours</p>
                            <p class="mt-[16px] text-[44px] leading-[1.1] font-medium tracking-[-0.03em]">
                                Fiat rails straight into the protocol
                            </p>
                            <ul class="spec mt-[40px] text-white/75">
                                <li>On-ramp in CZK and EUR: card, Apple Pay, SEPA Instant</li>
                                <li>Card tap at the charger settles on Solana in under 2 s</li>
                                <li>1:1 reserve proof: bank balance vs. EURTree supply</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 07 · THE LOOP                                                -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(6)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(7) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="img-in absolute inset-x-0 top-[340px] bottom-[96px]" style="--d: 200ms">
                    <Web3Ecosystem :draw="1" :flow="1" :orbit="0.52" :active="true" />
                </div>

                <div class="pointer-events-none relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[{ text: 'One loop,' }, { text: 'settled in EURTree.', tone: 'accent' }]"
                    />

                    <div class="rise flex items-center gap-[72px] text-[24px] text-white/50" style="--d: 700ms">
                        <span class="flex items-center gap-[16px]">
                            <span class="h-[12px] w-[12px] rounded-full bg-[#fbbf24]"></span>
                            <span><span class="text-white">Energy</span>&nbsp;&nbsp;tree → battery → charger → car</span>
                        </span>
                        <span class="flex items-center gap-[16px]">
                            <span class="h-[12px] w-[12px] rounded-full bg-[#4d8dff]"></span>
                            <span><span class="text-white">Money</span>&nbsp;&nbsp;card payment → EURTree → investors</span>
                        </span>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 08 · STREAMING YIELD                                         -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(7)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(8) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Traditional RWA pays out once a year</p>
                        <PitchHeadline
                            class="h-slide mt-[28px]"
                            :segments="[
                                { text: 'We pay out the second', break: true },
                                { text: 'a car starts charging.', tone: 'accent' },
                            ]"
                        />
                    </div>

                    <div class="stats-4">
                        <div class="rise" style="--d: 600ms">
                            <p class="stat-value">0.0 s</p>
                            <p class="caption-value mt-[28px]">Driver taps a card</p>
                            <p class="stat-label">450 CZK for 30 kWh at SIC</p>
                        </div>
                        <div class="rise" style="--d: 700ms">
                            <p class="stat-value">0.6 s</p>
                            <p class="caption-value mt-[28px]">Meter meets payment</p>
                            <p class="stat-label">Meter reading matched, CZK → EURTree</p>
                        </div>
                        <div class="rise" style="--d: 800ms">
                            <p class="stat-value">1.4 s</p>
                            <p class="caption-value mt-[28px]">Settled on Solana</p>
                            <p class="stat-label">18 EURTree into the tree’s vault</p>
                        </div>
                        <div class="rise !border-[#4d8dff]/60" style="--d: 900ms">
                            <p class="stat-value tone-accent">1.8 s</p>
                            <p class="caption-value mt-[28px]">Yield is claimable</p>
                            <p class="stat-label">Keep it on-chain or cash out</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 09 · REVENUE, 24/7                                           -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(8)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(9) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'No car plugged in?', break: true },
                            { text: 'The battery keeps earning.', tone: 'accent' },
                        ]"
                    />

                    <div>
                        <div class="grid grid-cols-3 gap-[64px]">
                            <div class="rise border-t border-white/10 pt-[32px]" style="--d: 550ms">
                                <p class="text-[22px] text-white/30 tabular-nums">01</p>
                                <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Charging</p>
                                <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">$7.7k / year</p>
                                <p class="stat-label">30 MWh sold through two 22 kW chargers</p>
                            </div>
                            <div class="rise border-t border-white/10 pt-[32px]" style="--d: 670ms">
                                <p class="text-[22px] text-white/30 tabular-nums">02</p>
                                <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Peak shaving</p>
                                <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">$7.2k / year</p>
                                <p class="stat-label">35 kW cut from the SIC building’s peak demand</p>
                            </div>
                            <div class="rise border-t border-white/10 pt-[32px]" style="--d: 790ms">
                                <p class="text-[22px] text-white/30 tabular-nums">03</p>
                                <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Spot trading</p>
                                <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">$5.8k / year</p>
                                <p class="stat-label">Buys cheap at night, sells into the evening peak</p>
                            </div>
                        </div>

                        <p class="rise mt-[56px] text-[26px] tracking-[-0.01em] text-white/45" style="--d: 900ms">
                            $20.6k revenue − $2.3k opex =
                            <span class="font-medium text-white">$18.3k net EBITDA a year</span>, all paid into one vault.
                        </p>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 10 · ARCHITECTURE                                            -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(9)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(10) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'Fiat in. Hardware verified.', break: true },
                            { text: 'Auditable on' },
                            { text: 'Solana.', tone: 'solana' },
                        ]"
                    />

                    <div class="grid grid-cols-3 gap-[64px]">
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 550ms">
                            <p class="text-[22px] text-white/30 tabular-nums">01</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">On-ramp</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">No wallet needed</p>
                            <p class="stat-label">Card, Apple Pay or SEPA in CZK or EUR</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 670ms">
                            <p class="text-[22px] text-white/30 tabular-nums">02</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Oracle</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">Real meters, real receipts</p>
                            <p class="stat-label">Victron, OTE spot prices, charger payments</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 790ms">
                            <p class="text-[22px] text-white/30 tabular-nums">03</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Audit</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">1:1 reserve proof</p>
                            <p class="stat-label">Each EURTree traced to fiat, kWh, receipt</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 11 · CLOSE · LIVE DEMO                                       -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(10)">
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
                        class="mt-[56px] text-[56px] leading-[1.15] font-medium tracking-[-0.035em]"
                        :delay="300"
                        :segments="[
                            { text: 'Tap a card. Charge a car.', break: true },
                            { text: 'Watch the yield land.', tone: 'accent' },
                        ]"
                    />
                    <a
                        :href="DEMO_URL"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="deck-ui rise relative z-30 mt-[56px] rounded-full bg-white px-[36px] py-[16px] text-[22px] font-medium text-zinc-950 transition hover:bg-white/85"
                        style="--d: 800ms"
                    >
                        Live demo →
                    </a>
                    <p class="rise mt-[56px] text-[24px] text-white/45" style="--d: 900ms">
                        Dominik Mašek, CEO&nbsp;&nbsp;·&nbsp;&nbsp;Jakub Lustyk, CTO
                    </p>
                    <p class="rise mt-[12px] text-[24px] text-white/30" style="--d: 950ms">
                        info@treetino.com&nbsp;&nbsp;·&nbsp;&nbsp;treetino.eu
                    </p>
                </div>
            </section>
        </div>

        <!-- ============== Presenter UI (never printed) ============== -->
        <button type="button" aria-label="Previous slide" class="deck-ui nav-zone left-0" @click="prev"></button>
        <button type="button" aria-label="Next slide" class="deck-ui nav-zone right-0" @click="next"></button>

        <div class="deck-ui fixed inset-x-0 top-0 z-30 h-[2px] bg-white/5">
            <div
                class="h-full bg-[#4d8dff] transition-[width] duration-500 ease-out"
                :style="{ width: `${((current + 1) / TOTAL) * 100}%` }"
            ></div>
        </div>

        <!-- Speaker notes (N) · timer (T) -->
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
            <button type="button" class="ui-btn gap-1.5 px-2.5 text-xs" aria-label="Save as PDF (P)" @click="printDeck">
                <Download class="h-4 w-4" />
                PDF
            </button>
        </div>
    </div>
</template>

<style>
/* Hackathon-only addition to the shared deck system: a quiet spec list. */
.slide .spec {
    font-size: 24px;
    line-height: 1.4;
    letter-spacing: -0.01em;
}
.slide .spec li {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px 0;
}
</style>
