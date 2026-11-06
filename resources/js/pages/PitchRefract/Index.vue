<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Download, Maximize, NotebookText, Timer } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InvestorPaymentScene from '@/custom/investors/InvestorPaymentScene.vue';
import InvestorTreeScene from '@/custom/investors/InvestorTreeScene.vue';
import LogoType from '@/custom/LogoType.vue';
import PitchEuropeMap from '@/custom/pitch/PitchEuropeMap.vue';
import PitchHeadline from '@/custom/pitch/PitchHeadline.vue';
import Web3BessWireframe from '@/custom/web3/Web3BessWireframe.vue';
import Web3Ecosystem from '@/custom/web3/Web3Ecosystem.vue';
import Web3PhoneWallet from '@/custom/web3/Web3PhoneWallet.vue';
import '@/custom/pitch/deck.css';

interface SlideMeta {
    id: string;
    label: string;
    duration: number; // target seconds for a ~12-minute partner presentation + discussion
    note: string;
    guardrail?: string;
}

const slides: SlideMeta[] = [
    {
        id: '00',
        label: 'Cover',
        duration: 20,
        note: 'Thanks HM, Dan, and Gintare for jumping back on. Last time we spoke in late September, Treetino was still framing our Web3 angle. Over the last 30 days we shipped the live PayFi settlement stack, closed major ecosystem partnerships, and locked institutional hardware milestones — so today we want to walk you through what is live, answer Gintare’s question on the stablecoin model, and align on a concrete structure.',
        guardrail: 'Tone: Peer-to-peer, calm, institutional. Zero apology for being heads-down building in October.',
    },
    {
        id: '01',
        label: '30-Day Delta',
        duration: 45,
        note: 'Here is what shipped in the 4 weeks since our first call: we took 2nd Place at Solana Startup Village CZE plus 1st Place in Marinade Finance, signed an official incubation MoU with peaq Ironyard to co-launch our Prague RWA hub, captured €3.4M in new commercial LOIs at Smart Energy Forum on top of €705k in signed contracts, and were selected by CzechInvest in the Top 12 of 200+ startups alongside Prusa Research’s Best Hardware Startup award.',
        guardrail: 'Anchor leverage early: Treetino already has peaq, Solana ecosystem wins, EU grants, and bank intros.',
    },
    {
        id: '02',
        label: 'Physical Anchor',
        duration: 40,
        note: 'Everything we do in Web3 is anchored in patented steel and silicon. A single Treetino V1 puts 300 actuated solar leaves, 12 silent Savonius wind turbines, LiFePO4 storage, and dual 22 kW EV charging onto a 1-square-metre footprint — generating 49 kW peak power at a 40.4% hardware gross margin.',
        guardrail: 'Contrast with synthetic RWA projects: anyone can walk up to our hardware in Prague and tap a payment card.',
    },
    {
        id: '03',
        label: 'Signed Sites',
        duration: 35,
        note: 'This is not a whitepaper render. We have €705k in signed installations under delivery — two V2 trees at a Prague high school and three V1 trees at MKovo’s industrial site — plus €3.4M in qualified B2B LOIs from Smart Energy Forum.',
        guardrail: 'Point out that hardware manufacturing and B2B margins stand on their own feet without token subsidies.',
    },
    {
        id: '04',
        label: '8.6 MW BESS',
        duration: 45,
        note: 'Alongside urban trees, our utility cash-flow engine is BESS Přeštice — a shovel-ready 8.6 MW / 17.2 MWh battery facility in West Bohemia with a secured ČEZ Distribuce 22 kV grid connection. Combining grid balancing and 15-minute spot arbitrage, it projects $1.0M to $1.5M in annual net EBITDA with a sub-3-year payback.',
        guardrail: 'This is the institutional RWA scale hook for family offices, RWA funds, and Tier-1 CEX listing committees.',
    },
    {
        id: '05',
        label: 'Tier 1 Pilot',
        duration: 40,
        note: 'Before scaling into multi-million BESS tranches, our immediate flagship RWA vault is SIC Smíchov in Prague — a $100k turnkey urban charging and storage hub ($60k net of EU grant) generating 18.3% base APY or 30.5% grant-levered APY, co-launched with peaq.',
        guardrail: 'Keep peaq visible: Tier 1 is bite-sized, permitted, and already moving.',
    },
    {
        id: '06',
        label: 'MiCA & PayFi',
        duration: 55,
        note: 'Gintare asked in Telegram for an update on the stablecoin idea we discussed. After reviewing EU MiCA Title IV and talking directly with Czech fintech and banking partners, issuing our own Euro stablecoin is a regulatory trap: it requires an EMI license and MiCA Article 50 explicitly bans paying yield on E-Money Tokens. Instead, we built regulated PayFi machine rails — drivers pay EUR or CZK via Apple Pay, a licensed partner settles Circle USDC/EURC on Solana, and smart contracts stream real kWh yield to RWA vaults in 1.8 seconds.',
        guardrail: 'Firm strategic pivot: No proprietary MiCA stablecoin. Regulated fiat → Circle USDC/EURC + $TREE protocol token.',
    },
    {
        id: '07',
        label: 'Card-to-USDC',
        duration: 40,
        note: 'Here is what the user sees at the plug: zero wallets, zero seed phrases. An EV driver taps Apple Pay or Visa at Bay 02, pulls 18.4 kWh for €8.28, and under the hood 8.94 USDC lands in the facility vault on Solana in 1.8 seconds.',
        guardrail: 'Highlight our FinTechers Stablecoin Track implementation and active Tapaya / Czech bank acquiring talks.',
    },
    {
        id: '08',
        label: 'On-Chain Loop',
        duration: 40,
        note: 'Every kilowatt-hour is cryptographically signed at the Victron Cerbo GX inverter and OCPP 2.0.1 charger meter before settlement hits the Solana PDA escrow. That means global holders verify real machine revenue block by block — zero self-reported spreadsheets.',
        guardrail: 'Emphasize verifiable DePIN oracle telemetry: hardware truth drives on-chain yield.',
    },
    {
        id: '09',
        label: 'Live Demo',
        duration: 30,
        note: 'This is our working software and Solana settlement flow running end-to-end today — live site telemetry, fractional facility vaults, and instant USDC yield claims.',
        guardrail: 'Let the video play for 15–20s. Working code separates Treetino from 95% of pre-TGE studio clients.',
    },
    {
        id: '10',
        label: 'Dual-Layer Token',
        duration: 55,
        note: 'HM and Dan know better than anyone from building Lingo how critical sustainable RWA token design is post-TGE. We separate capital into two clean layers: Layer 1 is non-dilutive USDC RWA facility vaults paying 18–30% real energy APY. Layer 2 is the $TREE PayFi protocol token (1B fixed supply, $35M FDV seed benchmark), powered by a 1.5% hardware origination fee, 10% performance fee on net kWh yield, and PayFi tap fees routed into programmatic buybacks and staking boosts.',
        guardrail: 'Speak to HM/Dan’s Lingo DNA: real machine cashflows buy back $TREE instead of inflationary emissions.',
    },
    {
        id: '11',
        label: 'OpCo Firewall',
        duration: 45,
        note: 'To scale globally in Web3 while protecting our Czech bank, municipal, and EU grant relationships, we maintain a strict structural firewall: Treetino Corp s.r.o. remains our clean EU Hardware OpCo with zero token liability, connected via hardware supply and oracle SLAs to a dedicated ring-fenced Protocol Entity issuing $TREE.',
        guardrail: 'Non-negotiable boundary: Czech OpCo equity, EU grants, and existing B2B contracts stay 100% ring-fenced.',
    },
    {
        id: '12',
        label: 'Partnership Fit',
        duration: 35,
        note: 'Why Treetino × Refract makes sense: we bring patented hardware, an 8.6 MW utility storage pipeline, working Solana PayFi code, and European institutional validation. Refract brings battle-tested RWA token GTM from Lingo, 500+ Web3 funds and KOLs, and ChainGPT Pad plus Tier-1 CEX launch infrastructure.',
        guardrail: 'Frame as equal, specialized partners — not a needy startup hiring an agency.',
    },
    {
        id: '13',
        label: 'Two Tracks',
        duration: 45,
        note: 'We propose structuring collaboration in two milestone-gated tracks. Track 1 (Weeks 1–6) validates execution fast: co-fill initial RWA vault liquidity and close an initial $500k+ strategic Web3 tranche via Refract’s syndicate — which automatically unlocks the escrowed GTM and KOL budget without draining a single euro from hardware manufacturing. Track 2 (Weeks 4–14) scales the full $TREE TGE across launchpads and Tier-1 CEXs.',
        guardrail: 'Hard red line: $0 upfront out-of-pocket cash retainer from hardware working capital. Raise funds GTM.',
    },
    {
        id: '14',
        label: 'Deal Simulator',
        duration: 60,
        note: 'Let’s look at the numbers transparently on screen. We can adjust the target Web3 raise, on-chain RWA TVL, raise-funded GTM allocation, and Refract’s success fee live right here — showing exact net capital into grid deployment, escrowed marketing warchest, and annual USDC yield plus $TREE buybacks, while keeping our existing EU grants and TradFi pipeline ring-fenced.',
        guardrail: 'Use the sliders live on the call! Anchor fees to whitelisted Refract-introduced Web3 capital + 24m vested $TREE.',
    },
    {
        id: '15',
        label: '12-Week Plan',
        duration: 35,
        note: 'If we align on structure, execution moves on a 12-week clock: Weeks 1–2 lock the term sheet, investor whitelist, and ProtocolCo SPV; Weeks 3–5 close the strategic anchor tranche to unlock GTM escrow; Weeks 6–8 take Vault #1 live on Solana mainnet; Weeks 9–12 execute launchpad and Tier-1 CEX TGE.',
        guardrail: 'Every phase has an objective milestone gate — if Track 1 misses, nobody burns capital on Track 2.',
    },
    {
        id: '16',
        label: '5 Decisions',
        duration: 50,
        note: 'To wrap up cleanly and see if we have a fit, here are the 5 specific points we want to align on today: (1) regulated USDC PayFi + $TREE instead of MiCA stablecoin issuance, (2) ProtocolCo vs EU OpCo ring-fencing, (3) funding the KOL/GTM warchest out of the first closed tranche, (4) whitelisted attribution on Refract-introduced capital, and (5) institutional-safe brand positioning.',
        guardrail: 'Pause here and let HM, Dan, and Gintare answer all 5 points directly on the call!',
    },
    {
        id: '17',
        label: 'Close',
        duration: 20,
        note: 'Tap a card. Settle in USDC. Own the European grid. If those five guardrails work for your side, let’s put a 1-page bullet term sheet on paper by Friday with the exact fee waterfall, investor whitelist rules, and 12-week milestone gates.',
        guardrail: 'End with a crisp Friday 1-pager action item. Never sign verbal exclusivity on the call.',
    },
];

