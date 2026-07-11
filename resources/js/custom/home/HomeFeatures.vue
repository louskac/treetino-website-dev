<template>
    <section ref="sectionRef" class="features-desktop relative">
        <div ref="pinRef" class="features-pin h-screen w-full overflow-hidden">
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
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import HomeFeaturesCardMobile from '@/custom/home/features/HomeFeaturesCardMobile.vue';

const TOTAL_FRAMES = 228;
const TRANSITION_FRAMES = 56;

const LG_BREAKPOINT = 1024;
const EXIT_HOLD_STEPS = 1;
const STEP_ANIMATION_SECONDS = 1.5;
const OBSERVER_TOLERANCE_PX = 14;
const FRAME_DECODE_CONCURRENCY = 8;
const PINNED_SCROLL_EPSILON_PX = 4;
const ENTRY_SNAP_SECONDS = 0.45;
const ENTRY_SNAP_INPUT_LOCK_MS = 650;
const EXIT_REENTRY_LOCK_MS = 600;
const EXIT_SCROLL_OFFSET_PX = 120;

gsap.registerPlugin(Observer, ScrollTrigger);

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

const scrollStepCount = sections.length - 1 + EXIT_HOLD_STEPS;

const sectionFrames = sections.map((_, i) =>
    i === sections.length - 1 ? TOTAL_FRAMES - 1 : i * TRANSITION_FRAMES,
);

const sectionRef = ref<HTMLElement | null>(null);
const pinRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const currentSectionIndex = ref(0);
const cardVisible = ref(false);

const imagePaths = Array.from(
    { length: TOTAL_FRAMES },
    (_, i) =>
        `/img/features-frames/features_frame_${String(i + 1).padStart(4, '0')}.webp`,
);

let imageElements: HTMLImageElement[] = [];

const frameState = {
    frame: sectionFrames[0],
};

let currentFrameIndex = 0;
let lastDrawnIndex = -1;
let canvasPixelWidth = 0;
let canvasPixelHeight = 0;
let canvasContext: CanvasRenderingContext2D | null = null;
let scrollTriggerInstance: ScrollTrigger | null = null;
let entrySnapTriggerInstance: ScrollTrigger | null = null;
let inputObserver: Observer | null = null;
let stepTween: gsap.core.Tween | null = null;
let scrollSnapTween: gsap.core.Tween | null = null;
let isStepAnimating = false;
let isEntrySnapping = false;
let ignoreStepInputUntil = 0;
let suppressScrollTriggerEntryUntil = 0;
let decodedFrameIndexes = new Set<number>();
let decodingFrameIndexes = new Set<number>();

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function isMobileViewport(): boolean {
    return window.innerWidth < LG_BREAKPOINT;
}

function getPinnedViewportHeight(): number {
    return pinRef.value?.offsetHeight || window.innerHeight;
}

function syncCanvasSize(canvas: HTMLCanvasElement): boolean {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const targetWidth = Math.max(1, Math.floor(rect.width * dpr));
    const targetHeight = Math.max(1, Math.floor(rect.height * dpr));

    if (
        canvas.width !== targetWidth ||
        canvas.height !== targetHeight ||
        canvasPixelWidth !== targetWidth ||
        canvasPixelHeight !== targetHeight
    ) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvasPixelWidth = targetWidth;
        canvasPixelHeight = targetHeight;
        canvasContext = canvas.getContext('2d');
    }

    return targetWidth > 0 && targetHeight > 0;
}

