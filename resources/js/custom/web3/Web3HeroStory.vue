<template>
    <!-- Tall scroll track; the stage inside stays pinned while scroll scrubs the story -->
    <section ref="sectionRef" class="relative bg-zinc-950 text-white" style="height: 880vh">
        <div ref="stageRef" class="sticky top-0 h-screen w-full overflow-hidden">
            <!-- Background: real map of Europe, zooms onto Přeštice (CZ) -->
            <Web3EuropeMap :zoom="s.zoom" :dim="s.dim" />
            <!-- Wind, solar and EV assets building themselves on the map during the zoom -->
            <Web3MapAssets :zoom="s.zoom" :fade="s.assets" />

            <!-- ============ VISUALS ============ -->

            <!-- ACT 2 battery  ·  ACT 4 control panel -->
            <div
                ref="visualRef"
                class="absolute inset-x-0 top-[23rem] bottom-[2vh] z-[5] mx-auto max-w-[1100px] px-4 sm:top-[25rem] lg:top-[26rem] xl:top-[43vh]"
            >
                <div class="relative h-full w-full">
                    <div class="absolute inset-0" :style="wireStyle">
                        <Web3BessWireframe
                            ref="wireRef"
                            :draw="s.draw"
                            :orbit="s.orbit"
                            :active="s.wire > 0 && s.morph < 1"
                        />
                    </div>

                    <div
                        class="absolute inset-0"
                        :style="{
                            visibility: s.assemble > 0 && s.topoOut < 1 ? 'visible' : 'hidden',
                            opacity: 1 - s.topoOut,
                            transform: `scale(${1 - s.topoOut * 0.06})`,
                        }"
                    >
                        <Web3VictronTopology :assemble="s.assemble" />
                    </div>
                </div>
            </div>

            <!-- ACT 3 phone (right half on desktop, lower half on mobile) -->
            <div class="pointer-events-none absolute inset-0 z-[5]">
                <div :class="container" class="relative h-full">
                    <div
                        ref="phoneBoxRef"
                        class="absolute inset-x-0 top-[42vh] bottom-[2vh] lg:top-[13vh] lg:bottom-[3vh] lg:left-auto lg:w-[54%]"
                        :style="{
                            visibility: s.phone > 0 && s.phoneOut < 1 ? 'visible' : 'hidden',
                            opacity: s.phone * (1 - s.phoneOut),
                            transform: `scale(${1 + s.phoneOut * 0.5}) translateY(${s.phoneOut * 4}%)`,
                        }"
                    >
                        <Web3PhoneWallet
                            :draw="s.phoneDraw"
                            :ui="s.ui"
                            :orbit="s.phoneOrbit"
                            :active="s.phone > 0 && s.phoneOut < 1"
                        />
                    </div>
                </div>
            </div>

            <!-- ACT 5 Treetino V1 + battery + EV charger -->
            <div
                class="absolute inset-x-0 top-[23rem] bottom-0 z-[5] mx-auto max-w-[1320px] sm:top-[25rem] lg:top-[26rem] xl:top-[43vh]"
                :style="{ visibility: s.eco > 0 ? 'visible' : 'hidden', opacity: s.eco }"
            >
                <Web3Ecosystem
                    :draw="s.ecoDraw"
                    :flow="s.flow"
                    :orbit="s.ecoOrbit"
                    :active="s.eco > 0"
                />
            </div>

            <!-- ============ HEADLINES & CTAS ============ -->
            <div class="pointer-events-none absolute inset-0 z-10">
                <div :class="container" class="relative h-full">
                    <!-- ACT 1 -->
                    <div
                        class="absolute inset-x-0 top-36 max-w-[32ch] sm:top-40 lg:top-44 xl:top-[20vh]"
                    >
                        <Web3ScrollHeading
                            tag="h1"
                            lead-class="text-[2.25rem] leading-[1.08] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[clamp(2.75rem,4.2vw,4.25rem)]"
                            :segments="[
                                { text: 'In the heart of Europe, the energy transition is creating' },
                                { text: 'an investment opportunity unlike any other.', tone: 'accent' },
                            ]"
                            :progress="s.h1"
                            :out="s.h1out"
                        />

                        <!-- Act 1 CTAs (instant disappear on first scroll) -->
                        <div
                            class="mt-8 flex flex-wrap items-center gap-3.5 sm:mt-10 sm:gap-4"
                            :style="ctaStyle"
                        >
                            <a
                                href="https://loyal-empathy-production-823a.up.railway.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-t-blue px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_32px_rgba(77,141,255,0.45)] transition-all duration-300 hover:scale-[1.02] hover:bg-t-blue/90 hover:shadow-[0_0_48px_rgba(77,141,255,0.7)] sm:text-base"
                            >
                                <span>Try Demo</span>
                                <ExternalLink class="h-4 w-4 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                            <a
                                href="#pitch-video"
                                class="pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-center text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:bg-white/10 sm:text-base"
                                @click="scrollToPitch"
                            >
                                <Play class="h-4 w-4 fill-white text-white" />
                                <span>Watch Pitch</span>
                            </a>
                        </div>
                    </div>

                    <!-- ACT 2 -->
                    <Web3ScrollHeading
                        class="absolute inset-x-0 top-44 sm:top-52 lg:top-56 xl:top-[25vh]"
                        lead-class="text-4xl leading-[1.02] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3rem,4.4vw,4.25rem)]"
                        :segments="[
                            { text: 'And ordinary investors like us?', break: true },
                            { text: 'Left completely on the sidelines.', tone: 'muted' },
                        ]"
                        :progress="s.h2"
                        :out="s.h2out"
                    />

                    <!-- ACT 3 -->
                    <Web3ScrollHeading
                        class="absolute inset-x-0 top-36 sm:top-40 lg:top-1/2 lg:w-[46%] lg:-translate-y-1/2"
                        lead-class="text-4xl leading-[1.02] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3rem,4.2vw,4rem)]"
                        :segments="[
                            { text: 'A new,' },
                            { text: 'greener economy', tone: 'green' },
                            { text: 'is being born.' },
                        ]"
                        sub="Don't just watch us build it — own a piece of it, straight from your phone."
                        :progress="s.h3"
                        :out="s.h3out"
                    />

                    <!-- ACT 4 -->
                    <Web3ScrollHeading
                        class="absolute inset-x-0 top-44 sm:top-52 lg:top-56 xl:top-[25vh]"
                        lead-class="text-4xl leading-[1.02] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[clamp(2.75rem,3.9vw,3.75rem)]"
                        :segments="[
                            { text: 'Every kWh, immutably on' },
                            { text: 'Solana.', tone: 'solana' },
                        ]"
                        sub="The only blockchain fast enough to keep up with the speed at which energy is traded."
                        :progress="s.h4"
                        :out="s.h4out"
                    />

                    <!-- ACT 5 -->
                    <Web3ScrollHeading
                        class="absolute inset-x-0 top-44 sm:top-52 lg:top-56 xl:top-[25vh]"
                        lead-class="text-4xl leading-[1.02] font-medium tracking-[-0.04em] sm:text-5xl lg:text-[clamp(2.75rem,3.9vw,3.75rem)]"
                        :segments="[
                            { text: 'All connected through' },
                            { text: 'EURTree.', tone: 'green' },
                        ]"
                        sub="The stablecoin laying the foundation for a completely new, greener economy of the future."
                        :progress="s.h5"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Play } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import Web3BessWireframe from './Web3BessWireframe.vue';