const { locale } = useI18n({ useScope: 'global' });
let previousLocale = 'en';
let isUnmounting = false;

const enforceEnglishLocale = () => {
    if (!isUnmounting && locale.value !== 'en') {
        locale.value = 'en';
    }
};

watch(locale, () => {
    enforceEnglishLocale();
});

const current = ref(0);
const navDir = ref<'forward' | 'backward'>('forward');
const scale = ref(1);
const showNotes = ref(false);
const showTimer = ref(false);
const isFullscreen = ref(false);
const isPrinting = ref(false);
const initialWarmup = ref(true);
const prefersReducedMotion = ref(false);
const elapsed = ref(0);
const demoVideo = ref<HTMLVideoElement | null>(null);
let timerHandle: number | null = null;
let warmupHandle: number | null = null;
let motionMedia: MediaQueryList | null = null;

// Slide 15 — interactive deal & capital waterfall simulator
const raiseUsdM = ref(2.5); // $0.5M – $5.5M Web3 protocol raise
const vaultTvlM = ref(1.5); // $0.1M – $10.0M USDC RWA vault TVL
const gtmAllocPct = ref(10); // 5% – 18% escrowed GTM/KOL warchest (from closed raise)
const cashSuccessPct = ref(8); // 5% – 12% success fee on whitelisted Refract-introduced capital

const gtmBudgetUsd = computed(() => Math.round(raiseUsdM.value * 1_000_000 * (gtmAllocPct.value / 100)));
const successFeeUsd = computed(() => Math.round(raiseUsdM.value * 1_000_000 * (cashSuccessPct.value / 100)));
const netProtocolTreasuryUsd = computed(
    () => Math.round(raiseUsdM.value * 1_000_000) - gtmBudgetUsd.value - successFeeUsd.value,
);
const annualVaultYieldUsd = computed(() => Math.round(vaultTvlM.value * 1_000_000 * 0.205)); // ~20.5% blended net RWA APY
const annualProtocolFeesUsd = computed(() => {
    const origination = vaultTvlM.value * 1_000_000 * 0.015;
    const perfFee = annualVaultYieldUsd.value * 0.1;
    const payfiTapSaas = Math.max(18_000, vaultTvlM.value * 24_000);
    return Math.round(origination + perfFee + payfiTapSaas);
});

const fmtUsd = (n: number): string => {
    if (n >= 1_000_000) {
        return '$' + (n / 1_000_000).toFixed(2) + 'M';
    }
    if (n >= 1_000) {
        return '$' + Math.round(n / 1_000).toLocaleString('en-US') + 'k';
    }
    return '$' + n.toLocaleString('en-US');
};

const totalTargetSeconds = computed(() => slides.reduce((acc, s) => acc + s.duration, 0));

const targetElapsedAtSlide = computed(() =>
    slides.slice(0, current.value + 1).reduce((acc, s) => acc + s.duration, 0),
);

const updateScale = () => {
    if (typeof window === 'undefined') return;
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    scale.value = Math.min(sx, sy);
};

const go = (idx: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    if (clamped === current.value) return;
    navDir.value = clamped > current.value ? 'forward' : 'backward';
    current.value = clamped;
};

const next = () => go(current.value + 1);
const prev = () => go(current.value - 1);

const isSceneActive = (slideIndex: number) =>
    current.value === slideIndex || isPrinting.value || initialWarmup.value;

const toggleFullscreen = async () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
    } else {
        await document.exitFullscreen().catch(() => {});
    }
};

const onFullscreenChange = () => {
    isFullscreen.value = Boolean(document.fullscreenElement);
    setTimeout(updateScale, 60);
};

const startTimer = () => {
    if (timerHandle !== null) return;
    timerHandle = window.setInterval(() => {
        elapsed.value += 1;
    }, 1000);
};

const resetTimer = () => {
    elapsed.value = 0;
    if (timerHandle !== null) {
        clearInterval(timerHandle);
        timerHandle = null;
    }
};

const toggleTimer = () => {
    showTimer.value = !showTimer.value;
    if (showTimer.value && timerHandle === null) startTimer();
};

const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
};

const downloadPdf = () => {
    if (typeof window === 'undefined') return;
    // Trigger native 1920x1080 PDF print stylesheet if pre-rendered PDF is not yet cached on static host
    const link = document.createElement('a');
    link.href = '/treetino-refract-pitchdeck.pdf';
    link.download = 'Treetino-x-Refract-PayFi-RWA-Outline-2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const onBeforePrint = () => {
    isPrinting.value = true;
};

const onAfterPrint = () => {
    isPrinting.value = false;
};

const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const targetEl = e.target as HTMLElement | null;
    const tag = targetEl?.tagName;
    const isRangeInput = tag === 'INPUT' && (targetEl as HTMLInputElement).type === 'range';
    if ((tag === 'INPUT' && !isRangeInput) || tag === 'TEXTAREA') {
        return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (tag === 'BUTTON' && e.key === ' ') return;
        e.preventDefault();
        if (isRangeInput) targetEl?.blur();
        next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        if (isRangeInput) targetEl?.blur();
        prev();
    } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        go(slides.length - 1);
    } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        showNotes.value = !showNotes.value;
    } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTimer();
    } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
        if (showTimer.value) startTimer();
    } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        window.print();
    }
};

let touchStartX = 0;
let touchStartY = 0;
let touchOnControl = false;
const onTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement | null;
    touchOnControl = Boolean(target?.closest('input, button, a, .calc-controls'));
    touchStartX = e.touches[0]?.clientX ?? 0;
    touchStartY = e.touches[0]?.clientY ?? 0;
};
const onTouchEnd = (e: TouchEvent) => {
    if (touchOnControl) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX;
    const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStartY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
    }
};

watch(current, (idx) => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        if (document.activeElement.tagName === 'INPUT') {
            document.activeElement.blur();
        }
    }
    const v = demoVideo.value;
    if (!v) return;
    if (idx === 9) {
        v.currentTime = 0;
        if (!prefersReducedMotion.value) {
            v.play().catch(() => {});
        }
    } else {
        v.pause();
    }
});

const onMotionPrefChange = (ev: MediaQueryListEvent) => {
    prefersReducedMotion.value = ev.matches;
    if (ev.matches && demoVideo.value) {
        demoVideo.value.pause();
    }
};

onMounted(() => {
    previousLocale = locale.value;
    locale.value = 'en';
    document.documentElement.classList.add('pitch-mode');
    updateScale();
    if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        const n = Number.parseInt(hash, 10);
        if (!Number.isNaN(n) && n >= 1 && n <= slides.length) {
            current.value = n - 1;
        }
        motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.value = motionMedia.matches;
        motionMedia.addEventListener('change', onMotionPrefChange);

        const printMedia = window.matchMedia('print');
        if (printMedia.matches) {
            isPrinting.value = true;
        }

        warmupHandle = window.setTimeout(() => {
            initialWarmup.value = false;
        }, 700);
    }

    window.addEventListener('resize', updateScale);
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    window.addEventListener('locale-changed', enforceEnglishLocale);
    document.addEventListener('fullscreenchange', onFullscreenChange);
});

onBeforeUnmount(() => {
    isUnmounting = true;
    window.removeEventListener('locale-changed', enforceEnglishLocale);
    locale.value = previousLocale;
    document.documentElement.classList.remove('pitch-mode');
    window.removeEventListener('resize', updateScale);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('beforeprint', onBeforePrint);
    window.removeEventListener('afterprint', onAfterPrint);
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    motionMedia?.removeEventListener('change', onMotionPrefChange);
    if (timerHandle !== null) clearInterval(timerHandle);
    if (warmupHandle !== null) clearTimeout(warmupHandle);
});
</script>

