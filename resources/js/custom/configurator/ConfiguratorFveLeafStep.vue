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
                    class="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-opacity duration-200"
                    :class="
                        modelValue === option.id
                            ? 'opacity-100'
                            : 'opacity-55 hover:opacity-100'
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
                                ? 'ring-2 ring-t-blue ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-black'
                                : '',
                        ]"
                        :style="!option.isCustom ? { background: option.swatch } : {}"
                    />
                    <span
                        class="flex-1 text-left text-sm text-black dark:text-white font-medium"
                    >
                        {{ $t(option.labelKey, option.label) }}
                    </span>
                    <span class="text-xs text-black/60 dark:text-white/60">
                        {{ option.priceKey ? $t(option.priceKey) : (option.price ?? $t('configurator.free')) }}
                    </span>
                </button>

                <!-- Custom Image Upload & Redesigned Interactive Editor Panel -->
                <div
                    v-if="option.isCustom && modelValue === 'custom'"
                    class="my-2.5 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/3 p-4 dark:border-white/10 dark:bg-white/4"
                >
                    <div v-if="rawUserImage" class="flex flex-col gap-3.5">
                        <!-- Mapping Mode Segmented Pill Switch -->
                        <div class="flex flex-col gap-1.5">
                            <span class="text-xs font-semibold text-black/80 dark:text-white/80">
                                Režim potisku listů
                            </span>
                            <div class="inline-flex w-full rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
                                <button
                                    type="button"
                                    @click="setMappingMode('branch')"
                                    class="flex-1 rounded-full py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer"
                                    :class="mappingMode === 'branch'
                                        ? 'bg-t-blue text-white shadow-xs'
                                        : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'"
                                >
                                    Celá větev
                                </button>
                                <button
                                    type="button"
                                    @click="setMappingMode('individual')"
                                    class="flex-1 rounded-full py-1.5 text-center text-xs font-semibold transition-all duration-200 cursor-pointer"
                                    :class="mappingMode === 'individual'
                                        ? 'bg-t-blue text-white shadow-xs'
                                        : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'"
                                >
                                    Jednotlivé listy
                                </button>
                            </div>
                        </div>

                        <!-- Interactive Viewport Drag Pad -->
                        <div
                            ref="dragPad"
                            @mousedown="startDrag"
                            @touchstart.prevent="startTouchDrag"
                            @wheel.prevent="onWheelZoom"
                            class="group relative aspect-square w-full cursor-grab overflow-hidden rounded-2xl border border-black/10 bg-stone-100 select-none active:cursor-grabbing dark:border-white/10 dark:bg-zinc-900/80 shadow-xs"
                        >
                            <!-- User Image inside Drag Pad (Branch Mode) -->
                            <img
                                v-if="mappingMode === 'branch'"
                                :src="rawUserImage"
                                alt="Vlastní obrázek"
                                class="absolute max-w-none pointer-events-none transition-transform duration-75"
                                :style="{
                                    width: (100 * scale) + '%',
                                    height: (100 * scale) + '%',
                                    left: (50 + posX - (50 * scale)) + '%',
                                    top: (50 + posY - (50 * scale)) + '%',
                                    objectFit: 'cover'
                                }"
                            />

                            <!-- Rendered Individual Leaves Preview inside Drag Pad (Individual Mode) -->
                            <img
                                v-else-if="customImage"
                                :src="customImage"
                                alt="Vlastní obrázek na listech"
                                class="absolute inset-0 h-full w-full object-contain pointer-events-none"
                            />

                            <!-- Leaf Contour Mask Overlay (Default Black PV Panel Grid) -->
                            <img
                                src="/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_black_pv_mask.png"
                                alt="FVE Listy vzor"
                                class="absolute inset-0 h-full w-full object-contain mix-blend-overlay opacity-70 pointer-events-none"
                            />

                            <!-- Floating Glassmorphic Top Controls -->
                            <div class="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-black/10 bg-white/85 p-1 backdrop-blur-md dark:border-white/10 dark:bg-black/85 shadow-xs">
                                <button
                                    type="button"
                                    @click.stop="zoomIn"
                                    class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-black hover:bg-t-blue hover:text-white dark:text-white transition-colors cursor-pointer"
                                    title="Přiblížit"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    @click.stop="zoomOut"
                                    class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-black hover:bg-t-blue hover:text-white dark:text-white transition-colors cursor-pointer"
                                    title="Oddálit"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    @click.stop="resetPosition"
                                    class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-black hover:bg-t-blue hover:text-white dark:text-white transition-colors cursor-pointer"
                                    title="Obnovit pozici"
                                >
                                    ↺
                                </button>
                            </div>

                            <!-- Floating Glassmorphic Bottom Badge -->
                            <div class="absolute bottom-3 inset-x-3 flex items-center justify-center">
                                <div class="rounded-full border border-black/10 bg-white/90 px-3.5 py-1 text-[11px] font-medium text-black/80 backdrop-blur-md dark:border-white/10 dark:bg-black/90 dark:text-white/80 shadow-xs">
                                    Táhněte myší pro posun • Zoom {{ Math.round(scale * 100) }}%
                                </div>
                            </div>
                        </div>

                        <!-- Photovoltaic Grid Undertone Control -->
                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center justify-between text-xs">
                                <span class="font-medium text-black/80 dark:text-white/80">Fotovoltaický vzor listů</span>
                                <span class="rounded-md bg-t-blue/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-t-blue dark:bg-white/10 dark:text-white">
                                    {{ Math.round(pvOpacity * 100) }}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.05"
                                v-model.number="pvOpacity"
                                @input="updateMappedTexture"
                                class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-t-blue dark:bg-white/15 dark:accent-t-blue"
                            />
                        </div>

                        <!-- Uploaded Photo Action Bar -->
                        <div class="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10">
                            <button
                                type="button"
                                @click="triggerFileInput"
                                class="text-xs font-semibold text-t-blue hover:underline cursor-pointer"
                            >
                                Změnit obrázek
                            </button>
                            <button
                                type="button"
                                @click="resetPosition"
                                class="text-xs text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white cursor-pointer"
                            >
                                Obnovit pozici
                            </button>
                        </div>
                    </div>

                    <!-- Empty Upload Dropzone -->
                    <div
                        v-else
                        @click="triggerFileInput"
                        class="flex cursor-pointer flex-col items-center justify-center gap-2.5 py-6 text-center transition-all hover:opacity-90"
                    >
                        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-t-blue/10 text-t-blue dark:bg-white/10 dark:text-white shadow-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-black dark:text-white">Nahrajte vlastní obrázek nebo vzor</p>
                            <p class="mt-0.5 text-[11px] text-black/55 dark:text-white/45">PNG, JPG, WebP — vytvořte unikátní solární listy</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
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
const dragPad = ref<HTMLElement | null>(null);

