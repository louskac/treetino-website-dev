<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Download, Maximize } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LogoType from '@/custom/LogoType.vue';
import PitchEuropeMap from '@/custom/pitch/PitchEuropeMap.vue';
import PitchHeadline from '@/custom/pitch/PitchHeadline.vue';
import Web3PhoneWallet from '@/custom/web3/Web3PhoneWallet.vue';

/**
 * Pitch deck. Every slide is a fixed 1920×1080 canvas that is scaled to the screen, so what you
 * present is exactly what lands in the PDF. Print (⌘P / "P" / download button) lays every slide
 * out as its own 1920×1080 page — no 3D, no scroll effects, just type and photography.
 */

const TOTAL = 12;
const current = ref(0);
const scale = ref(1);
const uiVisible = ref(false);

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
    a.href = `/treetino-pitchdeck.pdf?v=${Date.now()}`;
    a.download = 'Treetino-Pitch-Deck.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
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
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
    }
};

onMounted(() => {
    const fromHash = parseInt(location.hash.replace('#', ''), 10);
    if (fromHash >= 1 && fromHash <= TOTAL) current.value = fromHash - 1;

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
});

const stageStyle = computed(() => ({
    transform: `translate(-50%, -50%) scale(${scale.value})`,
}));

const partners = [
    { name: 'ČVUT', logo: '/partners/cvut.svg' },
    { name: 'FZU', logo: '/partners/fzu.svg' },
    { name: 'CzechInvest', logo: '/partners/CzechInvest.png' },
    { name: 'SIC', logo: '/partners/Sic.png' },
    { name: 'Start it @ČSOB', logo: '/partners/startit.svg' },
    { name: 'Make-iton', logo: '/partners/Makeiton.png' },
];
</script>

