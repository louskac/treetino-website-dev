<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    acceptCategory,
    hide,
    validCookie,
    showPreferences,
} from 'vanilla-cookieconsent';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';

import { CheckCircle, XmarkCircle, Settings } from '@iconoir/vue';

const isVisible = ref(false);

onMounted(() => {
    // If the 'cc_cookie' is NOT valid (meaning no consent given yet), show our banner
    if (!validCookie('cc_cookie')) {
        isVisible.value = true;
    }
});

const handleAcceptAll = () => {
    acceptCategory('all'); // Logic: save all cookies
    isVisible.value = false;
};

const handleRejectAll = () => {
    acceptCategory([]); // Logic: save only 'necessary'
    isVisible.value = false;
};

const handleOpenSettings = () => {
    showPreferences(); // This opens the library's built-in settings modal
};
</script>

<template>
    <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform translate-y-20 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="isVisible"
            class="fixed bottom-6 left-1/2 z-[9999] mx-auto flex max-w-[1400px] -translate-x-1/2 justify-end sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="w-fit rounded-2xl border bg-white/80 p-3 backdrop-blur-2xl"
            >
                <div class="flex flex-col gap-4 p-2 md:hidden">
                    <div class="my-auto">Our Site Uses Cookies</div>
                    <div class="flex gap-2">
                        <div class="">
                            <ButtonPrimary
                                class="cursor-pointer"
                                @click="handleAcceptAll"
                            >
                                <CheckCircle class="my-auto h-5 w-5" />
                            </ButtonPrimary>
                        </div>
                        <div class="">
                            <ButtonSecondary
                                class="cursor-pointer"
                                @click="handleRejectAll"
                            >
                                <XmarkCircle class="my-auto h-5 w-5" />
                            </ButtonSecondary>
                        </div>
                        <div class="flex">
                            <div
                                class="flex h-full cursor-pointer rounded-xl bg-black px-5 text-white"
                                @click="handleOpenSettings"
                            >
                                <Settings class="my-auto h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hidden gap-2 md:flex">
                    <div class="my-auto px-3">Our Site Uses Cookies</div>
                    <div class="">
                        <ButtonPrimary
                            class="cursor-pointer"
                            @click="handleAcceptAll"
                        >
                            Accept all
                        </ButtonPrimary>
                    </div>
                    <div class="">
                        <ButtonSecondary
                            class="cursor-pointer"
                            @click="handleRejectAll"
                        >
                            Reject All
                        </ButtonSecondary>
                    </div>
                    <div class="flex">
                        <div
                            class="flex h-full cursor-pointer rounded-xl bg-black px-3.5 text-white"
                            @click="handleOpenSettings"
                        >
                            <Settings class="my-auto h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            <!--            &lt;!&ndash; DESIGN YOUR COMPONENT HERE &ndash;&gt;-->
            <!--            <div-->
            <!--                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:bg-gray-800"-->
            <!--            >-->
            <!--                <h2 class="text-lg font-bold text-gray-900 dark:text-white">-->
            <!--                    Cookie Consent-->
            <!--                </h2>-->
            <!--                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">-->
            <!--                    We use cookies to improve your experience. You can manage-->
            <!--                    your preferences at any time.-->
            <!--                </p>-->

            <!--                <div class="mt-6 flex flex-col gap-2">-->
            <!--                    <button-->
            <!--                        @click="handleAcceptAll"-->
            <!--                        class="w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"-->
            <!--                    >-->
            <!--                        Accept all-->
            <!--                    </button>-->

            <!--                    <div class="flex gap-2">-->
            <!--                        <button-->
            <!--                            @click="handleRejectAll"-->
            <!--                            class="flex-1 rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"-->
            <!--                        >-->
            <!--                            Reject all-->
            <!--                        </button>-->
            <!--                        <button-->
            <!--                            @click="handleOpenSettings"-->
            <!--                            class="flex-1 rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"-->
            <!--                        >-->
            <!--                            Settings-->
            <!--                        </button>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
    </Transition>
</template>
