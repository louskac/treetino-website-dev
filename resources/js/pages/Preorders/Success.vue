<script setup lang="ts">
import { Download } from '@iconoir/vue';
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PreviewImage from '@/custom/preorders/PreviewImage.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { PRODUCTS } from '@/types/products';

const { t } = useI18n();

type Preorder = {
    uuid: string;
    product_type: string;
    configuration: Record<string, unknown>;
    amount_total: number | null;
    created_at: string;
    status: string;
};

const props = defineProps<{ preorder: Preorder }>();

const product = computed(
    () => PRODUCTS.find((p) => p.id === props.preorder?.product_type) ?? null,
);

const localizedProductName = computed(() => {
    if (!product.value) return props.preorder?.product_type ?? '';
    return product.value.labelKey
        ? t(product.value.labelKey, product.value.label)
        : product.value.label;
});

// Fields to skip when value is empty/zero/false
const skipIfEmpty = new Set(['evChargerCount', 'bikeChargerRequested']);

const configurationRows = computed(() => {
    const cfg = props.preorder?.configuration;

    if (!cfg) {
        return [];
    }

    const getLabel = (key: string): string => {
        const labels: Record<string, string> = {
            color: t('configurator.steps.color', 'Barva konstrukce'),
            leafColor: t('configurator.steps.leaf_color', 'Barva listů'),
            fveLeafDesign: t('configurator.steps.fve_leaf', 'Design FVE listů'),
            connectivity: t('configurator.steps.connectivity', 'Konektivita'),
            battery: t('configurator.steps.battery', 'Baterie'),
            evChargerCount: t(
                'configurator.addons.ev.label',
                'Počet EV nabíječek',
            ),
            bikeChargerRequested: t(
                'configurator.addons.bike.label',
                'Nabíječka pro elektrokola',
            ),
            windTurbines: t(
                'configurator.steps.wind_turbines',
                'Větrné turbíny',
            ),
            turbineSize: t(
                'configurator.steps.turbine_size',
                'Velikost turbíny',
            ),
            turbineMount: t(
                'configurator.steps.turbine_mount',
                'Umístění turbíny',
            ),
            treeDesign: t('configurator.steps.tree_design', 'Design stromu'),
            grant: t('configurator.steps.grant', 'Dotační program'),
            paymentMode: t('configurator.steps.payment_mode', 'Způsob platby'),
        };
        return labels[key] ?? key;
    };

    const getValue = (key: string, val: unknown): string => {
        if (val === true) return t('common.actions.yes', 'Ano');
        if (val === false) return t('common.actions.no', 'Ne');

        const str = String(val);
        if (key === 'windTurbines') {
            if (str === 'with-turbines')
                return t(
                    'configurator.wind_turbines.with.label',
                    'S větrnými turbínami',
                );
            if (str === 'without-turbines')
                return t(
                    'configurator.wind_turbines.without.label',
                    'Bez větrných turbín',
                );
        }
        if (key === 'turbineSize') {
            if (str === 'large')
                return `${t('configurator.turbine_size.large.label', 'Velká')} (${t('configurator.turbine_size.large.power', '3 kW (2,8 m)')})`;
            if (str === 'medium')
                return `${t('configurator.turbine_size.medium.label', 'Střední')} (${t('configurator.turbine_size.medium.power', '2 kW (1,8 m)')})`;
            if (str === 'small')
                return `${t('configurator.turbine_size.small.label', 'Menší')} (${t('configurator.turbine_size.small.power', '1 kW (1,2 m)')})`;
        }
        if (key === 'turbineMount') {
            if (str === 'roof')
                return t('configurator.turbine_mount.roof.label', 'Na střechu');
            if (str === 'wall')
                return t('configurator.turbine_mount.wall.label', 'Na zeď');
            if (str === 'pole')
                return t('configurator.turbine_mount.pole.label', 'Na sloup');
        }
        if (key === 'treeDesign') {
            if (str === 'standard')
                return t(
                    'configurator.tree_design.standard.label',
                    'Standardní',
                );
            if (str === 'cyber')
                return t('configurator.tree_design.cyber.label', 'Cyber');
        }
        if (key === 'fveLeafDesign') {
            if (str === 'none')
                return t('configurator.fve_leaf.none.label', 'Bez designu');
            if (str === 'spring')
                return t('configurator.fve_leaf.spring.label', 'Jaro');
            if (str === 'summer')
                return t('configurator.fve_leaf.summer.label', 'Léto');
            if (str === 'autumn')
                return t('configurator.fve_leaf.autumn.label', 'Podzim');
            if (str === 'winter')
                return t('configurator.fve_leaf.winter.label', 'Zima');
        }
        if (key === 'paymentMode') {
            if (str === 'cash')
                return t('configurator.payment.cash', 'Hotovost');
            if (str === 'credit')
                return t('configurator.payment.credit', 'Zelený úvěr');
        }
        if (key === 'color' || key === 'leafColor') {
            const colorKeys: Record<string, string> = {
                white: t('configurator.color.white', 'Bílá'),
                silver: t('configurator.color.silver', 'Stříbrná'),
                brown: t('configurator.color.brown', 'Hnědá'),
                green: t('configurator.color.green', 'Lesní zelená'),
                'dark-green': t(
                    'configurator.color.dark_green',
                    'Tmavě zelená',
                ),
                grey: t('configurator.color.grey', 'Šedá'),
                orange: t('configurator.color.orange', 'Oranžová'),
                transparent: t('configurator.color.transparent', 'Průhledná'),
            };
            if (colorKeys[str]) return colorKeys[str];
        }

        return str;
    };

    return Object.entries(cfg)
        .filter(([key, value]) => {
            if (skipIfEmpty.has(key) && !value) {
                return false;
            }

            return true;
        })
        .map(([key, value]) => ({
            label: getLabel(key),
            value: getValue(key, value),
        }));
});

