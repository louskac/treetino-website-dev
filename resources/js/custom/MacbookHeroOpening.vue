<template>
    <div
        ref="containerRef"
        class="relative w-full max-w-5xl mx-auto pt-6 pb-8 perspective-1200 select-none"
    >
        <!-- Ambient Backlight Glow -->
        <div
            class="absolute -inset-10 rounded-3xl bg-t-blue/35 blur-3xl transition-opacity duration-300 pointer-events-none"
            :style="{ opacity: 0.25 + smoothProgress * 0.75 }"
        ></div>

        <!-- 3D Laptop Assembly -->
        <div
            class="relative w-full flex flex-col items-center transform-gpu transition-transform duration-100 ease-out"
            :style="laptopTransformStyle"
        >
            <!-- Display Lid (Opens via 3D rotateX on bottom hinge origin as you scroll) -->
            <div
                class="relative w-[92%] sm:w-[94%] aspect-[16/10] rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 p-2.5 sm:p-4 shadow-2xl border border-white/20 origin-bottom transform-gpu transition-transform duration-75 ease-out z-20"
                :style="lidTransformStyle"
            >
                <!-- Inner Screen Bezel -->
                <div class="relative w-full h-full rounded-t-lg sm:rounded-t-xl bg-zinc-950 overflow-hidden border border-zinc-800 shadow-inner flex flex-col">
                    
                    <!-- Top Camera Notch -->
                    <div class="absolute top-0 inset-x-0 z-30 flex justify-center">
                        <div class="w-16 sm:w-24 h-3 sm:h-4 bg-zinc-950 rounded-b-lg flex items-center justify-center gap-1.5 px-2">
                            <span class="h-1.5 w-1.5 rounded-full bg-zinc-800"></span>
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-t-blue transition-opacity duration-300"
                                :style="{ opacity: smoothProgress }"
                            ></span>
                        </div>
                    </div>

                    <!-- Screen Screenshot Content -->
                    <div class="relative w-full h-full overflow-hidden bg-zinc-950">
                        <img
                            :src="screenSrc"
                            :alt="alt"
                            class="w-full h-full object-cover object-center transition-all duration-300"
                            :style="{ opacity: Math.max(0.85, smoothProgress) }"
                            @error="handleImageError"
                        />

                        <!-- Glass Gloss Reflection (Fades as lid opens) -->
                        <div
                            class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent transition-opacity duration-300"
                            :style="{ opacity: 1 - smoothProgress * 0.6 }"
                        ></div>

                        <!-- Inner Screen Bezel Depth Shadow -->
                        <div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.85)]"></div>
                    </div>
                </div>
            </div>

            <!-- Metallic Hinge Connection Bar -->
            <div class="w-[92%] sm:w-[94%] h-2.5 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 shadow-inner z-10"></div>

            <!-- MacBook Base Chassis (Lower Body) -->
            <div class="relative w-full h-5 sm:h-7 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-xl sm:rounded-b-2xl border-t border-white/20 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between px-6 z-10">
                <!-- Front Opening Lip Recess -->
                <div class="w-20 sm:w-28 h-1.5 bg-zinc-950 rounded-b-md mx-auto"></div>

                <!-- Bottom Side Feet Bumpers -->
                <div class="w-full flex justify-between px-8 pb-1">
                    <span class="w-6 h-0.5 bg-zinc-950/80 rounded-full"></span>
                    <span class="w-6 h-0.5 bg-zinc-950/80 rounded-full"></span>
                </div>
            </div>

            <!-- Laptop Reflection Shadow on Surface -->
            <div
                class="w-[88%] h-10 bg-black/90 blur-xl rounded-full transition-all duration-300"
                :style="{ transform: `scale(${0.8 + smoothProgress * 0.2})`, opacity: 0.4 + smoothProgress * 0.6 }"
            ></div>
            <div
                class="w-[75%] h-6 bg-t-blue/30 blur-lg rounded-full transition-all duration-300 -mt-6 pointer-events-none"
                :style="{ opacity: smoothProgress * 0.7 }"
            ></div>
        </div>

        <!-- =================================================================== -->
        <!-- 3 Floating Pop-Out Cards (Clean monochrome + Treetino Blue) -->
        <!-- Appear only once the Mac is fully in view (smoothProgress >= 0.7) -->
        <!-- =================================================================== -->
        
        <!-- 1. Top-Left: B2B Deal Closed & Commission -->
        <div
            class="absolute top-[8%] -left-2 sm:-left-8 lg:-left-16 z-30 transition-all duration-75 transform-gpu"
            :style="bubble1Style"
        >
            <div class="animate-float-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.18)] rounded-2xl p-4 sm:p-5 w-[260px] sm:w-[300px]">
                <div class="flex items-center gap-3 mb-2.5">
                    <div class="h-9 w-9 rounded-xl bg-t-blue/10 border border-t-blue/20 flex items-center justify-center text-t-blue shrink-0">
                        <CheckCircle2 class="h-5 w-5" />
                    </div>
                    <div class="overflow-hidden">
                        <span class="text-[11px] font-mono font-semibold tracking-wider text-t-blue uppercase block leading-none mb-1">B2B Partner CRM</span>
                        <p class="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate leading-tight">Tree V1 • 49.8 kW</p>
                    </div>
                </div>
                <div class="flex items-baseline justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm">
                    <span class="text-zinc-500 dark:text-zinc-400 font-mono">Provize:</span>
                    <span class="font-mono font-bold text-zinc-900 dark:text-white">+299 758 CZK</span>
                </div>
            </div>
        </div>

        <!-- 2. Top-Right: PDF Commercial Proposal Export -->
        <div
            class="absolute top-[6%] -right-2 sm:-right-8 lg:-right-16 z-30 transition-all duration-75 transform-gpu"
            :style="bubble2Style"
        >
            <div class="animate-float-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.18)] rounded-2xl p-4 sm:p-5 w-[270px] sm:w-[310px]">
                <div class="flex items-center gap-3 mb-2.5">
                    <div class="h-9 w-9 rounded-xl bg-t-blue/10 border border-t-blue/20 flex items-center justify-center text-t-blue shrink-0">
                        <FileText class="h-5 w-5" />
                    </div>
                    <div class="overflow-hidden">
                        <span class="text-[11px] font-mono font-semibold tracking-wider text-t-blue uppercase block leading-none mb-1">Nabídka vygenerována</span>
                        <p class="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate leading-tight">Commercial_Proposal.pdf</p>
                    </div>
                </div>
                <div class="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm">
                    <span class="font-mono font-bold text-zinc-900 dark:text-white">4 900 000 CZK</span>
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-t-blue text-white text-[11px] font-mono font-medium shadow-sm">
                        <Download class="h-3.5 w-3.5" />
                        Stáhnout PDF
                    </span>
                </div>
            </div>
        </div>

        <!-- 3. Bottom-Right: Live Production & ROI Payback -->
        <div
            class="hidden sm:block absolute bottom-[14%] -right-2 sm:-right-6 lg:-right-12 z-30 transition-all duration-75 transform-gpu"
            :style="bubble3Style"
        >
            <div class="animate-float-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.18)] rounded-2xl p-4 sm:p-5 w-[260px] sm:w-[300px]">
                <div class="flex items-center justify-between mb-2.5">
                    <div class="flex items-center gap-2">
                        <div class="h-7 w-7 rounded-lg bg-t-blue/10 border border-t-blue/20 flex items-center justify-center text-t-blue">
                            <Zap class="h-4 w-4" />
                        </div>
                        <span class="text-[11px] font-mono font-semibold tracking-wider text-t-blue uppercase">Výpočet Návratnosti</span>
                    </div>
                    <span class="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">16.3 let</span>
                </div>
                
                <div class="flex items-baseline justify-between gap-2 mb-2">
                    <div>
                        <span class="text-[10px] text-zinc-400 uppercase font-mono block">Roční výroba</span>
                        <p class="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-white tracking-tight">
                            47 393 <span class="text-xs font-normal text-zinc-500">kWh/rok</span>
                        </p>
                    </div>
                    
                    <!-- Clean Micro Bar Chart (Monochrome + Treetino blue) -->
                    <div class="flex items-end gap-1.5 h-6 pb-0.5">
                        <div class="w-1.5 h-[35%] bg-zinc-300 dark:bg-zinc-700 rounded-t-sm"></div>
                        <div class="w-1.5 h-[60%] bg-zinc-400 dark:bg-zinc-600 rounded-t-sm"></div>
                        <div class="w-1.5 h-[85%] bg-t-blue/70 rounded-t-sm"></div>
                        <div class="w-1.5 h-[100%] bg-t-blue rounded-t-sm"></div>
                        <div class="w-1.5 h-[75%] bg-t-blue/70 rounded-t-sm"></div>
                    </div>
                </div>

                <div class="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span>CO₂ Úspora:</span>
                    <span class="font-bold text-zinc-900 dark:text-white">11.8 tun / rok</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { CheckCircle2, FileText, Download, Zap } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        screenSrc?: string;
        alt?: string;
    }>(),
    {
        screenSrc: '/img/cta/cta-pos-1.webp',
        alt: 'Treetino Pricing ROI Calculator App Screenshot',
    }
);