<template>
    <Head title="Treetino × Refract — PayFi &amp; RWA Launch Outline">
        <meta name="robots" content="noindex, nofollow" />
    </Head>

    <div
        class="pitch-deck refract-deck"
        :class="{ 'reduced-motion': prefersReducedMotion }"
        :data-dir="navDir"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
    >
        <div class="deck-viewport">
            <div class="deck-stage" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
                <!-- =========================================================
                     01 · COVER — Treetino × Refract
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 0 }">
                    <PitchEuropeMap variant="cover" />
                    <div class="glow"></div>

                    <div class="chrome">
                        <div class="flex items-center gap-5">
                            <LogoType className="!h-[32px] w-auto fill-current text-white" />
                            <span class="partner-badge">× Refract</span>
                        </div>
                        <span class="eyebrow">PayFi &amp; RWA Launch Outline · Nov 2026</span>
                    </div>

                    <div class="relative z-10 flex h-full flex-col justify-center" style="padding: 0 128px">
                        <div class="eyebrow rise d1" style="margin-bottom: 26px">
                            Clean Urban Power · Utility BESS · Solana PayFi Settlement
                        </div>
                        <PitchHeadline
                            tag="h1"
                            class="h-display"
                            style="max-width: 1620px"
                            :segments="[
                                { text: 'Real hardware.', break: true },
                                { text: 'Instant USDC.', tone: 'accent', break: true },
                                { text: 'Real-time yield.', tone: 'green' },
                            ]"
                        />
                        <p class="sub rise d3" style="margin-top: 34px; max-width: 1020px">
                            Turning European EV charging and utility battery infrastructure into liquid,
                            machine-verified on-chain cashflow.
                        </p>
                    </div>
                </section>

                <!-- =========================================================
                     02 · 30-DAY DELTA — Since We Last Spoke
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 1 }">
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">01 · Since Late September</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 18px">30-Day Execution Delta</div>
                            <PitchHeadline
                                class="h-slide"
                                style="max-width: 1500px"
                                :segments="[
                                    { text: 'From RWA thesis', break: true },
                                    { text: 'to live PayFi stack.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="delta-grid rise d3">
                            <div class="delta-card is-highlight">
                                <div class="delta-top">
                                    <span class="delta-num">01 · SOLANA &amp; PAYFI</span>
                                    <span class="delta-pill tone-solana">SHIPPED</span>
                                </div>
                                <div class="delta-stat">2nd + 1st</div>
                                <div class="delta-title">Solana CZE &amp; Marinade Wins</div>
                                <p class="delta-desc">
                                    2nd Place at Solana Startup Village CZE, 1st Place Marinade Finance, and live
                                    card-to-USDC settlement built for The FinTechers Stablecoin Track.
                                </p>
                            </div>

                            <div class="delta-card">
                                <div class="delta-top">
                                    <span class="delta-num">02 · DEPIN ECOSYSTEM</span>
                                    <span class="delta-pill tone-green">SIGNED MOU</span>
                                </div>
                                <div class="delta-stat">peaq</div>
                                <div class="delta-title">Ironyard RWA Incubation</div>
                                <p class="delta-desc">
                                    Signed official partnership MoU with peaq to co-structure and fund our Tier 1
                                    Prague charging &amp; battery RWA pilot ($100k).
                                </p>
                            </div>

                            <div class="delta-card">
                                <div class="delta-top">
                                    <span class="delta-num">03 · COMMERCIAL PIPELINE</span>
                                    <span class="delta-pill tone-accent">B2B DEMAND</span>
                                </div>
                                <div class="delta-stat">€3.4M</div>
                                <div class="delta-title">New Smart Energy Forum LOIs</div>
                                <p class="delta-desc">
                                    Added €3.4M in new commercial LOIs on top of €705k in signed Czech installations at
                                    a 40.4% hardware gross margin.
                                </p>
                            </div>

                            <div class="delta-card">
                                <div class="delta-top">
                                    <span class="delta-num">04 · INSTITUTIONAL BACKING</span>
                                    <span class="delta-pill">TRADFI + EU</span>
                                </div>
                                <div class="delta-stat">Top 12</div>
                                <div class="delta-title">CzechInvest, Prusa &amp; Banks</div>
                                <p class="delta-desc">
                                    Top 12 of 200+ CzechInvest startups, Prusa Research Best HW Startup, Forbes
                                    Czechia feature, and active Czech bank acquiring talks.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     03 · PHYSICAL ANCHOR — 3D Kinetic Treetino V1
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 2 }">
                    <!-- Live 3D kinetic Treetino V1 wireframe with anchored 12x wind & 300x solar callouts -->
                    <div
                        class="pointer-events-none absolute top-0 right-0 bottom-0"
                        style="width: 56%; padding: 48px 36px 48px 0"
                    >
                        <InvestorTreeScene
                            :draw="1"
                            :callout-pods="1"
                            :callout-leaves="1"
                            :sun="0.62"
                            :track="0.65"
                            :orbit="0.22"
                            :active="isSceneActive(2)"
                        />
                    </div>
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">02 · Patented Physical Anchor</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 150px 128px 96px; max-width: 980px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 20px">
                                Treetino V1 &amp; V2 · 1 m² Footprint
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Real steel and silicon.', break: true },
                                    { text: 'Zero vaporware.', tone: 'green' },
                                ]"
                            />
                            <p class="sub rise d3" style="margin-top: 28px; max-width: 780px">
                                Patented biomimetic microgrid combining sun-tracking solar leaves, silent vertical
                                wind turbines, LiFePO4 battery storage, and 22 kW EV charging.
                            </p>
                        </div>

                        <div class="stats rise d4" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px">
                            <div>
                                <div class="stat-value tone-accent" style="font-size: 64px">49 kW</div>
                                <div class="stat-label">Peak hybrid output on 1 m²</div>
                            </div>
                            <div>
                                <div class="stat-value tone-green" style="font-size: 64px">40.4%</div>
                                <div class="stat-label">Hardware gross margin</div>
                            </div>
                            <div>
                                <div class="stat-value" style="font-size: 64px">24 / 7</div>
                                <div class="stat-label">Solar + wind + grid arbitrage</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     04 · DEPLOYED COMMERCIAL SITES — Real Contracts
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 3 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">03 · Contracted Hardware Pipeline</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div class="flex items-end justify-between gap-12">
                            <div>
                                <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                    Signed B2B &amp; Municipal Demand
                                </div>
                                <PitchHeadline
                                    class="h-slide"
                                    :segments="[
                                        { text: 'Built, permitted,', break: true },
                                        { text: 'and under contract.', tone: 'accent' },
                                    ]"
                                />
                            </div>
                            <div class="rise d2 text-right" style="padding-bottom: 8px">
                                <div class="stat-value tone-green" style="font-size: 72px">€4.1M+</div>
                                <div class="stat-label">Signed contracts (€705k) + active LOIs (€3.4M)</div>
                            </div>
                        </div>

                        <div
                            class="rise d3 grid grid-cols-3 gap-7"
                            style="height: 490px"
                        >
                            <div class="photo relative">
                                <img
                                    src="/img/im/prague-high-school-v2-site.jpg"
                                    alt="Prague high school V2 installation"
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    class="img-in"
                                />
                                <div
                                    class="absolute inset-x-0 bottom-0 p-7"
                                    style="background: linear-gradient(0deg, rgba(9, 9, 11, 0.92) 0%, transparent 100%)"
                                >
                                    <div class="eyebrow" style="color: #86efac">SIGNED CONTRACT · MUNICIPAL</div>
                                    <div class="mt-1 text-3xl font-semibold text-white">€385k · Prague High School</div>
                                    <div class="mt-1 text-base text-white/65">2× Treetino V2 + campus storage</div>
                                </div>
                            </div>

                            <div class="photo relative">
                                <img
                                    src="/img/im/mkovo-site-measurement.jpg"
                                    alt="MKovo industrial site"
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    class="img-in"
                                />
                                <div
                                    class="absolute inset-x-0 bottom-0 p-7"
                                    style="background: linear-gradient(0deg, rgba(9, 9, 11, 0.92) 0%, transparent 100%)"
                                >
                                    <div class="eyebrow" style="color: #86efac">SIGNED CONTRACT · INDUSTRIAL</div>
                                    <div class="mt-1 text-3xl font-semibold text-white">€320k · MKovo Hub</div>
                                    <div class="mt-1 text-base text-white/65">3× Treetino V1 + fleet EV charging</div>
                                </div>
                            </div>

                            <div class="photo relative">
                                <img
                                    src="/img/pitch/expo-booth-lois.jpg"
                                    alt="Smart Energy Forum Prague booth"
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    class="img-in"
                                />
                                <div
                                    class="absolute inset-x-0 bottom-0 p-7"
                                    style="background: linear-gradient(0deg, rgba(9, 9, 11, 0.92) 0%, transparent 100%)"
                                >
                                    <div class="eyebrow" style="color: #8ec5ff">QUALIFIED PIPELINE · OCT 2026</div>
                                    <div class="mt-1 text-3xl font-semibold text-white">€3.4M · Smart Energy Forum</div>
                                    <div class="mt-1 text-base text-white/65">Commercial parks, retail &amp; EV fleets</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     05 · INSTITUTIONAL YIELD ENGINE — 8.6 MW BESS Přeštice (3D)
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 4 }">
                    <div
                        class="pointer-events-none absolute top-0 right-0 bottom-0"
                        style="width: 56%; padding: 64px 24px 64px 0"
                    >
                        <Web3BessWireframe
                            :draw="1"
                            :orbit="0.32"
                            :active="isSceneActive(4)"
                        />
                    </div>
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">04 · Utility Cash-Flow Engine</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 150px 128px 96px; max-width: 980px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 20px">
                                BESS Přeštice · 8.6 MW / 17.2 MWh · Shovel-Ready
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Utility-scale yield', break: true },
                                    { text: 'on the ČEZ grid.', tone: 'accent' },
                                ]"
                            />
                            <p class="sub rise d3" style="margin-top: 28px; max-width: 800px">
                                Permitted 22 kV ČEZ Distribuce interconnection in West Bohemia. Monetizes SVR
                                frequency balancing and 15-minute OTE spot-price spreads.
                            </p>
                        </div>

                        <div class="stats rise d4" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px">
                            <div>
                                <div class="stat-value tone-green" style="font-size: 62px">$1.0–1.5M</div>
                                <div class="stat-label">Projected annual net EBITDA</div>
                            </div>
                            <div>
                                <div class="stat-value tone-accent" style="font-size: 62px">2.95 yr</div>
                                <div class="stat-label">Capex payback period</div>
                            </div>
                            <div>
                                <div class="stat-value" style="font-size: 62px">25–35%</div>
                                <div class="stat-label">Unlevered project IRR</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     06 · IMMEDIATE RWA PILOT — Tier 1 SIC Smíchov ($100k)
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 5 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">05 · Flagship Pilot Vault</span>
                    </div>

                    <div
                        class="relative z-10 grid h-full grid-cols-12 items-center gap-12"
                        style="padding: 138px 128px 88px"
                    >
                        <div class="col-span-6 flex h-full flex-col justify-between py-4">
                            <div>
                                <div class="eyebrow rise d1" style="margin-bottom: 18px">
                                    Tier 1 Vault · SIC Smíchov (Prague 5)
                                </div>
                                <PitchHeadline
                                    class="h-slide"
                                    :segments="[
                                        { text: 'Live Prague hub.', break: true },
                                        { text: '30.5% APY.', tone: 'green' },
                                    ]"
                                />
                                <p class="sub rise d3" style="margin-top: 26px; max-width: 760px">
                                    Treetino V1 + dual 22 kW EV charging + battery buffer at Středočeské inovační
                                    centrum — structured with peaq as our first on-chain RWA facility vault.
                                </p>
                            </div>

                            <div
                                class="stats rise d4"
                                style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px"
                            >
                                <div>
                                    <div class="stat-value" style="font-size: 58px">$100k</div>
                                    <div class="stat-label">Turnkey ($60k net of EU grant)</div>
                                </div>
                                <div>
                                    <div class="stat-value tone-accent" style="font-size: 58px">18.3%</div>
                                    <div class="stat-label">Base unsubsidized net APY</div>
                                </div>
                                <div>
                                    <div class="stat-value tone-green" style="font-size: 58px">30.5%</div>
                                    <div class="stat-label">Grant-levered vault APY</div>
                                </div>
                            </div>
                        </div>

                        <div class="col-span-6 h-full rise d3">
                            <div class="photo relative h-full w-full">
                                <img
                                    src="/img/pitch/sic-tier1-render.jpg"
                                    alt="SIC Smíchov Prague RWA Hub"
                                    width="960"
                                    height="800"
                                    loading="lazy"
                                    class="img-in"
                                />
                                <div
                                    class="absolute right-6 bottom-6 left-6 flex items-center justify-between rounded-2xl border border-white/15 px-6 py-4"
                                    style="background: rgba(9, 9, 11, 0.82); backdrop-filter: blur(16px)"
                                >
                                    <div>
                                        <div class="eyebrow" style="font-size: 12px; color: #86efac">
                                            VAULT #001 · PRAGUE INNOVATION HUB
                                        </div>
                                        <div class="mt-1 text-xl font-medium text-white">
                                            $18.3k/yr net cashflow · EV + Peak Shaving + Spot
                                        </div>
                                    </div>
                                    <span class="delta-pill tone-green">PEAQ INCUBATED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     07 · ANSWERING THE STABLECOIN QUESTION — MiCA vs PayFi
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 6 }">
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">06 · Regulatory Architecture · Answering the Stablecoin Question</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 136px 128px 86px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                EU MiCA Title IV Reality Check
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                style="max-width: 1640px"
                                :segments="[
                                    { text: 'Don’t issue an EU stablecoin.', break: true },
                                    { text: 'Settle in regulated USDC.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="mica-grid rise d3">
                            <div class="mica-card is-rejected">
                                <div class="mica-header">
                                    <span class="mica-tag is-bad">REJECTED PATH</span>
                                    <span class="mica-sub">Proprietary EU Stablecoin Issuance</span>
                                </div>
                                <div class="mica-title">Why issuing “EUR-Tree” breaks in Europe</div>
                                <ul class="mica-list">
                                    <li>
                                        <span class="mica-mark is-bad">✕</span>
                                        <div>
                                            <strong>Triggers MiCA Title IV EMI license</strong> — requires €350k+
                                            regulatory capital, ČNB supervision, and 12–18 months of legal freeze.
                                        </div>
                                    </li>
                                    <li>
                                        <span class="mica-mark is-bad">✕</span>
                                        <div>
                                            <strong>MiCA Art. 50 bans interest on EMTs</strong> — legally prohibits
                                            passing energy yield directly through a stablecoin wrapper.
                                        </div>
                                    </li>
                                    <li>
                                        <span class="mica-mark is-bad">✕</span>
                                        <div>
                                            <strong>Fragments DEX liquidity &amp; spooks banks</strong> — creates
                                            instant friction with Czech acquiring banks and municipal buyers.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div class="mica-card is-chosen">
                                <div class="mica-header">
                                    <span class="mica-tag is-good">SHIPPED ARCHITECTURE</span>
                                    <span class="mica-sub">PayFi Machine Rails + $TREE Protocol</span>
                                </div>
                                <div class="mica-title">Fiat at the plug → Circle USDC/EURC on Solana</div>
                                <ul class="mica-list">
                                    <li>
                                        <span class="mica-mark is-good">✓</span>
                                        <div>
                                            <strong>Zero MiCA issuer liability</strong> — EV drivers tap Apple Pay or
                                            Visa in EUR/CZK; licensed EMI/VASP settles Circle <code>USDC</code> /
                                            <code>EURC</code>.
                                        </div>
                                    </li>
                                    <li>
                                        <span class="mica-mark is-good">✓</span>
                                        <div>
                                            <strong>1.8-second programmable RWA yield</strong> — net kWh cashflow
                                            streams straight into Solana facility vaults with full legal clarity.
                                        </div>
                                    </li>
                                    <li>
                                        <span class="mica-mark is-good">✓</span>
                                        <div>
                                            <strong>Deep Day-1 liquidity + $TREE upside</strong> — vaults pay real
                                            <code>USDC</code> while protocol fees buy back <code>$TREE</code>.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     08 · PAYFI TAP EXPERIENCE — 3D Charger Gate + Live Receipt
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 7 }">
                    <!-- Live 3D contactless charger payment gate + EV + V2 hybrid tree -->
                    <div
                        class="pointer-events-none absolute left-0"
                        style="top: 310px; bottom: 24px; width: 62%; padding-left: 56px"
                    >
                        <InvestorPaymentScene
                            :tap="1"
                            :settle="1"
                            :scale="0"
                            :orbit="0.14"
                            :active="isSceneActive(7)"
                        />
                    </div>
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">07 · PayFi User Experience</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 136px 128px 84px"
                    >
                        <div class="flex items-end justify-between gap-12">
                            <div>
                                <div class="eyebrow rise d1" style="margin-bottom: 14px">
                                    Invisible Web3 · Instant Settlement
                                </div>
                                <PitchHeadline
                                    class="h-slide"
                                    :segments="[
                                        { text: 'Apple Pay at the plug.', break: true },
                                        { text: 'Solana under the hood.', tone: 'solana' },
                                    ]"
                                />
                            </div>
                            <p class="sub rise d3" style="max-width: 560px; font-size: 26px; padding-bottom: 8px">
                                Zero crypto wallets for drivers. Machine-verified <code>USDC</code> lands in the vault
                                seconds after unplugging.
                            </p>
                        </div>

                        <!-- Live PayFi terminal receipt card -->
                        <div class="kiosk rise d3 self-end">
                            <div class="kiosk-top">
                                <span class="kiosk-dot"></span>
                                <span>PRAGUE · SIC SMÍCHOV · BAY 02</span>
                            </div>
                            <div class="kiosk-kwh">18.4 <span>kWh</span></div>
                            <div class="kiosk-sub">22 kW AC · Victron + OCPP 2.0.1 signed</div>

                            <div class="kiosk-divider"></div>

                            <div class="kiosk-row">
                                <span>Driver paid (Apple Pay)</span>
                                <strong>€8.28 EUR</strong>
                            </div>
                            <div class="kiosk-row">
                                <span>Licensed PayFi conversion</span>
                                <strong class="tone-accent">8.94 USDC</strong>
                            </div>
                            <div class="kiosk-row">
                                <span>Vault split (85% LP / 15% O&amp;M + $TREE)</span>
                                <strong class="tone-green">+7.60 USDC</strong>
                            </div>

                            <div class="kiosk-badge">
                                <span>SOLANA PDA VAULT SETTLED</span>
                                <strong>1.8 s</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     09 · CLOSED-LOOP SETTLEMENT — 3D Web3Ecosystem + Latency
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 8 }">
                    <div
                        class="pointer-events-none absolute inset-x-0"
                        style="top: 210px; bottom: 205px"
                    >
                        <Web3Ecosystem
                            :draw="1"
                            :flow="1"
                            :orbit="0.5"
                            tree-variant="v2-hybrid"
                            :active="isSceneActive(8)"
                        />
                    </div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">08 · Verifiable DePIN Telemetry</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 134px 128px 80px"
                    >
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="eyebrow rise d1" style="margin-bottom: 14px">
                                    Hardware Oracle → On-Chain Escrow
                                </div>
                                <PitchHeadline
                                    class="h-slide"
                                    :segments="[
                                        { text: 'Signed at the inverter.', break: true },
                                        { text: 'Distributed per block.', tone: 'accent' },
                                    ]"
                                />
                            </div>
                            <div class="legend-pills rise d2">
                                <span class="legend-pill"><i class="dot-amber"></i> Physical kWh Flow</span>
                                <span class="legend-pill"><i class="dot-blue"></i> Regulated USDC Settlement</span>
                            </div>
                        </div>

                        <div class="latency-strip rise d3">
                            <div class="latency-step">
                                <span class="latency-t">0.0 s</span>
                                <div class="latency-name">Card Tap or Grid Trade</div>
                                <div class="latency-meta">EV session or 15-min OTE dispatch</div>
                            </div>
                            <div class="latency-step">
                                <span class="latency-t tone-green">0.6 s</span>
                                <div class="latency-name">Hardware Oracle Proof</div>
                                <div class="latency-meta">Victron Cerbo GX + OCPP 2.0.1 hash</div>
                            </div>
                            <div class="latency-step">
                                <span class="latency-t tone-accent">1.4 s</span>
                                <div class="latency-name">Fiat → Circle USDC</div>
                                <div class="latency-meta">Regulated acquiring + VASP rail</div>
                            </div>
                            <div class="latency-step">
                                <span class="latency-t tone-solana">1.8 s</span>
                                <div class="latency-name">Vault + $TREE Buyback</div>
                                <div class="latency-meta">Claimable on Solana (400 ms finality)</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     10 · LIVE PRODUCT DEMO — /video/treetino-demo.mp4
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 9 }">
                    <img
                        src="/img/pitch/demo-poster.jpg"
                        alt="Treetino Solana PayFi product demo"
                        width="1920"
                        height="1080"
                        loading="lazy"
                        class="absolute inset-0 h-full w-full object-cover"
                    />
                    <video
                        ref="demoVideo"
                        class="demo-video absolute inset-0 h-full w-full object-cover"
                        src="/video/treetino-demo.mp4"
                        poster="/img/pitch/demo-poster.jpg"
                        width="1920"
                        height="1080"
                        loading="lazy"
                        preload="metadata"
                        muted
                        playsinline
                        loop
                    ></video>
                    <div
                        class="pointer-events-none absolute inset-x-0 top-0"
                        style="height: 180px; background: linear-gradient(180deg, rgba(9, 9, 11, 0.78) 0%, transparent 100%)"
                    ></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white" />
                        <span class="demo-live-pill">
                            <span class="demo-live-dot"></span>
                            LIVE PRODUCT · SOLANA VAULTS &amp; TELEMETRY
                        </span>
                    </div>
                </section>

                <!-- =========================================================
                     11 · DUAL-LAYER TOKEN DESIGN — 3D Web3PhoneWallet
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 10 }">
                    <div
                        class="pointer-events-none absolute top-0 right-0 bottom-0"
                        style="width: 48%; padding: 56px 40px 56px 0"
                    >
                        <Web3PhoneWallet
                            :draw="1"
                            :ui="1"
                            :orbit="1"
                            :active="isSceneActive(10)"
                        />
                    </div>
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">10 · Dual-Layer Token Architecture</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 86px; max-width: 1100px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                Built for Post-TGE Longevity
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Two clean layers.', break: true },
                                    { text: 'Zero Ponzi emissions.', tone: 'solana' },
                                ]"
                            />
                        </div>

                        <div class="dual-stack rise d3">
                            <div class="dual-card is-usdc">
                                <div class="dual-head">
                                    <span class="eyebrow" style="color: #86efac">LAYER 01 · ASSET VAULTS</span>
                                    <span class="dual-badge is-green">18 – 30% REAL APY</span>
                                </div>
                                <div class="dual-title">Non-Dilutive USDC Facility Vaults</div>
                                <p class="dual-body">
                                    Fractionalized RWA pools per energy site (SIC Smíchov, Přeštice BESS). Investors
                                    deposit <code>USDC</code> and claim real kWh revenue with zero token inflation
                                    risk.
                                </p>
                            </div>

                            <div class="dual-card is-tree">
                                <div class="dual-head">
                                    <span class="eyebrow" style="color: #6ee7b7">LAYER 02 · PROTOCOL TOKEN</span>
                                    <span class="dual-badge is-solana">$TREE · 1B FIXED SUPPLY</span>
                                </div>
                                <div class="dual-title">$TREE PayFi Coordination &amp; Fee Engine</div>
                                <p class="dual-body">
                                    Captures <strong>1.5% hardware origination fees</strong>,
                                    <strong>10% performance fees on net kWh yield</strong>, and
                                    <strong>PayFi tap / TreeApp SaaS fees</strong> — driving programmatic buybacks,
                                    vault priority access, and boosted staking tiers ($35M FDV seed benchmark).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     12 · OPCO VS PROTOCOLCO FIREWALL — Ring-Fencing
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 11 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">11 · Corporate &amp; Regulatory Ring-Fencing</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                Institutional Safety + Global Web3 Scale
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Bank-safe in Europe.', break: true },
                                    { text: 'Liquid globally.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="firewall-grid rise d3">
                            <div class="fw-box">
                                <div class="fw-tag">EU HARDWARE OPCO</div>
                                <div class="fw-name">Treetino Corp s.r.o.</div>
                                <div class="fw-loc">Czech Republic · 100% Ring-Fenced</div>
                                <ul class="fw-list">
                                    <li>Holds EU patents, Prusa R&amp;D &amp; manufacturing IP</li>
                                    <li>Executes municipal, school &amp; MKovo B2B contracts</li>
                                    <li>Receives CzechInvest &amp; EU modernization grants</li>
                                    <li>Maintains Czech bank &amp; Tapaya card-acquiring rails</li>
                                </ul>
                                <div class="fw-foot">0% Token Issuance Liability</div>
                            </div>

                            <div class="fw-bridge">
                                <div class="fw-arrow-card">
                                    <span class="eyebrow" style="font-size: 11px; color: #8ec5ff">ARM’S-LENGTH SLA</span>
                                    <div class="mt-2 text-lg font-medium text-white">Turnkey Hardware &amp; O&amp;M</div>
                                    <div class="mt-1 text-sm text-white/55">Engineering, grid permits &amp; maintenance</div>
                                    <div class="fw-line"></div>
                                    <span class="eyebrow" style="font-size: 11px; color: #86efac">SIGNED ORACLE FEED</span>
                                    <div class="mt-2 text-lg font-medium text-white">Metered USDC Settlement</div>
                                    <div class="mt-1 text-sm text-white/55">1.5% origination + 10% net yield fee</div>
                                </div>
                            </div>

                            <div class="fw-box is-protocol">
                                <div class="fw-tag is-solana">WEB3 PROTOCOL ENTITY</div>
                                <div class="fw-name">Treetino ProtocolCo</div>
                                <div class="fw-loc">Dedicated Foundation / BVI / Swiss Wrapper</div>
                                <ul class="fw-list">
                                    <li>Issues <code>$TREE</code> &amp; governs Solana RWA smart contracts</li>
                                    <li>Runs SAFT / token warrant rounds with Web3 funds</li>
                                    <li>Executes global KOL, community &amp; launchpad GTM</li>
                                    <li>Manages Tier-1 CEX listings &amp; market-maker liquidity</li>
                                </ul>
                                <div class="fw-foot is-solana">Scope of Treetino × Refract Mandate</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     13 · PARTNERSHIP FIT — What Treetino Brings vs Refract
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 12 }">
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">12 · Complementary Strengths</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                Why Treetino × Refract Works
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'We build the grid.', break: true },
                                    { text: 'You scale the liquid market.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="fit-split rise d3">
                            <div class="fit-col">
                                <div class="fit-header">
                                    <span class="eyebrow" style="color: #86efac">WHAT TREETINO BRINGS</span>
                                </div>
                                <div class="fit-item">
                                    <span class="fit-idx">01</span>
                                    <div>
                                        <div class="fit-title">Contracted Hardware &amp; 8.6 MW BESS</div>
                                        <p class="fit-desc">
                                            Patented 49 kW kinetic trees (€4.1M+ signed/LOI pipeline) plus shovel-ready
                                            utility storage ($1.0M–$1.5M annual EBITDA).
                                        </p>
                                    </div>
                                </div>
                                <div class="fit-item">
                                    <span class="fit-idx">02</span>
                                    <div>
                                        <div class="fit-title">Live Solana PayFi Code &amp; TradFi Rails</div>
                                        <p class="fit-desc">
                                            Working Solana vaults, Victron/OCPP telemetry, peaq Ironyard MoU,
                                            CzechInvest/Prusa backing, and bank acquiring partnerships.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="fit-col is-refract">
                                <div class="fit-header">
                                    <span class="eyebrow" style="color: #8ec5ff">WHAT REFRACT BRINGS</span>
                                </div>
                                <div class="fit-item">
                                    <span class="fit-idx">03</span>
                                    <div>
                                        <div class="fit-title">Proven RWA Fundraising &amp; KOL Engine</div>
                                        <p class="fit-desc">
                                            Battle-tested RWA token narrative from scaling <code>$LINGO</code>, backed
                                            by direct access to 500+ Web3 funds, angels, and Tier-1 creators.
                                        </p>
                                    </div>
                                </div>
                                <div class="fit-item">
                                    <span class="fit-idx">04</span>
                                    <div>
                                        <div class="fit-title">Launchpad, Market-Making &amp; CEX Pipes</div>
                                        <p class="fit-desc">
                                            End-to-end TGE orchestration across ChainGPT Pad, partner launchpads,
                                            liquidity provisioning, and Tier-1 CEX listing committees.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     14 · TWO COLLABORATION TRACKS — Milestone-Gated
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 13 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">13 · Phased Collaboration Model</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                Validate Fast · Scale With Zero Cash Burn
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Two clear tracks.', break: true },
                                    { text: 'Milestone-gated.', tone: 'green' },
                                ]"
                            />
                        </div>

                        <div class="tracks-grid rise d3">
                            <div class="track-card">
                                <div class="track-top">
                                    <span class="track-badge is-green">TRACK 01 · WEEKS 1–6</span>
                                    <span class="eyebrow" style="font-size: 12px">PROVE SYNDICATE FIT</span>
                                </div>
                                <div class="track-title">Strategic Anchor + RWA Vault #1</div>
                                <p class="track-lead">
                                    Close initial Web3 strategic SAFT tranche and co-fill on-chain USDC facility
                                    liquidity before committing TGE marketing spend.
                                </p>
                                <div class="track-metrics">
                                    <div>
                                        <strong>$500k+</strong>
                                        <span>First strategic close gate</span>
                                    </div>
                                    <div>
                                        <strong>$0 Upfront</strong>
                                        <span>OpCo hardware cash burn</span>
                                    </div>
                                    <div>
                                        <strong>Escrowed</strong>
                                        <span>GTM warchest funded from raise</span>
                                    </div>
                                </div>
                            </div>

                            <div class="track-card is-accent">
                                <div class="track-top">
                                    <span class="track-badge is-blue">TRACK 02 · WEEKS 4–14</span>
                                    <span class="eyebrow" style="font-size: 12px">UNLOCKED BY TRACK 01</span>
                                </div>
                                <div class="track-title">Full $TREE PayFi Launch &amp; Tier-1 TGE</div>
                                <p class="track-lead">
                                    Scale global Web3 community, launchpad rounds (ChainGPT Pad + partners), and
                                    Tier-1 CEX listings backed by live mainnet energy yield.
                                </p>
                                <div class="track-metrics">
                                    <div>
                                        <strong>$2.5M–$5M</strong>
                                        <span>Target protocol &amp; vault raise</span>
                                    </div>
                                    <div>
                                        <strong>Day-1 Yield</strong>
                                        <span>Live USDC staking at TGE</span>
                                    </div>
                                    <div>
                                        <strong>24m Vest</strong>
                                        <span>Long-term $TREE alignment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     15 · INTERACTIVE DEAL & CAPITAL WATERFALL SIMULATOR
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 14 }">
                    <div class="glow"></div>

                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">14 · Interactive Deal &amp; Raise Waterfall</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 132px 128px 80px"
                    >
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="eyebrow rise d1" style="margin-bottom: 12px">
                                    Live Alignment Model · Drag to Stress-Test
                                </div>
                                <PitchHeadline
                                    class="h-slide"
                                    style="font-size: 76px"
                                    :segments="[
                                        { text: 'Aligned upside.' },
                                        { text: 'Zero upfront burn.', tone: 'accent' },
                                    ]"
                                />
                            </div>
                            <div class="ringfence-pill rise d2">
                                Ring-Fenced: EU Grants, peaq &amp; Existing TradFi Excluded from Fee Waterfall
                            </div>
                        </div>

                        <div class="calc rise d3">
                            <div class="calc-controls">
                                <label class="calc-row">
                                    <div class="calc-row-head">
                                        <span>Web3 Protocol Raise (Refract Syndicate + IDO)</span>
                                        <strong>${{ raiseUsdM.toFixed(1) }}M</strong>
                                    </div>
                                    <input
                                        v-model.number="raiseUsdM"
                                        type="range"
                                        min="0.5"
                                        max="5.5"
                                        step="0.25"
                                    />
                                    <div class="calc-scale"><span>$0.5M</span><span>$3.0M</span><span>$5.5M</span></div>
                                </label>

                                <label class="calc-row">
                                    <div class="calc-row-head">
                                        <span>On-Chain USDC RWA Vault TVL</span>
                                        <strong>${{ vaultTvlM.toFixed(1) }}M</strong>
                                    </div>
                                    <input
                                        v-model.number="vaultTvlM"
                                        type="range"
                                        min="0.1"
                                        max="10.0"
                                        step="0.1"
                                    />
                                    <div class="calc-scale"><span>$100k</span><span>$5.0M</span><span>$10.0M</span></div>
                                </label>

                                <label class="calc-row">
                                    <div class="calc-row-head">
                                        <span>Escrowed GTM &amp; KOL Budget (From Closed Raise)</span>
                                        <strong>{{ gtmAllocPct }}% · {{ fmtUsd(gtmBudgetUsd) }}</strong>
                                    </div>
                                    <input
                                        v-model.number="gtmAllocPct"
                                        type="range"
                                        min="5"
                                        max="18"
                                        step="1"
                                    />
                                    <div class="calc-scale"><span>5%</span><span>10% ($0 upfront)</span><span>18%</span></div>
                                </label>

                                <label class="calc-row">
                                    <div class="calc-row-head">
                                        <span>Success Fee (Whitelisted Refract Intros Only)</span>
                                        <strong>{{ cashSuccessPct }}% + 2.0% $TREE (24m vest)</strong>
                                    </div>
                                    <input
                                        v-model.number="cashSuccessPct"
                                        type="range"
                                        min="5"
                                        max="12"
                                        step="1"
                                    />
                                    <div class="calc-scale"><span>5%</span><span>8% standard</span><span>12%</span></div>
                                </label>
                            </div>

                            <div class="calc-results">
                                <div class="calc-hero">
                                    <div class="eyebrow">NET TREASURY TO RWA &amp; PROTOCOL EXPANSION</div>
                                    <div class="stat-value tone-accent" style="font-size: 92px; margin-top: 8px">
                                        {{ fmtUsd(netProtocolTreasuryUsd) }}
                                    </div>
                                    <div class="stat-label" style="margin-top: 8px">
                                        After {{ fmtUsd(gtmBudgetUsd) }} escrowed GTM warchest &amp;
                                        {{ fmtUsd(successFeeUsd) }} whitelisted success fee ·
                                        <strong class="text-white">$0 upfront OpCo cash drain</strong>
                                    </div>
                                </div>

                                <div class="calc-sub-grid">
                                    <div class="calc-sub-card">
                                        <div class="eyebrow">VAULT LP YIELD / YR</div>
                                        <div class="calc-sub-val tone-green">{{ fmtUsd(annualVaultYieldUsd) }}</div>
                                        <div class="stat-label">Real USDC streamed from kWh &amp; BESS</div>
                                    </div>
                                    <div class="calc-sub-card">
                                        <div class="eyebrow">$TREE BUYBACK &amp; FEES / YR</div>
                                        <div class="calc-sub-val tone-solana">{{ fmtUsd(annualProtocolFeesUsd) }}</div>
                                        <div class="stat-label">1.5% origination + 10% yield + PayFi SaaS</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     16 · 12-WEEK EXECUTION ROADMAP
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 15 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">15 · 12-Week Execution Roadmap</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 138px 128px 88px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 16px">
                                Q4 2026 – Q1 2027 · Objective Milestone Gates
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Twelve weeks', break: true },
                                    { text: 'to liquid RWA rails.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="timeline rise d3">
                            <div class="tl-step">
                                <div class="tl-week">WEEKS 1–2</div>
                                <div class="tl-dot"></div>
                                <div class="tl-title">Ring-Fence &amp; Term Sheet</div>
                                <p class="tl-desc">
                                    Sign milestone mandate, lock named investor whitelist, and incorporate ProtocolCo
                                    wrapper.
                                </p>
                            </div>

                            <div class="tl-step">
                                <div class="tl-week">WEEKS 3–5</div>
                                <div class="tl-dot is-green"></div>
                                <div class="tl-title">Strategic Anchor Close</div>
                                <p class="tl-desc">
                                    Refract syndicate roadshow; close first $500k+ SAFT gate to unlock escrowed GTM
                                    budget.
                                </p>
                            </div>

                            <div class="tl-step">
                                <div class="tl-week">WEEKS 6–8</div>
                                <div class="tl-dot is-blue"></div>
                                <div class="tl-title">Mainnet Vault #001</div>
                                <p class="tl-desc">
                                    Deploy SIC Smíchov USDC vault on Solana mainnet with live hardware oracle
                                    dashboard.
                                </p>
                            </div>

                            <div class="tl-step">
                                <div class="tl-week">WEEKS 9–10</div>
                                <div class="tl-dot is-blue"></div>
                                <div class="tl-title">Launchpad &amp; CEX Prep</div>
                                <p class="tl-desc">
                                    Institutional-grade PayFi campaign, ChainGPT Pad / IDO rounds, and market-maker
                                    onboarding.
                                </p>
                            </div>

                            <div class="tl-step">
                                <div class="tl-week">WEEKS 11–12</div>
                                <div class="tl-dot is-solana"></div>
                                <div class="tl-title">$TREE TGE + BESS Scale</div>
                                <p class="tl-desc">
                                    Liquid TGE with Day-1 real USDC staking yield and Přeštice 8.6 MW BESS tranche
                                    kickoff.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     17 · FIVE DECISIONS TO ALIGN TODAY
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 16 }">
                    <div class="chrome">
                        <LogoType className="!h-[26px] w-auto fill-current text-white/80" />
                        <span class="eyebrow">16 · Mutual Alignment</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 136px 128px 84px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 14px">
                                Decision Checklist for Today’s Call
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                :segments="[
                                    { text: 'Clear guardrails.', break: true },
                                    { text: 'Fast execution.', tone: 'green' },
                                ]"
                            />
                        </div>

                        <div class="align-grid rise d3">
                            <div class="align-left">
                                <div class="eyebrow" style="color: #86efac; margin-bottom: 18px">
                                    TREETINO COMMITS DAY 1
                                </div>
                                <ul class="commit-list">
                                    <li>
                                        <strong>Working Solana PayFi code &amp; live telemetry</strong> — ready for
                                        technical due diligence and mainnet audit.
                                    </li>
                                    <li>
                                        <strong>Real European energy cashflows</strong> — €4.1M+ commercial pipeline,
                                        SIC Prague hub, and 8.6 MW BESS Přeštice.
                                    </li>
                                    <li>
                                        <strong>Direct founder bandwidth</strong> — rapid investor calls, data-room
                                        transparency, and physical Prague site visits.
                                    </li>
                                </ul>
                            </div>

                            <div class="align-right">
                                <div class="eyebrow" style="color: #8ec5ff; margin-bottom: 18px">
                                    5 POINTS TO LOCK WITH REFRACT
                                </div>
                                <div class="q-list">
                                    <div class="q-row">
                                        <span>01</span>
                                        <div>
                                            <strong>PayFi over Stablecoin Issuance:</strong> Circle
                                            <code>USDC</code>/<code>EURC</code> settlement + <code>$TREE</code> (no
                                            MiCA EMT trap).
                                        </div>
                                    </div>
                                    <div class="q-row">
                                        <span>02</span>
                                        <div>
                                            <strong>Entity Firewall:</strong> Dedicated ProtocolCo issues
                                            <code>$TREE</code>; Czech hardware OpCo stays 100% ring-fenced.
                                        </div>
                                    </div>
                                    <div class="q-row">
                                        <span>03</span>
                                        <div>
                                            <strong>Raise-Funded GTM:</strong> $50k+ KOL/marketing warchest unlocks
                                            from first closed Web3 tranche ($0 upfront hardware drain).
                                        </div>
                                    </div>
                                    <div class="q-row">
                                        <span>04</span>
                                        <div>
                                            <strong>Whitelisted Attribution:</strong> Success fees apply strictly to
                                            approved Refract intros + 24m vested <code>$TREE</code>.
                                        </div>
                                    </div>
                                    <div class="q-row">
                                        <span>05</span>
                                        <div>
                                            <strong>Institutional Brand Tone:</strong> Clean PayFi / RWA narrative safe
                                            for EU banks, schools &amp; CzechInvest.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- =========================================================
                     18 · FOUNDERS & CLOSE
                     ========================================================= -->
                <section class="slide" :class="{ 'is-active': current === 17 }">
                    <PitchEuropeMap variant="close" />
                    <div class="glow"></div>

                    <div class="chrome">
                        <div class="flex items-center gap-5">
                            <LogoType className="!h-[32px] w-auto fill-current text-white" />
                            <span class="partner-badge">× Refract</span>
                        </div>
                        <span class="eyebrow">Next Step · 1-Page Term Sheet by Friday</span>
                    </div>

                    <div
                        class="relative z-10 flex h-full flex-col justify-between"
                        style="padding: 146px 128px 86px"
                    >
                        <div>
                            <div class="eyebrow rise d1" style="margin-bottom: 20px">
                                Treetino × Refract · PayFi &amp; RWA Launch
                            </div>
                            <PitchHeadline
                                class="h-slide"
                                style="max-width: 1580px; font-size: 92px"
                                :segments="[
                                    { text: 'Tap a card. Settle in USDC.', break: true },
                                    { text: 'Own the European grid.', tone: 'accent' },
                                ]"
                            />
                        </div>

                        <div class="close-bottom rise d3">
                            <div class="founders-strip">
                                <div class="founder-chip">
                                    <img
                                        src="/img/founders/jakub-portrait.jpg"
                                        alt="Jakub Lustyk"
                                        width="72"
                                        height="72"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div class="founder-name">Jakub Lustyk</div>
                                        <div class="founder-role">Co-Founder · Web3, PayFi &amp; Product</div>
                                    </div>
                                </div>

                                <div class="founder-chip">
                                    <img
                                        src="/img/founders/dominik-portrait.jpg"
                                        alt="Dominik Mašek"
                                        width="72"
                                        height="72"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div class="founder-name">Dominik Mašek</div>
                                        <div class="founder-role">Co-Founder · Hardware, Patents &amp; BESS</div>
                                    </div>
                                </div>

                                <div class="founder-chip is-initials">
                                    <div class="founder-avatar">MR</div>
                                    <div>
                                        <div class="founder-name">Marian-Daniel Rolník</div>
                                        <div class="founder-role">Co-Founder · Architecture &amp; Strategy</div>
                                    </div>
                                </div>
                            </div>

                            <div class="close-cta">
                                <div class="eyebrow" style="color: #86efac">PROPOSED FRIDAY GATE</div>
                                <div class="mt-1 text-2xl font-medium text-white">
                                    1-Page Mandate Outline · Whitelist + Milestone Escrow
                                </div>
                                <div class="mt-2 font-mono text-sm text-white/60">
                                    jakub.lustyk@treetino.com · treetino.eu/web3 · treetino.eu/investors
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- =========================================================
             PRESENTER UI (NEVER PRINTED — .deck-ui)
             ========================================================= -->
        <button
            v-if="current !== 14"
            type="button"
            aria-label="Previous slide"
            class="deck-ui nav-zone left-0"
            @click="prev"
        ></button>
        <button
            v-if="current !== 14"
            type="button"
            aria-label="Next slide"
            class="deck-ui nav-zone right-0"
            @click="next"
        ></button>

        <div class="deck-ui fixed inset-x-0 top-0 z-30 h-[2px] bg-white/5">
            <div
                class="h-full bg-[#4d8dff] transition-[width] duration-500 ease-out"
                :style="{ width: `${((current + 1) / slides.length) * 100}%` }"
            ></div>
        </div>

        <aside
            v-if="showNotes"
            class="deck-ui fixed bottom-6 left-6 z-40 w-[560px] max-w-[calc(100vw-3rem)] rounded-2xl border border-white/12 bg-zinc-950/92 p-5 text-white shadow-2xl backdrop-blur-xl"
        >
            <div class="flex items-center justify-between font-mono text-[11px] tracking-wider text-white/45 uppercase tabular-nums">
                <span>
                    {{ String(current + 1).padStart(2, '0') }} / {{ slides.length }} · {{ slides[current]?.label }}
                </span>
                <span>Target {{ slides[current]?.duration }}s · N to hide</span>
            </div>
            <p class="mt-2.5 text-sm leading-relaxed text-white/85">{{ slides[current]?.note }}</p>
            <div v-if="slides[current]?.guardrail" class="notes-guardrail">
                <strong>CALL GUARDRAIL:</strong> {{ slides[current]?.guardrail }}
            </div>
        </aside>

        <div
            v-if="showTimer"
            class="deck-ui fixed top-5 right-6 z-40 flex cursor-pointer items-center gap-2 rounded-full border border-white/12 bg-zinc-950/88 px-4 py-1.5 font-mono text-xs text-white/80 backdrop-blur-md tabular-nums"
            title="Click or press R to reset timer"
            @click="resetTimer"
        >
            <span class="font-semibold text-[#8ec5ff]">{{ formatTime(elapsed) }}</span>
            <span class="text-white/30">/</span>
            <span class="text-white/55">
                pace {{ formatTime(targetElapsedAtSlide) }} · total {{ formatTime(totalTargetSeconds) }}
            </span>
        </div>

        <nav
            class="deck-ui fixed right-6 bottom-6 z-40 flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/85 p-1.5 text-white/75 shadow-xl backdrop-blur-md"
            aria-label="Slide navigation"
        >
            <button type="button" class="ui-btn" :disabled="current === 0" aria-label="Previous slide" @click="prev">
                <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="refract-counter px-2 font-mono text-xs tabular-nums">
                {{ String(current + 1).padStart(2, '0') }} / {{ slides.length }}
            </span>
            <button
                type="button"
                class="ui-btn"
                :disabled="current === slides.length - 1"
                aria-label="Next slide"
                @click="next"
            >
                <ChevronRight class="h-4 w-4" />
            </button>
            <span class="mx-1 h-4 w-px bg-white/10"></span>
            <button
                type="button"
                class="ui-btn"
                :class="showNotes && 'bg-white/12 text-white'"
                title="Speaker notes &amp; call guardrails (N)"
                aria-label="Speaker notes (N)"
                @click="showNotes = !showNotes"
            >
                <NotebookText class="h-4 w-4" />
            </button>
            <button
                type="button"
                class="ui-btn"
                :class="showTimer && 'bg-white/12 text-white'"
                title="Call pace timer (T)"
                aria-label="Call pace timer (T)"
                @click="toggleTimer"
            >
                <Timer class="h-4 w-4" />
            </button>
            <button type="button" class="ui-btn" title="Fullscreen (F)" aria-label="Fullscreen (F)" @click="toggleFullscreen">
                <Maximize class="h-4 w-4" />
            </button>
            <button
                type="button"
                class="ui-btn gap-1.5 px-2.5 text-xs"
                title="Download PDF (or press P to print)"
                aria-label="Download PDF"
                @click="downloadPdf"
            >
                <Download class="h-4 w-4" />
                PDF
            </button>
        </nav>
    </div>
