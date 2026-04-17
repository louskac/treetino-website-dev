<template>
    <Transition name="mobile-card-slide" appear>
        <div
            v-if="visible"
            class="relative mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/20 bg-black/25 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
            <div class="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-t-accent/30 blur-3xl"></div>
            <div class="pointer-events-none absolute -left-10 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-14 right-6 h-40 w-40 rounded-full bg-blue-400/25 blur-3xl"></div>
            <div class="pointer-events-none absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-black/20"></div>

            <div class="relative z-10 flex items-center justify-between px-5 pt-5">
                <span class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white/70">Funkce</span>
                <span class="text-[0.65rem] font-medium tracking-[0.18em] text-white/60">
                    {{ String(currentSectionIndex + 1).padStart(2, '0') }} / {{ String(sections.length).padStart(2, '0') }}
                </span>
            </div>

            <Transition name="mobile-card-content" mode="out-in">
                <div :key="currentSectionIndex" class="relative z-10 flex flex-1 flex-col px-5 py-4">
                    <div class="flex flex-row items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/35 bg-gray-500/25">
                            <component :is="sections[currentSectionIndex].icon" class="h-6 w-6 text-white" stroke-width="1.5" />
                        </div>

                        <h2 class="text-2xl font-bold leading-tight text-white drop-shadow-sm">{{ sections[currentSectionIndex].title }}</h2>
                    </div>

                    <div>
                        <p class="mt-2 text-sm leading-relaxed text-white/80">{{ sections[currentSectionIndex].text }}</p>
                    </div>
                </div>
            </Transition>

            <div class="relative z-10 flex gap-1.5 px-5 pb-5">
                <div
                    v-for="(_, i) in sections"
                    :key="i"
                    class="h-1 flex-1 rounded-full transition-all duration-500"
                    :class="i === currentSectionIndex ? 'bg-white' : i < currentSectionIndex ? 'bg-white/55' : 'bg-white/25'"
                ></div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

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
.mobile-card-slide-enter-active,
.mobile-card-slide-leave-active {
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
}

.mobile-card-slide-enter-from,
.mobile-card-slide-leave-to {
    transform: translateY(18px) scale(0.985);
    opacity: 0;
}

.mobile-card-content-enter-active,
.mobile-card-content-leave-active {
    transition: opacity 0.28s ease, transform 0.28s ease;
}

.mobile-card-content-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.mobile-card-content-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>