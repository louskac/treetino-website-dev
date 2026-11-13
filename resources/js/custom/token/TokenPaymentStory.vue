<template>
    <!-- Chapter 02 · 0.1% EV Charger Network Skim: Tap-to-charge card payment, sub-2s payout, 0.1% fee to buybacks -->
    <section ref="sectionRef" data-chapter="02" class="relative bg-zinc-950 text-white" style="height: 460vh">
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
                index="02"
                label="02 · 0.1% EV CHARGING NETWORK SKIM"
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
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import type { Beat } from '@/custom/investors/InvestorChapterText.vue';
import InvestorChapterText from '@/custom/investors/InvestorChapterText.vue';
import InvestorPaymentScene from '@/custom/investors/InvestorPaymentScene.vue';
import { CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';

gsap.registerPlugin(ScrollTrigger);

const beats = computed<Beat[]>(() => [
    {
        segments: [
            { text: '0.1% skimmed on every EV charge ', break: true },
            { text: 'processed across our commercial network.', tone: 'accent' },
        ],
        sub: 'EV drivers tap Mastercard, Visa, Apple Pay or Solana Pay. 0.1% of every gross euro processed flows automatically into $TREE market buyback and burn contracts.',
        stats: [
            { value: '0.1%', label: 'Gross Volume Skim' },
            { value: '<2 sec', label: 'Contactless Settlement' },
            { value: '€0.45–€0.85', label: 'Average kWh Tariff' },
        ],
    },
    {
        segments: [
            { text: 'Contactless hardware terminal ', break: true },
            { text: 'with instant sub-2-second settlement.', tone: 'accent' },
        ],
        sub: 'Powered by our custom Tapaya NFC payment gate, eliminating 3–5% predatory banking acquirer fees and routing real interchange savings directly into buyback pressure.',
        stats: [
            { value: '99.8%', label: 'Hardware Uptime' },
            { value: 'Zero', label: 'Intermediary Banks' },
            { value: 'Instant', label: 'Fiat-to-$TREE Conversion' },
        ],
    },
    {
        segments: [
            { text: '50% permanently burned, ', break: true },
            { text: '50% distributed to veTREE protocol stakers.', tone: 'accent' },
        ],
        sub: 'Half of all repurchased tokens are irreversibly burned via verifiable Solana SPL token instructions; the other half boosts physical real yield for long-term holders.',
        stats: [
            { value: '50%', label: 'Permanent Burn' },
            { value: '50%', label: 'veTREE Staking Pool' },
            { value: 'Deflationary', label: 'Circulating Supply' },
        ],
    },
]);

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    tap: 0,
    settle: 0,
    scale: 0,
    orbit: 0,
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
        .to(s, { orbit: 1, duration: 10, ease: 'sine.inOut' }, 0)
        // beat 0 · card approaches the payment terminal, taps
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.2)
        .to(s, { tap: 1, duration: 1.6, ease: 'power2.out' }, 0.4)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 3.2)
        // beat 1 · green flash, sub-2s settlement stream flows
        .to(s, { b1: 1, duration: 1 }, 3.6)
        .to(s, { settle: 1, duration: 2.2, ease: 'power1.inOut' }, 3.6)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 6.6)
        // beat 2 · zoom in on terminal, 50/50 burn and veTREE staking
        .to(s, { b2: 1, duration: 1 }, 7.0)
        .to(s, { scale: 1, duration: 2.4, ease: 'power2.inOut' }, 7.0)
        .to({}, { duration: 0.6 }, 9.4);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