</template>

<style scoped>
/* Partner badge in top-left chrome */
.refract-deck :deep(.photo) {
    aspect-ratio: auto;
    height: 100%;
}

.refract-deck :deep(.rise.d1) {
    --d: 90ms;
}
.refract-deck :deep(.rise.d2) {
    --d: 210ms;
}
.refract-deck :deep(.rise.d3) {
    --d: 340ms;
}
.refract-deck :deep(.rise.d4) {
    --d: 470ms;
}

.partner-badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 999px;
    border: 1px solid rgba(142, 197, 255, 0.35);
    background: rgba(142, 197, 255, 0.1);
    color: #8ec5ff;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.08em;
}

/* Slide 02 · 30-Day Delta 4-column grid */
.delta-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
}

.delta-card {
    display: flex;
    flex-direction: column;
    padding: 32px 30px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.028);
    border: 1px solid rgba(255, 255, 255, 0.09);
}

.delta-card.is-highlight {
    background: linear-gradient(180deg, rgba(142, 197, 255, 0.09) 0%, rgba(20, 241, 149, 0.03) 100%);
    border-color: rgba(142, 197, 255, 0.34);
}

.delta-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.delta-num {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.46);
}

.delta-pill {
    padding: 4px 10px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
}

.delta-stat {
    margin-top: 28px;
    font-size: 58px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;
    color: #fafafa;
    font-variant-numeric: tabular-nums;
}

