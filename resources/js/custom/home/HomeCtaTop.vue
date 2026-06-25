<template>
    <section class="top-cta relative w-full">
        <div
            class="absolute h-1/2 w-full bg-linear-to-b from-black to-transparent"
        ></div>

        <!--        <div-->
        <!--            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"-->
        <!--        ></div>-->

        <div
            class="relative mx-auto max-w-[1400px] px-6 pt-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div
                    class="group relative flex aspect-4/5 flex-col rounded-2xl border border-zinc-600/5 bg-white/70 p-6 backdrop-blur-2xl"
                >
                    <div
                        class="absolute top-0 left-0 h-full w-full overflow-clip rounded-2xl"
                    >
                        <img
                            class="rounded-2xl transition-all duration-600 group-hover:scale-110"
                            src="/img/stills/LG-still.webp"
                            alt=""
                        />
                    </div>

                    <div
                        class="absolute bottom-0 left-0 h-50 w-full rounded-b-2xl bg-linear-to-b from-transparent to-black to-50%"
                    ></div>

                    <div class="relative mt-auto text-white">
                        <div class="relative mb-4 text-4xl">Treetino v1</div>

                        <div class="grid grid-cols-2 gap-2">
                            <ButtonPrimary
                                :href="
                                    route('configurator.product', 'strom-v1')
                                "
                                class="text-center"
                                >{{
                                    $t('common.actions.configure')
                                }}</ButtonPrimary
                            >
                            <ButtonWhite>{{
                                $t('common.actions.how')
                            }}</ButtonWhite>
                        </div>
                    </div>
                </div>

                <div
                    class="group relative flex aspect-4/5 flex-col rounded-2xl border border-zinc-500/20 bg-white/70 p-6 backdrop-blur-2xl"
                >
                    <div
                        class="absolute top-0 left-0 h-full w-full overflow-clip rounded-2xl"
                    >
                        <img
                            class="rounded-2xl transition-all duration-600 group-hover:scale-110"
                            src="/img/stills/SM-still.webp"
                            alt=""
                        />
                    </div>

                    <div
                        class="absolute bottom-0 left-0 h-50 w-full rounded-b-2xl bg-linear-to-b from-transparent to-black to-50%"
                    ></div>

                    <div class="relative mt-auto text-white">
                        <div class="relative mb-4 text-4xl">Treetino v2</div>

                        <div class="grid">
                            <ButtonPrimary
                                :href="
                                    route('configurator.product', 'strom-v2')
                                "
                                class="text-center"
                            >
                                {{
                                    $t('common.actions.configure')
                                }}</ButtonPrimary
                            >
                        </div>
                    </div>
                </div>

                <div
                    class="group relative flex aspect-4/5 flex-col rounded-2xl border border-zinc-500/20 bg-white/70 p-6 backdrop-blur-2xl"
                >
                    <div
                        class="absolute top-0 left-0 h-full w-full overflow-clip rounded-2xl"
                    >
                        <img
                            class="rounded-2xl transition-all duration-600 group-hover:scale-110"
                            src="/img/stills/Still_Turbina.png"
                            alt=""
                        />
                    </div>

                    <div
                        class="absolute bottom-0 left-0 h-50 w-full rounded-b-2xl bg-linear-to-b from-transparent to-black to-50%"
                    ></div>

                    <div class="relative mt-auto text-white">
                        <div class="relative mb-4 text-4xl">
                            Treetino Turbine
                        </div>

                        <div class="grid">
                            <ButtonPrimary
                                :href="route('configurator.product', 'turbina')"
                                class="text-center"
                                >{{
                                    $t('common.actions.configure')
                                }}</ButtonPrimary
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--        OLDER -->
        <!--        <div-->
        <!--            class="sm:px-0 pt-6 relative mx-auto max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"-->
        <!--        >-->
        <!--            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">-->
        <!--                <div-->
        <!--                    class="group flex aspect-square flex-col overflow-clip rounded-2xl border bg-white/70 p-8 backdrop-blur-xl transition-all hover:p-10 sm:aspect-5/4 md:aspect-2/1 lg:aspect-square xl:aspect-3/2"-->
        <!--                >-->
        <!--                    <div-->
        <!--                        class="absolute -bottom-16 -left-16 h-[100%] w-[100%] transition-all group-hover:h-110 group-hover:w-110 sm:h-80 sm:w-80 lg:h-90 lg:w-90 xl:h-110 xl:w-110 xl:group-hover:h-115 xl:group-hover:w-115"-->
        <!--                    >-->
        <!--                        <img-->
        <!--                            class="w-full"-->
        <!--                            src="/img/treetino-vrstevnice.png"-->
        <!--                            alt=""-->
        <!--                        />-->
        <!--                    </div>-->

        <!--                    <div-->
        <!--                        class="relative z-10 flex items-center justify-between"-->
        <!--                    >-->
        <!--                        <span-->
        <!--                            class="text-xs font-semibold tracking-[0.2em] text-black/60 uppercase"-->
        <!--                            >Space</span-->
        <!--                        >-->
        <!--                        <span-->
        <!--                            class="text-xs font-medium tracking-widest text-black/60"-->
        <!--                        >-->
        <!--                            <InfoCircle class="h-4 w-4" stroke-width="3" />-->
        <!--                        </span>-->
        <!--                    </div>-->

        <!--                    <div class="relative mt-3 text-4xl">-->
        <!--                        Proměňte prázdná Místa v&nbsp;Aktiva-->
        <!--                    </div>-->

        <!--                    <div class="relative mt-auto flex justify-end md:hidden">-->
        <!--                        <ButtonPrimary :href="route('configurator')"-->
        <!--                            >Konfigurovat</ButtonPrimary-->
        <!--                        >-->
        <!--                    </div>-->

        <!--                    <div-->
        <!--                        class="relative mt-auto hidden w-full justify-end gap-2 lg:flex"-->
        <!--                    >-->
        <!--                        <div-->
        <!--                            class="opacity-0 transition-all group-hover:opacity-100"-->
        <!--                        >-->
        <!--                            <ButtonPrimary :href="route('configurator')"-->
        <!--                                >Konfigurovat</ButtonPrimary-->
        <!--                            >-->
        <!--                        </div>-->
        <!--                        <div class="">-->
        <!--                            <div-->
        <!--                                class="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-800/15 bg-blue-200/10 lg:h-12 lg:w-12"-->
        <!--                            >-->
        <!--                                <FastArrowRight class="h-5 w-5" />-->
        <!--                            </div>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->

        <!--                <div-->
        <!--                    class="group flex aspect-square flex-col overflow-clip rounded-2xl bg-linear-to-br from-t-blue to-t-dark p-8 text-white backdrop-blur-xl transition-all hover:p-10 sm:aspect-5/4 md:aspect-2/1 lg:aspect-square xl:aspect-3/2"-->
        <!--                >-->
        <!--                    <div-->
        <!--                        class="absolute -bottom-16 -left-16 h-[100%] w-[100%] transition-all group-hover:h-110 group-hover:w-110 sm:h-80 sm:w-80 lg:h-90 lg:w-90 xl:h-110 xl:w-110 xl:group-hover:h-115 xl:group-hover:w-115"-->
        <!--                    >-->
        <!--                        <img-->
        <!--                            class="w-full"-->
        <!--                            src="/img/treetino-v1-isometric.png"-->
        <!--                            alt=""-->
        <!--                        />-->
        <!--                    </div>-->

        <!--                    <div-->
        <!--                        class="relative z-10 flex items-center justify-between"-->
        <!--                    >-->
        <!--                        <span-->
        <!--                            class="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase"-->
        <!--                            >Technologies</span-->
        <!--                        >-->
        <!--                        <span-->
        <!--                            class="text-xs font-medium tracking-widest text-white/30"-->
        <!--                        >-->
        <!--                            <InfoCircle class="h-4 w-4" stroke-width="3" />-->
        <!--                        </span>-->
        <!--                    </div>-->

        <!--                    <div class="relative mt-3 text-4xl">-->
        <!--                        Objevte Technologie Treetino-->
        <!--                    </div>-->

        <!--                    <div class="relative mt-auto flex justify-end md:hidden">-->
        <!--                        <ButtonWhite>Jak to Funguje?</ButtonWhite>-->
        <!--                    </div>-->

        <!--                    <div-->
        <!--                        class="relative mt-auto hidden w-full justify-end gap-2 lg:flex"-->
        <!--                    >-->
        <!--                        <div-->
        <!--                            class="opacity-0 transition-all group-hover:opacity-100"-->
        <!--                        >-->
        <!--                            <ButtonWhite>Jak to Funguje?</ButtonWhite>-->
        <!--                        </div>-->
        <!--                        <div class="">-->
        <!--                            <div-->
        <!--                                class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 lg:h-12 lg:w-12"-->
        <!--                            >-->
        <!--                                <FastArrowRight class="h-5 w-5" />-->
        <!--                            </div>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->

        <!--        OLDEST-->
        <!--                <div-->
        <!--                    class="relative mx-auto flex h-200 w-full max-w-[1400px] justify-end py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"-->
        <!--                >-->
        <!--                    <div class="relative mt-auto">-->
        <!--                        <div-->
        <!--                            class="mx-6 flex flex-col gap-6 rounded-2xl border border-black/20 bg-black/5 p-6 backdrop-blur-2xl dark:border-white/20 dark:bg-white/5"-->
        <!--                        >-->
        <!--                            <h2 class="text-right text-4xl md:text-6xl">-->
        <!--                                Turn your empty space <br />-->
        <!--                                into an asset.-->
        <!--                                <span class="text-t-blue">With Treetino</span>-->
        <!--                            </h2>-->
        <!--                            <div class="flex flex-col justify-end gap-3 sm:flex-row">-->
        <!--                                <div class="w-full md:w-fit">-->
        <!--                                    <ButtonPrimary class="w-full text-center md:w-fit"-->
        <!--                                        >Předobjednat</ButtonPrimary-->
        <!--                                    >-->
        <!--                                </div>-->

        <!--                                <div class="w-full md:w-fit">-->
        <!--                                    <ButtonSecondary class="w-full text-center md:w-fit"-->
        <!--                                        >Objevit technologie</ButtonSecondary-->
        <!--                                    >-->
        <!--                                </div>-->
        <!--                            </div>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import { InfoCircle, FastArrowRight } from '@iconoir/vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';

const videoRefs = ref<HTMLVideoElement[]>([]);

onMounted(() => {
    // Programmatically play all videos concurrently to ensure mobile compatibility
    videoRefs.value.forEach((video) => {
        if (video) {
            video
                .play()
                .catch((err) => console.warn('Video play blocked:', err));
        }
    });
});
</script>
