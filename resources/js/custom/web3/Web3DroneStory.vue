<template>
    <div id="drone-story" class="relative bg-black text-white">
        <!-- ===================================================================== -->
        <!-- PINNED FULLSCREEN DRONE SHOT SCROLL TRACK                             -->
        <!-- ===================================================================== -->
        <section ref="trackRef" class="relative bg-black" style="height: 460vh">
            <div ref="stageRef" class="sticky top-0 h-screen h-dvh w-full overflow-hidden bg-black">
                <!-- Canvas element rendering pre-rendered WebP frames for instantaneous 0ms scrub -->
                <canvas
                    ref="canvasRef"
                    class="absolute inset-0 h-full w-full"
                ></canvas>

                <!-- Atmospheric cinematic vignette for maximum text contrast without obscuring video -->
                <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85"
                ></div>

                <!-- Hairline scrub progress bar at top of screen -->
                <div class="pointer-events-none absolute top-0 inset-x-0 z-20 h-[2px] bg-white/10">
                    <div
                        class="h-full bg-t-blue transition-all duration-75"
                        :style="{ width: `${flightProgress * 100}%` }"
                    ></div>
                </div>

                <!-- ================= SCROLL STORY OVERLAYS ================= -->
                <div class="pointer-events-none absolute inset-0 z-20">
                    <div :class="container" class="relative h-full">
                        <!-- SCENE 1: Ground Launch (Jakub with arms spread on the hill) -->
                        <Web3ScrollHeading
                            class="absolute inset-x-0 top-36 px-4 sm:px-0 sm:top-36 md:top-44 lg:top-48 xl:top-[23vh] max-w-4xl"
                            lead-class="text-2xl leading-[1.12] font-medium tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-[clamp(2.75rem,4.2vw,4rem)]"
                            :segments="[
                                { text: 'We have' },
                                { text: 'government connections,', tone: 'accent' },
                                { text: 'licences and teams of technicians that can build these projects.' },
                            ]"
                            :progress="s.t1"
                            :out="s.t1out"
                        />

                        <!-- SCENE 2: Mid-Ascent (Revealing rolling hills & wind turbines) -->
                        <Web3ScrollHeading
                            class="absolute inset-x-0 top-36 px-4 sm:px-0 sm:top-36 md:top-44 lg:top-48 xl:top-[23vh] max-w-4xl"
                            lead-class="text-2xl leading-[1.12] font-medium tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-[clamp(2.75rem,4.2vw,4rem)]"
                            :segments="[
                                { text: 'With enough liquidity we can tokenize our trees, grid balancing batteries' },
                                { text: 'or even these wind turbines.', tone: 'accent' },
                            ]"
                            :progress="s.t2"
                            :out="s.t2out"
                        />

                        <!-- SCENE 3: High Altitude Climax (Panoramic Wind Park + Demo CTA + Pitch Video Window) -->
                        <div
                            class="absolute inset-x-0 top-[9.5rem] px-4 sm:px-0 sm:top-36 md:top-36 lg:top-1/2 lg:-translate-y-1/2 transition-all duration-300"
                            :style="{
                                opacity: s.end,
                                transform: `translateY(${(1 - s.end) * 24}px)`,
                                visibility: s.end > 0.01 ? 'visible' : 'hidden',
                            }"
                        >
                            <div class="grid grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-12">
                                <!-- Left Column: Final Pitch Statement & Action CTAs -->
                                <div class="lg:col-span-5">
                                    <h3
                                        class="text-2xl font-medium tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.08]"
                                    >
                                        Don't just watch us <span class="text-[#8ec5ff]">build it.</span>
                                    </h3>

                                    <p class="mt-1.5 text-xs font-light leading-relaxed text-white/75 sm:mt-4 sm:text-base">
                                        Explore the live deployed dApp on Solana devnet or watch the full founder pitch video.
                                    </p>

                                    <!-- Action Buttons -->
                                    <div class="mt-3.5 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-4">
                                        <a
                                            href="https://loyal-empathy-production-823a.up.railway.app/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="pointer-events-auto group inline-flex items-center gap-2 rounded-xl bg-t-blue px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_32px_rgba(77,141,255,0.45)] transition-all duration-300 hover:scale-[1.02] hover:bg-t-blue/90 hover:shadow-[0_0_48px_rgba(77,141,255,0.7)] sm:px-6 sm:py-3.5 sm:text-base"
                                        >
                                            <span>Try Demo</span>
                                            <ExternalLink class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>

                                        <a
                                            href="https://solscan.io/account/EEbZ5DVTQ9f4XeRwmSh4u2QPiMSSmQjqKPNEpDHoBU2n?cluster=devnet"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="pointer-events-auto group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:bg-white/10 sm:px-6 sm:py-3.5 sm:text-base"
                                        >
                                            <span>Solana Contract</span>
                                            <ExternalLink class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    </div>
                                </div>

                                <!-- Right Column: The Pitch Video in a sleek minimal frame -->
                                <div class="lg:col-span-7">
                                    <div
                                        id="pitch-video-container"
                                        class="pointer-events-auto relative aspect-video w-full max-w-[560px] mx-auto lg:max-w-none overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 hover:border-white/35"
                                        :class="{
                                            'ring-2 ring-t-blue/80 shadow-[0_0_50px_rgba(77,141,255,0.4)]': isVideoFocused,
                                        }"
                                    >
                                        <video
                                            id="pitch-video"
                                            ref="pitchVideoRef"
                                            src="/web3/video/pitch-web.mp4"
                                            poster="/video/pitch-poster.jpg"
                                            controls
                                            playsinline
                                            preload="auto"
                                            class="h-full w-full object-cover"
                                            @volumechange="checkMutedState"
                                        ></video>

                                        <!-- Tap to Unmute Overlay if browser enforced muted playback -->
                                        <button
                                            v-if="isMutedAutoplay"
                                            type="button"
                                            class="absolute top-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-black/85 px-4 py-2 text-xs font-medium text-white backdrop-blur-md border border-white/25 transition-all hover:bg-black hover:scale-105"
                                            @click="unmuteVideo"
                                        >
                                            <VolumeX class="h-4 w-4 text-t-blue animate-pulse" />
                                            <span>Click to Unmute</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, VolumeX } from 'lucide-vue-next';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import Web3ScrollHeading from './Web3ScrollHeading.vue';

