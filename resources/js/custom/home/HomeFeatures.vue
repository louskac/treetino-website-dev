<template>
    <section ref="sectionRef" class="features-desktop relative" style="height: 400vh;">
        <div class="sticky top-0 h-screen w-full overflow-hidden">
            <div class="absolute inset-0 overflow-hidden lg:left-auto lg:right-0 lg:w-7/12">
                <canvas ref="canvasRef" class="h-full w-full"></canvas>
                <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/70 lg:hidden"></div>
            </div>

            <div class="relative h-full w-full lg:w-1/2">
                <div class="relative h-full w-full">
                    <div class="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 sm:px-6 sm:pb-8 lg:inset-x-auto lg:top-1/2 lg:right-0 lg:mx-auto lg:my-auto lg:h-100 lg:max-w-150 lg:-translate-y-1/2 lg:px-0 lg:pb-0  2xl:h-110">
                        <HomeFeaturesCardMobile
                            class="lg:hidden"
                            :sections="sections"
                            :current-section-index="currentSectionIndex"
                            :visible="cardVisible"
                        />

                        <HomeFeaturesCardDesktop
                            :sections="sections"
                            :current-section-index="currentSectionIndex"
                            :visible="cardVisible"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { SunLight, Leaf, Tree, MultiplePages } from '@iconoir/vue';
import HomeFeaturesCardMobile from './HomeFeaturesCardMobile.vue';
import HomeFeaturesCardDesktop from './HomeFeaturesCardDesktop.vue';

const TOTAL_FRAMES = 228;
const TRANSITION_FRAMES = 56;
const SCROLL_LOCK_MS = 600;
const TRANSITION_DURATION_MS = 1500;