function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== '/img/cta/cta-pos-1.webp') {
        target.src = '/img/cta/cta-pos-1.webp';
    }
}

const containerRef = ref<HTMLElement | null>(null);
const smoothProgress = ref(0);

let animationFrameId: number | null = null;

function updateScrollProgress() {
    if (!containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
});

const lidTransformStyle = computed(() => {
    // Starts partially open (-48deg) so the screen content is visible on page load, opens upright (0deg) on scroll
    const closedAngle = -48;
    const openAngle = 0;
    const currentAngle = closedAngle + (openAngle - closedAngle) * smoothProgress.value;

    return {
        transform: `rotateX(${currentAngle}deg)`,
    };
});

const laptopTransformStyle = computed(() => {
    const closedTilt = 22;
    const openTilt = 8;
    const currentTilt = closedTilt + (openTilt - closedTilt) * smoothProgress.value;

    const closedScale = 0.92;
    const openScale = 1.0;
    const currentScale = closedScale + (openScale - closedScale) * smoothProgress.value;

    return {
        transform: `rotateX(${currentTilt}deg) scale(${currentScale})`,
    };
});

// Pop-out helper: starts ONLY once the full Mac is in view (progress >= 0.70)
function calculateBubbleSpring(threshold: number, startX: number, startY: number) {
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

const bubble1Style = computed(() => calculateBubbleSpring(0.70, 40, 50));
const bubble2Style = computed(() => calculateBubbleSpring(0.76, -40, 50));
const bubble3Style = computed(() => calculateBubbleSpring(0.82, -40, -40));
</script>

<style scoped>
.perspective-1200 {
    perspective: 1200px;
}

@keyframes float-1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(-0.5deg); }
}

@keyframes float-2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(0.6deg); }
}

@keyframes float-3 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-7px) rotate(0.4deg); }
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
