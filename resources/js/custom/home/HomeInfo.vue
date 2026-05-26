<template>
    <section class="keypoints relative">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto max-w-[1400px] px-6 py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
                <div
                    class="relative aspect-square overflow-hidden rounded-2xl border bg-t-blue/5 shadow-xl sm:col-span-2"
                >
                    <img
                        src="/img/treetino-v1-isometric.png"
                        class="absolute bottom-0 h-full w-full object-cover"
                        alt=""
                    />
                </div>

                <div
                    class="w-full rounded-2xl border border-black bg-zinc-800 p-6 shadow-xl sm:col-span-2 dark:border-white dark:bg-zinc-200"
                >
                    <p class="text-2xl text-secondary">
                        In a world increasingly dependent on electricity, we're
                        developing a new way to integrate sustainable power
                    </p>
                </div>

                <div
                    class="col-span-2 flex w-full flex-col rounded-2xl border p-6 shadow-xl"
                >
                    <div class="">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white dark:text-primary"
                        >
                            <DesignPencil
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                    </div>
                    <h2 class="mt-4 text-3xl sm:text-4xl">Špičkový design</h2>
                    <p class="mt-2 mb-3">
                        Treetino je víc než elektrárna. Slouží jako sebevědomý
                        symbol udržitelnosti, se kterým firmy a instituce
                        elegantně naplní své ESG cíle.
                    </p>

                    <p>
                        Kombinace 300 solárních listů a transparentních turbín
                        obohacuje veřejný prostor. Zcela neslyšný chod umožňuje
                        bezpečnou integraci přímo mezi lidi.
                    </p>
                </div>

                <div
                    class="reveal reveal-right col-span-2 w-full rounded-2xl border p-6 shadow-xl"
                >
                    <div class="">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white dark:text-primary"
                        >
                            <Network
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                    </div>
                    <h2 class="mt-4 text-3xl sm:text-4xl">
                        Chytrý propojený les
                    </h2>
                    <p class="mt-2 mb-3">
                        Treetino tvoří inteligentní, propojený ekosystém.
                        Integrovaná AI v reálném čase maximalizuje energetický
                        výnos a autonomně řídí prediktivní údržbu.
                    </p>

                    <p>
                        Technologie blockchain umožňuje bezpečné a
                        automatizované sdílení energie s okolím. Definujeme tak
                        standardy pro novou, decentralizovanou energetiku.
                    </p>
                </div>
            </div>

            <div class="hidden grid-cols-3 gap-6 lg:grid">
                <div
                    ref="leftCardEl"
                    :style="{
                        transform: 'translateY(' + leftTranslateY + 'px)',
                    }"
                    class="mt-26"
                >
                    <div class="w-full rounded-2xl border p-6 shadow-xl">
                        <div class="">
                            <div
                                class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white dark:text-primary"
                            >
                                <DesignPencil
                                    stroke-width="1.5"
                                    class="mx-auto my-auto h-6 w-6"
                                />
                            </div>
                        </div>
                        <h2 class="mt-4 text-4xl">Špičkový design</h2>
                        <p class="mt-2 mb-3">
                            Treetino je víc než elektrárna. Slouží jako
                            sebevědomý symbol udržitelnosti, se kterým firmy a
                            instituce elegantně naplní své ESG cíle.
                        </p>

                        <p>
                            Kombinace 300 solárních listů a transparentních
                            turbín obohacuje veřejný prostor. Zcela neslyšný
                            chod umožňuje bezpečnou integraci přímo mezi lidi.
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        class="w-full rounded-2xl border border-black bg-zinc-800 p-6 shadow-xl dark:border-white dark:bg-zinc-200"
                    >
                        <p class="text-2xl text-secondary">
                            Vracíme energetickou stabilitu do vašich rukou.
                            <span class="opacity-70"
                                >Treetino je elegantní off-grid řešení pro
                                lokální nezávislost bez kompromisů.</span
                            >
                        </p>
                    </div>

                    <div
                        class="relative aspect-square overflow-hidden rounded-2xl border bg-t-blue/5 shadow-xl sm:col-span-2"
                    >
                        <img
                            src="/img/treetino-v1-isometric.png"
                            class="absolute bottom-0 h-full w-full object-cover"
                            alt=""
                        />
                    </div>
                </div>

                <div
                    ref="rightCardEl"
                    :style="{
                        transform: 'translateY(' + rightTranslateY + 'px)',
                    }"
                    class="mt-26"
                >
                    <div
                        class="reveal reveal-right w-full rounded-2xl border p-6 shadow-xl"
                    >
                        <div class="">
                            <div
                                class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white dark:text-primary"
                            >
                                <Network
                                    stroke-width="1.5"
                                    class="mx-auto my-auto h-6 w-6"
                                />
                            </div>
                        </div>
                        <h2 class="mt-4 text-4xl">Chytrý propojený les </h2>
                        <p class="mt-2 mb-3">
                            Treetino tvoří inteligentní, propojený ekosystém.
                            Integrovaná AI v reálném čase maximalizuje
                            energetický výnos a autonomně řídí prediktivní
                            údržbu.
                        </p>

                        <p>
                            Technologie blockchain umožňuje bezpečné a
                            automatizované sdílení energie s okolím. Definujeme
                            tak standardy pro novou, decentralizovanou
                            energetiku.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { DesignPencil, Network } from '@iconoir/vue';

import { useParallax } from '@/composables/useAnimations';

const { el: leftCardEl, translateY: leftTranslateY } = useParallax(0.3);
const { el: rightCardEl, translateY: rightTranslateY } = useParallax(0.3);
</script>
