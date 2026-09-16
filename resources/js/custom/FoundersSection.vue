<script setup lang="ts">
import { ArrowUpRight, Globe } from 'lucide-vue-next';

function parseTags(tagString: string): string[] {
    if (!tagString) return [];
    return tagString.split('•').map(t => t.trim()).filter(Boolean);
}

const dominikMilestones = [
    {
        step: 'contact.team_dominik_m1_step',
        period: 'contact.team_dominik_m1_period',
        title: 'contact.team_dominik_m1_title',
        desc: 'contact.team_dominik_m1_desc',
        tag: 'contact.team_dominik_m1_tag',
    },
    {
        step: 'contact.team_dominik_m2_step',
        period: 'contact.team_dominik_m2_period',
        title: 'contact.team_dominik_m2_title',
        desc: 'contact.team_dominik_m2_desc',
        tag: 'contact.team_dominik_m2_tag',
    },
    {
        step: 'contact.team_dominik_m3_step',
        period: 'contact.team_dominik_m3_period',
        title: 'contact.team_dominik_m3_title',
        desc: 'contact.team_dominik_m3_desc',
        tag: 'contact.team_dominik_m3_tag',
    },
    {
        step: 'contact.team_dominik_m4_step',
        period: 'contact.team_dominik_m4_period',
        title: 'contact.team_dominik_m4_title',
        desc: 'contact.team_dominik_m4_desc',
        tag: 'contact.team_dominik_m4_tag',
    },
];

const jakubMilestones = [
    {
        step: 'contact.team_jakub_m1_step',
        period: 'contact.team_jakub_m1_period',
        title: 'contact.team_jakub_m1_title',
        desc: 'contact.team_jakub_m1_desc',
        tag: 'contact.team_jakub_m1_tag',
    },
    {
        step: 'contact.team_jakub_m2_step',
        period: 'contact.team_jakub_m2_period',
        title: 'contact.team_jakub_m2_title',
        desc: 'contact.team_jakub_m2_desc',
        tag: 'contact.team_jakub_m2_tag',
    },
    {
        step: 'contact.team_jakub_m3_step',
        period: 'contact.team_jakub_m3_period',
        title: 'contact.team_jakub_m3_title',
        desc: 'contact.team_jakub_m3_desc',
        tag: 'contact.team_jakub_m3_tag',
    },
    {
        step: 'contact.team_jakub_m4_step',
        period: 'contact.team_jakub_m4_period',
        title: 'contact.team_jakub_m4_title',
        desc: 'contact.team_jakub_m4_desc',
        tag: 'contact.team_jakub_m4_tag',
    },
    {
        step: 'contact.team_jakub_m5_step',
        period: 'contact.team_jakub_m5_period',
        title: 'contact.team_jakub_m5_title',
        desc: 'contact.team_jakub_m5_desc',
        tag: 'contact.team_jakub_m5_tag',
    },
    {
        step: 'contact.team_jakub_m6_step',
        period: 'contact.team_jakub_m6_period',
        title: 'contact.team_jakub_m6_title',
        desc: 'contact.team_jakub_m6_desc',
        tag: 'contact.team_jakub_m6_tag',
    },
];
</script>