import Web3Ecosystem from './Web3Ecosystem.vue';
import Web3EuropeMap from './Web3EuropeMap.vue';
import Web3MapAssets from './Web3MapAssets.vue';
import Web3PhoneWallet from './Web3PhoneWallet.vue';
import Web3ScrollHeading from './Web3ScrollHeading.vue';
import Web3VictronTopology from './Web3VictronTopology.vue';

gsap.registerPlugin(ScrollTrigger);

/** Same content width as the navbar and the rest of the site */
const container =
    'mx-auto w-full max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]';

const sectionRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const visualRef = ref<HTMLElement | null>(null);
const phoneBoxRef = ref<HTMLElement | null>(null);
const wireRef = ref<InstanceType<typeof Web3BessWireframe> | null>(null);

const ctaIntro = ref(0);

/** Everything the scroll scrubs lives here */
const s = reactive({
    // act 1
    h1: 0,
    h1out: 0,
    ctaScroll: 1,
    zoom: 0,
    assets: 1,
    dim: 0,
    // act 2
    wire: 0,
    draw: 0,
    orbit: -1,
    h2: 0,
    h2out: 0,
    morph: 0,
    // act 3
    phone: 0,
    phoneDraw: 0,
    phoneOrbit: 0,
    ui: 0,
    h3: 0,
    h3out: 0,
    phoneOut: 0,
    // act 4
    assemble: 0,
    h4: 0,
    h4out: 0,
    topoOut: 0,
    // act 5
    eco: 0,
    ecoDraw: 0,
    ecoOrbit: 0,
    flow: 0,
    h5: 0,
});

function smooth(a: number, b: number, v: number): number {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));

    return t * t * (3 - 2 * t);
}

/** The 3D battery shrinks and flies into the phone's screen — it becomes the first asset in the wallet */
const wireStyle = computed(() => {
    const m = s.morph;
    const base = {
        opacity: s.wire * (1 - smooth(0.55, 1, m)),
        filter: 'drop-shadow(0 0 6px rgba(77,141,255,0.55))',
        transform: 'none',
    };

    if (m <= 0) {
        return base;
    }

    const box = visualRef.value?.getBoundingClientRect();
    const phone = phoneBoxRef.value?.getBoundingClientRect();
    const rect = wireRef.value?.getContainerRect();

    if (!box || !phone || !rect || rect.w <= 0) {
        return base;
    }

    // everything in the wireframe layer's own coordinates (layer = visual box minus its padding)
    const pad = parseFloat(getComputedStyle(visualRef.value!).paddingLeft) || 0;
    const lw = box.width - pad * 2;
    const lh = box.height;
    const ox = lw / 2;
    const oy = lh / 2;
    const bx = rect.x + rect.w / 2;
    const by = rect.y + rect.h / 2;
    const cx = phone.left + phone.width / 2 - (box.left + pad);
    const cy = phone.top + phone.height * 0.42 - box.top;
    const target = (Math.min(phone.height * 0.3, phone.width * 0.5) * 0.9) / rect.w;
    const scale = 1 + (target - 1) * m;
    const tx = (cx - ox - target * (bx - ox)) * m;
    const ty = (cy - oy - target * (by - oy)) * m;

    return { ...base, transform: `translate(${tx}px, ${ty}px) scale(${scale})` };
});