const sections = [
    {
        icon: SunLight,
        title: 'Text 1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        icon: Leaf,
        title: 'Text 2',
        text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        icon: Tree,
        title: 'Text 3',
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
        icon: MultiplePages,
        title: 'Text 4',
        text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
        icon: SunLight,
        title: 'Text 5',
        text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
];

const sectionFrames = sections.map((_, i) =>
    i === sections.length - 1 ? TOTAL_FRAMES - 1 : i * TRANSITION_FRAMES,
);

const sectionRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const currentFrameIndex = ref(0);
const currentSectionIndex = ref(0);
const cardVisible = ref(false);

const imagePaths = Array.from(
    { length: TOTAL_FRAMES },
    (_, i) => `/img/features-frames/features_frame_${String(i + 1).padStart(4, '0')}.webp`,
);

// Image objects pre-instantiated at mount so the browser downloads all in parallel
let imageElements: HTMLImageElement[] = [];

// Lerp state - plain vars, not reactive (mutated 60 fps)
let targetFrame = 0;
let displayFrame = 0;
let rafId: number | null = null;
let lastDrawnIndex = -1;
let isSnapping = false;
let hasSnappedIntoSection = false;
let isWheelLocked = false;
let wheelLockTimeoutId: number | null = null;
let transitionFromFrame = 0;
let transitionToFrame = 0;
let transitionStartTime = 0;
let isTransitioning = false;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function drawCover(canvas: HTMLCanvasElement, image: HTMLImageElement): void {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.max(1, Math.floor(rect.width * dpr));
    const targetHeight = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    const ir = image.width / image.height;
    const cr = targetWidth / targetHeight;

    let dw: number;
    let dh: number;
    if (ir > cr) {
        dh = targetHeight;
        dw = dh * ir;
    } else {
        dw = targetWidth;
        dh = dw / ir;
    }

    ctx.drawImage(image, (targetWidth - dw) / 2, (targetHeight - dh) / 2, dw, dh);
}

function animate(): void {
    if (isTransitioning) {
        const elapsed = performance.now() - transitionStartTime;
        const progress = clamp(elapsed / TRANSITION_DURATION_MS, 0, 1);
        displayFrame = transitionFromFrame + (transitionToFrame - transitionFromFrame) * progress;

        if (progress >= 1) {
            isTransitioning = false;
            displayFrame = transitionToFrame;
            targetFrame = transitionToFrame;
        }
    } else {
        displayFrame = targetFrame;
    }

    const intFrame = clamp(Math.round(displayFrame), 0, TOTAL_FRAMES - 1);

    if (intFrame !== currentFrameIndex.value) {
        currentFrameIndex.value = intFrame;
    }

    // Draw only when frame changed - if image is not ready yet, retry next tick
    if (intFrame !== lastDrawnIndex) {
        const img = imageElements[intFrame];
        if (img?.complete && img.naturalWidth > 0) {
            if (canvasRef.value) drawCover(canvasRef.value, img);
            lastDrawnIndex = intFrame;
        }
    }

    rafId = requestAnimationFrame(animate);
}

function startStateTransition(nextSectionIndex: number): void {
    const nextFrame = sectionFrames[nextSectionIndex];

    if (nextFrame === targetFrame || isTransitioning) return;

    transitionFromFrame = targetFrame;
    transitionToFrame = nextFrame;
    transitionStartTime = performance.now();
    isTransitioning = true;

    currentSectionIndex.value = nextSectionIndex;
    targetFrame = nextFrame;

    isWheelLocked = true;
    if (wheelLockTimeoutId !== null) {
        window.clearTimeout(wheelLockTimeoutId);
    }
    wheelLockTimeoutId = window.setTimeout(() => {
        isWheelLocked = false;
        wheelLockTimeoutId = null;
    }, SCROLL_LOCK_MS);
}

function handleWheel(event: WheelEvent): void {
    const section = sectionRef.value;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const isInsidePinnedArea = rect.top <= 0 && rect.bottom >= vh;

    if (!isInsidePinnedArea || !cardVisible.value) return;

    if (isWheelLocked || isTransitioning) {
        event.preventDefault();
        return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;

    const nextSectionIndex = clamp(currentSectionIndex.value + direction, 0, sections.length - 1);
    if (nextSectionIndex === currentSectionIndex.value) {
        const sectionTop = window.scrollY + rect.top;

        // Let user leave sticky area immediately when trying to scroll past edges.
        if (currentSectionIndex.value === sections.length - 1 && direction > 0) {
            event.preventDefault();
            const exitBottomY = sectionTop + section.offsetHeight - vh + 2;
            window.scrollTo({ top: exitBottomY, behavior: 'auto' });
            return;
        }

        if (currentSectionIndex.value === 0 && direction < 0) {
            event.preventDefault();
            const exitTopY = Math.max(0, sectionTop - vh);
            window.scrollTo({ top: exitTopY, behavior: 'smooth' });
            return;
        }

        return;
    }

    event.preventDefault();
    startStateTransition(nextSectionIndex);
}

function handleScroll(): void {
    const section = sectionRef.value;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if (!isSnapping && !hasSnappedIntoSection && rect.top > 0 && rect.top <= vh / 2) {
        isSnapping = true;
        hasSnappedIntoSection = true;
        window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });

        window.setTimeout(() => {
            isSnapping = false;
            handleScroll();
        }, 600);

        return;
    }

    if (rect.top > vh / 2) {
        hasSnappedIntoSection = false;
    }

    cardVisible.value = rect.top <= 0;
}

onMounted(() => {
    // Instantiate all Image objects immediately - browser downloads all 228 in parallel
    imageElements = imagePaths.map((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        return img;
    });

    targetFrame = sectionFrames[0];
    displayFrame = sectionFrames[0];
    currentFrameIndex.value = sectionFrames[0];
    currentSectionIndex.value = 0;

    handleScroll();
    animate();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (wheelLockTimeoutId !== null) {
        window.clearTimeout(wheelLockTimeoutId);
        wheelLockTimeoutId = null;
    }
    imageElements = [];
});
</script>
