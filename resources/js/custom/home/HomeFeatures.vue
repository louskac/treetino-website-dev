<template>
    <section
        ref="sectionRef"
        class="features-desktop relative"
        :style="featureSectionStyle"
    >
        <div
            ref="stickyRef"
            class="features-sticky sticky top-0 h-screen w-full overflow-hidden"
        >
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import HomeFeaturesCardMobile from '@/custom/home/features/HomeFeaturesCardMobile.vue';

const TOTAL_FRAMES = 228;
const TRANSITION_FRAMES = 56;

const SCROLL_LOCK_MS = 600;
const SNAP_LOCK_MS = 600;
const TRANSITION_DURATION_MS = 1500;

const LG_BREAKPOINT = 1024;
const MOBILE_EXIT_HOLD_STEPS = 1;

const MOBILE_SWIPE_THRESHOLD_PX = 8;
const MOBILE_SETTLE_DELAY_MS = 90;
const MOBILE_SETTLE_MAX_MS = TRANSITION_DURATION_MS + 400;

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
const stickyRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const currentSectionIndex = ref(0);
const cardVisible = ref(false);

const featureSectionStyle = computed<Record<string, string>>(() => ({
    '--features-desktop-panels': String(sections.length),
    '--features-mobile-panels': String(
        sections.length + MOBILE_EXIT_HOLD_STEPS,
    ),
}));

const imagePaths = Array.from(
    { length: TOTAL_FRAMES },
    (_, i) =>
        `/img/features-frames/features_frame_${String(i + 1).padStart(4, '0')}.webp`,
);

let imageElements: HTMLImageElement[] = [];

let targetFrame = 0;
let displayFrame = 0;
let currentFrameIndex = 0;
let rafId: number | null = null;
let lastDrawnIndex = -1;
let canvasPixelWidth = 0;
let canvasPixelHeight = 0;

let isSnapping = false;
let hasSnappedIntoSection = false;

let isWheelLocked = false;
let wheelLockTimeoutId: number | null = null;

let transitionFromFrame = 0;
let transitionToFrame = 0;
let transitionStartTime = 0;
let isTransitioning = false;

let isMobileTouching = false;
let mobileGestureStartedInside = false;
let mobileGestureStartY = 0;
let mobileGestureStartIndex = 0;

let isMobileSettling = false;
let mobileSettleTimeoutId: number | null = null;
let mobileSettleRafId: number | null = null;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function isMobileViewport(): boolean {
    return window.innerWidth < LG_BREAKPOINT;
}

function getPinnedViewportHeight(): number {
    return stickyRef.value?.offsetHeight || window.innerHeight;
}

