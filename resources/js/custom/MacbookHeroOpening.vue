<template>
    <div
        ref="containerRef"
        class="perspective-1200 relative mx-auto w-full max-w-5xl pt-6 pb-0 select-none"
    >
        <!-- Ambient Backlight Glow -->
        <div
            class="pointer-events-none absolute -inset-10 rounded-3xl bg-t-blue/35 blur-3xl transition-opacity duration-300"
            :style="{ opacity: 0.25 + smoothProgress * 0.75 }"
        ></div>

        <!-- 3D Laptop Assembly -->
        <div
            class="relative flex w-full transform-gpu flex-col items-center transition-transform duration-100 ease-out"
            :style="laptopTransformStyle"
        >
            <!-- Display Lid (Opens via 3D rotateX on bottom hinge origin as you scroll) -->
            <div
                class="relative z-20 aspect-[16/10] w-[92%] origin-bottom transform-gpu rounded-t-2xl border border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 p-2.5 shadow-2xl transition-transform duration-75 ease-out sm:w-[94%] sm:rounded-t-3xl sm:p-4"
                :style="lidTransformStyle"
            >
                <!-- Inner Screen Bezel -->
                <div
                    class="relative flex h-full w-full flex-col overflow-hidden rounded-t-lg border border-zinc-800 bg-zinc-950 shadow-inner sm:rounded-t-xl"
                >
                    <!-- Top Camera Notch -->
                    <div
                        class="absolute inset-x-0 top-0 z-30 flex justify-center"
                    >
                        <div
                            class="flex h-3 w-16 items-center justify-center gap-1.5 rounded-b-lg bg-zinc-950 px-2 sm:h-4 sm:w-24"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-zinc-800"
                            ></span>
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-t-blue transition-opacity duration-300"
                                :style="{ opacity: smoothProgress }"
                            ></span>
                        </div>
                    </div>

                    <!-- Screen Screenshot Content -->
                    <div
                        class="relative h-full w-full overflow-hidden bg-zinc-950"
                    >
                        <img
                            :src="screenSrc"
                            :alt="alt"
                            class="h-full w-full object-cover object-center transition-all duration-300"
                            :style="{ opacity: Math.max(0.85, smoothProgress) }"
                            @error="handleImageError"
                        />

                        <!-- Glass Gloss Reflection (Fades as lid opens) -->
                        <div
                            class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent transition-opacity duration-300"
                            :style="{ opacity: 1 - smoothProgress * 0.6 }"
                        ></div>

                        <!-- Inner Screen Bezel Depth Shadow -->
                        <div
                            class="pointer-events-none absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.85)]"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Metallic Hinge Connection Bar -->
            <div
                class="z-10 h-2.5 w-[92%] bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 shadow-inner sm:w-[94%]"
            ></div>

            <!-- MacBook Base Chassis (Lower Body) -->
            <div
                class="relative z-10 flex h-5 w-full flex-col justify-between rounded-b-xl border-t border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 px-6 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.95)] sm:h-7 sm:rounded-b-2xl"
            >
                <!-- Front Opening Lip Recess -->
                <div
                    class="mx-auto h-1.5 w-20 rounded-b-md bg-zinc-950 sm:w-28"
                ></div>

                <!-- Bottom Side Feet Bumpers -->
                <div class="flex w-full justify-between px-8 pb-1">
                    <span class="h-0.5 w-6 rounded-full bg-zinc-950/80"></span>
                    <span class="h-0.5 w-6 rounded-full bg-zinc-950/80"></span>
                </div>
            </div>

            <!-- Laptop Reflection Shadow on Surface -->
            <div
                class="pointer-events-none -mb-10 h-10 w-[88%] rounded-full bg-black/90 blur-xl transition-all duration-300"
                :style="{
                    transform: `scale(${0.8 + smoothProgress * 0.2})`,
                    opacity: 0.4 + smoothProgress * 0.6,
                }"
            ></div>
            <div
                class="pointer-events-none -mt-6 h-6 w-[75%] rounded-full bg-t-blue/30 blur-lg transition-all duration-300"
                :style="{ opacity: smoothProgress * 0.7 }"
            ></div>
        </div>

        <!-- =================================================================== -->
        <!-- 3 Floating Pop-Out Cards (Clean monochrome + Treetino Blue) -->
        <!-- Appear only once the Mac is fully in view (smoothProgress >= 0.7) -->
        <!-- =================================================================== -->

        <!-- 1. Top-Left: B2B Deal Closed & Commission -->
        <div
            class="absolute top-[3%] -left-1 z-30 transform-gpu transition-all duration-75 sm:top-[8%] sm:-left-8 lg:-left-16"
            :style="bubble1Style"
        >
            <!-- Mobile Minimized Pill (<sm) -->
            <div
                class="animate-float-1 flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md sm:hidden dark:border-zinc-800/90 dark:bg-zinc-900/95"
            >
                <div
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-t-blue/15 text-t-blue"
                >
                    <CheckCircle2 class="h-3.5 w-3.5" />
                </div>
                <div class="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span
                        class="font-mono text-[10px] font-semibold text-zinc-400 uppercase"
                        >CRM</span
                    >
                    <span
                        class="font-mono text-xs font-bold text-zinc-900 dark:text-white"
                        >{{
                            $t('app.macbook.commission_amount', '+299 758 Kč')
                        }}</span
                    >
                </div>
            </div>

            <!-- Desktop Full Card (sm+) -->
            <div
                class="animate-float-1 hidden w-[260px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_25px_60px_rgba(0,0,0,0.18)] sm:block sm:w-[300px] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="mb-2.5 flex items-center gap-3">
                    <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-t-blue/20 bg-t-blue/10 text-t-blue"
                    >
                        <CheckCircle2 class="h-5 w-5" />
                    </div>
                    <div class="overflow-hidden">
                        <span
                            class="mb-1 block font-mono text-[11px] leading-none font-semibold tracking-wider text-t-blue uppercase"
                            >B2B Partner CRM</span
                        >
                        <p
                            class="truncate text-sm leading-tight font-bold text-zinc-900 sm:text-base dark:text-white"
                        >
                            Tree V1 • 49.8 kW
                        </p>
                    </div>
                </div>
                <div
                    class="flex items-baseline justify-between border-t border-zinc-100 pt-2.5 text-xs sm:text-sm dark:border-zinc-800"
                >
                    <span class="font-mono text-zinc-500 dark:text-zinc-400">{{
                        $t('app.macbook.commission')
                    }}</span>
                    <span
                        class="font-mono font-bold text-zinc-900 dark:text-white"
                        >{{
                            $t('app.macbook.commission_amount', '+299 758 Kč')
                        }}</span
                    >
                </div>
            </div>
        </div>

        <!-- 2. Top-Right: PDF Commercial Proposal Export -->
        <div
            class="absolute top-[3%] -right-1 z-30 transform-gpu transition-all duration-75 sm:top-[6%] sm:-right-8 lg:-right-16"
            :style="bubble2Style"
        >
            <!-- Mobile Minimized Pill (<sm) -->
            <div
                class="animate-float-2 flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md sm:hidden dark:border-zinc-800/90 dark:bg-zinc-900/95"
            >
                <div
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-t-blue/15 text-t-blue"
                >
                    <FileText class="h-3.5 w-3.5" />
                </div>
                <span
                    class="font-mono text-xs font-bold whitespace-nowrap text-zinc-900 dark:text-white"
                    >Proposal.pdf</span
                >
            </div>

            <!-- Desktop Full Card (sm+) -->
            <div
                class="animate-float-2 hidden w-[270px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_25px_60px_rgba(0,0,0,0.18)] sm:block sm:w-[310px] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="mb-2.5 flex items-center gap-3">
                    <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-t-blue/20 bg-t-blue/10 text-t-blue"
                    >
                        <FileText class="h-5 w-5" />
                    </div>
                    <div class="overflow-hidden">
                        <span
                            class="mb-1 block font-mono text-[11px] leading-none font-semibold tracking-wider text-t-blue uppercase"
                            >{{ $t('app.macbook.offer_generated') }}</span
                        >
                        <p
                            class="truncate text-sm leading-tight font-bold text-zinc-900 sm:text-base dark:text-white"
                        >
                            Commercial_Proposal.pdf
                        </p>
                    </div>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs sm:text-sm dark:border-zinc-800"
                >
                    <span
                        class="font-mono font-bold text-zinc-900 dark:text-white"
                        >{{
                            $t('app.macbook.proposal_price', '4 900 000 Kč')
                        }}</span
                    >
                    <span
                        class="inline-flex items-center gap-1.5 rounded-lg bg-t-blue px-2.5 py-1 font-mono text-[11px] font-medium text-white shadow-sm"
                    >
                        <Download class="h-3.5 w-3.5" />
                        {{ $t('app.macbook.download_pdf') }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 3. Bottom-Right: Live Production & ROI Payback -->
        <div
            class="absolute -right-2 bottom-[14%] z-30 hidden transform-gpu transition-all duration-75 sm:-right-6 sm:block lg:-right-12"
            :style="bubble3Style"
        >
            <div
                class="animate-float-3 w-[260px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_25px_60px_rgba(0,0,0,0.18)] sm:w-[300px] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="mb-2.5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div
                            class="flex h-7 w-7 items-center justify-center rounded-lg border border-t-blue/20 bg-t-blue/10 text-t-blue"
                        >
                            <Zap class="h-4 w-4" />
                        </div>
                        <span
                            class="font-mono text-[11px] font-semibold tracking-wider text-t-blue uppercase"
                            >{{ $t('app.macbook.roi_calculation') }}</span
                        >
                    </div>
                    <span
                        class="font-mono text-[11px] text-zinc-500 dark:text-zinc-400"
                        >{{ $t('app.macbook.roi_years') }}</span
                    >
                </div>

                <div class="mb-2 flex items-baseline justify-between gap-2">
                    <div>
                        <span
                            class="block font-mono text-[10px] text-zinc-400 uppercase"
                            >{{ $t('app.macbook.annual_production') }}</span
                        >
                        <p
                            class="font-mono text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-white"
                        >
                            47 393
                            <span class="text-xs font-normal text-zinc-500">{{
                                $t('app.macbook.kwh_year')
                            }}</span>
                        </p>
                    </div>

                    <!-- Clean Micro Bar Chart (Monochrome + Treetino blue) -->
                    <div class="flex h-6 items-end gap-1.5 pb-0.5">
                        <div
                            class="h-[35%] w-1.5 rounded-t-sm bg-zinc-300 dark:bg-zinc-700"
                        ></div>
                        <div
                            class="h-[60%] w-1.5 rounded-t-sm bg-zinc-400 dark:bg-zinc-600"
                        ></div>
                        <div
                            class="h-[85%] w-1.5 rounded-t-sm bg-t-blue/70"
                        ></div>
                        <div
                            class="h-[100%] w-1.5 rounded-t-sm bg-t-blue"
                        ></div>
                        <div
                            class="h-[75%] w-1.5 rounded-t-sm bg-t-blue/70"
                        ></div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-2 font-mono text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                >
                    <span>{{ $t('app.macbook.co2_savings') }}</span>
                    <span class="font-bold text-zinc-900 dark:text-white">{{
                        $t('app.macbook.tons_year')
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CheckCircle2, FileText, Download, Zap } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
    defineProps<{
        screenSrc?: string;
        alt?: string;
    }>(),
    {
        screenSrc: '/img/cta/cta-pos-1.webp',
        alt: 'Treetino Pricing ROI Calculator App Screenshot',
    },
);

function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;

    if (target && target.src !== '/img/cta/cta-pos-1.webp') {
        target.src = '/img/cta/cta-pos-1.webp';
    }
}

