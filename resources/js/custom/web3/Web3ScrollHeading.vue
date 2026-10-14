<template>
    <component
        :is="tag"
        class="pointer-events-none"
        :style="{
            opacity: 1 - out,
            transform: `translateY(${-out * 36}px)`,
            filter: out > 0 ? `blur(${out * 6}px)` : undefined,
        }"
    >
        <span class="block" :class="leadClass">
            <template v-for="(w, i) in words" :key="i">
                <span
                    class="inline-block will-change-transform"
                    :class="toneClass[w.tone]"
                    :style="wordStyle(i)"
                    >{{ w.text }}</span
                ><br v-if="w.breakAfter" class="block" />{{ i < words.length - 1 ? ' ' : '' }}
            </template>
        </span>
        <span
            v-if="sub"
            class="mt-3 block max-w-[34ch] text-sm leading-relaxed font-normal tracking-[-0.01em] text-white/70 sm:mt-5 sm:text-xl lg:mt-6 lg:text-[1.375rem]"
            :style="subStyle"
        >
            {{ sub }}
        </span>
    </component>
</template>

<script setup lang="ts">
/**
 * Scroll-scrubbed headline: words rise out of a blur one after another as `progress` goes 0 → 1,
 * and the whole line lifts away as `out` goes 0 → 1. Tones colour individual phrases.
 */
import { computed } from 'vue';

export type Tone = 'base' | 'accent' | 'muted' | 'solana' | 'green';

export interface Segment {
    text: string;
    tone?: Tone;
    break?: boolean;
}

const props = withDefaults(
    defineProps<{
        segments: Segment[];
        sub?: string;
        progress?: number;
        out?: number;
        tag?: string;
        leadClass?: string;
    }>(),
    { sub: undefined, progress: 1, out: 0, tag: 'h2', leadClass: '' },
);

const toneClass: Record<Tone, string> = {
    base: 'text-white',
    accent: 'text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]',
    muted: 'text-white/30',
    solana: 'bg-gradient-to-r from-[#b47bff] to-[#14F195] bg-clip-text text-transparent',
    green: 'bg-gradient-to-r from-[#8ec5ff] to-[#34d399] bg-clip-text text-transparent',
};

const words = computed(() =>
    props.segments.flatMap((s) => {
        const parts = s.text.split(/\s+/).filter(Boolean);

        return parts.map((text, idx) => ({
            text,
            tone: s.tone ?? 'base',
            breakAfter: s.break && idx === parts.length - 1,
        }));
    }),
);

function smooth(a: number, b: number, v: number): number {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));

    return t * t * (3 - 2 * t);
}

// Lead words use the first 75 % of the progress, the sub line the rest
function wordStyle(i: number) {
    const n = words.value.length;
    const start = (i / n) * 0.45;
    const a = smooth(start, start + 0.3, props.progress);

    return {
        opacity: a,
        transform: `translateY(${(1 - a) * 0.38}em)`,
        filter: a < 1 ? `blur(${(1 - a) * 12}px)` : undefined,
    };
}

const subStyle = computed(() => {
    const a = smooth(0.6, 1, props.progress);

    return {
        opacity: a,
        transform: `translateY(${(1 - a) * 14}px)`,
    };
});
</script>
