<template>
    <component :is="tag" class="pitch-headline">
        <template v-for="(w, i) in words" :key="i">
            <span class="pitch-word" :class="toneClass[w.tone]" :style="{ '--d': `${delay + i * stagger}ms` }">{{
                w.text
            }}</span
            ><br v-if="w.breakAfter" />{{ i < words.length - 1 && !w.breakAfter ? ' ' : '' }}
        </template>
    </component>
</template>

<script setup lang="ts">
/**
 * Slide headline in the /web3 type system. Segments colour individual phrases;
 * on screen the words rise out of a blur one after another when the slide becomes active
 * (pure CSS, see Pitch/Index.vue), in print they are simply static.
 */
import { computed } from 'vue';

export type Tone = 'base' | 'accent' | 'muted' | 'green' | 'solana';

export interface Segment {
    text: string;
    tone?: Tone;
    /** Line break after this segment */
    break?: boolean;
}

const props = withDefaults(
    defineProps<{
        segments: Segment[];
        tag?: string;
        /** ms before the first word */
        delay?: number;
        /** ms between words */
        stagger?: number;
    }>(),
    { tag: 'h2', delay: 120, stagger: 55 },
);

const toneClass: Record<Tone, string> = {
    base: 'text-white',
    accent: 'tone-accent',
    muted: 'text-white/30',
    green: 'tone-green',
    solana: 'tone-solana',
};

const words = computed(() =>
    props.segments.flatMap((s) => {
        const parts = s.text.split(/\s+/).filter(Boolean);

        return parts.map((text, idx) => ({
            text,
            tone: s.tone ?? 'base',
            breakAfter: !!s.break && idx === parts.length - 1,
        }));
    }),
);
</script>
