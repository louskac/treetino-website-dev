<script setup lang="ts"></script>

<template>
    <section class="cta-generic relative h-180 overflow-hidden bg-t-blue">
        <div
            class="bg absolute inset-0 overflow-hidden bg-t-dark opacity-20 mix-blend-screen saturate-0"
        >
            <img
                src="/img/cta/cta-pos-1.webp"
                alt=""
                class="cta-slide cta-slide-first absolute inset-0 h-full w-full object-cover"
            />

            <img
                src="/img/cta/cta-pos-2.webp"
                alt=""
                class="cta-slide cta-slide-second absolute inset-0 h-full w-full object-cover"
            />
        </div>

        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto h-full w-full max-w-[1200px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex h-full w-full p-6">
                <div class="mx-auto my-auto text-white">
                    <h1
                        class="text-center text-6xl leading-17"
                        v-html="$t('home.cta.generic')"
                    ></h1>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.cta-slide {
    opacity: 0;
    transform: scale(1);
    animation: cta-slideshow 6s linear infinite;
    will-change: opacity, transform;
}

.cta-slide-first {
    animation-delay: 0s;
}

.cta-slide-second {
    animation-delay: -3s;
}

@keyframes cta-slideshow {
    0% {
        opacity: 0;
        transform: scale(1);
    }

    8% {
        opacity: 1;
    }

    42% {
        opacity: 1;
    }

    50% {
        opacity: 0;
        transform: scale(1.08);
    }

    100% {
        opacity: 0;
        transform: scale(1.08);
    }
}

@media (prefers-reduced-motion: reduce) {
    .cta-slide {
        animation: none;
        transform: none;
    }

    .cta-slide-first {
        opacity: 1;
    }

    .cta-slide-second {
        opacity: 0;
    }
}
</style>
