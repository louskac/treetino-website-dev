<template>
    <section ref="sectionRef" class="features-desktop relative" style="height: 300vh;">
        <div class="sticky top-0 h-screen w-full overflow-hidden">
            <div class="absolute right-0 h-full w-7/12 overflow-hidden">
                <Transition name="features-fade" mode="out-in">
                    <img
                        :key="currentImageIndex"
                        class="h-full w-full object-cover"
                        :src="images[currentImageIndex]"
                        alt=""
                    />
                </Transition>
            </div>

            <div class="relative flex h-full w-1/2 flex-col">
                <div class="relative h-full w-full">
                    <div
                        class="absolute top-1/2 right-0 mx-auto my-auto h-110 max-w-[600px] -translate-y-1/2 sm:w-[260px] md:w-[350px] lg:w-[calc(100%-100px)] xl:w-[calc(100%-200px)]"
                    >
                        <Transition name="card-slide" appear>
                            <div
                                v-if="cardVisible"
                                class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-t-blue to-t-dark shadow-2xl flex flex-col"
                            >
                                <div class="pointer-events-none absolute -top-14 -right-14 h-48 w-48 rounded-full bg-t-accent/25 blur-3xl"></div>
                                <div class="pointer-events-none absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-white/5 blur-3xl"></div>

                                <!-- Top labels -->
                                <div class="relative z-10 flex items-center justify-between px-8 pt-8">
                                    <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Funkce</span>
                                    <span class="text-xs font-medium tracking-widest text-white/30">
                                        {{ String(currentImageIndex + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}
                                    </span>
                                </div>

                                <Transition name="card-content" mode="out-in">
                                    <div :key="currentImageIndex" class="relative z-10 flex flex-1 flex-col gap-5 px-8 py-6">
                                        <!-- Icon badge -->
                                        <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                                            <component :is="slides[currentImageIndex].icon" class="h-6 w-6 text-white" stroke-width="1.5" />
                                        </div>

                                        <!-- Text -->
                                        <div>
                                            <h2 class="text-2xl font-bold leading-tight text-white">{{ slides[currentImageIndex].title }}</h2>
                                            <p class="mt-3 text-base leading-relaxed text-white/65">{{ slides[currentImageIndex].text }}</p>
                                        </div>

                                        <div class="mt-auto">
                                            <ButtonSecondary>Předobjednat</ButtonSecondary>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Bottom progress bars -->
                                <div class="relative z-10 flex gap-1.5 px-8 pb-8">
                                    <div
                                        v-for="(_, i) in slides"
                                        :key="i"
                                        class="h-0.5 flex-1 rounded-full transition-all duration-500"
                                        :class="i === currentImageIndex ? 'bg-white' : i < currentImageIndex ? 'bg-white/50' : 'bg-white/20'"
                                    ></div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { SunLight, Leaf, Tree } from '@iconoir/vue';
import ButtonSecondary from '../ButtonSecondary.vue';

const images = [
    '/img/features-1.png',
    '/img/features-2.png',
    '/img/features-3.png',
];

const slides = [
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
];

const sectionRef = ref<HTMLElement | null>(null);
const currentImageIndex = ref(0);
const cardVisible = ref(false);

const SCROLL_COOLDOWN = 600;

let snapping = false;
let hasSnapped = false;
let scrollCooldown = false;
let programmaticScroll = false;

function isInStickyZone(): boolean {
    const section = sectionRef.value;
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top <= 2 && rect.bottom >= vh - 2;
}

function handleScroll() {
    if (programmaticScroll) return;

    const section = sectionRef.value;
    if (!section || snapping) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if (rect.top <= 0) {
        cardVisible.value = true;
    }

    // Snap
    if (!hasSnapped && rect.top > 0 && rect.top <= vh / 2) {
        snapping = true;
        hasSnapped = true;
        cardVisible.value = true;
        window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
        setTimeout(() => { snapping = false; }, 600);
        return;
    }

    // Reset when above
    if (rect.top > vh / 2) {
        hasSnapped = false;
        cardVisible.value = false;
        currentImageIndex.value = 0;
    }
}

function handleWheel(e: WheelEvent) {
    if (!isInStickyZone()) return;

    const section = sectionRef.value!;
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextIndex = currentImageIndex.value + direction;

    // Scroll up from first slide is normal
    if (nextIndex < 0) return;

    e.preventDefault();

    if (scrollCooldown) return;

    // Exit after last slide
    if (nextIndex >= images.length) {
        scrollCooldown = true;
        programmaticScroll = true;
        const sectionScrollSpace = section.offsetHeight - window.innerHeight;
        window.scrollTo({
            top: section.offsetTop + sectionScrollSpace + 50,
            behavior: 'smooth',
        });
        setTimeout(() => {
            scrollCooldown = false;
            programmaticScroll = false;
        }, SCROLL_COOLDOWN);
        return;
    }

    currentImageIndex.value = nextIndex;
    scrollCooldown = true;
    programmaticScroll = true;

    const sectionScrollSpace = section.offsetHeight - window.innerHeight;
    const targetScrollY = section.offsetTop + (nextIndex / (images.length - 1)) * sectionScrollSpace;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

    setTimeout(() => {
        scrollCooldown = false;
        programmaticScroll = false;
    }, SCROLL_COOLDOWN);
}

onMounted(() => {
    const section = sectionRef.value;
    if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0) {
            const sectionScrollSpace = section.offsetHeight - window.innerHeight;
            const progress = Math.min(1, Math.max(0, -rect.top / sectionScrollSpace));
            currentImageIndex.value = Math.min(images.length - 1, Math.floor(progress * images.length));
            cardVisible.value = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
});
</script>

<style scoped>
/* Image crossfade */
.features-fade-enter-active,
.features-fade-leave-active {
    transition: opacity 0.35s ease;
}
.features-fade-enter-from,
.features-fade-leave-to {
    opacity: 0;
}

/* Card slide-in */
.card-slide-enter-active,
.card-slide-leave-active {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease;
}
.card-slide-enter-from {
    transform: translateX(-110%);
    opacity: 0;
}
.card-slide-enter-to {
    transform: translateX(0%);
    opacity: 1;
}

.card-slide-leave-from {
    transform: translateX(0%);
    opacity: 1;
}
.card-slide-leave-to {
    transform: translateX(-110%);
    opacity: 0;
}

/* Card content */
.card-content-enter-active,
.card-content-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.card-content-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.card-content-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>