const formattedAmount = computed(() => {
    const amount = props.preorder?.amount_total;

    if (amount == null) {
        return '—';
    }

    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
    }).format(amount / 100);
});

const formattedDate = computed(() => {
    const date = props.preorder?.created_at;

    if (!date) {
        return '—';
    }

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
    <DefaultLayout :inverted="true">
        <div
            class="relative overflow-hidden bg-white pt-36 text-black sm:pt-44"
        >
            <div
                class="pointer-events-none absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-black/10 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            ></div>

            <main
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 text-black sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="pb-4.5">
                    <h1
                        class="text-4xl font-medium tracking-tight text-black sm:text-6xl"
                    >
                        {{ $t('preorders.title') }}
                    </h1>

                    <div class="mt-1 text-xs text-black/70">
                        ID: {{ preorder.uuid }}
                    </div>
                </div>

                <!-- Status + Invoice download Desktop -->
                <div class="hidden pb-6 sm:block">
                    <div class="flex gap-5">
                        <div
                            class="flex w-fit rounded-xl border border-black/10 bg-white px-5 py-3 shadow-xl"
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
                                <div
                                    class="text-sm font-medium text-orange-600"
                                >
                                    {{ $t('preorders.status.pending') }}
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
                                <div class="text-sm font-medium text-green-700">
                                    {{ $t('preorders.status.paid') }}
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
                                    class="flex cursor-pointer gap-2 text-black/70 transition-all hover:text-black hover:opacity-100 disabled:opacity-50"
                                >
                                    <div class="my-auto">
                                        <Download class="h-5 w-5" />
                                    </div>
                                    <div class="my-auto text-sm font-medium">
                                        <span v-if="isDownloading">{{
                                            $t('preorders.invoice.generating')
                                        }}</span>
                                        <span v-else>{{
                                            $t('preorders.invoice.download')
                                        }}</span>
                                    </div>
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Two-column layout -->
                <div class="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-2">
                    <!-- Left: Product image with name overlay -->
                    <div
                        class="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xl dark:bg-white/5"
                    >
                        <PreviewImage
                            :product-type="preorder.product_type"
                            :configuration="preorder.configuration"
                            :alt="localizedProductName"
                        />

                        <!-- Product name gradient bottom -->
                        <div
                            class="absolute bottom-0 h-35 w-full bg-linear-to-b from-transparent to-white"
                        ></div>

                        <!-- Product name overlay bottom-left -->
                        <div class="absolute bottom-0 left-0 p-6">
                            <div
                                class="text-5xl font-medium text-black md:text-6xl lg:text-5xl xl:text-6xl"
                            >
                                {{ localizedProductName }}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Order info + Configuration table -->
                    <div class="flex flex-col gap-6">
                        <!-- Order info -->
                        <div class="">
                            <h2 class="pb-4 text-3xl font-medium text-black">
                                {{ $t('preorders.order_info') }}
                            </h2>

                            <table class="w-full text-sm">
                                <tbody>
                                    <tr
                                        class="border-t border-black/10 first:border-t-0"
                                    >
                                        <td class="py-2 pr-6 text-black/60">
                                            {{ $t('preorders.created_at') }}
                                        </td>
                                        <td class="py-2 font-medium text-black">
                                            {{ formattedDate }}
                                        </td>
                                    </tr>

                                    <tr
                                        class="border-t border-black/10 first:border-t-0"
                                    >
                                        <td class="py-2 pr-6 text-black/60">
                                            {{ $t('preorders.total_price') }}
                                        </td>
                                        <td class="py-2 font-medium text-black">
                                            {{ formattedAmount }}
                                        </td>
                                    </tr>

                                    <tr
                                        class="border-t border-black/10 first:border-t-0"
                                    >
                                        <td class="py-2 pr-6 text-black/60">
                                            {{ $t('preorders.product') }}
                                        </td>
                                        <td class="py-2 font-medium text-black">
                                            {{ localizedProductName }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Configuration table -->
                        <div class="">
                            <h2 class="pb-4 text-3xl font-medium text-black">
                                {{ $t('preorders.configuration') }}
                            </h2>
                            <table class="w-full text-sm">
                                <tbody>
                                    <tr
                                        v-for="row in configurationRows"
                                        :key="row.label"
                                        class="border-t border-black/10 first:border-t-0"
                                    >
                                        <td class="py-2 pr-6 opacity-60">
                                            {{ row.label }}
                                        </td>
                                        <td class="py-2 font-medium">
                                            {{ row.value }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div
                                v-if="configurationRows.length === 0"
                                class="text-sm opacity-50"
                            >
                                {{ $t('preorders.no_configuration') }}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
