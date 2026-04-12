<template>
    <Transition name="card-slide" appear>
        <div
            v-if="visible"
            class="relative mx-auto hidden h-80 w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-t-blue to-t-dark shadow-2xl lg:flex lg:h-full lg:max-w-none"
        >
            <div class="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-t-accent/25 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-white/5 blur-3xl"></div>

            <div class="relative z-10 flex items-center justify-between px-6 pt-6 lg:px-8 lg:pt-8">
                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Funkce</span>
                <span class="text-xs font-medium tracking-widest text-white/30">
                    {{ String(currentSectionIndex + 1).padStart(2, '0') }} / {{ String(sections.length).padStart(2, '0') }}
                </span>
            </div>

            <Transition name="card-content" mode="out-in">
                <div :key="currentSectionIndex" class="relative z-10 flex flex-1 flex-col gap-4 px-6 py-5 lg:gap-5 lg:px-8 lg:py-6">
                    <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 lg:h-12 lg:w-12">
                        <component :is="sections[currentSectionIndex].icon" class="h-5 w-5 text-white lg:h-6 lg:w-6" stroke-width="1.5" />
                    </div>

                    <div>
                        <h2 class="text-2xl font-bold leading-tight text-white">{{ sections[currentSectionIndex].title }}</h2>
                        <p class="mt-2 text-sm leading-relaxed text-white/65 lg:mt-3 lg:text-base">{{ sections[currentSectionIndex].text }}</p>
                    </div>

                    <div class="mt-auto">
                        <ButtonSecondary>Předobjednat</ButtonSecondary>
                    </div>
                </div>
            </Transition>

            <div class="relative z-10 flex gap-1.5 px-6 pb-6 lg:px-8 lg:pb-8">
                <div
                    v-for="(_, i) in sections"
                    :key="i"
                    class="h-0.5 flex-1 rounded-full transition-all duration-500"
                    :class="i === currentSectionIndex ? 'bg-white' : i < currentSectionIndex ? 'bg-white/50' : 'bg-white/20'"
                ></div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ButtonSecondary from '../ButtonSecondary.vue';

type FeatureSection = {
    icon: Component;
    title: string;
    text: string;
};

defineProps<{
    sections: FeatureSection[];
    currentSectionIndex: number;
    visible: boolean;
}>();
</script>

<style scoped>
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