const containerRef = ref<HTMLElement | null>(null);
const smoothProgress = ref(0);
const isMobile = ref(false);

let animationFrameId: number | null = null;

function updateDimensions() {
    if (typeof window !== 'undefined') {
        isMobile.value = window.innerWidth < 640;
    }
}

function updateScrollProgress() {
    if (!containerRef.value) {
        return;
    }

    const rect = containerRef.value.getBoundingClientRect();
    const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

    const startY = windowHeight;
    const endY = windowHeight * 0.2;

    const currentY = rect.top;
    const rawProgress = (startY - currentY) / (startY - endY);
    const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

    smoothProgress.value += (clampedProgress - smoothProgress.value) * 0.15;

    if (Math.abs(clampedProgress - smoothProgress.value) > 0.001) {
        animationFrameId = requestAnimationFrame(updateScrollProgress);
    }
}

function handleScroll() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(updateScrollProgress);
}

onMounted(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();
});

onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions);
    window.removeEventListener('scroll', handleScroll);

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
});

const lidTransformStyle = computed(() => {
    // Starts partially open so screen content is visible, opens upright (0deg) on scroll.
    // On mobile, start near-upright (-12deg) to prevent 3D perspective squashing.
    const closedAngle = isMobile.value ? -12 : -48;
    const openAngle = 0;
    const currentAngle =
        closedAngle + (openAngle - closedAngle) * smoothProgress.value;

    return {
        transform: `rotateX(${currentAngle}deg)`,
    };
});

