<template>
    <!-- Chapter 04 · hardware EV charger payment gate: card tap → instant metered payout -->
    <section ref="sectionRef" data-chapter="04" class="relative bg-zinc-950 text-white" style="height: 460vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA">
                        <InvestorPaymentScene
                            :tap="s.tap"
                            :settle="s.settle"
                            :scale="s.scale"
                            :orbit="s.orbit"
                            :active="active"
                        />
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="04"
                label="Payment gate"
                :beats="beats"
                :state="[
                    { in: s.b0, out: s.b0out },
                    { in: s.b1, out: s.b1out },
                    { in: s.b2, out: 0 },
                ]"
                :mark="s.mark"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import type { Beat } from './InvestorChapterText.vue';
import InvestorChapterText from './InvestorChapterText.vue';
import InvestorPaymentScene from './InvestorPaymentScene.vue';
import { CONTAINER, VISUAL_AREA } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const beats: Beat[] = [
    {
        segments: [{ text: 'Tap a card.', break: true }, { text: 'Charge the car.', tone: 'accent' }],
        sub: 'Drivers pay with any bank card or Apple Pay right on the charger — no app, no account.',
        stats: [
            { value: 'CZK · EUR', label: 'Card & Apple Pay' },
            { value: '0', label: 'Apps to install' },
            { value: '22 kW', label: 'Per charger' },
        ],
    },
    {
        segments: [{ text: 'The owner is paid', break: true }, { text: 'in seconds.', tone: 'accent' }],
        sub: 'Paired here with the compact 5 m Treetino V2 — every kilowatt-hour is metered at the socket and settled straight to the owner.',
        stats: [
            { value: '<2 s', label: 'Settlement' },
            { value: '1:1', label: 'Metered to kWh' },
            { value: 'V1 & V2', label: 'Compatible trees' },
        ],
    },
    {
        segments: [{ text: 'New to Europe.', break: true }, { text: 'Licensed partner.', tone: 'accent' }],
        sub: 'Hackathon-winning prototype, now in hardware development with a licensed payment partner.',
        stats: [
            { value: '1st in EU', label: 'EV payment gate' },
            { value: '2 ×', label: 'Hackathon awards' },
            { value: 'ČSOB', label: 'Start it accelerator' },
        ],
    },
];

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    orbit: 0,
    tap: 0,
    settle: 0,
    scale: 0,
    b0: 0,
    b0out: 0,
    b1: 0,
    b1out: 0,
    b2: 0,
});

let timeline: gsap.core.Timeline | null = null;
let visibility: ScrollTrigger | null = null;

onMounted(() => {
    visibility = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (active.value = self.isActive),
    });

    timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
        },
    });

    timeline
        .to(s, { orbit: 1, duration: 7.6, ease: 'sine.inOut' }, 0)
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.1)
        .to(s, { tap: 1, duration: 1.4 }, 0.1)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 2.3)
        .to(s, { b1: 1, duration: 1 }, 2.8)
        .to(s, { settle: 1, duration: 1.5 }, 2.75)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 5.0)
        .to(s, { b2: 1, duration: 1 }, 5.5)
        .to(s, { scale: 1, duration: 1.3 }, 5.45)
        .to({}, { duration: 1 }, 6.8);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
