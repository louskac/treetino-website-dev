<template>
    <section
        ref="sectionRef"
        class="features-desktop relative"
        style="height: 400vh"
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

            <!-- Desktop: left column content (no card) -->
            <div
                class="absolute top-0 left-1/2 h-full w-full max-w-[1400px] -translate-x-1/2 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!--                <div-->
                <!--                    class="absolute top-0 left-0 z-10 hidden h-full w-5/12 items-center px-12 lg:flex xl:px-16 2xl:px-20"-->
                <!--                >-->
                <div
                    class="absolute top-0 left-0 z-10 hidden h-full w-5/12 items-center lg:flex"
                >
                    <div class="w-full max-w-sm xl:max-w-md">
                        <div class="mb-8 flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >Funkce</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                {{
                                    String(currentSectionIndex + 1).padStart(
                                        2,
                                        '0',
                                    )
                                }}
                                /
                                {{ String(sections.length).padStart(2, '0') }}
                            </span>
                        </div>

                        <Transition name="section-content" mode="out-in">
                            <div
                                :key="currentSectionIndex"
                                class="flex flex-col gap-5"
                            >
                                <div
                                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                                >
                                    <component
                                        :is="sections[currentSectionIndex].icon"
                                        class="h-6 w-6 text-white"
                                        stroke-width="1.5"
                                    />
                                </div>

                                <div>
                                    <!--                                <h2 class="text-4xl leading-tight text-black">-->
                                    <!--                                    {{ sections[currentSectionIndex].title }}-->
                                    <!--                                </h2>-->
                                    <p
                                        class="mt-0 text-base leading-relaxed text-black/75"
                                    >
                                        {{ sections[currentSectionIndex].text }}
                                    </p>
                                </div>
                            </div>
                        </Transition>

                        <div class="mt-8 flex gap-1.5">
                            <div
                                v-for="(_, i) in sections"
                                :key="i"
                                class="h-0.5 flex-1 rounded-full transition-all duration-500"
                                :class="
                                    i === currentSectionIndex
                                        ? 'bg-black'
                                        : i < currentSectionIndex
                                          ? 'bg-black/50'
                                          : 'bg-black/20'
                                "
                            ></div>
                        </div>
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
import { SunLight, Leaf, Tree, MultiplePages } from '@iconoir/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import HomeFeaturesCardMobile from '@/custom/home/features/HomeFeaturesCardMobile.vue';

const TOTAL_FRAMES = 228;
const TRANSITION_FRAMES = 56;
const SCROLL_LOCK_MS = 600;
const TRANSITION_DURATION_MS = 1500;

const sections = [
    {
        icon: SunLight,
        title: 'Text 1',
        text: 'Treetino je chytrý strom, který na 1 m² kombinuje solární a větrnou energii. Jeho 49 kW dokáže napájet až 60 domácností.',
    },
    {
        icon: Leaf,
        title: 'Text 2',
        text: 'Zabere pouhý 1 m², přesto nahradí 400 m² solárních panelů. Treetino mění parkoviště, firemní areály a ulice v efektivní zdroje energie.',
    },
    {
        icon: Tree,
        title: 'Text 3',
        text: 'Patentovaný AI systém plynule sleduje slunce, čímž zvyšuje výkon o 30 %. Před bouří navíc inteligentně složí své listy pro maximální bezpečnost.',
    },
    {
        icon: MultiplePages,
        title: 'Text 4',
        text: 'Korunu tvoří 300 solárních listů prémiové české výroby. Plně přizpůsobitelný design a barvy dokonale sladíte se svou značkou či architekturou.',
    },
    {
        icon: SunLight,
        title: 'Text 5',
        text: 'Transparentní turbíny 2. generace vyrábí energii 24 hodin denně i při slabém větru. Nerušivý výkon stvořený pro města.',
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

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    const ir = image.width / image.height;

    // cover
    // const cr = targetWidth / targetHeight;

    // let dw: number;
    // let dh: number;
    // if (ir > cr) {
    //     dh = targetHeight;
    //     dw = dh * ir;
    // } else {
    //     dw = targetWidth;
    //     dh = dw / ir;
    // }

    // ctx.drawImage(image, (targetWidth - dw) / 2, (targetHeight - dh) / 2, dw, dh);

    // contain
    const dw = targetWidth;
    const dh = dw / ir;

    const isMobile = window.innerWidth < 1024; // lg breakpoint

    const offsetY = isMobile ? -130 : 0;

    ctx.drawImage(image, 0, (targetHeight - dh) / 2 + offsetY, dw, dh);
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

    // Draw only when frame changed - if image is not ready yet, retry next tick
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

function handleWheel(event: WheelEvent): void {
    const section = sectionRef.value;

    if (!section) {
        return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const isInsidePinnedArea = rect.top <= 0 && rect.bottom >= vh;

    if (!isInsidePinnedArea || !cardVisible.value) {
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

        // Let user leave sticky area immediately when trying to scroll past edges.
        if (
            currentSectionIndex.value === sections.length - 1 &&
            direction > 0
        ) {
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
        window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });

        window.setTimeout(() => {
            isSnapping = false;

            // Block wheel briefly after snap so trackpad momentum doesn't immediately advance to next section
            isWheelLocked = true;
            if (wheelLockTimeoutId !== null) {
                window.clearTimeout(wheelLockTimeoutId);
            }
            wheelLockTimeoutId = window.setTimeout(() => {
                isWheelLocked = false;
                wheelLockTimeoutId = null;
            }, 600);

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

    if (rafId !== null) {
        cancelAnimationFrame(rafId);
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