.delta-title {
    margin-top: 16px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.delta-desc {
    margin-top: 12px;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.6);
}

/* Slide 07 · MiCA vs PayFi matrix */
.mica-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
}

.mica-card {
    padding: 36px 40px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.025);
}

.mica-card.is-rejected {
    border-color: rgba(248, 113, 113, 0.26);
    background: linear-gradient(180deg, rgba(248, 113, 113, 0.06) 0%, rgba(9, 9, 11, 0.4) 100%);
}

.mica-card.is-chosen {
    border-color: rgba(134, 239, 172, 0.36);
    background: linear-gradient(180deg, rgba(134, 239, 172, 0.08) 0%, rgba(142, 197, 255, 0.04) 100%);
}

.mica-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mica-tag {
    padding: 5px 12px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
}

.mica-tag.is-bad {
    background: rgba(248, 113, 113, 0.15);
    color: #fca5a5;
}

.mica-tag.is-good {
    background: rgba(134, 239, 172, 0.16);
    color: #86efac;
}

.mica-sub {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.48);
}

.mica-title {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: #fafafa;
}

.mica-list {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    list-style: none;
    padding: 0;
}

.mica-list li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    font-size: 18px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.72);
}

.mica-list strong {
    color: #ffffff;
    font-weight: 600;
}

