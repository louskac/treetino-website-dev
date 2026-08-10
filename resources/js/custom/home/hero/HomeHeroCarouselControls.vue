<script setup lang="ts">
import { FastArrowRight, FastArrowLeft } from '@iconoir/vue';

const emit = defineEmits<{
    (e: 'prev'): void;
    (e: 'next'): void;
    (e: 'goTo'): void;
}>();
</script>

<template>
    <!-- Controls -->
    <div
        class="pointer-events-none absolute bottom-0 left-1/2 z-10 w-full max-w-[1400px] -translate-x-1/2 px-6 gap-4 text-white sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <div class="pointer-events-auto flex gap-3 py-6">
            <button
                type="button"
                @click="emit('prev')"
                class="group flex h-11 cursor-pointer items-center gap-0 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 hover:gap-2 lg:h-12"
            >
                <FastArrowLeft class="my-auto h-5 w-5 pointer-events-none" />
                <div
                    class="my-auto max-w-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs pointer-events-none"
                >
                    <span class="whitespace-nowrap">Previous</span>
                </div>
            </button>

            <button
                type="button"
                @click="emit('next')"
                class="group flex h-11 cursor-pointer items-center gap-0 rounded-xl border border-white/15 bg-white/10 px-4 transition-all duration-300 hover:gap-2 lg:h-12"
            >
                <div
                    class="my-auto max-w-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs pointer-events-none"
                >
                    <span class="whitespace-nowrap">Next</span>
                </div>
                <FastArrowRight class="my-auto h-5 w-5 pointer-events-none" />
            </button>
        </div>
    </div>
</template>