<template>
    <section class="py-20 text-black lg:py-28 dark:text-white">
        <!-- Section Header -->
        <div class="mb-16 sm:mb-20">
            <span
                class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
            >
                {{ $t('contact.team_tag') }}
            </span>
            <h2
                class="mt-3 text-4xl font-medium tracking-tight text-black sm:text-5xl lg:text-6xl dark:text-white"
            >
                {{ $t('contact.team_title') }}
            </h2>
            <p
                class="mt-4 max-w-3xl text-lg leading-relaxed text-black/70 sm:text-xl dark:text-white/70"
            >
                {{ $t('contact.team_lead') }}
            </p>
        </div>

        <!-- ============================================ -->
        <!-- FOUNDER 1: DOMINIK MAŠEK (CEO)                -->
        <!-- ============================================ -->
        <div class="space-y-16 lg:space-y-20">
            <!-- Open Profile Hero: Portrait + Narrative + Open Stats -->
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                <!-- Left: Portrait & Links -->
                <div class="flex flex-col items-center lg:col-span-4 lg:items-start">
                    <div
                        class="group relative aspect-4/5 w-full max-w-[280px] overflow-hidden rounded-xl border border-black/10 bg-zinc-100 sm:max-w-[320px] dark:border-white/10 dark:bg-zinc-800"
                    >
                        <img
                            src="/img/founders/dominik-portrait.jpg"
                            :alt="$t('contact.team_dominik_name')"
                            class="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                            class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent"
                        ></div>
                        <div class="absolute inset-x-0 bottom-0 p-4 text-white">
                            <div class="text-xs font-semibold tracking-wider uppercase text-white/90">
                                {{ $t('contact.team_dominik_role') }}
                            </div>
                            <div class="text-xs font-light text-white/70">
                                {{ $t('contact.team_cofounder_tag') }}
                            </div>
                        </div>
                    </div>

                    <!-- Founder Location & Social Links -->
                    <div class="mt-4 flex w-full max-w-[280px] items-center justify-between sm:max-w-[320px]">
                        <span class="text-xs font-medium text-black/60 dark:text-white/60">
                            {{ $t('contact.team_location_prague') }}
                        </span>
                        <div class="flex items-center gap-2">
                            <a
                                href="https://wattino.eu"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Wattino.eu"
                                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black transition-colors hover:border-t-blue hover:text-t-blue dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:border-t-blue dark:hover:text-t-blue"
                            >
                                <Globe class="h-4 w-4" />
                            </a>
                            <a
                                href="https://rejstrik-firem.kurzy.cz/17366640/natureprotection-group-sro/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="FutureEnergy Register"
                                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black transition-colors hover:border-t-blue hover:text-t-blue dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:border-t-blue dark:hover:text-t-blue"
                            >
                                <ArrowUpRight class="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right: Editorial Narrative & Tabular Stats -->
                <div class="flex flex-col justify-between lg:col-span-8">
                    <div>
                        <!-- Header Accent Block -->
                        <div class="border-l-2 border-t-blue pl-6">
                            <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                                {{ $t('contact.team_dominik_role') }}
                            </span>
                            <h3
                                class="mt-1 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white"
                            >
                                {{ $t('contact.team_dominik_name') }}
                            </h3>
                            <p
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/50 uppercase dark:text-white/50"
                            >
                                {{ $t('contact.team_dominik_tagline') }}
                            </p>
                        </div>

                        <!-- Bio Narrative -->
                        <p
                            class="mt-6 text-base leading-relaxed text-black/80 sm:text-lg dark:text-white/80"
                        >
                            {{ $t('contact.team_dominik_bio') }}
                        </p>

                        <!-- Domain Focus Line -->
                        <div class="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-xs">
                            <span class="font-semibold tracking-wider text-t-blue uppercase">
                                {{ $t('contact.team_focus_label') }}:
                            </span>
                            <span class="text-black/70 dark:text-white/70">
                                {{ $t('contact.team_dominik_focus') }}
                            </span>
                        </div>
                    </div>

                    <!-- Open Tabular Numbers -->
                    <div
                        class="mt-10 grid grid-cols-1 gap-6 border-t border-black/10 pt-8 sm:grid-cols-3 sm:gap-0 dark:border-white/10"
                    >
                        <div class="sm:pr-6">
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_dominik_stat1_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_dominik_stat1_label') }}
                            </div>
                        </div>
                        <div
                            class="border-t border-black/10 pt-6 sm:border-t-0 sm:border-l sm:px-6 sm:pt-0 dark:border-white/10"
                        >
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_dominik_stat2_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_dominik_stat2_label') }}
                            </div>
                        </div>
                        <div
                            class="border-t border-black/10 pt-6 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0 dark:border-white/10"
                        >
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_dominik_stat3_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_dominik_stat3_label') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dominik Milestones (Dynamic Connected Chronological Timeline) -->
            <div>
                <div class="mb-10 flex flex-col justify-between border-b border-black/10 pb-4 sm:flex-row sm:items-baseline dark:border-white/10">
                    <div>
                        <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                            {{ $t('contact.team_milestones_title') }}
                        </span>
                        <h4 class="mt-1 text-2xl font-medium tracking-tight text-black sm:text-3xl dark:text-white">
                            {{ $t('contact.team_milestones_subtitle') }}
                        </h4>
                    </div>
                </div>

                <!-- Vertical Connected Timeline Track -->
                <div
                    class="relative ml-4 space-y-12 pl-8 sm:ml-5 sm:space-y-14 sm:pl-12 before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[2px] before:bg-linear-to-b before:from-t-blue before:via-black/15 before:to-t-blue/30 dark:before:via-white/20"
                >
                    <div
                        v-for="(m, idx) in dominikMilestones"
                        :key="idx"
                        class="group relative"
                    >
                        <!-- Illuminated Node Beacon -->
                        <div
                            class="absolute -left-[45px] sm:-left-[61px] top-0.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white bg-t-blue text-white shadow-xs ring-4 ring-t-blue/15 transition-all duration-300 group-hover:scale-110 group-hover:ring-t-blue/35 dark:border-zinc-950"
                        >
                            <span class="font-mono text-xs font-bold">{{ $t(m.step) }}</span>
                        </div>

                        <!-- Milestone Story -->
                        <div class="relative">
                            <div class="flex flex-wrap items-center gap-2 text-xs">
                                <span class="font-mono font-semibold tracking-wider text-t-blue uppercase">
                                    {{ $t(m.period) }}
                                </span>
                            </div>

                            <h5
                                class="mt-1.5 text-xl font-medium tracking-tight text-black transition-colors group-hover:text-t-blue sm:text-2xl dark:text-white"
                            >
                                {{ $t(m.title) }}
                            </h5>

                            <p
                                class="mt-2.5 max-w-3xl text-sm leading-relaxed text-black/75 sm:text-base dark:text-white/75"
                            >
                                {{ $t(m.desc) }}
                            </p>

                            <!-- Micro-Chips with Accent Dots -->
                            <div class="mt-4 flex flex-wrap items-center gap-2">
                                <span
                                    v-for="(tag, tagIdx) in parseTags($t(m.tag))"
                                    :key="tagIdx"
                                    class="inline-flex items-center gap-1.5 rounded-md border border-black/8 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-black/70 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-800/80 dark:text-white/70"
                                >
                                    <span class="h-1.5 w-1.5 rounded-full bg-t-blue" />
                                    <span>{{ tag }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dominik Ventures & Projects (Open Editorial Columns) -->
            <div>
                <div class="mb-8 border-b border-black/10 pb-4 dark:border-white/10">
                    <h4 class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                        {{ $t('contact.team_ventures_title') }}
                    </h4>
                </div>

                <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <!-- Project 1: Wattino -->
                    <div class="group flex flex-col justify-between">
                        <div>
                            <!-- Image Frame -->
                            <div
                                class="relative aspect-16/10 overflow-hidden rounded-xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800"
                            >
                                <img
                                    src="/img/founders/wattino-dominik.jpg"
                                    :alt="$t('contact.team_dominik_v1_title')"
                                    class="h-full w-full object-cover object-[center_22%] transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div
                                    class="absolute top-3 left-3 rounded-sm bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-xs"
                                >
                                    {{ $t('contact.team_dominik_v1_tag') }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="pt-6">
                                <h5
                                    class="text-2xl font-medium tracking-tight text-black dark:text-white"
                                >
                                    {{ $t('contact.team_dominik_v1_title') }}
                                </h5>
                                <div class="mt-1 text-xs font-medium tracking-wide text-t-blue uppercase">
                                    {{ $t('contact.team_dominik_v1_badge') }}
                                </div>

                                <!-- Narrative Points -->
                                <div class="mt-4 space-y-2.5 border-l-2 border-black/10 pl-4 text-sm leading-relaxed text-black/75 dark:border-white/15 dark:text-white/75">
                                    <p>{{ $t('contact.team_dominik_v1_p1') }}</p>
                                    <p>{{ $t('contact.team_dominik_v1_p2') }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Minimal Arrow Link -->
                        <div class="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                            <a
                                href="https://wattino.eu"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-black uppercase transition-colors hover:text-t-blue dark:text-white dark:hover:text-t-blue"
                            >
                                <span>{{ $t('contact.team_dominik_v1_link') }}</span>
                                <ArrowUpRight class="h-4 w-4 text-t-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>

                    <!-- Project 2: FutureEnergy -->
                    <div class="group flex flex-col justify-between">
                        <div>
                            <!-- Image Frame -->
                            <div
                                class="relative aspect-16/10 overflow-hidden rounded-xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800"
                            >
                                <img
                                    src="/img/founders/futureenergy-dominik.png"
                                    :alt="$t('contact.team_dominik_v2_title')"
                                    class="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div
                                    class="absolute top-3 left-3 rounded-sm bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-xs"
                                >
                                    {{ $t('contact.team_dominik_v2_tag') }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="pt-6">
                                <h5
                                    class="text-2xl font-medium tracking-tight text-black dark:text-white"
                                >
                                    {{ $t('contact.team_dominik_v2_title') }}
                                </h5>
                                <div class="mt-1 text-xs font-medium tracking-wide text-t-blue uppercase">
                                    {{ $t('contact.team_dominik_v2_badge') }}
                                </div>

                                <!-- Narrative Points -->
                                <div class="mt-4 space-y-2.5 border-l-2 border-black/10 pl-4 text-sm leading-relaxed text-black/75 dark:border-white/15 dark:text-white/75">
                                    <p>{{ $t('contact.team_dominik_v2_p1') }}</p>
                                    <p>{{ $t('contact.team_dominik_v2_p2') }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Minimal Arrow Link -->
                        <div class="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                            <a
                                href="https://rejstrik-firem.kurzy.cz/17366640/natureprotection-group-sro/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-black uppercase transition-colors hover:text-t-blue dark:text-white dark:hover:text-t-blue"
                            >
                                <span>{{ $t('contact.team_dominik_v2_link') }}</span>
                                <ArrowUpRight class="h-4 w-4 text-t-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Founder Separator -->
        <div class="my-20 border-t border-black/10 sm:my-28 dark:border-white/10"></div>

        <!-- ============================================ -->
        <!-- FOUNDER 2: JAKUB LUSTYK (CTO)                 -->
        <!-- ============================================ -->
        <div class="space-y-16 lg:space-y-20">
            <!-- Open Profile Hero: Portrait + Narrative + Open Stats -->
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                <!-- Left: Portrait & Links -->
                <div class="flex flex-col items-center lg:col-span-4 lg:items-start">
                    <div
                        class="group relative aspect-4/5 w-full max-w-[280px] overflow-hidden rounded-xl border border-black/10 bg-zinc-100 sm:max-w-[320px] dark:border-white/10 dark:bg-zinc-800"
                    >
                        <img
                            src="/img/founders/jakub-portrait.jpg"
                            :alt="$t('contact.team_jakub_name')"
                            class="h-full w-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                            class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent"
                        ></div>
                        <div class="absolute inset-x-0 bottom-0 p-4 text-white">
                            <div class="text-xs font-semibold tracking-wider uppercase text-white/90">
                                {{ $t('contact.team_jakub_role') }}
                            </div>
                            <div class="text-xs font-light text-white/70">
                                {{ $t('contact.team_cofounder_tag') }}
                            </div>
                        </div>
                    </div>

                    <!-- Founder Location & Social Links -->
                    <div class="mt-4 flex w-full max-w-[280px] items-center justify-between sm:max-w-[320px]">
                        <span class="text-xs font-medium text-black/60 dark:text-white/60">
                            {{ $t('contact.team_location_prague') }}
                        </span>
                        <div class="flex items-center gap-2">
                            <a
                                href="https://peko-studio.cz/reference/oukee/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="OuKee App Study"
                                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black transition-colors hover:border-t-blue hover:text-t-blue dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:border-t-blue dark:hover:text-t-blue"
                            >
                                <Globe class="h-4 w-4" />
                            </a>
                            <a
                                href="https://nocena.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Nocena Protocol"
                                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black transition-colors hover:border-t-blue hover:text-t-blue dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:border-t-blue dark:hover:text-t-blue"
                            >
                                <ArrowUpRight class="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right: Editorial Narrative & Tabular Stats -->
                <div class="flex flex-col justify-between lg:col-span-8">
                    <div>
                        <!-- Header Accent Block -->
                        <div class="border-l-2 border-t-blue pl-6">
                            <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                                {{ $t('contact.team_jakub_role') }}
                            </span>
                            <h3
                                class="mt-1 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white"
                            >
                                {{ $t('contact.team_jakub_name') }}
                            </h3>
                            <p
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/50 uppercase dark:text-white/50"
                            >
                                {{ $t('contact.team_jakub_tagline') }}
                            </p>
                        </div>

                        <!-- Bio Narrative -->
                        <p
                            class="mt-6 text-base leading-relaxed text-black/80 sm:text-lg dark:text-white/80"
                        >
                            {{ $t('contact.team_jakub_bio') }}
                        </p>

                        <!-- Domain Focus Line -->
                        <div class="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-xs">
                            <span class="font-semibold tracking-wider text-t-blue uppercase">
                                {{ $t('contact.team_focus_label') }}:
                            </span>
                            <span class="text-black/70 dark:text-white/70">
                                {{ $t('contact.team_jakub_focus') }}
                            </span>
                        </div>
                    </div>

                    <!-- Open Tabular Numbers -->
                    <div
                        class="mt-10 grid grid-cols-1 gap-6 border-t border-black/10 pt-8 sm:grid-cols-3 sm:gap-0 dark:border-white/10"
                    >
                        <div class="sm:pr-6">
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_jakub_stat1_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_jakub_stat1_label') }}
                            </div>
                        </div>
                        <div
                            class="border-t border-black/10 pt-6 sm:border-t-0 sm:border-l sm:px-6 sm:pt-0 dark:border-white/10"
                        >
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_jakub_stat2_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_jakub_stat2_label') }}
                            </div>
                        </div>
                        <div
                            class="border-t border-black/10 pt-6 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0 dark:border-white/10"
                        >
                            <div
                                class="text-3xl font-medium tracking-tight text-black sm:text-4xl tabular-nums dark:text-white"
                            >
                                {{ $t('contact.team_jakub_stat3_val') }}
                            </div>
                            <div
                                class="mt-1.5 text-xs font-medium tracking-wider text-black/60 uppercase dark:text-white/60"
                            >
                                {{ $t('contact.team_jakub_stat3_label') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Jakub Milestones (Dynamic Connected Chronological Timeline) -->
            <div>
                <div class="mb-10 flex flex-col justify-between border-b border-black/10 pb-4 sm:flex-row sm:items-baseline dark:border-white/10">
                    <div>
                        <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                            {{ $t('contact.team_milestones_title') }}
                        </span>
                        <h4 class="mt-1 text-2xl font-medium tracking-tight text-black sm:text-3xl dark:text-white">
                            {{ $t('contact.team_milestones_subtitle') }}
                        </h4>
                    </div>
                </div>

                <!-- Vertical Connected Timeline Track -->
                <div
                    class="relative ml-4 space-y-12 pl-8 sm:ml-5 sm:space-y-14 sm:pl-12 before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[2px] before:bg-linear-to-b before:from-t-blue before:via-black/15 before:to-t-blue/30 dark:before:via-white/20"
                >
                    <div
                        v-for="(m, idx) in jakubMilestones"
                        :key="idx"
                        class="group relative"
                    >
                        <!-- Illuminated Node Beacon -->
                        <div
                            class="absolute -left-[45px] sm:-left-[61px] top-0.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white bg-t-blue text-white shadow-xs ring-4 ring-t-blue/15 transition-all duration-300 group-hover:scale-110 group-hover:ring-t-blue/35 dark:border-zinc-950"
                        >
                            <span class="font-mono text-xs font-bold">{{ $t(m.step) }}</span>
                        </div>

                        <!-- Milestone Story -->
                        <div class="relative">
                            <div class="flex flex-wrap items-center gap-2 text-xs">
                                <span class="font-mono font-semibold tracking-wider text-t-blue uppercase">
                                    {{ $t(m.period) }}
                                </span>
                            </div>

                            <h5
                                class="mt-1.5 text-xl font-medium tracking-tight text-black transition-colors group-hover:text-t-blue sm:text-2xl dark:text-white"
                            >
                                {{ $t(m.title) }}
                            </h5>

                            <p
                                class="mt-2.5 max-w-3xl text-sm leading-relaxed text-black/75 sm:text-base dark:text-white/75"
                            >
                                {{ $t(m.desc) }}
                            </p>

                            <!-- Micro-Chips with Accent Dots -->
                            <div class="mt-4 flex flex-wrap items-center gap-2">
                                <span
                                    v-for="(tag, tagIdx) in parseTags($t(m.tag))"
                                    :key="tagIdx"
                                    class="inline-flex items-center gap-1.5 rounded-md border border-black/8 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-black/70 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-800/80 dark:text-white/70"
                                >
                                    <span class="h-1.5 w-1.5 rounded-full bg-t-blue" />
                                    <span>{{ tag }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Jakub Ventures & Projects (Open Editorial Columns) -->
            <div>
                <div class="mb-8 border-b border-black/10 pb-4 dark:border-white/10">
                    <h4 class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                        {{ $t('contact.team_ventures_title') }}
                    </h4>
                </div>

                <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <!-- Project 1: OuKee -->
                    <div class="group flex flex-col justify-between">
                        <div>
                            <!-- Image Frame -->
                            <div
                                class="relative aspect-16/10 overflow-hidden rounded-xl border border-black/10 bg-[#121212] dark:border-white/10"
                            >
                                <img
                                    src="/img/founders/oukee-app.webp"
                                    alt="OuKee mobile app UI on multiple devices"
                                    class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div
                                    class="absolute top-3 left-3 rounded-sm bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-xs"
                                >
                                    {{ $t('contact.team_jakub_v1_tag') }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="pt-6">
                                <h5
                                    class="text-2xl font-medium tracking-tight text-black dark:text-white"
                                >
                                    {{ $t('contact.team_jakub_v1_title') }}
                                </h5>
                                <div class="mt-1 text-xs font-medium tracking-wide text-t-blue uppercase">
                                    {{ $t('contact.team_jakub_v1_badge') }}
                                </div>

                                <!-- Narrative Points -->
                                <div class="mt-4 space-y-2.5 border-l-2 border-black/10 pl-4 text-sm leading-relaxed text-black/75 dark:border-white/15 dark:text-white/75">
                                    <p>{{ $t('contact.team_jakub_v1_p1') }}</p>
                                    <p>{{ $t('contact.team_jakub_v1_p2') }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Minimal Arrow Link -->
                        <div class="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                            <a
                                href="https://peko-studio.cz/reference/oukee/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-black uppercase transition-colors hover:text-t-blue dark:text-white dark:hover:text-t-blue"
                            >
                                <span>{{ $t('contact.team_jakub_v1_link') }}</span>
                                <ArrowUpRight class="h-4 w-4 text-t-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>

                    <!-- Project 2: Nocena -->
                    <div class="group flex flex-col justify-between">
                        <div>
                            <!-- Image Frame -->
                            <div
                                class="relative aspect-16/10 overflow-hidden rounded-xl border border-black/10 bg-black dark:border-white/10"
                            >
                                <img
                                    src="/img/founders/nocena-team.jpg"
                                    alt="Nocena team at Protocol Labs in San Francisco"
                                    class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div
                                    class="absolute top-3 left-3 rounded-sm bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-xs"
                                >
                                    {{ $t('contact.team_jakub_v2_tag') }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="pt-6">
                                <h5
                                    class="text-2xl font-medium tracking-tight text-black dark:text-white"
                                >
                                    {{ $t('contact.team_jakub_v2_title') }}
                                </h5>
                                <div class="mt-1 text-xs font-medium tracking-wide text-t-blue uppercase">
                                    {{ $t('contact.team_jakub_v2_badge') }}
                                </div>

                                <!-- Narrative Points -->
                                <div class="mt-4 space-y-2.5 border-l-2 border-black/10 pl-4 text-sm leading-relaxed text-black/75 dark:border-white/15 dark:text-white/75">
                                    <p>{{ $t('contact.team_jakub_v2_p1') }}</p>
                                    <p>{{ $t('contact.team_jakub_v2_p2') }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Minimal Arrow Link -->
                        <div class="mt-6 border-t border-black/10 pt-4 dark:border-white/10">
                            <a
                                href="https://nocena.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-black uppercase transition-colors hover:text-t-blue dark:text-white dark:hover:text-t-blue"
                            >
                                <span>{{ $t('contact.team_jakub_v2_link') }}</span>
                                <ArrowUpRight class="h-4 w-4 text-t-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Founders Red Bull Basement Panoramic Banner & Mission Quote -->
        <div class="mt-24 sm:mt-28">
            <div
                class="group relative overflow-hidden rounded-xl border border-black/10 bg-black shadow-xl dark:border-white/10"
            >
                <div class="aspect-16/9 overflow-hidden sm:aspect-21/9 lg:aspect-24/9">
                    <img
                        src="/img/team/founders-leaf.jpg"
                        :alt="$t('contact.team_caption')"
                        class="h-full w-full object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                </div>

                <!-- Cinematic Gradient Overlay -->
                <div
                    class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"
                ></div>

                <!-- Bottom Caption & Quote -->
                <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                    <div class="max-w-4xl">
                        <p
                            class="text-xs font-medium tracking-wider text-white/75 uppercase sm:text-sm"
                        >
                            {{ $t('contact.team_caption') }}
                        </p>
                        <p
                            class="mt-2 text-base leading-relaxed font-light text-white/95 italic sm:text-lg lg:text-xl"
                        >
                            {{ $t('contact.team_quote') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Academic & Technological R&D Partners (Radim hidden as requested) -->
        <div class="mt-16 border-t border-black/10 pt-12 sm:mt-20 dark:border-white/10">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-l-2 border-t-blue pl-6">
                <div class="max-w-2xl">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                        {{ $t('contact.team_rnd_partners_tag') }}
                    </span>
                    <p class="mt-2 text-sm leading-relaxed text-black/75 sm:text-base dark:text-white/75">
                        {{ $t('contact.team_rnd_partners_desc') }}
                    </p>
                </div>
                <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-black/70 dark:text-white/70">
                    <span
                        class="rounded-lg border border-black/10 bg-zinc-50 px-4 py-2 font-medium tracking-wide dark:border-white/10 dark:bg-zinc-800"
                    >
                        {{ $t('contact.team_rnd_partner_cvut') }}
                    </span>
                    <span
                        class="rounded-lg border border-black/10 bg-zinc-50 px-4 py-2 font-medium tracking-wide dark:border-white/10 dark:bg-zinc-800"
                    >
                        {{ $t('contact.team_rnd_partner_fzu') }}
                    </span>
                    <span
                        class="rounded-lg border border-black/10 bg-zinc-50 px-4 py-2 font-medium tracking-wide dark:border-white/10 dark:bg-zinc-800"
                    >
                        {{ $t('contact.team_rnd_partner_czechinvest') }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>