<template>
    <Head title="Pitch Deck — Treetino" />

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
                    <LogoType className="rise self-start !h-[44px] w-auto fill-current text-white" style="--d: 0ms" />

                    <div>
                        <PitchHeadline
                            tag="h1"
                            class="h-display max-w-[16ch]"
                            :delay="200"
                            :segments="[
                                { text: 'The future of energy,', break: true },
                                { text: 'rooted in sustainability.', tone: 'accent' },
                            ]"
                        />
                        <p class="rise mt-[56px] text-[24px] tracking-[-0.01em] text-white/45" style="--d: 900ms">
                            treetino.eu
                        </p>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 02 · PROBLEM                                                 -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(1)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(2) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-center px-[128px]">
                    <PitchHeadline
                        class="h-display"
                        :stagger="70"
                        :segments="[
                            { text: 'Factory roofs are full.', break: true },
                            { text: 'Grid connections are capped.', break: true },
                            { text: 'Industry still needs more power.', tone: 'accent' },
                        ]"
                    />
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 03 · TREETINO V1                                             -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(2)">
                <div class="img-in absolute inset-y-0 right-[-120px] w-[1340px]" style="--d: 0ms">
                    <img src="/img/hero-v1-cinematic.png" alt="Treetino V1" class="h-full w-full object-cover" />
                </div>
                <div class="product-fade"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(3) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
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
            <!-- 04 · TREETINO V2                                             -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(3)">
                <div class="img-in absolute inset-y-0 right-[-160px] w-[1400px]" style="--d: 0ms">
                    <img
                        src="/img/hero-images/poster-v2_2.1.2.webp"
                        alt="Treetino V2"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div class="product-fade"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(4) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Treetino V2</p>
                        <PitchHeadline
                            class="h-slide mt-[28px] max-w-[11ch]"
                            :segments="[{ text: '12 kW that' }, { text: 'follows the sun.', tone: 'accent' }]"
                        />
                    </div>

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">+28.4%</p>
                            <p class="stat-label">Yield from AI sun-tracking</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">&lt; 5.5 m</p>
                            <p class="stat-label">No building permit</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">€60k</p>
                            <p class="stat-label">4× power per € vs market</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 05 · TREETINO AERO                                           -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(4)">
                <div class="img-in absolute inset-y-0 right-[-80px] w-[1300px]" style="--d: 0ms">
                    <img
                        src="/img/pitch/aero-updated-glass.jpg"
                        alt="Treetino Aero"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div class="product-fade"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(5) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <div>
                        <p class="eyebrow rise" style="--d: 0ms">Treetino Aero</p>
                        <PitchHeadline
                            class="h-slide mt-[28px] max-w-[12ch]"
                            :segments="[{ text: 'Wind power' }, { text: 'you can’t hear.', tone: 'accent' }]"
                        />
                    </div>

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">3 kW</p>
                            <p class="stat-label">From 1.8 m/s of wind</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">&lt; 30 dB</p>
                            <p class="stat-label">Quieter than a whisper</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">€4k</p>
                            <p class="stat-label">4-year payback</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 06 · WE ARE BUILDING                                         -->
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
                        :segments="[{ text: 'R&D is done.' }, { text: 'We’re building.', tone: 'accent' }]"
                    />

                    <div class="grid grid-cols-3 gap-[48px]">
                        <figure class="rise" style="--d: 450ms">
                            <div class="photo">
                                <img src="/img/im/prague-high-school-v2-site.jpg" alt="Prague high school site" />
                            </div>
                            <figcaption>
                                <p class="caption-value">2× V2 in construction</p>
                                <p class="stat-label !mt-[8px]">Prague high school</p>
                            </figcaption>
                        </figure>
                        <figure class="rise" style="--d: 570ms">
                            <div class="photo">
                                <img src="/img/im/mkovo-site-measurement.jpg" alt="MKovo site measurement" />
                            </div>
                            <figcaption>
                                <p class="caption-value">3× V1 · €705k</p>
                                <p class="stat-label !mt-[8px]">Delivering to MKovo in Q1</p>
                            </figcaption>
                        </figure>
                        <figure class="rise" style="--d: 690ms">
                            <div class="photo">
                                <img
                                    src="/img/im/industrial-3d-printer-production.jpg"
                                    alt="In-house 3D print farm"
                                />
                            </div>
                            <figcaption>
                                <p class="caption-value">16 weeks → 48 hours</p>
                                <p class="stat-label !mt-[8px]">Tooling from our own 3D print farm</p>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 07 · TRACTION                                                -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(6)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(7) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'We don’t draw hockey sticks.', break: true },
                            { text: 'We sign contracts.', tone: 'accent' },
                        ]"
                    />

                    <div class="stats-4">
                        <div class="rise" style="--d: 600ms">
                            <p class="stat-value-xl">€705k</p>
                            <p class="stat-label">Signed contracts</p>
                        </div>
                        <div class="rise" style="--d: 700ms">
                            <p class="stat-value-xl">€2.8M</p>
                            <p class="stat-label">Pipeline from 16 signed LOIs</p>
                        </div>
                        <div class="rise" style="--d: 800ms">
                            <p class="stat-value-xl">€10M</p>
                            <p class="stat-label">Bond underwriting committed</p>
                        </div>
                        <div class="rise" style="--d: 900ms">
                            <p class="stat-value-xl">€200k</p>
                            <p class="stat-label">EU grant · 2 patents filed</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 08 · SCALE LIKE SOFTWARE                                     -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(7)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(8) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="img-in absolute top-[452px] right-[-2px] w-[1060px]" style="--d: 350ms">
                    <div class="screen">
                        <img src="/img/sales/step-5-roi.webp" alt="Treetino partner sales app" />
                    </div>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[
                            { text: 'We automated the sales engineer.', break: true },
                            { text: 'A quote in 120 seconds.', tone: 'accent' },
                        ]"
                    />

                    <div class="flex w-[520px] flex-col gap-[44px]">
                        <div class="rise border-t border-white/10 pt-[28px]" style="--d: 650ms">
                            <p class="stat-value">120 s</p>
                            <p class="stat-label">From a pin on Google Maps to an audited ROI quote</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[28px]" style="--d: 750ms">
                            <p class="stat-value">€0</p>
                            <p class="stat-label">Fixed CAC — partners across Europe sell for us</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 09 · WEB3                                                    -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(8)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(9) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
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
                            :segments="[{ text: 'Every kWh, immutably on' }, { text: 'Solana.', tone: 'solana' }]"
                        />
                        <p class="sub rise mt-[36px] max-w-[34ch]" style="--d: 600ms">
                            Our oracle tokenizes trees, batteries and EV hubs, so anyone can own a piece of the grid.
                        </p>
                    </div>

                    <div class="stats w-[860px]">
                        <div class="rise" style="--d: 650ms">
                            <p class="stat-value">2nd</p>
                            <p class="stat-label">Place · Solana</p>
                        </div>
                        <div class="rise" style="--d: 750ms">
                            <p class="stat-value">1st</p>
                            <p class="stat-label">Place · Marinade</p>
                        </div>
                        <div class="rise" style="--d: 850ms">
                            <p class="stat-value">MoU</p>
                            <p class="stat-label">Signed · peaq</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 10 · BUSINESS MODEL                                          -->
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
                            { text: 'We earn' },
                            { text: 'three times', tone: 'accent' },
                            { text: 'on every tree.' },
                        ]"
                    />

                    <div class="grid grid-cols-3 gap-[64px]">
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 550ms">
                            <p class="text-[22px] text-white/30 tabular-nums">01</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Hardware</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">
                                40.4% margin
                            </p>
                            <p class="stat-label">€95k profit on every V1 sold</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 670ms">
                            <p class="text-[22px] text-white/30 tabular-nums">02</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Software</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">
                                €3,800 / tree / year
                            </p>
                            <p class="stat-label">AI tracking switched off = 30% less energy</p>
                        </div>
                        <div class="rise border-t border-white/10 pt-[32px]" style="--d: 790ms">
                            <p class="text-[22px] text-white/30 tabular-nums">03</p>
                            <p class="mt-[20px] text-[56px] leading-none font-medium tracking-[-0.035em]">Protocol</p>
                            <p class="tone-accent mt-[24px] text-[32px] font-medium tracking-[-0.02em]">
                                Minting + yield share
                            </p>
                            <p class="stat-label">Tokenized CapEx funds the next tree</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 11 · TEAM                                                    -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(10)">
                <div class="glow"></div>
                <div class="chrome">
                    <LogoType className="!h-[28px] w-auto fill-current text-white/40" />
                    <span>{{ pad(11) }}<span class="text-white/20"> / {{ TOTAL }}</span></span>
                </div>

                <div class="relative flex h-full flex-col justify-between px-[128px] pt-[200px] pb-[112px]">
                    <PitchHeadline
                        class="h-slide"
                        :segments="[{ text: 'The people' }, { text: 'behind the trees.', tone: 'accent' }]"
                    />

                    <div class="grid grid-cols-2 gap-[64px]">
                        <div class="rise flex items-end gap-[40px]" style="--d: 450ms">
                            <div class="portrait">
                                <img
                                    src="/img/founders/dominik-portrait.jpg"
                                    alt="Dominik Mašek"
                                    style="object-position: 50% 8%"
                                />
                            </div>
                            <div class="pb-[8px]">
                                <p class="text-[22px] text-white/45">Co-founder &amp; CEO</p>
                                <p class="mt-[10px] text-[48px] leading-none font-medium tracking-[-0.035em]">
                                    Dominik Mašek
                                </p>
                                <p class="mt-[20px] max-w-[22ch] text-[22px] leading-[1.45] text-white/60">
                                    Hardware, serial production and enterprise sales.
                                </p>
                            </div>
                        </div>
                        <div class="rise flex items-end gap-[40px]" style="--d: 570ms">
                            <div class="portrait">
                                <img
                                    src="/img/founders/jakub-portrait.jpg"
                                    alt="Jakub Lustyk"
                                    style="object-position: 50% 14%"
                                />
                            </div>
                            <div class="pb-[8px]">
                                <p class="text-[22px] text-white/45">Co-founder &amp; CTO</p>
                                <p class="mt-[10px] text-[48px] leading-none font-medium tracking-[-0.035em]">
                                    Jakub Lustyk
                                </p>
                                <p class="mt-[20px] max-w-[22ch] text-[22px] leading-[1.45] text-white/60">
                                    Sales OS, AI telemetry and the Solana protocol.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rise flex items-center justify-between border-t border-white/10 pt-[40px]"
                        style="--d: 750ms"
                    >
                        <img
                            v-for="p in partners"
                            :key="p.name"
                            :src="p.logo"
                            :alt="p.name"
                            class="h-[40px] w-auto object-contain opacity-50 brightness-0 invert"
                        />
                    </div>
                </div>
            </section>

            <!-- ============================================================ -->
            <!-- 12 · CLOSE                                                   -->
            <!-- ============================================================ -->
            <section class="slide" :class="state(11)">
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
                            { text: 'The future of energy,' },
                            { text: 'rooted in sustainability.', tone: 'accent' },
                        ]"
                    />
                    <p class="rise mt-[48px] text-[24px] text-white/45" style="--d: 900ms">
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
/* ---------- Type system (shared with PitchHeadline, so not scoped) ---------- */
.pitch-deck {
    -webkit-font-smoothing: antialiased;
    color: #fff;
}
.pitch-deck .h-display {
    font-size: 128px;
    line-height: 1.04;
    letter-spacing: -0.045em;
    font-weight: 500;
}
.pitch-deck .h-slide {
    font-size: 96px;
    line-height: 1.06;
    letter-spacing: -0.04em;
    font-weight: 500;
}
.pitch-deck .pitch-word {
    display: inline-block;
}
.pitch-deck .tone-accent {
    color: #8ec5ff;
    text-shadow: 0 0 40px rgba(77, 141, 255, 0.45);
}
.pitch-deck .tone-green,
.pitch-deck .tone-solana {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-repeat: no-repeat;
    background-size: calc(100% - 2px) 100%;
}
.pitch-deck .tone-green {
    background-image: linear-gradient(90deg, #8ec5ff, #34d399);
}
.pitch-deck .tone-solana {
    background-image: linear-gradient(90deg, #b47bff, #14f195);
}

/* ---------- Deck shell ---------- */
html.pitch-mode,
html.pitch-mode body {
    background: #09090b;
}
html.pitch-mode #cc-main {
    display: none !important;
}
.deck-viewport {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #09090b;
    user-select: none;
}
.deck-stage {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1920px;
    height: 1080px;
    transform-origin: center center;
}
.slide {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #09090b;
    opacity: 0;
    visibility: hidden;
    transition:
        opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
        visibility 0s linear 0.6s;
}
.slide.is-active {
    z-index: 1;
    opacity: 1;
    visibility: visible;
    transition:
        opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
        visibility 0s;
}

/* Same ambient light as the /web3 map scenes */
.slide .glow {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 55% 65% at 92% 0%, rgba(24, 61, 137, 0.42), transparent 70%),
        radial-gradient(ellipse 45% 50% at 0% 100%, rgba(24, 61, 137, 0.16), transparent 70%);
}
/* Product renders melt into the page from the right */
.slide .product-fade {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg, #09090b 30%, rgba(9, 9, 11, 0.7) 44%, rgba(9, 9, 11, 0) 62%),
        linear-gradient(0deg, #09090b 0%, rgba(9, 9, 11, 0) 22%),
        linear-gradient(180deg, #09090b 0%, rgba(9, 9, 11, 0) 18%),
        linear-gradient(270deg, #09090b 0%, rgba(9, 9, 11, 0) 10%);
}
.slide .chrome {
    position: absolute;
    top: 72px;
    left: 128px;
    right: 128px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.4);
    font-variant-numeric: tabular-nums;
}
.slide .eyebrow {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: rgba(255, 255, 255, 0.45);
}
.slide .sub {
    font-size: 32px;
    line-height: 1.45;
    letter-spacing: -0.01em;
    color: rgba(255, 255, 255, 0.6);
}
.slide .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 48px;
}
.slide .stats > div,
.slide .stats-4 > div {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 28px;
}
.slide .stats-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 48px;
}
.slide .stat-value {
    font-size: 72px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.04em;
    white-space: nowrap;
}
.slide .stat-value-xl {
    font-size: 112px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.045em;
    white-space: nowrap;
}
.slide .stat-label {
    margin-top: 16px;
    font-size: 22px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.45);
}
.slide .caption-value {
    font-size: 34px;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: -0.03em;
}
.slide figcaption {
    margin-top: 28px;
}
.slide .photo {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 24px;
    background: #18181b;
}
.slide .photo img,
.slide .portrait img,
.slide .screen img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.slide .portrait {
    width: 260px;
    height: 330px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 24px;
    background: #18181b;
}
.slide .screen {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 0;
    border-radius: 24px 0 0 24px;
    box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.9);
}