function drawCover(canvas: HTMLCanvasElement, image: HTMLImageElement): void {
    if (
        (canvasPixelWidth <= 0 || canvasPixelHeight <= 0) &&
        !syncCanvasSize(canvas)
    ) {
        return;
    }

    const ctx = canvasContext || canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    canvasContext = ctx;

    ctx.clearRect(0, 0, canvasPixelWidth, canvasPixelHeight);

    const imageRatio = image.width / image.height;

    const drawWidth = canvasPixelWidth;
    const drawHeight = drawWidth / imageRatio;

    const mobileOffsetY = isMobileViewport() ? -130 : 0;
    const drawX = 0;
    const drawY = (canvasPixelHeight - drawHeight) / 2 + mobileOffsetY;

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawFrame(frame: number): void {
    const nextFrameIndex = clamp(Math.round(frame), 0, TOTAL_FRAMES - 1);

    currentFrameIndex = nextFrameIndex;

    if (nextFrameIndex === lastDrawnIndex) {
        return;
    }

    const canvas = canvasRef.value;
    const img = imageElements[nextFrameIndex];

    if (!canvas || !img?.complete || img.naturalWidth <= 0) {
        if (img) {
            void decodeFrame(nextFrameIndex);
        }

        return;
    }

    drawCover(canvas, img);
    lastDrawnIndex = nextFrameIndex;
}

function handleResize(): void {
    canvasPixelWidth = 0;
    canvasPixelHeight = 0;
    lastDrawnIndex = -1;
    canvasContext = null;

    if (canvasRef.value) {
        syncCanvasSize(canvasRef.value);
    }

    drawFrame(frameState.frame);
}

async function decodeFrame(frameIndex: number): Promise<void> {
    if (
        decodedFrameIndexes.has(frameIndex) ||
        decodingFrameIndexes.has(frameIndex)
    ) {
        return;
    }

    const img = imageElements[frameIndex];

    if (!img) {
        return;
    }

    decodingFrameIndexes.add(frameIndex);

    try {
        await img.decode();
    } catch {
        if (!img.complete || img.naturalWidth <= 0) {
            decodingFrameIndexes.delete(frameIndex);

            return;
        }
    }

    decodingFrameIndexes.delete(frameIndex);
    decodedFrameIndexes.add(frameIndex);

    if (frameIndex === currentFrameIndex) {
        lastDrawnIndex = -1;
        drawFrame(frameIndex);
    }
}

async function decodeFrames(frameIndexes: number[]): Promise<void> {
    let nextIndex = 0;

    async function worker(): Promise<void> {
        while (nextIndex < frameIndexes.length) {
            const frameIndex = frameIndexes[nextIndex];

            nextIndex++;
            await decodeFrame(frameIndex);
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(FRAME_DECODE_CONCURRENCY, frameIndexes.length) },
            worker,
        ),
    );
}

