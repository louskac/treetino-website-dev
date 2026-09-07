<template>
    <Head :title="$t('sales.audience') + ' | Treetino'" />

    <DefaultLayout :scroll="true">
        <!-- Hero Section - Dark Atmospheric Studio Hero with Minimalist City Map Blueprint -->
        <section
            class="hero relative overflow-hidden bg-zinc-950 pt-36 pb-0 text-white"
        >
            <!-- Minimalist City Map Vector Background with Animated Architectural Blue Lines -->
            <SalesHeroCityMap />

            <div
                class="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 text-center sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Audience Badge -->
                <div
                    class="text-xs font-semibold tracking-[0.25em] text-white/70 uppercase sm:text-sm lg:text-base"
                >
                    {{ $t('sales.audience') }}
                </div>

                <!-- Main Title -->
                <h1
                    class="mt-3 max-w-5xl text-4xl leading-[1.08] font-medium tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
                >
                    {{ $t('sales.title') }}
                </h1>

                <!-- Lead Paragraph -->
                <p
                    class="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl"
                >
                    {{ $t('sales.lead') }}
                </p>

                <!-- Action Buttons -->
                <div
                    class="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <ButtonPrimary
                        :href="pricingAppUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-8 py-3.5 text-sm font-semibold sm:text-base"
                    >
                        {{ $t('sales.cta_primary') }}
                    </ButtonPrimary>
                    <ButtonWhite
                        href="#opportunities"
                        @click.prevent="scrollToSection('opportunities')"
                        class="px-7 py-3.5 text-sm font-medium sm:text-base"
                    >
                        {{ $t('sales.cta_secondary') }}
                    </ButtonWhite>
                </div>

                <!-- 3D MacBook Pro Device Frame with scroll opening lid animation -->
                <div class="relative z-10 mt-14 w-full">
                    <MacbookHeroOpening
                        screenSrc="/img/cta/cta-pos-1.webp"
                        alt="Treetino Pricing App 3D Google Maps & Partner Portal"
                    />
                </div>
            </div>
        </section>

        <!-- 7-Step Interactive Pinned 3D MacBook App Tour -->
        <SalesAppShowcase3D />

        <!-- Sales Opportunities & Target Clients Showcase (Signature Split Carousel matching V2.vue style) -->
        <SalesOpportunitiesShowcase />

        <!-- Informace & čísla (Databook Stats Grid) -->
        <section
            id="numbers"
            class="relative scroll-mt-24 bg-white py-20 text-black dark:bg-zinc-950 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Stats Grid -->
                <div
                    class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16"
                >
                    <div class="flex flex-col items-start lg:col-span-4">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('sales.numbers_badge') }}</span
                        >
                        <h2
                            class="mt-3 text-3xl leading-tight font-medium text-black sm:text-4xl dark:text-white"
                        >
                            {{ $t('sales.numbers_title') }}
                        </h2>
                        <p
                            class="mt-4 text-base leading-relaxed text-black/70 dark:text-white/70"
                        >
                            {{ $t('sales.numbers_description') }}
                        </p>
                        <div class="w-full pt-8 sm:w-auto">
                            <ButtonPrimary
                                :href="pricingAppUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="w-full px-8 py-3.5 text-center text-sm font-semibold sm:w-auto sm:text-base"
                            >
                                {{ $t('sales.cta_primary') }}
                            </ButtonPrimary>
                        </div>
                    </div>

                    <div
                        class="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:border-l lg:border-black/10 lg:pl-16 dark:lg:border-white/10"
                    >
                        <div
                            v-for="stat in partnerStats"
                            :key="stat.label + stat.value"
                        >
                            <div class="mb-2 flex items-center gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 shrink-0 rounded-xl bg-t-blue/10 text-t-blue dark:bg-white/10 dark:text-white"
                                >
                                    <component
                                        :is="stat.icon"
                                        class="m-auto h-6 w-6"
                                        stroke-width="1.5"
                                    />
                                </div>
                                <div
                                    class="text-2xl font-medium whitespace-nowrap text-black sm:text-3xl lg:text-3xl xl:text-4xl dark:text-white"
                                >
                                    {{ stat.value }}
                                </div>
                            </div>
                            <div class="text-sm leading-relaxed opacity-75">
                                {{ stat.label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Borderless Minimalist List Highlights Section (Identical to V1.vue Design 3) -->
        <section
            class="border-y border-black/10 bg-stone-50/50 py-20 text-black dark:border-white/10 dark:bg-stone-900/40 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-14 text-center">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('sales.why_join.badge') }}</span
                    >
                    <h2
                        class="mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl"
                    >
                        {{ $t('sales.why_join.title') }}
                    </h2>
                </div>

                <div
                    class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
                >
                    <div
                        class="border-l border-black/15 pl-6 dark:border-white/15"
                    >
                        <div
                            class="text-3xl font-semibold tracking-tight text-black lg:text-4xl dark:text-white"
                        >
                            01
                        </div>
                        <h3
                            class="mt-2 text-base font-semibold text-black dark:text-white"
                        >
                            {{ $t('sales.why_join.card1_title') }}
                        </h3>
                        <p
                            class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65"
                        >
                            {{ $t('sales.why_join.card1_desc') }}
                        </p>
                    </div>

                    <div
                        class="border-l border-black/15 pl-6 dark:border-white/15"
                    >
                        <div
                            class="text-3xl font-semibold tracking-tight text-black lg:text-4xl dark:text-white"
                        >
                            02
                        </div>
                        <h3
                            class="mt-2 text-base font-semibold text-black dark:text-white"
                        >
                            {{ $t('sales.why_join.card2_title') }}
                        </h3>
                        <p
                            class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65"
                        >
                            {{ $t('sales.why_join.card2_desc') }}
                        </p>
                    </div>

                    <div
                        class="border-l border-black/15 pl-6 dark:border-white/15"
                    >
                        <div
                            class="text-3xl font-semibold tracking-tight text-black lg:text-4xl dark:text-white"
                        >
                            03
                        </div>
                        <h3
                            class="mt-2 text-base font-semibold text-black dark:text-white"
                        >
                            {{ $t('sales.why_join.card3_title') }}
                        </h3>
                        <p
                            class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65"
                        >
                            {{ $t('sales.why_join.card3_desc') }}
                        </p>
                    </div>

                    <div
                        class="border-l border-black/15 pl-6 dark:border-white/15"
                    >
                        <div
                            class="text-3xl font-semibold tracking-tight text-black lg:text-4xl dark:text-white"
                        >
                            04
                        </div>
                        <h3
                            class="mt-2 text-base font-semibold text-black dark:text-white"
                        >
                            {{ $t('sales.why_join.card4_title') }}
                        </h3>
                        <p
                            class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65"
                        >
                            {{ $t('sales.why_join.card4_desc') }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sales Network / Team Commissions Showcase (Identical to V2.vue Feature Showcase 2) -->
        <section
            class="relative bg-stone-50 py-24 text-black dark:bg-stone-900/50 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div
                    class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center"
                >
                    <!-- Signature Design Element -->
                    <div
                        class="relative overflow-hidden border-t-4 border-l-4 border-t-t-blue border-l-t-blue bg-black shadow-2xl"
                    >
                        <div class="relative aspect-4/3 overflow-hidden">
                            <img
                                src="/img/stills/Still_Strom-v1.png"
                                alt="Treetino Partnerská Síť"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                            <!-- 2-Line Stacked Typography Overlay -->
                            <div
                                class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/85 via-black/20 to-transparent p-8 sm:p-12"
                            >
                                <span
                                    class="text-5xl leading-none font-black tracking-tight text-white uppercase drop-shadow-2xl sm:text-7xl lg:text-8xl"
                                >
                                    {{ $t('sales.network.overlay_line1') }}
                                </span>
                                <span
                                    class="mt-1 text-5xl leading-none font-black tracking-tight text-white uppercase drop-shadow-2xl sm:text-7xl lg:text-8xl"
                                >
                                    {{ $t('sales.network.overlay_line2') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('sales.network.tag') }}</span
                        >
                        <h2
                            class="mt-3 text-4xl font-medium text-black sm:text-5xl dark:text-white"
                        >
                            {{ $t('sales.network.title') }}
                        </h2>
                        <p
                            class="mt-6 text-lg leading-relaxed text-black/75 dark:text-white/75"
                        >
                            {{ $t('sales.network.text') }}
                        </p>

                        <!-- Info cards with vertical left blue border line -->
                        <div class="mt-8 grid grid-cols-2 gap-6">
                            <div
                                class="border-l-2 border-t-blue bg-white/60 p-4 pl-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="text-lg font-bold text-t-blue">
                                    {{ $t('sales.network.card1_title') }}
                                </div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('sales.network.card1_text') }}
                                </div>
                            </div>
                            <div
                                class="border-l-2 border-t-blue bg-white/60 p-4 pl-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="text-lg font-bold text-t-blue">
                                    {{ $t('sales.network.card2_title') }}
                                </div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('sales.network.card2_text') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic Product Preview Hover Grid (Identical to V1.vue / V2.vue #products) -->
        <section
            class="bg-white py-20 text-black dark:bg-zinc-950 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div
                    class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
                >
                    <!-- Left Column: Product Selection with Clear Cards & Big Profits (7 cols) -->
                    <div class="lg:col-span-7">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('sales.portfolio.badge') }}</span
                        >
                        <h2
                            class="mt-3 text-3xl leading-tight font-medium sm:text-4xl lg:text-5xl"
                        >
                            {{ $t('sales.portfolio.title') }}
                        </h2>

                        <div class="mt-8 space-y-4">
                            <!-- V1 Commercial Tree -->
                            <div
                                @mouseenter="hoveredProduct = 'v1'"
                                @click="hoveredProduct = 'v1'"
                                class="cursor-pointer rounded-2xl border p-5 transition-all duration-300 sm:p-6"
                                :class="
                                    hoveredProduct === 'v1' || !hoveredProduct
                                        ? 'border-t-blue/40 bg-t-blue/[0.04] shadow-sm dark:border-t-blue/60 dark:bg-white/10'
                                        : 'border-black/5 bg-stone-50/60 hover:border-black/15 hover:bg-stone-100/60 dark:border-white/5 dark:bg-stone-900/40 dark:hover:border-white/15'
                                "
                            >
                                <div
                                    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <h3
                                            class="text-xl font-semibold text-black dark:text-white"
                                        >
                                            {{ $t('sales.portfolio.v1_title') }}
                                        </h3>
                                        <div
                                            class="mt-0.5 text-xs text-black/50 dark:text-white/50"
                                        >
                                            {{ $t('sales.portfolio.v1_price') }}
                                        </div>
                                    </div>
                                    <div class="shrink-0">
                                        <span
                                            class="inline-block rounded-xl bg-t-blue/10 px-4 py-2 text-sm font-bold text-t-blue dark:bg-t-blue/20"
                                        >
                                            {{
                                                $t(
                                                    'sales.portfolio.v1_commission',
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70"
                                >
                                    {{ $t('sales.portfolio.v1_desc') }}
                                </p>
                            </div>

                            <!-- V2 Residential Tree -->
                            <div
                                @mouseenter="hoveredProduct = 'v2'"
                                @click="hoveredProduct = 'v2'"
                                class="cursor-pointer rounded-2xl border p-5 transition-all duration-300 sm:p-6"
                                :class="
                                    hoveredProduct === 'v2'
                                        ? 'border-t-blue/40 bg-t-blue/[0.04] shadow-sm dark:border-t-blue/60 dark:bg-white/10'
                                        : 'border-black/5 bg-stone-50/60 hover:border-black/15 hover:bg-stone-100/60 dark:border-white/5 dark:bg-stone-900/40 dark:hover:border-white/15'
                                "
                            >
                                <div
                                    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <h3
                                            class="text-xl font-semibold text-black dark:text-white"
                                        >
                                            {{ $t('sales.portfolio.v2_title') }}
                                        </h3>
                                        <div
                                            class="mt-0.5 text-xs text-black/50 dark:text-white/50"
                                        >
                                            {{ $t('sales.portfolio.v2_price') }}
                                        </div>
                                    </div>
                                    <div class="shrink-0">
                                        <span
                                            class="inline-block rounded-xl bg-t-blue/10 px-4 py-2 text-sm font-bold text-t-blue dark:bg-t-blue/20"
                                        >
                                            {{
                                                $t(
                                                    'sales.portfolio.v2_commission',
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70"
                                >
                                    {{ $t('sales.portfolio.v2_desc') }}
                                </p>
                            </div>

                            <!-- Turbine T1 -->
                            <div
                                @mouseenter="hoveredProduct = 'turbine'"
                                @click="hoveredProduct = 'turbine'"
                                class="cursor-pointer rounded-2xl border p-5 transition-all duration-300 sm:p-6"
                                :class="
                                    hoveredProduct === 'turbine'
                                        ? 'border-t-blue/40 bg-t-blue/[0.04] shadow-sm dark:border-t-blue/60 dark:bg-white/10'
                                        : 'border-black/5 bg-stone-50/60 hover:border-black/15 hover:bg-stone-100/60 dark:border-white/5 dark:bg-stone-900/40 dark:hover:border-white/15'
                                "
                            >
                                <div
                                    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <h3
                                            class="text-xl font-semibold text-black dark:text-white"
                                        >
                                            {{
                                                $t(
                                                    'sales.portfolio.turbine_title',
                                                )
                                            }}
                                        </h3>
                                        <div
                                            class="mt-0.5 text-xs text-black/50 dark:text-white/50"
                                        >
                                            {{
                                                $t(
                                                    'sales.portfolio.turbine_price',
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div class="shrink-0">
                                        <span
                                            class="inline-block rounded-xl bg-t-blue/10 px-4 py-2 text-sm font-bold text-t-blue dark:bg-t-blue/20"
                                        >
                                            {{
                                                $t(
                                                    'sales.portfolio.turbine_commission',
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70"
                                >
                                    {{ $t('sales.portfolio.turbine_desc') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Balanced preview image (5 cols) -->
                    <div class="lg:col-span-5">
                        <div
                            class="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10 bg-zinc-100 shadow-2xl dark:border-white/10 dark:bg-zinc-900"
                        >
                            <Transition name="fade" mode="out-in">
                                <img
                                    :key="previewImage"
                                    :src="previewImage"
                                    alt="Treetino Product Portfolio"
                                    class="h-full w-full object-cover"
                                />
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Datasheet / Partnership Specs Table (Identical to V1.vue / V2.vue #datasheet) -->
        <section
            class="border-t border-black/10 bg-white py-20 text-black dark:border-white/10 dark:bg-zinc-950 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-12">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('sales.datasheet.badge') }}</span
                    >
                    <h2
                        class="mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl"
                    >
                        {{ $t('sales.datasheet.title') }}
                    </h2>
                </div>

                <div
                    class="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10"
                >
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row1_label') }}
                        </div>
                        <div
                            class="text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            {{ $t('sales.datasheet.row1_val') }}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row2_label') }}
                        </div>
                        <div
                            class="text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            {{ $t('sales.datasheet.row2_val') }}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row3_label') }}
                        </div>
                        <div
                            class="text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            {{ $t('sales.datasheet.row3_val') }}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row4_label') }}
                        </div>
                        <div
                            class="text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            {{ $t('sales.datasheet.row4_val') }}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row5_label') }}
                        </div>
                        <div
                            class="flex flex-wrap items-center gap-4 text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            <span>{{ $t('sales.datasheet.row5_val') }}</span>
                            <div class="flex items-center gap-3">
                                <a
                                    href="/legal/nda/download"
                                    class="inline-flex items-center gap-1 text-xs font-semibold text-t-blue hover:underline"
                                >
                                    <Download class="h-3.5 w-3.5" />
                                    <span>{{
                                        $t('sales.datasheet.download_nda')
                                    }}</span>
                                </a>
                                <span class="text-black/30 dark:text-white/30"
                                    >&bull;</span
                                >
                                <a
                                    href="/legal/nda"
                                    class="text-xs font-medium text-black/60 hover:text-black hover:underline dark:text-white/60 dark:hover:text-white"
                                >
                                    {{ $t('sales.datasheet.view_online') }}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 py-4 md:grid-cols-3">
                        <div class="font-medium text-black dark:text-white">
                            {{ $t('sales.datasheet.row6_label') }}
                        </div>
                        <div
                            class="flex flex-wrap items-center gap-4 text-black/80 md:col-span-2 dark:text-white/80"
                        >
                            <span>{{ $t('sales.datasheet.row6_val') }}</span>
                            <div class="flex items-center gap-3">
                                <a
                                    href="/legal/mediation/download"
                                    class="inline-flex items-center gap-1 text-xs font-semibold text-t-blue hover:underline"
                                >
                                    <Download class="h-3.5 w-3.5" />
                                    <span>{{
                                        $t('sales.datasheet.download_mediation')
                                    }}</span>
                                </a>
                                <span class="text-black/30 dark:text-white/30"
                                    >&bull;</span
                                >
                                <a
                                    href="/legal/mediation"
                                    class="text-xs font-medium text-black/60 hover:text-black hover:underline dark:text-white/60 dark:hover:text-white"
                                >
                                    {{ $t('sales.datasheet.view_online') }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Generic Call to Action Banner (Reusing HomeCtaGeneric component) -->
        <HomeCtaGeneric
            :badge="$t('sales.audience')"
            :title="$t('sales.banner.title')"
            :description="$t('sales.banner.subtitle')"
            :button-text="$t('sales.banner.cta')"
            :button-href="pricingAppUrl"
        />
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Clock, Coins, Download, Flash, ShieldCheck } from '@iconoir/vue';
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
import MacbookHeroOpening from '@/custom/MacbookHeroOpening.vue';
import SalesAppShowcase3D from '@/custom/sales/SalesAppShowcase3D.vue';
import SalesHeroCityMap from '@/custom/sales/SalesHeroCityMap.vue';
import SalesOpportunitiesShowcase from '@/custom/sales/SalesOpportunitiesShowcase.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { SALES_OPPORTUNITIES } from '@/types/sales';

const { t } = useI18n();

const opportunities = SALES_OPPORTUNITIES;

const pricingAppUrl = computed(() => {
    return (
        (import.meta.env.VITE_PRICING_APP_URL as string) ||
        'https://treetino-pricing.vercel.app'
    );
});

const hoveredProduct = ref<string | null>(null);

const previewImage = computed(() => {
    const p = hoveredProduct.value || 'v1';

    if (p === 'v2') {
        return '/img/stills/Still_Strom-v2.png';
    }

    if (p === 'turbine') {
        return '/img/stills/Still_Turbina.png';
    }

    return '/img/stills/Still_Strom-v1.png';
});

const partnerStats = computed(() => [
    {
        icon: Coins,
        value: t('sales.stats.1.val'),
        label: t('sales.stats.1.lbl'),
    },
    {
        icon: Flash,
        value: t('sales.stats.2.val'),
        label: t('sales.stats.2.lbl'),
    },
    {
        icon: Clock,
        value: t('sales.stats.3.val'),
        label: t('sales.stats.3.lbl'),
    },
    {
        icon: ShieldCheck,
        value: t('sales.stats.4.val'),
        label: t('sales.stats.4.lbl'),
    },
]);

function scrollToSection(id: string) {
    const el = document.getElementById(id);

    if (!el) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent('suppress-3d-pin', { detail: { duration: 2500 } }),
    );

    const navOffset = 90;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
