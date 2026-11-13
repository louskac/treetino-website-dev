<template>
    <!-- Chapter 04 · DePIN Telemetry & veTREE Staking: 3D Phone with real-time on-chain wallet & oracle proofs -->
    <section ref="sectionRef" data-chapter="04" class="relative bg-zinc-950 text-white" style="height: 480vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA">
                        <Web3PhoneWallet
                            :draw="s.draw"
                            :ui="s.ui"
                            :orbit="s.orbit"
                            :active="active"
                        />
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="04"
                label="04 · DEPIN ORACLE & veTREE STAKING"
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
import { CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';
import Web3PhoneWallet from '@/custom/web3/Web3PhoneWallet.vue';

gsap.registerPlugin(ScrollTrigger);

const beats = computed<Beat[]>(() => [
    {
        segments: [
            { text: 'Certino DePIN telemetry: ', break: true },
            { text: 'hardware-signed oracle proof of generation.', tone: 'accent' },
        ],
        sub: 'Every Treetino unit embeds an on-board hardware security module (HSM) signing generation telemetry every 60 seconds. External protocols burn $TREE to query certified clean energy data.',
        stats: [
            { value: '60 sec', label: 'Cryptographic Proofs' },
            { value: 'ISTOCH13', label: 'Hardware Station ID' },
            { value: '100%', label: 'Tamper-Proof HSM' },
        ],
    },
    {
        segments: [
            { text: 'veTREE staking multiplier: ', break: true },
            { text: 'boosted real yield from physical grid revenue.', tone: 'accent' },
        ],
        sub: 'Holders lock $TREE for up to 4 years to receive veTREE, voting power over buyback distribution pools, and priority access to new tokenized energy tranches.',
        stats: [
            { value: '4 Years', label: 'Max Lock Duration' },
            { value: '2.5x', label: 'Yield Multiplier' },
            { value: '18.3%–25%+', label: 'Real Cashflow APY' },
        ],
    },
    {
        segments: [
            { text: 'Hardware validator bonding: ', break: true },
            { text: '50,000 $TREE locked per deployed station.', tone: 'accent' },
        ],
        sub: 'Franchise operators and municipal hosts bond $TREE as slashable collateral to run charging and telemetry nodes, taking circulating tokens off the open market.',
        stats: [
            { value: '50,000', label: '$TREE Bond / Node' },
            { value: 'Slashable', label: 'Malicious Telemetry' },
            { value: 'Supply Lock', label: 'Organic Illiquidity' },
        ],
    },
]);

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    draw: 0,
    ui: 0,
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
        // beat 0 · phone wireframe draws in, HSM telemetry activates
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { draw: 1, duration: 1.6 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.2)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 3.2)
        // beat 1 · screen illuminates with on-chain wallet balance & veTREE staking
        .to(s, { b1: 1, duration: 1 }, 3.6)
        .to(s, { ui: 1, duration: 2.2, ease: 'power1.out' }, 3.6)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 6.6)
        // beat 2 · node bonding & supply lock
        .to(s, { b2: 1, duration: 1 }, 7.0)
        .to({}, { duration: 0.6 }, 9.4);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
