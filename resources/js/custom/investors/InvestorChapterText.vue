<template>
    <div class="pointer-events-none absolute inset-0 z-10">
        <div :class="CONTAINER" class="relative h-full">
            <!-- Chapter mark + headlines: always the same place, same size -->
            <div :class="TEXT_COLUMN">
                <div :style="fadeStyle(mark, markOut, 8)">
                    <InvestorChapterMark :index="index" :label="label" />
                </div>
                <div class="mt-6 grid">
                    <div v-for="(beat, i) in beats" :key="i" class="col-start-1 row-start-1">
                        <Web3ScrollHeading
                            :tag="i === 0 ? 'h2' : 'p'"
                            :lead-class="HEADLINE"
                            :segments="beat.segments"
                            :sub="beat.sub"
                            :progress="state[i]?.in ?? 0"
                            :out="state[i]?.out ?? 0"
                        />
                        <slot :name="`beat-${i}`" />
                    </div>
                </div>
            </div>

            <!-- Three numbers per beat, pinned to the bottom of the stage -->
            <div :class="STATS_ROW" class="grid">
                <template v-for="(beat, i) in beats" :key="i">
                    <InvestorStats
                        v-if="beat.stats"
                        class="col-start-1 row-start-1"
                        :stats="beat.stats"
                        :style="fadeStyle(statIn(i), state[i]?.out ?? 0, 10)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * The text layer of every chapter: chapter mark top-left, one headline per beat stacked in
 * the same spot, and a row of three stats at the bottom. Visuals live outside this component.
 */
import type { Segment } from '@/custom/web3/Web3ScrollHeading.vue';
import Web3ScrollHeading from '@/custom/web3/Web3ScrollHeading.vue';
import InvestorChapterMark from './InvestorChapterMark.vue';
import InvestorStats from './InvestorStats.vue';
import type { Stat } from './tokens';
import { CONTAINER, clamp01, fadeStyle, HEADLINE, STATS_ROW, TEXT_COLUMN } from './tokens';

export interface Beat {
    segments: Segment[];
    sub?: string;
    stats?: Stat[];
}

const props = withDefaults(
    defineProps<{
        index: string;
        label: string;
        beats: Beat[];
        /** per-beat progress: `in` 0→1 reveals, `out` 0→1 hides */
        state: { in: number; out: number }[];
        mark?: number;
        markOut?: number;
    }>(),
    { mark: 1, markOut: 0 },
);

/** stats follow the headline with a small delay */
function statIn(i: number): number {
    return clamp01(((props.state[i]?.in ?? 0) - 0.35) / 0.65);
}
</script>