function getFrameRange(fromFrame: number, toFrame: number): number[] {
    const from = clamp(Math.min(fromFrame, toFrame), 0, TOTAL_FRAMES - 1);
    const to = clamp(Math.max(fromFrame, toFrame), 0, TOTAL_FRAMES - 1);

    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function warmUpFeatureFrames(): void {
    const firstTransitionFrames = getFrameRange(
        sectionFrames[0],
        sectionFrames[1],
    );
    const remainingFrames = imageElements
        .map((_, frameIndex) => frameIndex)
        .filter((frameIndex) => !firstTransitionFrames.includes(frameIndex));

    void decodeFrames(firstTransitionFrames).then(() => {
        void decodeFrames(remainingFrames);
    });
}

function getStepDistance(): number {
    const trigger = scrollTriggerInstance;

    if (!trigger) {
        return getPinnedViewportHeight();
    }

    return (trigger.end - trigger.start) / scrollStepCount;
}

function getSectionScrollY(sectionIndex: number): number | null {
    const trigger = scrollTriggerInstance;

    if (!trigger) {
        return null;
    }

    const rawY = trigger.start + getStepDistance() * sectionIndex;

    if (sectionIndex === 0) {
        return rawY + PINNED_SCROLL_EPSILON_PX;
    }

    if (sectionIndex === sections.length - 1) {
        return Math.min(rawY, trigger.end - PINNED_SCROLL_EPSILON_PX);
    }

    return rawY;
}

function setFrameToSection(sectionIndex: number): void {
    const frame = sectionFrames[sectionIndex];

    stepTween?.kill();
    stepTween = null;
    isStepAnimating = false;
    frameState.frame = frame;
    currentSectionIndex.value = sectionIndex;
    drawFrame(frame);
}

function syncScrollToSection(sectionIndex: number): void {
    const targetY = getSectionScrollY(sectionIndex);

    if (targetY === null) {
        return;
    }

    window.scrollTo({
        top: targetY,
        behavior: 'auto',
    });
}

function stopScrollSnap(): void {
    scrollSnapTween?.kill();
    scrollSnapTween = null;
    isEntrySnapping = false;
}

function lockStepInput(durationMs: number): void {
    ignoreStepInputUntil = Math.max(
        ignoreStepInputUntil,
        performance.now() + durationMs,
    );
}

function shouldIgnoreStepInput(): boolean {
    return isEntrySnapping || performance.now() < ignoreStepInputUntil;
}

function shouldSuppressScrollTriggerEntry(): boolean {
    return performance.now() < suppressScrollTriggerEntryUntil;
}

function snapScrollToY(targetY: number): void {
    const scrollState = {
        y: window.scrollY,
    };

    stopScrollSnap();
    isEntrySnapping = true;
    lockStepInput(ENTRY_SNAP_SECONDS * 1000 + ENTRY_SNAP_INPUT_LOCK_MS);

    scrollSnapTween = gsap.to(scrollState, {
        y: targetY,
        duration: ENTRY_SNAP_SECONDS,
        ease: 'none',
        overwrite: true,
        onUpdate: () => {
            window.scrollTo({
                top: scrollState.y,
                behavior: 'auto',
            });
        },
        onComplete: () => {
            scrollSnapTween = null;
            isEntrySnapping = false;
            lockStepInput(ENTRY_SNAP_INPUT_LOCK_MS);
        },
        onInterrupt: () => {
            scrollSnapTween = null;
            isEntrySnapping = false;
        },
    });
}

function snapIntoPinnedArea(): void {
    const targetY = getSectionScrollY(0);

    if (targetY === null || isEntrySnapping || inputObserver?.isEnabled) {
        return;
    }

    snapScrollToY(targetY);
}

function animateToSection(sectionIndex: number): void {
    const nextSectionIndex = clamp(sectionIndex, 0, sections.length - 1);

    if (nextSectionIndex === currentSectionIndex.value && !isStepAnimating) {
        syncScrollToSection(nextSectionIndex);

        return;
    }

    stepTween?.kill();
    isStepAnimating = true;
    currentSectionIndex.value = nextSectionIndex;
    void decodeFrames(
        getFrameRange(
            Math.round(frameState.frame),
            sectionFrames[nextSectionIndex],
        ),
    );

    stepTween = gsap.to(frameState, {
        frame: sectionFrames[nextSectionIndex],
        duration: STEP_ANIMATION_SECONDS,
        ease: 'none',
        overwrite: true,
        onUpdate: () => {
            drawFrame(frameState.frame);
        },
        onComplete: () => {
            isStepAnimating = false;
            stepTween = null;
            frameState.frame = sectionFrames[nextSectionIndex];
            drawFrame(frameState.frame);
            syncScrollToSection(nextSectionIndex);
        },
    });
}

function getNextSectionForDirection(direction: 1 | -1): number | null {
    const lastSectionIndex = sections.length - 1;

    if (direction > 0 && currentSectionIndex.value < lastSectionIndex) {
        return currentSectionIndex.value + 1;
    }

    if (direction < 0 && currentSectionIndex.value > 0) {
        return currentSectionIndex.value - 1;
    }

    return null;
}

function enableInputObserver(): void {
    inputObserver?.enable();
}

function disableInputObserver(): void {
    inputObserver?.disable();
}

function exitPinnedArea(direction: 1 | -1): void {
    const trigger = scrollTriggerInstance;

    if (!trigger) {
        return;
    }

    disableInputObserver();
    stepTween?.kill();
    stepTween = null;
    isStepAnimating = false;
    stopScrollSnap();
    lockStepInput(EXIT_REENTRY_LOCK_MS);
    suppressScrollTriggerEntryUntil = performance.now() + EXIT_REENTRY_LOCK_MS;

    if (direction > 0) {
        setFrameToSection(sections.length - 1);
    } else {
        setFrameToSection(0);
    }

    window.scrollTo({
        top:
            direction > 0
                ? trigger.end + EXIT_SCROLL_OFFSET_PX
                : Math.max(0, trigger.start - EXIT_SCROLL_OFFSET_PX),
        behavior: 'auto',
    });
}

function getObserverDirection(self: Observer): 1 | -1 {
    const eventType = self.event?.type ?? '';
    const isWheel = eventType === 'wheel';

    if (isWheel) {
        return self.deltaY > 0 ? 1 : -1;
    }

    return self.deltaY < 0 ? 1 : -1;
}

function handleStepInput(self: Observer): void {
    if (shouldIgnoreStepInput()) {
        return;
    }

    if (isStepAnimating) {
        return;
    }

    const direction = getObserverDirection(self);
    const nextSectionIndex = getNextSectionForDirection(direction);

    if (nextSectionIndex === null) {
        exitPinnedArea(direction);

        return;
    }

    animateToSection(nextSectionIndex);
}

function setupInputObserver(): void {
    inputObserver?.kill();

    inputObserver = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        preventDefault: true,
        allowClicks: true,
        tolerance: OBSERVER_TOLERANCE_PX,
        wheelSpeed: 1,
        onChangeY: handleStepInput,
    });

    disableInputObserver();
}