const laptopTransformStyle = computed(() => {
    const closedTilt = isMobile.value ? 8 : 22;
    const openTilt = isMobile.value ? 2 : 8;
    const currentTilt =
        closedTilt + (openTilt - closedTilt) * smoothProgress.value;

    const closedScale = isMobile.value ? 0.96 : 0.92;
    const openScale = 1.0;
    const currentScale =
        closedScale + (openScale - closedScale) * smoothProgress.value;

    return {
        transform: `rotateX(${currentTilt}deg) scale(${currentScale})`,
    };
});

// Pop-out helper: starts ONLY once the full Mac is in view (progress >= 0.70)
function calculateBubbleSpring(
    threshold: number,
    startX: number,
    startY: number,
) {
    if (smoothProgress.value < threshold) {
        return {
            opacity: 0,
            transform: `translate3d(${startX}px, ${startY}px, 0) scale(0.6)`,
            pointerEvents: 'none' as const,
            visibility: 'hidden' as const,
        };
    }

    const raw = (smoothProgress.value - threshold) / (1 - threshold);
    const p = Math.min(Math.max(raw, 0), 1);

    // Smooth cubic ease-out
    const ease = 1 - Math.pow(1 - p, 3);

    const curX = startX * (1 - ease);
    const curY = startY * (1 - ease);
    const scale = 0.6 + 0.4 * ease;
    const opacity = Math.min(p * 1.5, 1);

    return {
        transform: `translate3d(${curX}px, ${curY}px, 0) scale(${scale})`,
        opacity,
        pointerEvents: p > 0.8 ? ('auto' as const) : ('none' as const),
        visibility: opacity > 0.01 ? ('visible' as const) : ('hidden' as const),
    };
}

const bubble1Style = computed(() =>
    calculateBubbleSpring(
        0.7,
        isMobile.value ? 10 : 40,
        isMobile.value ? 10 : 50,
    ),
);
const bubble2Style = computed(() =>
    calculateBubbleSpring(
        0.76,
        isMobile.value ? -10 : -40,
        isMobile.value ? 10 : 50,
    ),
);
const bubble3Style = computed(() => calculateBubbleSpring(0.82, -40, -40));
</script>

<style scoped>
.perspective-1200 {
    perspective: 1200px;
}

@keyframes float-1 {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-8px) rotate(-0.5deg);
    }
}

@keyframes float-2 {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(0.6deg);
    }
}

@keyframes float-3 {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-7px) rotate(0.4deg);
    }
}

.animate-float-1 {
    animation: float-1 4.8s ease-in-out infinite;
}

.animate-float-2 {
    animation: float-2 5.6s ease-in-out infinite 0.7s;
}

.animate-float-3 {
    animation: float-3 5.2s ease-in-out infinite 1.4s;
}
</style>
