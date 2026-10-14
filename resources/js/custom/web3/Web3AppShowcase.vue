<template>
    <div id="app-showcase" class="relative bg-black text-white">
        <!-- Ambient subtle boundary lines matching site grid -->
        <div
            class="pointer-events-none absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/5 border-l-white/5 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        ></div>

        <!-- Pinned fullscreen scroll track matching the rest of the landing page -->
        <section ref="trackRef" class="relative bg-black" style="height: 440vh">
            <div
                ref="stageRef"
                class="sticky top-0 h-screen h-dvh w-full overflow-hidden bg-black"
            >
                <!-- Canvas element rendering pre-rendered WebP frames for instantaneous 0ms scrub -->
                <canvas
                    ref="canvasRef"
                    class="absolute inset-0 h-full w-full"
                ></canvas>

                <!-- Atmospheric cinematic vignette for top and bottom -->
                <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-black/85"
                ></div>

                <!-- Left dark gradient behind the text stack for desktop -->
                <div
                    class="pointer-events-none absolute inset-y-0 left-0 hidden lg:block w-[55%] bg-gradient-to-r from-black via-black/85 to-transparent z-10"
                ></div>

                <!-- Top vignette for mobile readability -->
                <div
                    class="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black via-black/85 to-transparent z-10 lg:hidden"
                ></div>

                <!-- Hairline scrub progress bar at top of screen -->
                <div
                    class="pointer-events-none absolute top-0 inset-x-0 z-30 h-[2px] bg-white/10"
                >
                    <div
                        class="h-full bg-t-blue transition-all duration-75"
                        :style="{ width: `${appProgress * 100}%` }"
                    ></div>
                </div>

                <!-- ================= DESKTOP: ALL 3 POINTS ON THE LEFT ================= -->
                <div class="pointer-events-none absolute inset-0 z-20 hidden lg:flex items-center">
                    <div class="w-full px-6 sm:px-10 lg:px-12 xl:px-16">
                        <div class="max-w-[440px] lg:max-w-[480px] xl:max-w-[510px] space-y-7 sm:space-y-9 lg:space-y-11">
                            <div
                                v-for="(step, idx) in steps"
                                :key="idx"
                                class="group cursor-pointer select-none transition-all duration-500 ease-out pointer-events-auto"
                                :class="[
                                    activeStep === idx
                                        ? 'opacity-100 translate-x-2 sm:translate-x-3'
                                        : 'opacity-40 hover:opacity-70 translate-x-0',
                                ]"
                                @click="scrollToStep(idx)"
                            >
                                <h3
                                    class="text-2xl leading-[1.14] font-medium tracking-[-0.035em] sm:text-3xl lg:text-[clamp(1.75rem,2.15vw,2.25rem)] xl:text-[clamp(1.95rem,2.4vw,2.45rem)]"
                                >
                                    <span
                                        class="block transition-all duration-500 ease-out"
                                        :class="[
                                            activeStep === idx
                                                ? 'text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]'
                                                : 'text-zinc-400 [text-shadow:none]',
                                        ]"
                                    >
                                        {{ step.lead }}
                                    </span>
                                    <span
                                        class="block transition-all duration-500 ease-out"
                                        :class="[
                                            activeStep === idx
                                                ? 'text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]'
                                                : 'text-zinc-500 drop-shadow-none',
                                        ]"
                                    >
                                        {{ step.sub }}
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= MOBILE / TABLET: ACTIVE STEP TEXT (MATCHING DESKTOP DESIGN) ================= -->
                <div class="pointer-events-none absolute inset-x-0 top-36 sm:top-36 z-20 flex lg:hidden">
                    <div :class="container" class="relative">
                        <div class="px-4 sm:px-0 max-w-[34ch] sm:max-w-md">
                            <h3
                                class="text-2xl leading-[1.14] font-medium tracking-[-0.035em] sm:text-3xl"
                            >
                                <span
                                    class="block text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)] transition-all duration-300"
                                >
                                    {{ steps[activeStep].lead }}
                                </span>
                                <span
                                    class="block text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] mt-1.5 font-medium transition-all duration-300"
                                >
                                    {{ steps[activeStep].sub }}
                                </span>
                            </h3>
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
import { onMounted, onUnmounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

/** Same content width as the navbar and the rest of the site */
const container =
    'mx-auto w-[calc(100%-72px)] sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] lg:max-w-[1400px] xl:w-[calc(100%-400px)] max-w-[1400px]';

const trackRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const appProgress = ref(0);
const activeStep = ref(0);

const steps = [
    {
        lead: '1) Choose infrastructure project',
        sub: 'you want to invest in like on Kickstarter.',
    },
    {
        lead: '2) Prepare investment plans',
        sub: 'for yourself.',
    },
    {
        lead: '3) Manage assets and earn yield',
        sub: 'in predictable way.',
    },
];

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

    const isDesktop = w >= 1024;
    // Scale slightly on desktop so phone fills the right side heroically; scale nicely on mobile to fill canvas seamlessly
    const scale = isDesktop ? 1.25 : 1.08;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let rw: number, rh: number;

    if (imgRatio > canvasRatio) {
        rh = h * scale;
        rw = h * imgRatio * scale;
    } else {
        rw = w * scale;
        rh = (w / imgRatio) * scale;
    }

    const rx = (w - rw) / 2;
    const ry = (h - rh) / 2;

    // On desktop, shift the phone to the right so it doesn't collide with the left text stack
    const xShift = isDesktop ? Math.min(w * 0.22, 320) : 0;
    const yOffset = isDesktop ? Math.min(25, h * 0.03) : Math.min(30, h * 0.04);

    ctx.drawImage(img, rx + xShift, ry + yOffset, rw, rh);
    ctx.restore();
}

function preloadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const numStr = String(i).padStart(3, '0');
        img.src = `/video/app_frames_webp/f_${numStr}.webp`;
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

function scrollToStep(stepIndex: number) {
    if (!trackRef.value) return;
    const rect = trackRef.value.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const trackH = trackRef.value.offsetHeight;
    const vh = window.innerHeight;
    const scrollableH = trackH - vh;

    const targets = [0.16, 0.50, 0.84];
    const targetY = trackTop + scrollableH * targets[stepIndex];
    window.scrollTo({ top: targetY, behavior: 'smooth' });
}

onMounted(() => {
    preloadFrames();
    window.addEventListener('resize', handleResize);

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
                appProgress.value = self.progress;

                // Scrub canvas video frames
                const idx = Math.min(
                    TOTAL_FRAMES - 1,
                    Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
                );
                renderFrame(idx);

                // Update active step based on scroll progress
                if (self.progress < 0.35) {
                    activeStep.value = 0;
                } else if (self.progress < 0.68) {
                    activeStep.value = 1;
                } else {
                    activeStep.value = 2;
                }
            },
        },
    });

    timeline.to({}, { duration: 1 });

    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        renderFrame(0);
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
});
</script>
