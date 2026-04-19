<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps({
    preorder: Object,
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const refreshPreorder = () => {
    // Only fetch preoprder prop
    router.reload({
        only: ['preorder'],
        onSuccess: () => {
            // If the status becomes 'paid', stop the interval
            if (props.preorder?.status === 'paid' && intervalId) {
                clearInterval(intervalId);
            }
        },
    });
};

onMounted(() => {
    // 1. Wait 3 seconds before starting the process
    setTimeout(() => {
        // If it's already paid, don't even start polling
        if (props.preorder?.status === 'paid') {
            return;
        }

        // 2. Perform the first refresh immediately after the 3s delay
        refreshPreorder();

        // 3. Set up the 1-second interval
        intervalId = setInterval(() => {
            if (props.preorder?.status !== 'paid') {
                refreshPreorder();
            } else {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }, 1000);
    }, 3000);
});

// 4. Clean up the interval when the user leaves the page
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<template>
    <DefaultLayout>
        <div class="buffer h-50 pb-12"></div>

        <div class="success relative">
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
            ></div>

            <div
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="pb-6">
                    <div class="text-6xl">Preorder Summary</div>

                    <div class="text-xs opacity-70">
                        Preorder ID: {{ preorder.uuid }}
                    </div>
                </div>

                <div class="pb-6">
                    <div
                        class="flex w-fit rounded-2xl border px-5 py-3 shadow-2xl"
                    >
                        <div
                            v-if="preorder.status === 'pending'"
                            class="flex gap-3"
                        >
                            <div class="relative my-auto">
                                <div
                                    class="absolute h-2 w-2 animate-ping rounded-full bg-orange-600"
                                ></div>
                                <div
                                    class="relative h-2 w-2 rounded-full bg-orange-600"
                                ></div>
                            </div>
                            <div class="text-sm text-orange-600">
                                Payment Pending
                            </div>
                        </div>

                        <div
                            v-else-if="preorder.status === 'paid'"
                            class="flex gap-3"
                        >
                            <div class="relative my-auto">
                                <div
                                    class="relative h-2 w-2 rounded-full bg-green-700"
                                ></div>
                            </div>
                            <div class="text-sm text-green-700">
                                Payment Successful
                            </div>
                        </div>
                    </div>
                </div>

                {{ preorder }}
            </div>
        </div>
    </DefaultLayout>
</template>