function isInsidePinnedArea(rect: DOMRect, vh: number): boolean {
    return rect.top <= 0 && rect.bottom >= vh;
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

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, canvasPixelWidth, canvasPixelHeight);

    const imageRatio = image.width / image.height;

    const drawWidth = canvasPixelWidth;
    const drawHeight = drawWidth / imageRatio;

    const mobileOffsetY = isMobileViewport() ? -130 : 0;
    const drawX = 0;
    const drawY = (canvasPixelHeight - drawHeight) / 2 + mobileOffsetY;

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function redrawCurrentFrame(): void {
    const canvas = canvasRef.value;
    const img = imageElements[currentFrameIndex];

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

    if (intFrame !== currentFrameIndex) {
        currentFrameIndex = intFrame;
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

    if (nextFrame === targetFrame && !isTransitioning) {
        currentSectionIndex.value = nextSectionIndex;

        return;
    }

    transitionFromFrame = displayFrame;
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

function getSectionTop(rect: DOMRect): number {
    return window.scrollY + rect.top;
}

function getMobileScrollableDistance(section: HTMLElement, vh: number): number {
    return Math.max(0, section.offsetHeight - vh);
}

function getMobileStepDistance(section: HTMLElement, vh: number): number {
    const scrollableDistance = getMobileScrollableDistance(section, vh);
    const stepCount = sections.length - 1 + MOBILE_EXIT_HOLD_STEPS;

    if (stepCount <= 0) {
        return scrollableDistance;
    }

    return scrollableDistance / stepCount;
}

function getMobileAnimationDistance(section: HTMLElement, vh: number): number {
    return getMobileStepDistance(section, vh) * Math.max(0, sections.length - 1);
}

function getMobileProgress(rect: DOMRect, vh: number): number {
    const section = sectionRef.value;

    if (!section) {
        return 0;
    }

    const sectionTop = getSectionTop(rect);
    const animationDistance = getMobileAnimationDistance(section, vh);

    if (animationDistance <= 0) {
        return 0;
    }

    return clamp((window.scrollY - sectionTop) / animationDistance, 0, 1);
}

function getFrameFromMobileProgress(progress: number): number {
    const lastSectionIndex = sections.length - 1;
    const exactSectionProgress = progress * lastSectionIndex;

    const fromSectionIndex = clamp(
        Math.floor(exactSectionProgress),
        0,
        lastSectionIndex,
    );

    const toSectionIndex = clamp(fromSectionIndex + 1, 0, lastSectionIndex);

    const localProgress = clamp(exactSectionProgress - fromSectionIndex, 0, 1);

    const fromFrame = sectionFrames[fromSectionIndex];
    const toFrame = sectionFrames[toSectionIndex];

    return Math.round(fromFrame + (toFrame - fromFrame) * localProgress);
}

function getNearestMobileSectionIndex(rect: DOMRect, vh: number): number {
    const progress = getMobileProgress(rect, vh);

    return clamp(
        Math.round(progress * (sections.length - 1)),
        0,
        sections.length - 1,
    );
}

function getMobileSectionScrollY(sectionIndex: number): number | null {
    const section = sectionRef.value;

    if (!section) {
        return null;
    }

    const rect = section.getBoundingClientRect();
    const vh = getPinnedViewportHeight();

    const sectionTop = getSectionTop(rect);
    const stepDistance = getMobileStepDistance(section, vh);

    return sectionTop + stepDistance * sectionIndex;
}

function clearMobileSettleTimers(): void {
    if (mobileSettleTimeoutId !== null) {
        window.clearTimeout(mobileSettleTimeoutId);
        mobileSettleTimeoutId = null;
    }

    if (mobileSettleRafId !== null) {
        cancelAnimationFrame(mobileSettleRafId);
        mobileSettleRafId = null;
    }
}

function clearMobileSettleState(): void {
    clearMobileSettleTimers();

    isMobileSettling = false;
}

function getMobileExitDirection(deltaY: number): 1 | -1 | null {
    if (Math.abs(deltaY) < MOBILE_SWIPE_THRESHOLD_PX) {
        return null;
    }

    const direction = deltaY > 0 ? 1 : -1;
    const lastSectionIndex = sections.length - 1;

    if (mobileGestureStartIndex === lastSectionIndex && direction > 0) {
        return 1;
    }

    if (mobileGestureStartIndex === 0 && direction < 0) {
        return -1;
    }

    return null;
}

function finishMobileSettleWhenArrived(
    targetY: number,
    sectionIndex: number,
    startedAt: number,
): void {
    const finalFrame = sectionFrames[sectionIndex];
    const isCloseEnough = Math.abs(window.scrollY - targetY) <= 2;
    const isFrameSettled =
        !isTransitioning && Math.round(displayFrame) === finalFrame;
    const hasTimedOut = performance.now() - startedAt >= MOBILE_SETTLE_MAX_MS;

    if ((isCloseEnough && isFrameSettled) || hasTimedOut) {
        window.scrollTo({
            top: targetY,
            behavior: 'auto',
        });

        isTransitioning = false;
        isMobileSettling = false;

        targetFrame = finalFrame;
        displayFrame = finalFrame;

        currentFrameIndex = finalFrame;
        currentSectionIndex.value = sectionIndex;

        mobileSettleRafId = null;

        return;
    }

    mobileSettleRafId = requestAnimationFrame(() => {
        finishMobileSettleWhenArrived(targetY, sectionIndex, startedAt);
    });
}

function startMobileFrameTransition(sectionIndex: number): void {
    const finalFrame = sectionFrames[sectionIndex];

    transitionFromFrame = displayFrame;
    transitionToFrame = finalFrame;
    transitionStartTime = performance.now();
    isTransitioning = transitionFromFrame !== transitionToFrame;

    targetFrame = finalFrame;

    if (!isTransitioning) {
        displayFrame = finalFrame;
    }
}

function settleMobileToSection(sectionIndex: number): void {
    const targetY = getMobileSectionScrollY(sectionIndex);

    if (targetY === null) {
        return;
    }

    clearMobileSettleTimers();

    isMobileSettling = true;

    currentSectionIndex.value = sectionIndex;
    startMobileFrameTransition(sectionIndex);

    window.scrollTo({
        top: targetY,
        behavior: 'smooth',
    });

    mobileSettleRafId = requestAnimationFrame(() => {
        finishMobileSettleWhenArrived(targetY, sectionIndex, performance.now());
    });
}

function exitMobilePinnedArea(direction: 1 | -1): void {
    const section = sectionRef.value;

    if (!section) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = getPinnedViewportHeight();
    const sectionTop = getSectionTop(rect);

    const targetY =
        direction > 0
            ? sectionTop + section.offsetHeight - vh + 2
            : Math.max(0, sectionTop - vh);

    clearMobileSettleTimers();

    isTransitioning = false;
    isMobileSettling = true;

    const sectionIndex = direction > 0 ? sections.length - 1 : 0;
    const finalFrame = sectionFrames[sectionIndex];

    currentSectionIndex.value = sectionIndex;
    targetFrame = finalFrame;
    displayFrame = finalFrame;

    window.scrollTo({
        top: targetY,
        behavior: 'smooth',
    });

    window.setTimeout(() => {
        isMobileSettling = false;
    }, SNAP_LOCK_MS);
}

function updateMobileFrameFromScroll(rect: DOMRect, vh: number): void {
    if (!isMobileViewport()) {
        return;
    }

    if (!isInsidePinnedArea(rect, vh)) {
        return;
    }

    if (isMobileTouching || isMobileSettling) {
        return;
    }

    const progress = getMobileProgress(rect, vh);
    const nextFrame = getFrameFromMobileProgress(progress);

    isTransitioning = false;

    targetFrame = nextFrame;
    displayFrame = nextFrame;

    if (!isMobileTouching && !isMobileSettling) {
        currentSectionIndex.value = getNearestMobileSectionIndex(rect, vh);
    }
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
    const vh = getPinnedViewportHeight();

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
        const sectionTop = getSectionTop(rect);

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

function handleTouchStart(event: TouchEvent): void {
    if (!isMobileViewport()) {
        return;
    }

    const section = sectionRef.value;
    const touch = event.touches[0];

    if (!section || !touch) {
        return;
    }

    clearMobileSettleState();

    const rect = section.getBoundingClientRect();
    const vh = getPinnedViewportHeight();

    isMobileTouching = true;
    mobileGestureStartY = touch.clientY;
    mobileGestureStartedInside = isInsidePinnedArea(rect, vh);
    mobileGestureStartIndex = mobileGestureStartedInside
        ? getNearestMobileSectionIndex(rect, vh)
        : currentSectionIndex.value;

    if (mobileGestureStartedInside) {
        const startFrame = sectionFrames[mobileGestureStartIndex];

        isTransitioning = false;
        targetFrame = startFrame;
        displayFrame = startFrame;
        currentFrameIndex = startFrame;
        currentSectionIndex.value = mobileGestureStartIndex;
    }
}

function handleTouchEnd(event: TouchEvent): void {
    if (!isMobileViewport() || !isMobileTouching) {
        return;
    }

    const section = sectionRef.value;
    const touch = event.changedTouches[0];

    isMobileTouching = false;

    if (!section || !touch) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = getPinnedViewportHeight();

    const deltaY = mobileGestureStartY - touch.clientY;
    const absDeltaY = Math.abs(deltaY);

    const isEnteringPinnedArea =
        rect.top > 0 && rect.top <= vh / 2 && rect.bottom >= vh;

    if (isEnteringPinnedArea) {
        mobileSettleTimeoutId = window.setTimeout(() => {
            settleMobileToSection(0);
        }, MOBILE_SETTLE_DELAY_MS);

        return;
    }

    if (!isInsidePinnedArea(rect, vh)) {
        return;
    }

    let targetSectionIndex: number;

    if (!mobileGestureStartedInside || absDeltaY < MOBILE_SWIPE_THRESHOLD_PX) {
        targetSectionIndex = getNearestMobileSectionIndex(rect, vh);
    } else {
        const direction = deltaY > 0 ? 1 : -1;
        const lastSectionIndex = sections.length - 1;
        const exitDirection = getMobileExitDirection(deltaY);

        if (exitDirection !== null) {
            mobileSettleTimeoutId = window.setTimeout(() => {
                exitMobilePinnedArea(exitDirection);
            }, MOBILE_SETTLE_DELAY_MS);

            return;
        }

        targetSectionIndex = clamp(
            mobileGestureStartIndex + direction,
            0,
            lastSectionIndex,
        );
    }

    mobileSettleTimeoutId = window.setTimeout(() => {
        settleMobileToSection(targetSectionIndex);
    }, MOBILE_SETTLE_DELAY_MS);
}

function handleScroll(): void {
    const section = sectionRef.value;

    if (!section) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = getPinnedViewportHeight();

    if (
        !isMobileViewport() &&
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

    if (isMobileViewport() && !insidePinnedArea) {
        clearMobileSettleState();
    }

    if (isMobileViewport()) {
        updateMobileFrameFromScroll(rect, vh);
    }
}

function handleResize(): void {
    canvasPixelWidth = 0;
    canvasPixelHeight = 0;
    lastDrawnIndex = -1;

    if (canvasRef.value) {
        syncCanvasSize(canvasRef.value);
    }

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

    currentFrameIndex = sectionFrames[0];
    currentSectionIndex.value = 0;

    handleScroll();
    animate();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize, { passive: true });

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('resize', handleResize);

    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchEnd);

    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (wheelLockTimeoutId !== null) {
        window.clearTimeout(wheelLockTimeoutId);
        wheelLockTimeoutId = null;
    }

    clearMobileSettleTimers();

    imageElements = [];
});
</script>

<style scoped>
.features-desktop {
    height: calc(var(--features-desktop-panels) * 100vh);
}

@media (max-width: 1023px) {
    .features-desktop {
        height: calc(var(--features-mobile-panels) * 100svh);
    }

    .features-sticky {
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
