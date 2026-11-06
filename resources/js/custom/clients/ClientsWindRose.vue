<template>
    <svg viewBox="-60 -60 120 120" class="w-full overflow-visible" :aria-label="isEn ? 'Wind rose' : 'Větrná růžice'">
        <!-- rings -->
        <circle v-for="r in [16, 32, 48]" :key="r" cx="0" cy="0" :r="r" fill="none" stroke="rgba(255,255,255,0.07)" />
        <line v-for="a in [0, 45, 90, 135]" :key="a" :x1="-50 * sin(a)" :y1="50 * cos(a)" :x2="50 * sin(a)" :y2="-50 * cos(a)" stroke="rgba(255,255,255,0.05)" />

        <!-- petals -->
        <path
            v-for="(p, i) in petals"
            :key="p.sector"
            :d="p.d"
            :fill="p.dominant ? 'rgba(142,197,255,0.75)' : `rgba(77,141,255,${0.22 + p.speedK * 0.4})`"
            :stroke="p.dominant ? '#8ec5ff' : 'rgba(142,197,255,0.35)'"
            stroke-width="0.5"
            class="petal"
            :style="{ animationDelay: `${i * 35}ms` }"
        />

        <!-- live direction needle -->
        <g v-if="liveFromDeg !== null" :transform="`rotate(${liveFromDeg})`" class="needle">
            <line x1="0" y1="-54" x2="0" y2="-40" stroke="#34d399" stroke-width="1.4" />
            <path d="M0 -38 L-3 -44 L3 -44 Z" fill="#34d399" />
        </g>

        <!-- cardinals -->
        <text
            v-for="c in cardinals"
            :key="c.t"
            :x="c.x"
            :y="c.y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="text-[7px]"
            :class="c.n ? 'fill-[#8ec5ff]' : 'fill-white/35'"
        >
            {{ c.t }}
        </text>
        <circle cx="0" cy="0" r="2" fill="#09090b" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WindRoseSector } from './pwsData';

const props = withDefaults(defineProps<{ sectors: WindRoseSector[]; liveFromDeg?: number | null }>(), { liveFromDeg: null });

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);

const petals = computed(() => {
    const maxPct = Math.max(1, ...props.sectors.map((s) => s.pct));
    const maxSpd = Math.max(0.5, ...props.sectors.map((s) => s.avgSpeedMs));
    const top = Math.max(...props.sectors.map((s) => s.pct));

    return props.sectors.map((s) => {
        const r = 6 + Math.sqrt(s.pct / maxPct) * 42;
        const a0 = s.degCenter - 10;
        const a1 = s.degCenter + 10;
        const p = (a: number, rr: number) => `${(rr * sin(a)).toFixed(2)},${(-rr * cos(a)).toFixed(2)}`;
        const d = s.pct > 0 ? `M${p(a0, 4)} L${p(a0, r)} A${r} ${r} 0 0 1 ${p(a1, r)} L${p(a1, 4)} A4 4 0 0 0 ${p(a0, 4)} Z` : '';

        return { sector: s.sector, d, dominant: s.pct === top, speedK: s.avgSpeedMs / maxSpd };
    });
});

const cardinals = computed(() => {
    const t = isEn.value ? ['N', 'E', 'S', 'W'] : ['S', 'V', 'J', 'Z'];

    return [0, 90, 180, 270].map((a, i) => ({ t: t[i], x: 57 * sin(a), y: -57 * cos(a), n: i === 0 }));
});
</script>

<style scoped>
.petal {
    transform-origin: 0 0;
    animation: grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.needle {
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes grow {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .petal {
        animation: none;
    }
}
</style>
