<template>
    <section
        ref="sectionRef"
        class="features-desktop relative"
        :style="{ height: `${sections.length * 100}vh` }"
    >
        <div class="sticky top-0 h-screen w-full overflow-hidden">
            <div
                class="absolute inset-0 overflow-hidden lg:right-0 lg:left-auto lg:w-7/12"
            >
                <canvas
                    ref="canvasRef"
                    class="h-full w-full bg-[#fdfdfd]"
                ></canvas>
            </div>

            <div class="absolute right-0 hidden h-full lg:block lg:w-7/12">
                <div
                    class="h-full w-28 bg-linear-90 from-white to-transparent"
                ></div>
            </div>

            <!-- Desktop: left column content -->
            <div
                class="absolute top-0 left-1/2 h-full w-full max-w-[1400px] -translate-x-1/2 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div
                    class="absolute top-0 left-0 z-10 hidden h-full w-5/12 items-center lg:flex"
                >
                    <div class="w-full max-w-sm xl:max-w-md">
                        <Transition name="section-content" mode="out-in">
                            <div
                                :key="currentSectionIndex"
                                class="flex flex-col gap-4"
                            >
                                <span
                                    class="text-sm font-medium text-black/35 tabular-nums"
                                >
                                    {{
                                        String(
                                            currentSectionIndex + 1,
                                        ).padStart(2, '0')
                                    }}
                                    /
                                    {{
                                        String(sections.length).padStart(2, '0')
                                    }}
                                </span>

                                <h2 class="text-4xl leading-tight text-black">
                                    {{ sections[currentSectionIndex].title }}
                                </h2>

                                <p class="text-2xl leading-tight text-black/75">
                                    {{ sections[currentSectionIndex].text }}
                                </p>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>

            <!-- Mobile: card at the bottom -->
            <div
                class="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 sm:px-6 sm:pb-8 lg:hidden"
            >
                <HomeFeaturesCardMobile
                    :sections="sections"
                    :current-section-index="currentSectionIndex"
                    :visible="cardVisible"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { SunLight, Leaf, Tree, RulerCombine, Wind } from '@iconoir/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import HomeFeaturesCardMobile from '@/custom/home/features/HomeFeaturesCardMobile.vue';

const TOTAL_FRAMES = 228;
const TRANSITION_FRAMES = 56;
const SCROLL_LOCK_MS = 600;
const SNAP_LOCK_MS = 600;
const TRANSITION_DURATION_MS = 1500;
const LG_BREAKPOINT = 1024;

const { t } = useI18n();

