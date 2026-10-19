<template>
    <svg
        class="pointer-events-none absolute inset-0 h-full w-full"
        :viewBox="viewBoxAttr"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
    >
        <defs>
            <filter id="pitch-cz-glow" x="-50%" y="-50%" width="200%" height="200%">
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
                :stroke="c.eu ? `rgba(255,255,255,${0.42 * strength})` : `rgba(255,255,255,${0.22 * strength})`"
                stroke-width="0.8"
                vector-effect="non-scaling-stroke"
            />
        </g>

        <!-- Czech Republic: where it all starts -->
        <path
            v-if="czech"
            :d="czech.d"
            fill="rgba(0,102,255,0.16)"
            stroke="#4d8dff"
            stroke-width="1.6"
            vector-effect="non-scaling-stroke"
            filter="url(#pitch-cz-glow)"
        />
    </svg>
</template>

<script setup lang="ts">
/** Static, print-safe version of the /web3 Europe line map (pure SVG → vector in the PDF). */
import { computed } from 'vue';
import { EUROPE_COUNTRIES } from '@/custom/web3/europePaths';

const props = withDefaults(
    defineProps<{
        /** Map-space centre + width (viewBox 680×520) */
        cx?: number;
        cy?: number;
        w?: number;
        /** Line opacity multiplier */
        strength?: number;
    }>(),
    { cx: 345, cy: 300, w: 420, strength: 1 },
);

const countries = EUROPE_COUNTRIES.filter((c) => c.id !== 'cz');
const czech = EUROPE_COUNTRIES.find((c) => c.id === 'cz');

const viewBoxAttr = computed(() => {
    const h = props.w / (16 / 9);

    return `${props.cx - props.w / 2} ${props.cy - h / 2} ${props.w} ${h}`;
});
</script>