function setupScrollTrigger(): void {
    const section = sectionRef.value;
    const pin = pinRef.value;

    if (!section || !pin) {
        return;
    }

    entrySnapTriggerInstance?.kill();
    scrollTriggerInstance?.kill();

    scrollTriggerInstance = ScrollTrigger.create({
        trigger: section,
        pin,
        start: 'top top',
        end: () => `+=${getPinnedViewportHeight() * scrollStepCount}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onEnter: () => {
            if (shouldSuppressScrollTriggerEntry()) {
                return;
            }

            cardVisible.value = true;
            setFrameToSection(0);
            lockStepInput(ENTRY_SNAP_INPUT_LOCK_MS);
            enableInputObserver();
            syncScrollToSection(0);
        },
        onEnterBack: () => {
            if (shouldSuppressScrollTriggerEntry()) {
                return;
            }

            cardVisible.value = true;
            setFrameToSection(sections.length - 1);
            lockStepInput(ENTRY_SNAP_INPUT_LOCK_MS);
            enableInputObserver();
            syncScrollToSection(sections.length - 1);
        },
        onLeave: () => {
            cardVisible.value = false;
            disableInputObserver();
            setFrameToSection(sections.length - 1);
        },
        onLeaveBack: () => {
            cardVisible.value = false;
            disableInputObserver();
            setFrameToSection(0);
        },
        onUpdate: (self) => {
            if (shouldSuppressScrollTriggerEntry()) {
                cardVisible.value = false;

                return;
            }

            cardVisible.value =
                self.isActive || Boolean(inputObserver?.isEnabled);
        },
        onRefresh: () => {
            handleResize();
        },
    });

    entrySnapTriggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'top top',
        invalidateOnRefresh: true,
        onEnter: () => {
            snapIntoPinnedArea();
        },
    });
}

onMounted(() => {
    imageElements = imagePaths.map((src, imageIndex) => {
        const img = new Image();

        img.decoding = 'async';
        img.onload = () => {
            if (imageIndex === currentFrameIndex) {
                drawFrame(currentFrameIndex);
            }
        };
        img.src = src;

        return img;
    });

    frameState.frame = sectionFrames[0];
    currentFrameIndex = sectionFrames[0];
    currentSectionIndex.value = 0;

    drawFrame(frameState.frame);
    warmUpFeatureFrames();

    nextTick(() => {
        setupInputObserver();
        setupScrollTrigger();
        ScrollTrigger.refresh();
    });

    window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);

    scrollTriggerInstance?.kill();
    entrySnapTriggerInstance?.kill();
    inputObserver?.kill();
    stepTween?.kill();
    scrollSnapTween?.kill();

    scrollTriggerInstance = null;
    entrySnapTriggerInstance = null;
    inputObserver = null;
    stepTween = null;
    scrollSnapTween = null;
    decodedFrameIndexes = new Set<number>();
    decodingFrameIndexes = new Set<number>();

    imageElements = [];
});
</script>

<style scoped>
@media (max-width: 1023px) {
    .features-pin {
        height: 100svh;
    }
}

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