const rawUserImage = ref<string | null>(null);
const posX = ref(0);
const posY = ref(0);
const scale = ref(1.0);
const pvOpacity = ref(0.6);
const mappingMode = ref<'branch' | 'individual'>('branch');

let isDragging = false;
let startX = 0;
let startY = 0;
let startPosX = 0;
let startPosY = 0;

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
    if (id === 'custom' && !rawUserImage.value) {
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

function setMappingMode(mode: 'branch' | 'individual') {
    mappingMode.value = mode;
    updateMappedTexture();
}

async function updateMappedTexture() {
    if (!rawUserImage.value) return;
    const mappedTexture = await generateMappedLeafTexture(rawUserImage.value, {
        offsetX: posX.value,
        offsetY: posY.value,
        scale: scale.value,
        pvOpacity: pvOpacity.value,
        mappingMode: mappingMode.value,
    });
    emit('update:customImage', mappedTexture);
}

function resetPosition() {
    posX.value = 0;
    posY.value = 0;
    scale.value = 1.0;
    pvOpacity.value = 0.6;
    updateMappedTexture();
}

function zoomIn() {
    scale.value = Math.min(3.0, scale.value + 0.15);
    updateMappedTexture();
}

function zoomOut() {
    scale.value = Math.max(0.4, scale.value - 0.15);
    updateMappedTexture();
}

function onWheelZoom(event: WheelEvent) {
    const delta = event.deltaY < 0 ? 0.08 : -0.08;
    scale.value = Math.min(3.0, Math.max(0.4, scale.value + delta));
    updateMappedTexture();
}

/* Mouse Dragging Logic */
function startDrag(event: MouseEvent) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startPosX = posX.value;
    startPosY = posY.value;

    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', stopDrag);
}

function onDragMove(event: MouseEvent) {
    if (!isDragging || !dragPad.value) return;
    const rect = dragPad.value.getBoundingClientRect();
    const deltaX = ((event.clientX - startX) / rect.width) * 100;
    const deltaY = ((event.clientY - startY) / rect.height) * 100;

    posX.value = Math.min(60, Math.max(-60, Math.round(startPosX + deltaX)));
    posY.value = Math.min(60, Math.max(-60, Math.round(startPosY + deltaY)));

    updateMappedTexture();
}

function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', stopDrag);
}

/* Touch Dragging Logic */
function startTouchDrag(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) return;
    isDragging = true;
    startX = touch.clientX;
    startY = touch.clientY;
    startPosX = posX.value;
    startPosY = posY.value;

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', stopTouchDrag);
}

function onTouchMove(event: TouchEvent) {
    if (!isDragging || !dragPad.value) return;
    const touch = event.touches[0];
    if (!touch) return;
    const rect = dragPad.value.getBoundingClientRect();
    const deltaX = ((touch.clientX - startX) / rect.width) * 100;
    const deltaY = ((touch.clientY - startY) / rect.height) * 100;

    posX.value = Math.min(60, Math.max(-60, Math.round(startPosX + deltaX)));
    posY.value = Math.min(60, Math.max(-60, Math.round(startPosY + deltaY)));

    updateMappedTexture();
}

function stopTouchDrag() {
    isDragging = false;
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', stopTouchDrag);
}

onUnmounted(() => {
    stopDrag();
    stopTouchDrag();
});

async function onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const fileObj = target.files?.[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            rawUserImage.value = dataUrl;
            resetPosition();
        }
    };
    reader.readAsDataURL(fileObj);
}
</script>
