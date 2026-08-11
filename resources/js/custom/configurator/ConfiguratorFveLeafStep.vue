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

                <!-- Custom Image Upload & Mouse Drag-and-Drop Pad -->
                <div
                    v-if="option.isCustom && modelValue === 'custom'"
                    class="my-2 flex flex-col gap-3 rounded-lg border border-dashed border-black/20 bg-black/5 p-3 dark:border-white/20 dark:bg-white/5"
                >
                    <div v-if="rawUserImage" class="flex flex-col gap-2.5">
                        <!-- Header bar & Mapping Mode Switch -->
                        <div class="flex flex-col gap-1.5 border-b border-black/10 pb-2 dark:border-white/10">
                            <div class="flex items-center justify-between text-xs text-black/70 dark:text-white/70">
                                <span class="font-medium text-black dark:text-white">Režim mapování obrázku</span>
                                <span class="text-[11px] opacity-75">Přepínač stylu</span>
                            </div>
                            <div class="grid grid-cols-2 gap-1 rounded-lg bg-black/10 p-1 dark:bg-white/10">
                                <button
                                    type="button"
                                    @click="setMappingMode('branch')"
                                    class="rounded px-2 py-1.5 text-center text-xs font-medium transition-all"
                                    :class="mappingMode === 'branch'
                                        ? 'bg-white text-black shadow-sm dark:bg-black dark:text-white'
                                        : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'"
                                >
                                    Celá větev
                                </button>
                                <button
                                    type="button"
                                    @click="setMappingMode('individual')"
                                    class="rounded px-2 py-1.5 text-center text-xs font-medium transition-all"
                                    :class="mappingMode === 'individual'
                                        ? 'bg-white text-black shadow-sm dark:bg-black dark:text-white'
                                        : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'"
                                >
                                    Jednotlivé listy
                                </button>
                            </div>
                        </div>

                        <!-- Interactive Mouse Drag-and-Drop Viewport Pad -->
                        <div
                            ref="dragPad"
                            @mousedown="startDrag"
                            @touchstart.prevent="startTouchDrag"
                            @wheel.prevent="onWheelZoom"
                            class="group relative aspect-square w-full cursor-grab overflow-hidden rounded-md border border-black/15 bg-white select-none active:cursor-grabbing dark:border-white/15 dark:bg-black"
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
                                class="absolute inset-0 h-full w-full object-contain mix-blend-overlay opacity-75 pointer-events-none"
                            />

                            <!-- Drag Instruction Badge -->
                            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm opacity-90 transition-opacity group-hover:opacity-100">
                                <span>🖱️ Táhněte myší</span>
                                <span>🔍 Kolečko = Zoom ({{ Math.round(scale * 100) }}%)</span>
                            </div>

                            <!-- Quick Action Overlay Buttons -->
                            <div class="absolute top-2 right-2 flex items-center gap-1">
                                <button
                                    type="button"
                                    @click.stop="zoomIn"
                                    class="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white backdrop-blur-sm hover:bg-black/90"
                                    title="Přiblížit"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    @click.stop="zoomOut"
                                    class="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white backdrop-blur-sm hover:bg-black/90"
                                    title="Oddálit"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    @click.stop="resetPosition"
                                    class="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white backdrop-blur-sm hover:bg-black/90"
                                    title="Obnovit pozici"
                                >
                                    ↺
                                </button>
                            </div>
                        </div>

                        <!-- Photovoltaic Grid Undertone Control -->
                        <div class="mt-1 flex flex-col gap-1 text-xs">
                            <div class="flex items-center justify-between text-[11px] text-black/70 dark:text-white/70">
                                <span>Fotovoltaický vzor / Mřížka listů</span>
                                <span class="font-mono font-medium">{{ Math.round(pvOpacity * 100) }}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.05"
                                v-model.number="pvOpacity"
                                @input="updateMappedTexture"
                                class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-black/20 accent-black dark:bg-white/20 dark:accent-white"
                            />
                        </div>

                        <div class="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                @click="triggerFileInput"
                                class="text-[11px] font-medium text-black/70 underline hover:text-black dark:text-white/70 dark:hover:text-white"
                            >
                                Změnit fotku
                            </button>
                            <button
                                type="button"
                                @click="resetPosition"
                                class="text-[11px] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                            >
                                Vycentrovat
                            </button>
                        </div>
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
                        <span class="text-[10px] opacity-70">PNG, JPG, WebP (bude naneseno na listy)</span>
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
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
            rawUserImage.value = dataUrl;
            resetPosition();
        }
    };
    reader.readAsDataURL(file);
}
</script>