.mica-list code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 15px;
    color: #8ec5ff;
}

.mica-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    margin-top: 2px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
}

.mica-mark.is-bad {
    background: rgba(248, 113, 113, 0.16);
    color: #fca5a5;
}

.mica-mark.is-good {
    background: rgba(134, 239, 172, 0.18);
    color: #86efac;
}

/* Slide 08 · Kiosk PayFi receipt card */
.kiosk {
    width: 560px;
    padding: 36px 38px;
    border-radius: 26px;
    background: rgba(12, 14, 20, 0.86);
    border: 1px solid rgba(142, 197, 255, 0.28);
    backdrop-filter: blur(22px);
    box-shadow: 0 32px 90px rgba(0, 0, 0, 0.65);
}

.kiosk-top {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.62);
}

.kiosk-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #86efac;
    box-shadow: 0 0 12px #86efac;
}

.kiosk-kwh {
    margin-top: 22px;
    font-size: 84px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
}

.kiosk-kwh span {
    font-size: 34px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
}

.kiosk-sub {
    margin-top: 8px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.52);
}

.kiosk-divider {
    height: 1px;
    margin: 26px 0;
    background: rgba(255, 255, 255, 0.1);
}

.kiosk-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.65);
}

.kiosk-row strong {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 19px;
    font-weight: 600;
    color: #ffffff;
}