/* Presenter UI */
.nav-zone {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 20;
    width: 18vw;
    cursor: default;
}
.ui-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    min-width: 2rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
}
.ui-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
}

/* ---------- Reveal (screen only; print gets the finished state) ---------- */
@media screen {
    .slide.is-active .pitch-word {
        animation: pitch-word-in 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: var(--d, 0ms);
    }
    .slide.is-active .rise {
        animation: pitch-rise-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: var(--d, 0ms);
    }
    .slide.is-active .img-in {
        animation: pitch-img-in 1.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: var(--d, 0ms);
    }
}
@keyframes pitch-word-in {
    from {
        opacity: 0;
        transform: translateY(0.38em);
        filter: blur(12px);
    }
    to {
        opacity: 1;
        transform: none;
        filter: blur(0);
    }
}
@keyframes pitch-rise-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes pitch-img-in {
    from {
        opacity: 0;
        transform: scale(1.035);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@media (prefers-reduced-motion: reduce) {
    .slide.is-active .pitch-word,
    .slide.is-active .rise,
    .slide.is-active .img-in {
        animation: none;
    }
}

/* ---------- PDF: one slide per 1920×1080 page ---------- */
@media print {
    @page {
        size: 1920px 1080px;
        margin: 0;
    }
    html.pitch-mode,
    html.pitch-mode body {
        width: 1920px;
        margin: 0;
        background: #09090b !important;
    }
    .pitch-deck,
    .pitch-deck * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    .deck-viewport {
        position: static;
        overflow: visible;
    }
    .deck-stage {
        position: static;
        height: auto;
        transform: none !important;
    }
    .slide {
        position: relative;
        width: 1920px;
        height: 1080px;
        opacity: 1 !important;
        visibility: visible !important;
        transition: none !important;
        break-after: page;
        break-inside: avoid;
    }
    .slide:last-child {
        break-after: auto;
    }
    .deck-ui {
        display: none !important;
    }
    .pitch-deck .tone-accent {
        text-shadow: none !important;
    }
}
</style>
