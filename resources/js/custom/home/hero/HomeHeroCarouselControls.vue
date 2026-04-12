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
        class="absolute bottom-0 left-1/2 z-50 max-w-[1400px] -translate-x-1/2 gap-4 text-white sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <div class="flex gap-3 p-6">
            <div
                @click="emit('prev')"
                class="group flex h-11 cursor-pointer gap-2 rounded-xl border border-white/15 bg-white/10 px-4 lg:h-12"
            >
                <FastArrowLeft class="my-auto h-5 w-5" />
                <div
                    class="my-auto hidden overflow-clip transition-all group-hover:block"
                >
                    <div class="w-0 transition-all group-hover:w-fit">
                        Previous
                    </div>
                </div>
            </div>

            <div
                @click="emit('next')"
                class="group flex h-11 cursor-pointer gap-2 rounded-xl border border-white/15 bg-white/10 px-4 lg:h-12"
            >
                <div
                    class="my-auto hidden overflow-clip transition-all group-hover:block"
                >
                    <div class="w-0 transition-all group-hover:w-fit">Next</div>
                </div>
                <FastArrowRight class="my-auto h-5 w-5" />
            </div>
        </div>
    </div>
</template>
