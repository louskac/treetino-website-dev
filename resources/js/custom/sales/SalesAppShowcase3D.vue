<template>
    <section ref="sectionRef" class="sales-showcase-desktop relative bg-[#fdfdfd] text-black">
        <div ref="pinRef" class="showcase-pin h-screen w-full flex items-center relative overflow-hidden">
            <div class="relative mx-auto w-full max-w-[1500px] h-full px-6 flex items-center justify-between sm:w-full lg:w-[calc(100%-100px)] xl:w-[calc(100%-160px)]">
                
                <!-- Left Column (Identical to HomeFeatures.vue) -->
                <div class="w-full lg:w-5/12 text-left z-20">
                    <Transition name="section-content" mode="out-in">
                        <div :key="currentSectionIndex" class="flex flex-col gap-4 max-w-lg">
                            <!-- Top Grey Counter (01 / 07) -->
                            <span class="text-sm font-medium text-black/40 font-mono tabular-nums">
                                {{ String(currentSectionIndex + 1).padStart(2, '0') }} / {{ String(sections.length).padStart(2, '0') }}
                            </span>

                            <!-- Clean Title (No numbers) -->
                            <h2 class="text-4xl font-medium leading-tight text-black sm:text-5xl">
                                {{ $t(`sales.interactive_steps.step${currentSectionIndex + 1}_title`) }}
                            </h2>

                            <!-- Clean Lead Paragraph -->
                            <p class="text-2xl leading-tight text-black/75">
                                {{ $t(`sales.interactive_steps.step${currentSectionIndex + 1}_desc`) }}
                            </p>
                        </div>
                    </Transition>
                </div>

                <!-- Right Column: 3D MacBook Pro Component (Macbook3D.vue) -->
                <div class="hidden lg:flex lg:w-7/12 h-full items-center justify-center relative z-10 pl-4">
                    <div class="w-full max-w-5xl">
                        <Macbook3D
                            :screen-src="sections[currentSectionIndex].screen"
                            :alt="sections[currentSectionIndex].alt"
                            :rotate-y="sections[currentSectionIndex].rotateY"
                            :rotate-x="sections[currentSectionIndex].rotateX"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Macbook3D from '@/custom/Macbook3D.vue';

const EXIT_HOLD_STEPS = 1;
const STEP_ANIMATION_SECONDS = 0.9;
const OBSERVER_TOLERANCE_PX = 14;
const PINNED_SCROLL_EPSILON_PX = 4;
const ENTRY_SNAP_SECONDS = 0.45;
const ENTRY_SNAP_INPUT_LOCK_MS = 650;
const EXIT_REENTRY_LOCK_MS = 600;
const EXIT_SCROLL_OFFSET_PX = 120;

gsap.registerPlugin(Observer, ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const pinRef = ref<HTMLElement | null>(null);

const currentSectionIndex = ref(0);

// 7 Horizontal Screenshots & App Sections with 3D Spin Angles for MacBook
const sections = [
    {
        screen: '/img/sales/step-1-signup.webp',
        alt: 'Partner Sign-Up & Activation',
        rotateY: 18,
        rotateX: 4,
    },
    {
        screen: '/img/sales/step-2-nda.webp',
        alt: 'Digital Document Signatures',
        rotateY: -18,
        rotateX: 8,
    },
    {
        screen: '/img/sales/step-3-training.webp',
        alt: 'Video Academy & Tutorials',
        rotateY: 22,
        rotateX: 2,
    },
    {
        screen: '/img/sales/step-4-map.webp',
        alt: '3D Google Maps Site Inspection',
        rotateY: -20,
        rotateX: 10,
    },
    {
        screen: '/img/sales/step-5-roi.webp',
        alt: 'ROI & Energy Breakdown',
        rotateY: 16,
        rotateX: 6,
    },
    {
        screen: '/img/sales/step-6-pdf.webp',
        alt: 'Client PDF Proposal Export',
        rotateY: -16,
        rotateX: 8,
    },
    {
        screen: '/img/sales/step-7-crm.webp',
        alt: 'Partner CRM & Commissions',
        rotateY: 0,
        rotateX: 4,
    },
];

const scrollStepCount = sections.length - 1 + EXIT_HOLD_STEPS;

let scrollTriggerInstance: ScrollTrigger | null = null;
let entrySnapTriggerInstance: ScrollTrigger | null = null;
let inputObserver: Observer | null = null;
let stepTween: gsap.core.Tween | null = null;
let scrollSnapTween: gsap.core.Tween | null = null;
let isStepAnimating = false;
let isEntrySnapping = false;
let ignoreStepInputUntil = 0;
let suppressScrollTriggerEntryUntil = 0;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function getPinnedViewportHeight(): number {
    return pinRef.value?.offsetHeight || window.innerHeight;
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

function setStepToSection(sectionIndex: number): void {
    stepTween?.kill();
    stepTween = null;
    isStepAnimating = false;
    currentSectionIndex.value = clamp(sectionIndex, 0, sections.length - 1);
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
    if (
        targetY === null ||
        isEntrySnapping ||
        inputObserver?.isEnabled ||
        shouldSuppressScrollTriggerEntry()
    ) {
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
    lockStepInput(STEP_ANIMATION_SECONDS * 1000);

    const animState = { progress: 0 };
    stepTween = gsap.to(animState, {
        progress: 1,
        duration: STEP_ANIMATION_SECONDS,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => {
            isStepAnimating = false;
            stepTween = null;
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
        setStepToSection(sections.length - 1);
    } else {
        setStepToSection(0);
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

            setStepToSection(0);
            lockStepInput(ENTRY_SNAP_INPUT_LOCK_MS);
            enableInputObserver();
            syncScrollToSection(0);
        },
        onEnterBack: () => {
            if (shouldSuppressScrollTriggerEntry()) {
                return;
            }

            setStepToSection(sections.length - 1);
            lockStepInput(ENTRY_SNAP_INPUT_LOCK_MS);
            enableInputObserver();
            syncScrollToSection(sections.length - 1);
        },
        onLeave: () => {
            disableInputObserver();
            setStepToSection(sections.length - 1);
        },
        onLeaveBack: () => {
            disableInputObserver();
            setStepToSection(0);
        },
        onRefresh: () => {
            // refresh
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

function handleSuppressPinEvent(e: Event): void {
    const customEvent = e as CustomEvent<{ duration?: number }>;
    const duration = customEvent.detail?.duration || 2500;
    disableInputObserver();
    stopScrollSnap();
    stepTween?.kill();
    stepTween = null;
    isStepAnimating = false;
    lockStepInput(duration);
    suppressScrollTriggerEntryUntil = performance.now() + duration;
    setStepToSection(sections.length - 1);
}

onMounted(() => {
    window.addEventListener('suppress-3d-pin', handleSuppressPinEvent);
    nextTick(() => {
        setupInputObserver();
        setupScrollTrigger();
        ScrollTrigger.refresh();
    });
});

onUnmounted(() => {
    window.removeEventListener('suppress-3d-pin', handleSuppressPinEvent);
    stepTween?.kill();
    scrollTriggerInstance?.kill();
    entrySnapTriggerInstance?.kill();
    inputObserver?.kill();
    scrollSnapTween?.kill();

    stepTween = null;
    scrollTriggerInstance = null;
    entrySnapTriggerInstance = null;
    inputObserver = null;
    scrollSnapTween = null;
});
</script>

<style scoped>
@media (max-width: 1023px) {
    .showcase-pin {
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
