<template>
    <div
        ref="rootRef"
        class="pointer-events-none absolute inset-0 overflow-hidden select-none"
        aria-hidden="true"
    >
        <!-- Ambient studio lighting (same recipe as SalesHeroCityMap) -->
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(14,165,233,0.14),rgba(0,0,0,0))]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_88%_60%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>

        <!-- Real map of Europe drawn purely as lines; zoom is done through the viewBox so strokes stay crisp -->
        <svg
            class="absolute inset-0 h-full w-full"
            :viewBox="viewBoxAttr"
            preserveAspectRatio="xMidYMid slice"
            :style="{ opacity: 1 - dim * 0.75 }"
        >
            <defs>
                <filter
                    id="w3-cz-glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur stdDeviation="2.2" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g fill="none" stroke-linejoin="round">
                <path
                    v-for="c in countries"
                    :key="c.id"
                    :d="c.d"
                    :stroke="
                        c.eu ? 'rgba(255,255,255,0.46)' : 'rgba(255,255,255,0.26)'
                    "
                    stroke-width="0.8"
                    vector-effect="non-scaling-stroke"
                />
            </g>

            <!-- Czech Republic: the heart of the story -->
            <path
                v-if="czech"
                :d="czech.d"
                fill="rgba(0,102,255,0.16)"
                stroke="#4d8dff"
                stroke-width="1.6"
                vector-effect="non-scaling-stroke"
                filter="url(#w3-cz-glow)"
            />
        </svg>

        <!-- Readability vignette (lighter on the right so the map breathes behind left-aligned copy) -->
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(9,9,11,0.7)_0%,rgba(9,9,11,0.3)_52%,transparent_100%)]"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/10 to-transparent"
        ></div>

        <!-- Fade into the page body -->
        <div
            class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { EUROPE_COUNTRIES } from './europePaths';
import { europeViewBox } from './europeView';

const props = withDefaults(
    defineProps<{
        /** 0 = whole of Europe, 1 = zoomed onto Přeštice (CZ) */
        zoom?: number;
        /** 0..1 darkens the map when other visuals take over */
        dim?: number;
    }>(),
    { zoom: 0, dim: 0 },
);

const isPortrait = ref(false);

const checkOrientation = () => {
    isPortrait.value = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
};

onMounted(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('resize', checkOrientation);
});

const countries = EUROPE_COUNTRIES.filter((c) => c.id !== 'cz');
const czech = EUROPE_COUNTRIES.find((c) => c.id === 'cz');

const viewBoxAttr = computed(() => {
    const vb = europeViewBox(props.zoom, isPortrait.value);

    return `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;
});
</script>