gsap.registerPlugin(ScrollTrigger);

/** Same content width as the navbar and the rest of the site */
const container =
    'mx-auto w-[calc(100%-72px)] sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] max-w-[1400px]';

const trackRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const pitchVideoRef = ref<HTMLVideoElement | null>(null);

const isVideoFocused = ref(false);
const isMutedAutoplay = ref(false);

const flightProgress = ref(0);

const s = reactive({
    // Scene 1: "We have government connections, licences and teams of technicians..."
    t1: 0,
    t1out: 0,
    // Scene 2: "With enough liquidity we can tokenize our trees..."
    t2: 0,
    t2out: 0,
    // Scene 3: Demo CTA + Pitch Video Window
    end: 0,
});

const TOTAL_FRAMES = 121;
const frames: HTMLImageElement[] = [];
let lastRenderedIndex = -1;
let currentProgress = 0;
let timeline: gsap.core.Timeline | null = null;

function renderFrame(targetIndex: number) {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick target frame or closest loaded frame
    let img = frames[targetIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
        for (let j = targetIndex - 1; j >= 0; j--) {
            if (frames[j]?.complete && frames[j].naturalWidth > 0) {
                img = frames[j];
                break;
            }
        }
        if (!img || !img.complete || img.naturalWidth === 0) {
            for (let j = targetIndex + 1; j < TOTAL_FRAMES; j++) {
                if (frames[j]?.complete && frames[j].naturalWidth > 0) {
                    img = frames[j];
                    break;
                }
            }
        }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastRenderedIndex = targetIndex;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, w, h);

    // CSS object-cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let rw: number, rh: number, rx: number, ry: number;

    if (imgRatio > canvasRatio) {
        rh = h;
        rw = h * imgRatio;
        rx = (w - rw) / 2;
        ry = 0;
    } else {
        rw = w;
        rh = w / imgRatio;
        rx = 0;
        ry = (h - rh) / 2;
    }

    ctx.drawImage(img, rx, ry, rw, rh);
    ctx.restore();
}

function preloadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const numStr = String(i).padStart(3, '0');
        img.src = `/video/drone_frames_webp/f_${numStr}.webp`;
        img.onload = () => {
            const currentIdx = Math.min(
                TOTAL_FRAMES - 1,
                Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
            );
            if (i === 0 && lastRenderedIndex === -1) {
                renderFrame(0);
            } else if (i === currentIdx) {
                renderFrame(currentIdx);
            }
        };
        frames.push(img);
    }
}

function handleResize() {
    const idx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );
    renderFrame(idx);
}

function playPitchVideo() {
    if (!pitchVideoRef.value) return;
    isVideoFocused.value = true;
    setTimeout(() => {
        isVideoFocused.value = false;
    }, 4500);

    const playPromise = pitchVideoRef.value.play();
    if (playPromise !== undefined) {
        playPromise.catch((err) => {
            console.warn('Autoplay with audio blocked, trying muted playback:', err);
            if (pitchVideoRef.value) {
                pitchVideoRef.value.muted = true;
                isMutedAutoplay.value = true;
                pitchVideoRef.value.play().catch(() => {});
            }
        });
    }
}

function checkMutedState() {
    if (pitchVideoRef.value && !pitchVideoRef.value.muted) {
        isMutedAutoplay.value = false;
    }
}

function unmuteVideo() {
    if (!pitchVideoRef.value) return;
    pitchVideoRef.value.muted = false;
    isMutedAutoplay.value = false;
}

function onPlayPitchEvent() {
    playPitchVideo();
}

onMounted(() => {
    preloadFrames();
    window.addEventListener('resize', handleResize);
    window.addEventListener('web3-play-pitch', onPlayPitchEvent);

    timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: trackRef.value,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                currentProgress = self.progress;
                flightProgress.value = self.progress;
                const idx = Math.min(
                    TOTAL_FRAMES - 1,
                    Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
                );
                renderFrame(idx);
            },
        },
    });

    timeline
        // =========================================================================
        // SCENE 1: "We have government connections, licences and teams of technicians..."
        // Appears FAST (0.0 -> 0.08) and STAYS LONG (0.08 -> 0.38)
        // =========================================================================
        .to(s, { t1: 1, duration: 0.08, ease: 'power1.out' }, 0.0)
        .to(s, { t1out: 1, duration: 0.06, ease: 'power1.in' }, 0.38)

        // =========================================================================
        // SCENE 2: "With enough liquidity we can tokenize our trees..."
        // Appears FAST (0.42 -> 0.48) and STAYS LONG (0.48 -> 0.74)
        // =========================================================================
        .to(s, { t2: 1, duration: 0.06, ease: 'power1.out' }, 0.42)
        .to(s, { t2out: 1, duration: 0.06, ease: 'power1.in' }, 0.74)

        // =========================================================================
        // SCENE 3: Final Panoramic Climax + Demo CTA + Pitch Video Window
        // Appears (0.78 -> 0.86) and STAYS through 1.0
        // =========================================================================
        .to(s, { end: 1, duration: 0.08, ease: 'power1.out' }, 0.78)
        .to({}, { duration: 0.14 }, 0.86);

    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        renderFrame(0);
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('web3-play-pitch', onPlayPitchEvent);
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
});
</script>