const ctaOpacity = computed(() => ctaIntro.value * s.ctaScroll * (1 - s.h1out));

const ctaStyle = computed(() => {
    const op = ctaOpacity.value;
    const isVisible = op > 0.02;

    return {
        opacity: op,
        transform: `translateY(${(1 - op) * 14}px)`,
        pointerEvents: (isVisible ? 'auto' : 'none') as 'auto' | 'none',
        visibility: (isVisible ? 'visible' : 'hidden') as 'visible' | 'hidden',
    };
});

function scrollToPitch(e: MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('web3-play-pitch'));
    const track = (document.querySelector('#drone-story section') ||
        document.getElementById('drone-story')) as HTMLElement | null;
    if (track) {
        const rect = track.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const target = top + track.offsetHeight - window.innerHeight;
        window.scrollTo({ top: target, behavior: 'smooth' });
    }
}

let timeline: gsap.core.Timeline | null = null;
let intro: gsap.core.Tween | null = null;
let introCta: gsap.core.Tween | null = null;

onMounted(() => {
    // Act 1 headline writes itself in on load, followed by the CTAs
    intro = gsap.to(s, { h1: 1, duration: 1.6, ease: 'power2.out', delay: 0.15 });
    introCta = gsap.to(ctaIntro, { value: 1, duration: 0.8, delay: 0.6, ease: 'power2.out' });

    timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
        },
    });

    timeline
        // Act 1 CTAs vanish immediately on first scroll
        .to(s, { ctaScroll: 0, duration: 0.15, ease: 'power2.out' }, 0.0)
        // ACT 1 → assets build up all over Europe while we dive into the Czech Republic
        .to(s, { h1out: 1, duration: 0.7, ease: 'power1.in' }, 0.7)
        .to(s, { zoom: 1, duration: 3.6, ease: 'power1.inOut' }, 0.4)
        .to(s, { dim: 0.5, duration: 1.0 }, 3.4)
        .to(s, { assets: 0, duration: 0.6 }, 3.7)
        // ACT 2 → the battery is drawn line by line and the camera orbits it
        .to(s, { wire: 1, duration: 0.4 }, 3.8)
        .to(s, { draw: 1, duration: 2.6 }, 3.8)
        .to(s, { orbit: 0.6, duration: 3.6, ease: 'sine.inOut' }, 3.8)
        .to(s, { h2: 1, duration: 1.0 }, 4.1)
        .to(s, { h2out: 1, duration: 0.45, ease: 'power1.in' }, 7.0)
        // ACT 3 → the battery shrinks into the distance; the phone arrives with its energy wallet
        .to(s, { morph: 1, duration: 0.9, ease: 'power2.in' }, 7.2)
        .to(s, { dim: 0.82, duration: 1.0 }, 7.2)
        .to(s, { phone: 1, duration: 0.3 }, 8.1)
        .to(s, { phoneDraw: 1, duration: 1.4 }, 8.15)
        .to(s, { phoneOrbit: 1, duration: 3.3, ease: 'sine.inOut' }, 8.15)
        .to(s, { h3: 1, duration: 1.0 }, 8.5)
        .to(s, { ui: 1, duration: 2.2 }, 9.1)
        .to(s, { h3out: 1, duration: 0.45, ease: 'power1.in' }, 11.4)
        // ACT 4 → open the asset: live Victron control panel, every kWh on Solana
        .to(s, { phoneOut: 1, duration: 0.7, ease: 'power2.in' }, 11.4)
        .to(s, { assemble: 1, duration: 1.8 }, 11.7)
        .to(s, { h4: 1, duration: 1.0 }, 11.9)
        .to(s, { h4out: 1, duration: 0.45, ease: 'power1.in' }, 14.3)
        .to(s, { topoOut: 1, duration: 0.6, ease: 'power1.in' }, 14.3)
        // ACT 5 → Treetino V1, battery and charger, all connected through EURTree
        .to(s, { eco: 1, duration: 0.3 }, 14.6)
        .to(s, { ecoDraw: 1, duration: 2.0 }, 14.6)
        .to(s, { ecoOrbit: 1, duration: 3.6, ease: 'sine.inOut' }, 14.6)
        .to(s, { h5: 1, duration: 1.0 }, 15.0)
        .to(s, { flow: 1, duration: 0.6 }, 16.2)
        // hold the finished scene before releasing the page
        .to({}, { duration: 1.0 }, 17.2);

    // Fonts / layout can shift after mount
    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    intro?.kill();
    introCta?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
});
</script>