.kiosk-badge {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-radius: 14px;
    background: rgba(20, 241, 149, 0.1);
    border: 1px solid rgba(20, 241, 149, 0.35);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    letter-spacing: 0.12em;
    color: #86efac;
}

.kiosk-badge strong {
    font-size: 20px;
    color: #ffffff;
}

/* Slide 09 · Latency strip & legend */
.legend-pills {
    display: flex;
    gap: 14px;
    padding-bottom: 8px;
}

.legend-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(9, 9, 11, 0.72);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.78);
}

.dot-amber,
.dot-blue {
    width: 9px;
    height: 9px;
    border-radius: 999px;
}

.dot-amber {
    background: #fbbf24;
}

.dot-blue {
    background: #8ec5ff;
}

.latency-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
}

.latency-step {
    padding: 20px 24px;
    border-radius: 18px;
    background: rgba(9, 9, 11, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
}

.latency-t {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
}

.latency-name {
    margin-top: 6px;
    font-size: 19px;
    font-weight: 600;
    color: #fafafa;
}

.latency-meta {
    margin-top: 4px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.52);
}

/* Slide 10 · Live demo pill */
.demo-live-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(9, 9, 11, 0.78);
    border: 1px solid rgba(134, 239, 172, 0.35);
    backdrop-filter: blur(12px);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    letter-spacing: 0.14em;
    color: #86efac;
}

