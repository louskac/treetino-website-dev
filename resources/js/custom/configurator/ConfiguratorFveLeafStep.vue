<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — {{ $t('configurator.steps.fve_leaf') }}
        </p>

        <!-- Hidden File Input for Custom Image Upload -->
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelected"
        />

        <div class="flex flex-col gap-1">
            <template v-for="option in visibleOptions" :key="option.id">
                <button
                    @click="selectOption(option.id)"
                    class="flex w-full items-center gap-3 rounded px-1 py-2 transition-opacity duration-200"
                    :class="
                        modelValue === option.id
                            ? 'opacity-100'
                            : 'opacity-50 hover:opacity-100'
                    "
                >
                    <!-- Design swatch -->
                    <div
                        class="h-6 w-6 shrink-0 rounded-full border border-black/15 transition-all duration-200 dark:border-white/15"
                        :class="[
                            option.isCustom
                                ? 'bg-[conic-gradient(from_180deg_at_50%_50%,#FF0000_0deg,#FFFF00_60deg,#00FF00_120deg,#00FFFF_180deg,#0000FF_240deg,#FF00FF_300deg,#FF0000_360deg)]'
                                : '',
                            modelValue === option.id
                                ? 'ring-2 ring-black ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-black'
                                : '',
                        ]"
                        :style="!option.isCustom ? { background: option.swatch } : {}"
                    />
                    <span
                        class="flex-1 text-left text-sm text-black dark:text-white"
                    >
                        {{ $t(option.labelKey, option.label) }}
                    </span>
                    <span class="text-xs text-black dark:text-white">
                        {{ option.priceKey ? $t(option.priceKey) : (option.price ?? $t('configurator.free')) }}
                    </span>
                </button>

                <!-- Custom Image Upload Section -->
                <div
                    v-if="option.isCustom && modelValue === 'custom'"
                    class="my-2 flex flex-col gap-3 rounded-lg border border-dashed border-black/20 bg-black/5 p-3 dark:border-white/20 dark:bg-white/5"
                >
                    <div v-if="customImage" class="flex items-center gap-3">
                        <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-black/15 bg-white dark:border-white/15 dark:bg-black">
                            <img :src="customImage" alt="Vlastní obrázek FVE listů" class="h-full w-full object-cover" />
                        </div>
                        <div class="flex-1 text-xs text-black/70 dark:text-white/70">
                            <p class="font-medium text-black dark:text-white">Vlastní fotka namapována</p>
                            <p class="text-[11px] opacity-75">Obrázek je nanesen na FVE listy</p>
                        </div>
                        <button
                            type="button"
                            @click="triggerFileInput"
                            class="rounded border border-black/20 px-2 py-1 text-xs font-medium text-black hover:bg-black/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                        >
                            Změnit
                        </button>
                    </div>

                    <div
                        v-else
                        @click="triggerFileInput"
                        class="flex cursor-pointer flex-col items-center justify-center gap-1.5 py-4 text-center text-xs text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
                    >
                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black dark:bg-white/10 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span class="font-medium">Nahrajte vlastní fotku nebo vzor</span>
                        <span class="text-[10px] opacity-70">PNG, JPG, WebP (bude namapováno na listy)</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStepFormatter } from '@/composables/useStepFormatter';
import { ProductId } from '@/types/products';
import { generateMappedLeafTexture } from './leafTextureMapper';

const props = defineProps<{
    modelValue: string;
    stepNumber: number;
    productId: string;
    customImage?: string | null;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'update:customImage': [value: string | null];
}>();

const { formatStep } = useStepFormatter();
const fileInput = ref<HTMLInputElement | null>(null);

interface FveLeafOption {
    id: string;
    label: string;
    labelKey: string;
    swatch: string;
    price: string | null;
    priceKey?: string;
    description: string;
    descKey: string;
    isCustom?: boolean;
}

const options: FveLeafOption[] = [
    {
        id: 'none',
        label: 'Bez designu',
        labelKey: 'configurator.fve_leaf.none.label',
        swatch: '#E5E7EB',
        price: null,
        description: 'FVE listy bez sezonního designu.',
        descKey: 'configurator.fve_leaf.none.desc',
    },
    {
        id: 'spring',
        label: 'Jaro',
        labelKey: 'configurator.fve_leaf.spring.label',
        swatch: 'linear-gradient(135deg, #E2F674 0%, #A3E635 50%, #4D7C0F 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro jarní variantu stromu.',
        descKey: 'configurator.fve_leaf.spring.desc',
    },
    {
        id: 'summer',
        label: 'Léto',
        labelKey: 'configurator.fve_leaf.summer.label',
        swatch: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #064E3B 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro letní variantu stromu.',
        descKey: 'configurator.fve_leaf.summer.desc',
    },
    {
        id: 'autumn',
        label: 'Podzim',
        labelKey: 'configurator.fve_leaf.autumn.label',
        swatch: 'linear-gradient(135deg, #F2B84B 0%, #C85D2A 50%, #7A3B20 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro podzimní variantu stromu.',
        descKey: 'configurator.fve_leaf.autumn.desc',
    },
    {
        id: 'winter',
        label: 'Zima',
        labelKey: 'configurator.fve_leaf.winter.label',
        swatch: 'linear-gradient(135deg, #F3F7FA 0%, #B8D1E0 50%, #6E8798 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro zimní variantu stromu.',
        descKey: 'configurator.fve_leaf.winter.desc',
    },
    {
        id: 'custom',
        label: 'Na míru',
        labelKey: 'configurator.fve_leaf.custom.label',
        swatch: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FFFF00 60deg, #00FF00 120deg, #00FFFF 180deg, #0000FF 240deg, #FF00FF 300deg, #FF0000 360deg)',
        price: 'Individuální',
        priceKey: 'configurator.price.individual',
        description: 'Nahrajte vlastní fotku nebo grafiku pro potisk FVE listů.',
        descKey: 'configurator.fve_leaf.custom.desc',
        isCustom: true,
    },
];

const visibleOptions = computed(() =>
    props.productId === ProductId.StromV1
        ? options
        : options.filter((option) => option.id !== 'none'),
);

function selectOption(id: string) {
    emit('update:modelValue', id);
    if (id === 'custom' && !props.customImage) {
        triggerFileInput();
    }
}

function triggerFileInput() {
    const el = Array.isArray(fileInput.value)
        ? (fileInput.value[0] as HTMLInputElement | undefined)
        : fileInput.value;
    if (el && typeof el.click === 'function') {
        el.click();
    }
}

async function onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            const mappedTexture = await generateMappedLeafTexture(dataUrl);
            emit('update:customImage', mappedTexture);
        }
    };
    reader.readAsDataURL(file);
}
</script>
