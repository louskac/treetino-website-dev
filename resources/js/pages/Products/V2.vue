<template>
    <Head title="Strom V2 | Treetino" />

    <DefaultLayout :scroll="true">
        <!-- Hero Section - Clean & Minimalist (Identical structure to Homepage Hero) -->
        <section class="hero relative h-screen w-full bg-zinc-950">
            <div class="pointer-events-none absolute inset-0">
                <video
                    poster="/img/hero-images/poster-v2_2.1.2.webp"
                    class="h-full w-full object-cover"
                    muted
                    loop
                    playsinline
                    webkit-playsinline
                    autoplay
                    preload="auto"
                >
                    <source
                        src="/video/hero-v2-cine-noaudio.webm"
                        type="video/webm"
                    />
                </video>
            </div>

            <!-- Soft Bottom Gradient Overlay for Text Contrast & Smooth Transition -->
            <div
                class="pointer-events-none absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-black"
            ></div>

            <div
                class="relative mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 pb-28 text-white sm:w-[500px] sm:pb-24 sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mt-auto">
                    <div
                        class="text-sm font-semibold tracking-[0.25em] text-white/70 uppercase lg:text-base"
                    >
                        {{ $t('products.v2.audience') }}
                    </div>

                    <h1
                        class="mt-2 text-6xl font-medium tracking-tight text-white sm:text-7xl lg:text-8xl"
                    >
                        {{ $t('products.v2.title') }}
                    </h1>

                    <p
                        class="mt-4 max-w-2xl text-base text-white/80 sm:text-lg lg:text-xl"
                    >
                        {{ $t('products.v2.lead') }}
                    </p>

                    <div class="mt-8 flex items-center gap-4">
                        <ButtonPrimary
                            :href="route('configurator.product', 'strom-v2')"
                            class="px-7 py-3 text-sm font-semibold sm:text-base"
                        >
                            {{ $t('common.actions.configure') }}
                        </ButtonPrimary>
                        <ButtonWhite
                            href="#numbers"
                            class="px-6 py-3 text-sm font-medium sm:text-base"
                        >
                            {{ $t('home.numbers.title') }}
                        </ButtonWhite>
                    </div>
                </div>
            </div>
        </section>

        <!-- Informace & čísla (Databook Stats Grid) -->
        <section
            id="numbers"
            class="relative bg-white py-20 text-black dark:bg-zinc-950 dark:text-white scroll-mt-24"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Stats Grid -->
                <div
                    class="grid grid-cols-1 gap-12 pt-4 lg:grid-cols-3 2xl:grid-cols-4"
                >
                    <div class="col-span-1 flex flex-col">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('home.features.key_parameters', 'Klíčové Parametry') }}</span
                        >
                        <h2
                            class="mt-3 text-4xl font-medium leading-tight lg:text-5xl"
                        >
                            {{ $t('products.v2.numbers_title') }}
                        </h2>
                        <p class="mt-4 text-sm text-black/70 dark:text-white/70">
                            {{ $t('products.v2.numbers_description') }}
                        </p>
                        <div class="mt-auto pt-6">
                            <ButtonPrimary
                                :href="route('configurator.product', 'strom-v2')"
                                class="w-full text-center"
                            >
                                {{ $t('products.v2.configure_label') }}
                            </ButtonPrimary>
                        </div>
                    </div>

                    <div
                        class="col-span-1 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-2 lg:border-l lg:border-black/10 lg:pl-12 2xl:col-span-3 dark:lg:border-white/10"
                    >
                        <div
                            v-for="stat in productStats"
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
                                    class="text-2xl font-medium text-black whitespace-nowrap dark:text-white sm:text-3xl lg:text-3xl xl:text-4xl"
                                >
                                    {{ stat.valueKey ? $t(stat.valueKey, stat.value) : stat.value }}
                                </div>
                            </div>
                            <div class="text-sm opacity-75">
                                {{ $t(stat.descriptionKey, stat.description) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Design 3: Borderless Minimalist List Highlights Section -->
        <section class="border-y border-black/10 bg-stone-50/50 py-20 text-black dark:border-white/10 dark:bg-stone-900/40 dark:text-white">
            <div class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]">
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">{{ $t('products.v2.tech.tag') }}</span>
                    <h2 class="mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl">{{ $t('products.v2.tech.title') }}</h2>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">5.0 m</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.v2.tech.item1_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.v2.tech.item1_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">2 {{ $t('products.datasheet.val_months') }}</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.v2.tech.item2_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.v2.tech.item2_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">0.5 m</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.v2.tech.item3_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.v2.tech.item3_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">25 {{ $t('products.datasheet.val_years') }}</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.v2.tech.item4_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.v2.tech.item4_text') }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature Showcase 1: Winning Design 2A Picture Presentation (NO BORDER) -->
        <section
            class="relative bg-white py-24 text-black dark:bg-black dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="relative overflow-hidden rounded-3xl bg-black shadow-2xl">
                    <div class="relative h-[500px] w-full overflow-hidden">
                        <img
                            src="/img/stills/Still_Strom-v2.png"
                            alt="Treetino Strom V2"
                            class="h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                        />
                        <div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/45 to-transparent"></div>
                    </div>

                    <div class="absolute inset-y-0 left-0 flex items-center p-8 sm:p-14 lg:w-7/12">
                        <div class="max-w-xl">
                            <span class="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                                {{ $t('products.v2.showcase1.tag') }}
                            </span>
                            <h3 class="mt-4 text-3xl font-medium text-white sm:text-4xl lg:text-5xl">
                                {{ $t('products.v2.showcase1.title') }}
                            </h3>
                            <p class="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                                {{ $t('products.v2.showcase1.lead') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature Showcase 2: Signature V2 Design Element -->
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
                    <div class="relative overflow-hidden border-t-4 border-l-4 border-t-t-blue border-l-t-blue bg-black shadow-2xl">
                        <div class="relative aspect-4/3 overflow-hidden">
                            <img
                                src="/img/info/info-strom-v2-w.webp"
                                alt="Strom V2"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                            <!-- 2-Line Stacked Typography Overlay (HYBRID / 24/7) -->
                            <div class="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 bg-linear-to-t from-black/85 via-black/20 to-transparent">
                                <span class="text-5xl font-black tracking-tight text-white leading-none uppercase sm:text-7xl lg:text-8xl drop-shadow-2xl">
                                    HYBRID
                                </span>
                                <span class="text-5xl font-black tracking-tight text-white leading-none uppercase sm:text-7xl lg:text-8xl drop-shadow-2xl mt-1">
                                    24/7
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('products.v2.showcase2.tag') }}</span
                        >
                        <h2
                            class="mt-3 text-4xl font-medium text-black dark:text-white sm:text-5xl"
                        >
                            {{ $t('products.v2.showcase2.title') }}
                        </h2>
                        <p
                            class="mt-6 text-lg leading-relaxed text-black/75 dark:text-white/75"
                        >
                            {{ $t('products.v2.showcase2.text') }}
                        </p>

                        <!-- Info cards with vertical left blue border line -->
                        <div class="mt-8 grid grid-cols-2 gap-6">
                            <div
                                class="border-l-2 border-t-blue pl-4 bg-white/60 p-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="text-lg font-bold text-t-blue">
                                    TreeApp
                                </div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('products.v2.showcase2.card1') }}
                                </div>
                            </div>
                            <div
                                class="border-l-2 border-t-blue pl-4 bg-white/60 p-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="text-lg font-bold text-t-blue">
                                    Victron Energy
                                </div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('products.v2.showcase2.card2') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature Showcase 3: Market Competition Section -->
        <section
            id="comparison"
            class="scroll-mt-24 border-t border-black/10 bg-white py-24 text-black dark:border-white/10 dark:bg-black dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">{{ $t('products.v2.comp.tag') }}</span>
                    <h2 class="mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl">{{ $t('products.v2.comp.title') }}</h2>
                    <p class="mt-3 text-base text-black/70 dark:text-white/70 max-w-2xl mx-auto">
                        {{ $t('products.v2.comp.subtitle') }}
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <!-- Card 1: Spotlight Solar -->
                    <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-black text-white shadow-2xl min-h-[480px]">
                        <div class="relative h-64 w-full overflow-hidden bg-zinc-900">
                            <img
                                src="/img/competition/spotlight-solar-hq-crop.jpg"
                                alt="Spotlight Solar"
                                class="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                            <span class="absolute top-4 left-4 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                                {{ $t('products.v2.comp.competitor') }}
                            </span>
                        </div>

                        <div class="p-8 pt-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="text-2xl font-bold text-white">Spotlight Solar</h3>
                                <div class="mt-1 text-3xl font-black text-white">$50,000</div>
                            </div>

                            <ul class="mt-6 space-y-2.5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/80">
                                <li class="flex items-center gap-2.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/50"></span>
                                    <span>{{ $t('products.v2.comp.pv_panels') }} <strong class="text-white">3 kWp</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5 text-white/60">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/30"></span>
                                    <span>{{ $t('products.v2.comp.wind_turbine') }} <strong class="text-white/70">{{ $t('products.v2.comp.none') }}</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5 text-white/60">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/30"></span>
                                    <span>{{ $t('products.v2.comp.operation') }} <strong class="text-white/70">{{ $t('products.v2.comp.daylight_only') }}</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Card 2: Smartflower -->
                    <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-black text-white shadow-2xl min-h-[480px]">
                        <div class="relative h-64 w-full overflow-hidden bg-zinc-900">
                            <img
                                src="/img/competition/smart-flower-hq-crop.jpg"
                                alt="Smartflower"
                                class="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                            <span class="absolute top-4 left-4 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                                {{ $t('products.v2.comp.competitor') }}
                            </span>
                        </div>

                        <div class="p-8 pt-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="text-2xl font-bold text-white">Smartflower</h3>
                                <div class="mt-1 text-3xl font-black text-white">$40,000</div>
                            </div>

                            <ul class="mt-6 space-y-2.5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/80">
                                <li class="flex items-center gap-2.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/50"></span>
                                    <span>{{ $t('products.v2.comp.pv_panels') }} <strong class="text-white">2.4 kWp</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5 text-white/60">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/30"></span>
                                    <span>{{ $t('products.v2.comp.wind_turbine') }} <strong class="text-white/70">{{ $t('products.v2.comp.none') }}</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5 text-white/60">
                                    <span class="h-1.5 w-1.5 rounded-full bg-white/30"></span>
                                    <span>{{ $t('products.v2.comp.operation') }} <strong class="text-white/70">{{ $t('products.v2.comp.daylight_only') }}</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Card 3: Treetino Strom V2 -->
                    <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-black text-white shadow-2xl min-h-[480px] border-2 border-t-blue/80">
                        <div class="relative h-64 w-full overflow-hidden bg-zinc-900">
                            <img
                                src="/img/stills/SM-still.webp"
                                alt="Treetino Strom V2"
                                class="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                            <span class="absolute top-4 left-4 rounded-full bg-t-blue px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md shadow-lg">
                                {{ $t('products.v2.comp.winner') }}
                            </span>
                        </div>

                        <div class="p-8 pt-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="text-2xl font-black text-white">Treetino {{ $t('products.v2.title') }}</h3>
                                <div class="mt-1 text-3xl font-black text-white">$60,000</div>
                            </div>

                            <ul class="mt-6 space-y-2.5 border-t border-t-blue/40 pt-4 text-xs leading-relaxed text-white">
                                <li class="flex items-center gap-2.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                                    <span>{{ $t('products.v2.comp.pv_leaves') }} <strong class="text-white">5.61 kWp TopCon</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                                    <span>{{ $t('products.v2.comp.wind_turbine') }} <strong class="text-white">6 kW (6× 1 kW kit)</strong></span>
                                </li>
                                <li class="flex items-center gap-2.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                                    <span>{{ $t('products.v2.comp.hybrid_op') }} <strong class="text-sky-300 font-bold">{{ $t('products.v2.comp.day_night') }}</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Technical Specifications Datasheet Table Section -->
        <section
            id="specifications"
            class="scroll-mt-24 border-t border-black/10 bg-white py-24 text-black dark:bg-black dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-12">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('products.datasheet.tag') }}</span
                    >
                    <h2 class="mt-2 text-4xl font-medium">
                        {{ $t('products.v2.numbers_title') }} (6 – 12 kW)
                    </h2>
                </div>

                <div
                    class="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                >
                    <table class="w-full text-left text-sm">
                        <tbody
                            class="divide-y divide-black/10 dark:divide-white/10"
                        >
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">{{ $t('products.datasheet.model') }}</td>
                                <td class="px-6 py-4 opacity-80">
                                    Treetino Strom V2 (Small Tree B2C)
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.power') }}
                                </td>
                                <td class="px-6 py-4 opacity-80 font-bold text-t-blue">
                                    {{ $t('products.v2.stats.1') }}
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.pv') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    61 {{ $t('products.v2.stats.2') }} × 12 V (830 × 340 mm, TopCon, 20.2 %)
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.wind') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    6 {{ $t('products.v2.stats.3') }} × 48 V (1.5 m / 1.0 m, 48 kg, 1 kW)
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.wind_speed') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    1,8 m/s / 13,8 m/s (21 %)
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.dimensions') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    5,0 m / {{ $t('products.v2.stats.6') }} (&lt; 1 m²)
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.v2.tech.item2_title') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_2months') }}
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.warranty_steel') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_steel_warranty') }}
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.warranty_pv') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_pv_warranty') }}
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.warranty_elec') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_elec_warranty') }}
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.cert') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    ČSN EN 1991-1-4, ČSN EN 61400-2, ČSN EN 1993-1-1, ČSN EN 62305, ČSN EN 61215, ČSN EN 61730
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Product Redirect / Navigation Section (Placed at the bottom) -->
        <section
            class="border-t border-black/10 bg-stone-50 py-20 text-black dark:border-white/10 dark:bg-zinc-950 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-8 text-center">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('products.portfolio.tag') }}</span
                    >
                    <h2 class="mt-2 text-3xl font-medium sm:text-4xl">
                        {{ $t('products.portfolio.title') }}
                    </h2>
                    <p class="mt-2 text-sm opacity-70">
                        {{ $t('products.portfolio.description') }}
                    </p>
                </div>

                <!-- Preview Image Container with rounded-3xl & border -->
                <div
                    class="relative aspect-3/2 overflow-hidden rounded-3xl border border-black/10 bg-stone-100 shadow-2xl lg:aspect-3/1 dark:border-white/10 dark:bg-stone-900"
                >
                    <img
                        :src="previewImage"
                        alt="Portfolio Treetino Strom V2"
                        class="h-full w-full object-cover transition-all duration-500"
                    />

                    <!-- Floating Navigation Pills -->
                    <div
                        class="absolute inset-x-0 bottom-6 flex justify-center px-6"
                    >
                        <div
                            class="inline-flex gap-2 rounded-full border border-black/10 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90"
                        >
                            <Link
                                :href="route('products.treeV1')"
                                @mouseenter="hoveredProduct = 'v1'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <span>{{ $t('products.v1.title') }}</span>
                                <ArrowRight class="h-3.5 w-3.5" />
                            </Link>

                            <Link
                                :href="route('products.treeV2')"
                                @mouseenter="hoveredProduct = 'v2'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full bg-t-blue px-5 py-2 text-xs font-medium text-white shadow-md sm:text-sm"
                            >
                                <span>{{ $t('products.v2.title') }}</span>
                            </Link>

                            <Link
                                :href="route('products.turbine')"
                                @mouseenter="hoveredProduct = 'turbine'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <span>{{ $t('products.turbine.title') }}</span>
                                <ArrowRight class="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Reused Shared HomeCtaGeneric Component with Prominent Configurator CTA Button -->
        <HomeCtaGeneric
            :title="$t('products.v2.cta_title')"
            :buttonText="$t('products.v2.configure_label')"
            :buttonHref="route('configurator.product', 'strom-v2')"
            image1="/img/stills/Still_Strom-v2.png"
            image2="/img/stills/SM-still.webp"
        />
    </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    ArrowRight,
    Clock,
    Cube,
    Flash,
    Home,
    Leaf,
    ShieldCheck,
    TwoPointsCircle,
    Wind,
} from '@iconoir/vue';
import { Head, Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const hoveredProduct = ref<string | null>(null);

const previewImage = computed(() => {
    const p = hoveredProduct.value || 'v2';
    if (p === 'v1') return '/img/info/night-detail-w.jpg';
    if (p === 'turbine') return '/img/info/info-turbine-w.webp';
    return '/img/info/info-strom-v2-w.webp';
});

const productStats = [
    {
        icon: Flash,
        value: '6 – 12 kW',
        valueKey: 'products.v2.stats_val.1',
        label: 'Celkový Výkon',
        description: '5,61 kWp FVE + 6 kW VTE kit',
        descriptionKey: 'products.v2.stats.1',
    },
    {
        icon: Leaf,
        value: '61 ks',
        valueKey: 'products.v2.stats_val.2',
        label: 'Solární listy',
        description: 'Zabere jen 1 m² trávníku',
        descriptionKey: 'products.v2.stats.2',
    },
    {
        icon: Wind,
        value: '6 ks',
        valueKey: 'products.v2.stats_val.3',
        label: 'Větrné turbíny',
        description: '6× tiché vertikální turbíny',
        descriptionKey: 'products.v2.stats.3',
    },
    {
        icon: ShieldCheck,
        value: 'Až 90 %',
        valueKey: 'products.v2.stats_val.4',
        label: 'Dotace & Podpory',
        description: 'Pro rodinné domy a vily',
        descriptionKey: 'products.v2.stats.4',
    },
    {
        icon: Clock,
        value: '2 měsíce',
        valueKey: 'products.v2.stats_val.5',
        label: 'Rychlost výstavby',
        description: 'Rychlá montáž za 1 den',
        descriptionKey: 'products.v2.stats.5',
    },
    {
        icon: TwoPointsCircle,
        value: '< 1 m²',
        valueKey: 'products.v2.stats_val.6',
        label: 'Zastavěná plocha',
        description: 'Průměr kmenu 0,6 m u paty',
        descriptionKey: 'products.v2.stats.6',
    },
];
</script>