const sections = [
    {
        icon: Tree,
        title: t('home.features.design.title'),
        text: t('home.features.design.text'),
    },
    {
        icon: RulerCombine,
        title: t('home.features.space.title'),
        text: t('home.features.space.text'),
    },
    {
        icon: SunLight,
        title: t('home.features.performance.title'),
        text: t('home.features.performance.text'),
    },
    {
        icon: Leaf,
        title: t('home.features.premium.title'),
        text: t('home.features.premium.text'),
    },
    {
        icon: Wind,
        title: t('home.features.balance.title'),
        text: t('home.features.balance.text'),
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
    (_, i) =>
        `/img/features-frames/features_frame_${String(i + 1).padStart(4, '0')}.webp`,
);

let imageElements: HTMLImageElement[] = [];

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

function isMobileViewport(): boolean {
    return window.innerWidth < LG_BREAKPOINT;
}

function isInsidePinnedArea(rect: DOMRect, vh: number): boolean {
    return rect.top <= 0 && rect.bottom >= vh;
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

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    const imageRatio = image.width / image.height;

    // Current mode: contain by width
    const drawWidth = targetWidth;
    const drawHeight = drawWidth / imageRatio;

    const mobileOffsetY = isMobileViewport() ? -130 : 0;
    const drawX = 0;
    const drawY = (targetHeight - drawHeight) / 2 + mobileOffsetY;

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function redrawCurrentFrame(): void {
    const canvas = canvasRef.value;
    const img = imageElements[currentFrameIndex.value];

    if (!canvas || !img?.complete || img.naturalWidth <= 0) {
        return;
    }

    drawCover(canvas, img);
}

function animate(): void {
    if (isTransitioning) {
        const elapsed = performance.now() - transitionStartTime;
        const progress = clamp(elapsed / TRANSITION_DURATION_MS, 0, 1);

        displayFrame =
            transitionFromFrame +
            (transitionToFrame - transitionFromFrame) * progress;

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

    if (intFrame !== lastDrawnIndex) {
        const img = imageElements[intFrame];

        if (img?.complete && img.naturalWidth > 0) {
            if (canvasRef.value) {
                drawCover(canvasRef.value, img);
            }

            lastDrawnIndex = intFrame;
        }
    }

    rafId = requestAnimationFrame(animate);
}

function startStateTransition(nextSectionIndex: number): void {
    const nextFrame = sectionFrames[nextSectionIndex];

    if (nextFrame === targetFrame || isTransitioning) {
        return;
    }

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

function updateMobileScrollProgress(rect: DOMRect, vh: number): void {
    const section = sectionRef.value;

    if (!section || !isInsidePinnedArea(rect, vh)) {
        return;
    }

    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = section.offsetHeight - vh;

    if (scrollableDistance <= 0) {
        return;
    }

    const progress = clamp(
        (window.scrollY - sectionTop) / scrollableDistance,
        0,
        1,
    );

    const nextFrame = Math.round(progress * (TOTAL_FRAMES - 1));

    const nextSectionIndex = clamp(
        Math.round(progress * (sections.length - 1)),
        0,
        sections.length - 1,
    );

    isTransitioning = false;

    targetFrame = nextFrame;
    displayFrame = nextFrame;

    currentSectionIndex.value = nextSectionIndex;
}

function handleWheel(event: WheelEvent): void {
    if (isMobileViewport()) {
        return;
    }

    const section = sectionRef.value;

    if (!section) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if (!isInsidePinnedArea(rect, vh) || !cardVisible.value) {
        return;
    }

    if (isWheelLocked || isTransitioning || isSnapping) {
        event.preventDefault();
        return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;

    const nextSectionIndex = clamp(
        currentSectionIndex.value + direction,
        0,
        sections.length - 1,
    );

    if (nextSectionIndex === currentSectionIndex.value) {
        const sectionTop = window.scrollY + rect.top;

        if (
            currentSectionIndex.value === sections.length - 1 &&
            direction > 0
        ) {
            event.preventDefault();

            const exitBottomY = sectionTop + section.offsetHeight - vh + 2;

            window.scrollTo({
                top: exitBottomY,
                behavior: 'auto',
            });

            return;
        }

        if (currentSectionIndex.value === 0 && direction < 0) {
            event.preventDefault();

            const exitTopY = Math.max(0, sectionTop - vh);

            window.scrollTo({
                top: exitTopY,
                behavior: 'smooth',
            });

            return;
        }

        return;
    }

    event.preventDefault();
    startStateTransition(nextSectionIndex);
}

function handleScroll(): void {
    const section = sectionRef.value;

    if (!section) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if (
        !isSnapping &&
        !hasSnappedIntoSection &&
        rect.top > 0 &&
        rect.top <= vh / 2
    ) {
        isSnapping = true;
        hasSnappedIntoSection = true;

        window.scrollTo({
            top: window.scrollY + rect.top,
            behavior: 'smooth',
        });

        window.setTimeout(() => {
            isSnapping = false;

            isWheelLocked = true;

            if (wheelLockTimeoutId !== null) {
                window.clearTimeout(wheelLockTimeoutId);
            }

            wheelLockTimeoutId = window.setTimeout(() => {
                isWheelLocked = false;
                wheelLockTimeoutId = null;
            }, SNAP_LOCK_MS);

            handleScroll();
        }, SNAP_LOCK_MS);

        return;
    }

    if (rect.top > vh / 2) {
        hasSnappedIntoSection = false;
    }

    const insidePinnedArea = isInsidePinnedArea(rect, vh);

    cardVisible.value = insidePinnedArea;

    if (isMobileViewport()) {
        updateMobileScrollProgress(rect, vh);
    }
}

function handleResize(): void {
    lastDrawnIndex = -1;

    handleScroll();
    redrawCurrentFrame();
}

onMounted(() => {
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
    window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('resize', handleResize);

    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (wheelLockTimeoutId !== null) {
        window.clearTimeout(wheelLockTimeoutId);
        wheelLockTimeoutId = null;
    }

    imageElements = [];
});
</script>

<style scoped>
.section-content-enter-active,
.section-content-leave-active {
    transition:
        opacity 0.35s ease,
        transform 0.35s ease;
}

.section-content-enter-from {
    opacity: 0;
    transform: translateY(16px);
}

.section-content-leave-to {
    opacity: 0;
    transform: translateY(-16px);
}
</style>