.demo-live-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #86efac;
}

/* Slide 11 · Dual-Layer Token Cards */
.dual-stack {
    display: flex;
    flex-direction: column;
    gap: 22px;
    max-width: 920px;
}

.dual-card {
    padding: 30px 34px;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(9, 9, 11, 0.78);
    backdrop-filter: blur(16px);
}

.dual-card.is-usdc {
    border-color: rgba(134, 239, 172, 0.3);
}

.dual-card.is-tree {
    border-color: rgba(142, 197, 255, 0.36);
    background: linear-gradient(135deg, rgba(20, 241, 149, 0.06) 0%, rgba(153, 69, 255, 0.06) 100%);
}

.dual-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dual-badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    font-weight: 600;
}

.dual-badge.is-green {
    background: rgba(134, 239, 172, 0.14);
    color: #86efac;
}

.dual-badge.is-solana {
    background: rgba(142, 197, 255, 0.14);
    color: #8ec5ff;
}

.dual-title {
    margin-top: 12px;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.dual-body {
    margin-top: 10px;
    font-size: 17px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.68);
}

.dual-body strong {
    color: #ffffff;
}

.dual-body code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    color: #8ec5ff;
}

/* Slide 12 · OpCo vs ProtocolCo Firewall */
.firewall-grid {
    display: grid;
    grid-template-columns: 1fr 360px 1fr;
    gap: 26px;
    align-items: stretch;
}

.fw-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 38px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.028);
    border: 1px solid rgba(255, 255, 255, 0.11);
}

.fw-box.is-protocol {
    border-color: rgba(142, 197, 255, 0.38);
    background: linear-gradient(180deg, rgba(142, 197, 255, 0.08) 0%, rgba(20, 241, 149, 0.04) 100%);
}

.fw-tag {
    display: inline-block;
    align-self: flex-start;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.78);
}

.fw-tag.is-solana {
    background: rgba(142, 197, 255, 0.16);
    color: #8ec5ff;
}

.fw-name {
    margin-top: 18px;
    font-size: 36px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #ffffff;
}

.fw-loc {
    margin-top: 4px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.5);
}

.fw-list {
    margin: 24px 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 18px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.74);
}

.fw-list code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    color: #8ec5ff;
}

.fw-foot {
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.09);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #86efac;
}

.fw-foot.is-solana {
    color: #8ec5ff;
}

.fw-bridge {
    display: flex;
    align-items: center;
}

.fw-arrow-card {
    width: 100%;
    padding: 30px 26px;
    border-radius: 20px;
    border: 1px dashed rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.02);
    text-align: center;
}

.fw-line {
    height: 1px;
    margin: 22px 0;
    background: linear-gradient(90deg, transparent, rgba(142, 197, 255, 0.5), transparent);
}

/* Slide 13 · Fit Split */
.fit-split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
}

.fit-col {
    padding: 36px 40px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.028);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.fit-col.is-refract {
    border-color: rgba(142, 197, 255, 0.32);
    background: linear-gradient(180deg, rgba(142, 197, 255, 0.07) 0%, rgba(9, 9, 11, 0.4) 100%);
}

.fit-header {
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.fit-item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.fit-idx {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    padding-top: 4px;
}

.fit-title {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.fit-desc {
    margin-top: 8px;
    font-size: 17px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.64);
}

.fit-desc code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    color: #8ec5ff;
}

/* Slide 14 · Two Tracks */
.tracks-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
}

.track-card {
    padding: 40px 42px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(134, 239, 172, 0.28);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 430px;
}

.track-card.is-accent {
    border-color: rgba(142, 197, 255, 0.35);
    background: linear-gradient(180deg, rgba(142, 197, 255, 0.08) 0%, rgba(9, 9, 11, 0.4) 100%);
}

.track-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.track-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
}

.track-badge.is-green {
    background: rgba(134, 239, 172, 0.15);
    color: #86efac;
}

.track-badge.is-blue {
    background: rgba(142, 197, 255, 0.16);
    color: #8ec5ff;
}

.track-title {
    margin-top: 22px;
    font-size: 36px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #ffffff;
}

.track-lead {
    margin-top: 12px;
    font-size: 19px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.66);
}

.track-metrics {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
}

.track-metrics strong {
    display: block;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.track-metrics span {
    display: block;
    margin-top: 4px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.54);
}

/* Slide 15 · Interactive Deal & Raise Simulator */
.ringfence-pill {
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid rgba(134, 239, 172, 0.32);
    background: rgba(134, 239, 172, 0.08);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: #86efac;
}

.calc {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 36px;
    align-items: stretch;
}

.calc-controls {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    padding: 32px 36px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.calc-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
}

.calc-row-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 17px;
    color: rgba(255, 255, 255, 0.76);
}

.calc-row-head strong {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 18px;
    color: #ffffff;
}

.calc-row input[type='range'] {
    width: 100%;
    height: 6px;
    accent-color: #8ec5ff;
    cursor: pointer;
}

.calc-scale {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.38);
}

.calc-results {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
}

.calc-hero {
    flex: 1;
    padding: 34px 38px;
    border-radius: 24px;
    background: linear-gradient(160deg, rgba(142, 197, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 100%);
    border: 1px solid rgba(142, 197, 255, 0.34);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.calc-sub-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
}

.calc-sub-card {
    padding: 26px 28px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.028);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.calc-sub-val {
    margin-top: 10px;
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.05;
    font-variant-numeric: tabular-nums;
}

/* Slide 16 · 5-Step Timeline */
.timeline {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 24px;
    padding-top: 24px;
}

.timeline::before {
    content: '';
    position: absolute;
    top: 72px;
    left: 24px;
    right: 24px;
    height: 1px;
    background: linear-gradient(90deg, rgba(142, 197, 255, 0.5), rgba(20, 241, 149, 0.5));
}

.tl-step {
    position: relative;
    padding: 24px 26px 32px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.09);
}

.tl-week {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.52);
}

.tl-dot {
    width: 14px;
    height: 14px;
    margin-top: 18px;
    border-radius: 999px;
    background: #fafafa;
    border: 3px solid #09090b;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.tl-dot.is-green {
    background: #86efac;
    box-shadow: 0 0 14px rgba(134, 239, 172, 0.7);
}

.tl-dot.is-blue {
    background: #8ec5ff;
    box-shadow: 0 0 14px rgba(142, 197, 255, 0.7);
}

.tl-dot.is-solana {
    background: #14f195;
    box-shadow: 0 0 16px rgba(20, 241, 149, 0.8);
}

.tl-title {
    margin-top: 26px;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #ffffff;
}

.tl-desc {
    margin-top: 10px;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.62);
}

/* Slide 17 · Alignment Checklist */
.align-grid {
    display: grid;
    grid-template-columns: 0.88fr 1.12fr;
    gap: 32px;
}

.align-left,
.align-right {
    padding: 36px 40px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.028);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.align-right {
    border-color: rgba(142, 197, 255, 0.34);
    background: linear-gradient(180deg, rgba(142, 197, 255, 0.07) 0%, rgba(9, 9, 11, 0.45) 100%);
}

.commit-list {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding-left: 20px;
    font-size: 19px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.72);
}

.commit-list strong {
    color: #ffffff;
}

.q-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.q-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    font-size: 17px;
    line-height: 1.42;
    color: rgba(255, 255, 255, 0.74);
}

.q-row > span {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    font-weight: 600;
    color: #8ec5ff;
    padding: 3px 8px;
    border-radius: 6px;
    background: rgba(142, 197, 255, 0.12);
    flex-shrink: 0;
}

.q-row strong {
    color: #ffffff;
}

.q-row code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    color: #86efac;
}

/* Slide 18 · Founders & Close */
.close-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 36px;
}

.founders-strip {
    display: flex;
    gap: 20px;
}

.founder-chip {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 22px 14px 14px;
    border-radius: 999px;
    background: rgba(9, 9, 11, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(14px);
}

.founder-chip img {
    width: 58px;
    height: 58px;
    border-radius: 999px;
    object-fit: cover;
}

.founder-avatar {
    width: 58px;
    height: 58px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(142, 197, 255, 0.14);
    border: 1px solid rgba(142, 197, 255, 0.35);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 18px;
    font-weight: 600;
    color: #8ec5ff;
}

.founder-name {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
}

.founder-role {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.56);
}

.close-cta {
    padding: 24px 32px;
    border-radius: 22px;
    background: rgba(9, 9, 11, 0.84);
    border: 1px solid rgba(134, 239, 172, 0.32);
    backdrop-filter: blur(16px);
    text-align: right;
}

/* Guardrail highlight inside speaker notes */
.notes-guardrail {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 13px;
    color: #86efac;
}

.notes-guardrail strong {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    letter-spacing: 0.08em;
    color: #8ec5ff;
}

/* Thoughtful reduced-motion handling (compositor-friendly, no 0.01ms global hack) */
@media (prefers-reduced-motion: reduce) {
    .refract-deck :deep(.rise),
    .refract-deck :deep(.img-in),
    .refract-deck :deep(.pitch-word) {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
        filter: none !important;
    }
}
</style>

<style>
/* Compositor-thread directional slide entrance (opacity + individual translate, zero WebGL ReadPixels stall) */
@media screen and (prefers-reduced-motion: no-preference) {
    .refract-deck[data-dir='forward'] .slide.is-active {
        animation: refractStageInForward 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .refract-deck[data-dir='backward'] .slide.is-active {
        animation: refractStageInBackward 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }
}

@keyframes refractStageInForward {
    from {
        opacity: 0;
        translate: 20px 0;
    }
    to {
        opacity: 1;
        translate: 0 0;
    }
}

@keyframes refractStageInBackward {
    from {
        opacity: 0;
        translate: -20px 0;
    }
    to {
        opacity: 1;
        translate: 0 0;
    }
}

@media print {
    .slide .demo-video {
        display: none !important;
    }
}
</style>
