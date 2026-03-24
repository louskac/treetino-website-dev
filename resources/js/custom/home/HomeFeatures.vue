<template>
    <section ref="sectionRef" class="features-desktop relative" style="height: 240vh;">
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
                        class="absolute top-1/2 right-0 mx-auto my-auto h-110 max-w-[600px] -translate-y-1/2 sm:w-[260px] md:w-[350px] lg:w-[calc(100%-100px)] xl:w-[calc(100%-200px)] overflow-hidden"
                    >
                        <Transition name="card-slide" appear>
                            <div
                                v-if="cardVisible"
                                class="h-full w-full bg-t-blue rounded-lg flex flex-col justify-center px-8 py-10"
                            >
                                <Transition name="card-content" mode="out-in">
                                    <div :key="currentImageIndex" class="flex flex-col gap-4">
                                        <h2 class="text-2xl font-bold text-white">{{ slides[currentImageIndex].title }}</h2>
                                        <p class="text-white/80 text-base leading-relaxed">{{ slides[currentImageIndex].text }}</p>
                                        <ButtonSecondary class="w-min">Předobjednat</ButtonSecondary>
                                    </div>
                                </Transition>
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
import ButtonSecondary from '../ButtonSecondary.vue';

const images = [
    '/img/features-1.png',
    '/img/features-2.png',
    '/img/features-3.png',
];

const slides = [
    {
        title: 'Text 1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        title: 'Text 2',
        text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        title: 'Text 3',
        text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
];

const sectionRef = ref<HTMLElement | null>(null);
const currentImageIndex = ref(0);
const cardVisible = ref(false);

let snapping = false;
let hasSnapped = false;

function handleScroll() {
    const section = sectionRef.value;
    if (!section || snapping) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Show card when section snaps in
    if (rect.top <= 0 || hasSnapped) {
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

    if (rect.top > vh / 2) {
        hasSnapped = false;
        cardVisible.value = false;
    }

    // Switching images
    const sectionScrollSpace = section.offsetHeight - vh;
    if (rect.top <= 0 && sectionScrollSpace > 0) {
        const progress = Math.min(1, -rect.top / sectionScrollSpace);
        if (progress < 1 / 3) {
            currentImageIndex.value = 0;
        } else if (progress < 2 / 3) {
            currentImageIndex.value = 1;
        } else {
            currentImageIndex.value = 2;
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
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
.card-slide-enter-active {
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease;
}
.card-slide-enter-from {
    transform: translateX(-110%);
    opacity: 0;
}
.card-slide-enter-to {
    transform: translateX(0%);
    opacity: 1;
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