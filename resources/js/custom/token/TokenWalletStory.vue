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
                :label="t('token.c04.label')"
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
import { useI18n } from 'vue-i18n';
import type { Beat } from '@/custom/investors/InvestorChapterText.vue';
import InvestorChapterText from '@/custom/investors/InvestorChapterText.vue';
import { CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';
import Web3PhoneWallet from '@/custom/web3/Web3PhoneWallet.vue';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n();

const beats = computed<Beat[]>(() => [
    {
        segments: [
            { text: t('token.c04.b0_s1'), break: true },
            { text: t('token.c04.b0_s2'), tone: 'accent' },
        ],
        sub: t('token.c04.b0_sub'),
        stats: [
            { value: t('token.c04.b0_st0_val'), label: t('token.c04.b0_st0_lbl') },
            { value: t('token.c04.b0_st1_val'), label: t('token.c04.b0_st1_lbl') },
            { value: t('token.c04.b0_st2_val'), label: t('token.c04.b0_st2_lbl') },
        ],
    },
    {
        segments: [
            { text: t('token.c04.b1_s1'), break: true },
            { text: t('token.c04.b1_s2'), tone: 'accent' },
        ],
        sub: t('token.c04.b1_sub'),
        stats: [
            { value: t('token.c04.b1_st0_val'), label: t('token.c04.b1_st0_lbl') },
            { value: t('token.c04.b1_st1_val'), label: t('token.c04.b1_st1_lbl') },
            { value: t('token.c04.b1_st2_val'), label: t('token.c04.b1_st2_lbl') },
        ],
    },
    {
        segments: [
            { text: t('token.c04.b2_s1'), break: true },
            { text: t('token.c04.b2_s2'), tone: 'accent' },
        ],
        sub: t('token.c04.b2_sub'),
        stats: [
            { value: t('token.c04.b2_st0_val'), label: t('token.c04.b2_st0_lbl') },
            { value: t('token.c04.b2_st1_val'), label: t('token.c04.b2_st1_lbl') },
            { value: t('token.c04.b2_st2_val'), label: t('token.c04.b2_st2_lbl') },
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
