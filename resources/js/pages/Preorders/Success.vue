<script setup lang="ts">
import { Download } from '@iconoir/vue';
import { router } from '@inertiajs/vue3';
import { onMounted, onUnmounted, computed } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import axios from 'axios';
import { ref } from 'vue';
import { PRODUCTS } from '@/types/products';

const props = defineProps({
    preorder: Object,
});

const product = computed(() =>
    PRODUCTS.find((p) => p.id === props.preorder?.product_type) ?? null,
);

const productImageSrc = computed(() => {
    const type = props.preorder?.product_type;
    const color = props.preorder?.configuration?.color ?? 'green';
    if (!type) return null;
    return `/img/config-images/${type}/color/color_${color}.webp`;
});

const configurationLabels: Record<string, string> = {
    color: 'Barva',
    leafColor: 'Barva listů',
    connectivity: 'Konektivita',
    battery: 'Baterie',
    evChargerCount: 'Počet EV nabíječek',
    bikeChargerRequested: 'Nabíječka na kolo',
};

const configurationRows = computed(() => {
    const cfg = props.preorder?.configuration;
    if (!cfg) return [];
    return Object.entries(cfg).map(([key, value]) => ({
        label: configurationLabels[key] ?? key,
        value: value === true ? 'Ano' : value === false ? 'Ne' : String(value),
    }));
});

const formattedAmount = computed(() => {
    const amount = props.preorder?.amount_total;
    if (amount == null) return '—';
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
    }).format(amount / 100);
});

const formattedDate = computed(() => {
    const date = props.preorder?.created_at;
    if (!date) return '—';
    return new Intl.DateTimeFormat('cs-CZ', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(date));
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

const isDownloading = ref(false);

const downloadInvoice = async () => {
    isDownloading.value = true;

    try {
        const response = await axios({
            url: '/preorders/invoice', // Make sure this matches your route path
            method: 'POST',
            data: {
                uuid: props.preorder.uuid,
            },
            responseType: 'blob', // CRITICAL: This tells axios to treat response as binary
        });

        // 1. Create a URL for the binary data
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // 2. Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${props.preorder.uuid}.pdf`);

        // 3. Append to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 4. Clean up the URL object
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Could not download invoice. Please try again.');
    } finally {
        isDownloading.value = false;
    }
};
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

                <!-- Status + Invoice download -->
                <div class="pb-6">
                    <div class="flex gap-5">
                        <div
                            class="flex w-fit rounded-xl border px-5 py-3 shadow-2xl"
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

                        <Transition>
                            <div
                                class="relative my-auto"
                                v-if="preorder.status === 'paid'"
                            >
                                <button
                                    @click="downloadInvoice"
                                    :disabled="isDownloading"
                                    class="flex cursor-pointer gap-2 opacity-70 transition-all hover:opacity-100 disabled:opacity-50"
                                >
                                    <div class="my-auto">
                                        <Download class="h-5 w-5" />
                                    </div>
                                    <div class="my-auto text-sm">
                                        <span v-if="isDownloading"
                                            >Generating...</span
                                        >
                                        <span v-else>Download Invoice</span>
                                    </div>
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Two-column layout -->
                <div class="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-2">

                    <!-- Left: Product image with name overlay -->
                    <div class="relative aspect-square overflow-hidden rounded-2xl border bg-black/5 dark:bg-white/5">
                        <img
                            v-if="productImageSrc"
                            :src="productImageSrc"
                            :alt="product?.label ?? preorder.product_type"
                            class="h-full w-full object-contain"
                        />
                        <!-- Product name overlay bottom-left -->
                        <div class="absolute bottom-0 left-0 p-5">
                            <div class="text-2xl font-semibold drop-shadow-lg">
                                {{ product?.label ?? preorder.product_type }}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Order info + Configuration table -->
                    <div class="flex flex-col gap-6">

                        <!-- Order info -->
                        <div class="rounded-2xl border p-6">
                            <div class="pb-4 text-lg font-semibold">Informace o objednávce</div>
                            <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                                <dt class="opacity-60">Datum vytvoření</dt>
                                <dd>{{ formattedDate }}</dd>

                                <dt class="opacity-60">Celková cena</dt>
                                <dd>{{ formattedAmount }}</dd>

                                <dt class="opacity-60">Produkt</dt>
                                <dd>{{ product?.label ?? preorder.product_type }}</dd>
                            </dl>
                        </div>

                        <!-- Configuration table -->
                        <div class="rounded-2xl border p-6">
                            <div class="pb-4 text-lg font-semibold">Konfigurace</div>
                            <table class="w-full text-sm">
                                <tbody>
                                    <tr
                                        v-for="row in configurationRows"
                                        :key="row.label"
                                        class="border-t first:border-t-0"
                                    >
                                        <td class="py-2 pr-6 opacity-60">{{ row.label }}</td>
                                        <td class="py-2 font-medium">{{ row.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="configurationRows.length === 0" class="text-sm opacity-50">
                                Žádná konfigurace
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 200ms ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
