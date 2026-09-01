<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} —
            {{ $t('configurator.steps.fve_leaf', 'Design FVE listů') }}
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
                        :style="
                            !option.isCustom
                                ? { background: option.swatch }
                                : {}
                        "
                    />
                    <span
                        class="flex-1 text-left text-sm font-medium text-black dark:text-white"
                    >
                        {{ $t(option.labelKey, option.label) }}
                    </span>
                    <span class="text-xs text-black/60 dark:text-white/60">
                        {{
                            option.priceKey
                                ? $t(option.priceKey)
                                : (option.price ?? $t('configurator.free'))
                        }}
                    </span>
                </button>

                <!-- Custom Image Upload & Interactive Editor Panel -->
                <div
                    v-if="option.isCustom && modelValue === 'custom'"
                    class="my-2.5 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/3 p-4 dark:border-white/10 dark:bg-white/4"
                >
                    <div v-if="rawUserImage" class="flex flex-col gap-3.5">
                        <!-- Mapping Mode Segmented Pill Switch -->
                        <div class="flex flex-col gap-1.5">
                            <span
                                class="text-xs font-semibold text-black/80 dark:text-white/80"
                            >
                                {{
                                    $t(
                                        'configurator.fve_leaf.custom.mode_title',
                                        'Režim potisku listů',
                                    )
                                }}
                            </span>
                            <div
                                class="inline-flex w-full rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5"
                            >
                                <button
                                    type="button"
                                    @click="setMappingMode('branch')"
                                    class="flex-1 cursor-pointer rounded-full py-1.5 text-center text-xs font-semibold transition-all duration-200"
                                    :class="
                                        mappingMode === 'branch'
                                            ? 'bg-t-blue text-white shadow-xs'
                                            : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                                    "
                                >
                                    {{
                                        $t(
                                            'configurator.fve_leaf.custom.mode_branch',
                                            'Celá větev',
                                        )
                                    }}
                                </button>
                                <button
                                    type="button"
                                    @click="setMappingMode('individual')"
                                    class="flex-1 cursor-pointer rounded-full py-1.5 text-center text-xs font-semibold transition-all duration-200"
                                    :class="
                                        mappingMode === 'individual'
                                            ? 'bg-t-blue text-white shadow-xs'
                                            : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                                    "
                                >
                                    {{
                                        $t(
                                            'configurator.fve_leaf.custom.mode_individual',
                                            'Jednotlivé listy',
                                        )
                                    }}
                                </button>
                            </div>
                        </div>

                        <!-- Interactive Viewport Drag Pad (Focused & Enlarged PV Leaves) -->
                        <div
                            ref="dragPad"
                            @mousedown.prevent="startDrag"
                            @touchstart="onTouchStart"
                            @wheel.prevent="onWheelZoom"
                            class="group relative aspect-square w-full cursor-grab overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-stone-50 to-stone-100 shadow-sm select-none active:cursor-grabbing sm:aspect-[4/3] dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950"
                        >
                            <!-- Rendered Mapped Leaf Texture (Exact 5 Leaves Framed Viewport) -->
                            <img
                                v-if="editorImage"
                                :src="editorImage"
                                :alt="
                                    $t(
                                        'configurator.fve_leaf.custom.alt',
                                        'Vlastní potisk FVE listů',
                                    )
                                "
                                class="pointer-events-none absolute inset-0 h-full w-full object-contain p-3"
                            />

                            <!-- Prominent Glassmorphic Controls Toolbar -->
                            <div
                                class="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-md backdrop-blur-md dark:border-white/15 dark:bg-black/85"
                            >
                                <button
                                    type="button"
                                    @click.stop="zoomIn"
                                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-black/5 font-semibold text-black shadow-2xs transition-all hover:bg-t-blue hover:text-white active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-t-blue"
                                    :title="
                                        $t(
                                            'configurator.fve_leaf.custom.zoom_in',
                                            'Přiblížit',
                                        )
                                    "
                                >
                                    <ZoomIn class="h-4.5 w-4.5" />
                                </button>
                                <button
                                    type="button"
                                    @click.stop="zoomOut"
                                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-black/5 font-semibold text-black shadow-2xs transition-all hover:bg-t-blue hover:text-white active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-t-blue"
                                    :title="
                                        $t(
                                            'configurator.fve_leaf.custom.zoom_out',
                                            'Oddálit',
                                        )
                                    "
                                >
                                    <ZoomOut class="h-4.5 w-4.5" />
                                </button>
                                <button
                                    type="button"
                                    @click.stop="resetPosition"
                                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-black/5 text-black shadow-2xs transition-all hover:bg-t-blue hover:text-white active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-t-blue"
                                    :title="
                                        $t(
                                            'configurator.fve_leaf.custom.reset_pos',
                                            'Vycentrovat fotku',
                                        )
                                    "
                                >
                                    <RotateCcw class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Non-Intrusive Helper Instruction Bar (Placed below dragPad so leaves are 100% uncovered) -->
                        <div
                            class="flex items-center justify-between px-1 text-xs text-black/60 dark:text-white/60"
                        >
                            <span class="flex items-center gap-1.5">
                                <span>{{
                                    $t(
                                        'configurator.fve_leaf.drag_instruction',
                                        'Táhněte pro posun • Pinch / Kolečko pro zoom',
                                    )
                                }}</span>
                            </span>
                            <span
                                class="rounded-full bg-t-blue/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-t-blue dark:bg-blue-400/15 dark:text-blue-400"
                            >
                                {{ Math.round(scale * 100) }}%
                            </span>
                        </div>

                        <!-- Uploaded Photo Action Bar -->
                        <div
                            class="flex items-center justify-between border-t border-black/10 pt-1 dark:border-white/10"
                        >
                            <button
                                type="button"
                                @click="triggerFileInput"
                                class="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-t-blue hover:underline"
                            >
                                <Upload class="h-3.5 w-3.5" />
                                {{
                                    $t(
                                        'configurator.fve_leaf.custom.change_image',
                                        'Změnit obrázek',
                                    )
                                }}
                            </button>
                            <button
                                type="button"
                                @click="resetPosition"
                                class="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
                            >
                                <RotateCcw class="h-3.5 w-3.5" />
                                {{
                                    $t(
                                        'configurator.fve_leaf.custom.reset_pos',
                                        'Vycentrovat fotku',
                                    )
                                }}
                            </button>
                        </div>
                    </div>

                    <!-- Empty Upload Dropzone -->
                    <div
                        v-else
                        @click="triggerFileInput"
                        class="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-black/15 py-7 text-center transition-all hover:opacity-90 dark:border-white/15"
                    >
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-full bg-t-blue/10 text-t-blue shadow-xs dark:bg-white/10 dark:text-white"
                        >
                            <Upload class="h-6 w-6" />
                        </div>
                        <div>
                            <p
                                class="text-xs font-semibold text-black dark:text-white"
                            >
                                {{
                                    $t(
                                        'configurator.fve_leaf.custom.upload_title',
                                        'Nahrajte vlastní obrázek nebo vzor',
                                    )
                                }}
                            </p>
                            <p
                                class="mt-0.5 text-[11px] text-black/55 dark:text-white/45"
                            >
                                {{
                                    $t(
                                        'configurator.fve_leaf.custom.upload_desc',
                                        'PNG, JPG, WebP — vytvořte unikátní potisk FVE listů',
                                    )
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Solar Panel Efficiency Notice on Custom/Seasonal Designs -->
        <div
            class="mt-3 flex items-start gap-2.5 rounded-xl border border-black/8 bg-black/3 p-3 text-xs leading-relaxed text-black/65 dark:border-white/8 dark:bg-white/4 dark:text-white/65"
        >
            <Info class="mt-0.5 h-4 w-4 shrink-0 text-black/45 dark:text-white/45" />
            <span>
                {{
                    $t(
                        'configurator.fve_leaf.efficiency_notice',
                        'Designové a vlastní vzory FVE listů mohou mírně snížit celkovou účinnost a výkon fotovoltaických článků.',
                    )
                }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Info, RotateCcw, Upload, ZoomIn, ZoomOut } from 'lucide-vue-next';
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
const editorImage = ref<string | null>(null);
const posX = ref(0);
const posY = ref(0);
const scale = ref(1.0);
const mappingMode = ref<'branch' | 'individual'>('individual');

let isDragging = false;
let startX = 0;
let startY = 0;
let startPosX = 0;
let startPosY = 0;

let touchStartDist = 0;
let startScale = 1.0;

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
        price: '+111 990 Kč',
        priceKey: 'configurator.price.plus_112k',
        description: 'Sezonní design FVE listů pro letní variantu stromu.',
        descKey: 'configurator.fve_leaf.summer.desc',
    },
    {
        id: 'autumn',
        label: 'Podzim',
        labelKey: 'configurator.fve_leaf.autumn.label',
        swatch: 'linear-gradient(135deg, #F2B84B 0%, #C85D2A 50%, #7A3B20 100%)',
        price: '+111 990 Kč',
        priceKey: 'configurator.price.plus_112k',
        description: 'Sezonní design FVE listů pro podzimní variantu stromu.',
        descKey: 'configurator.fve_leaf.autumn.desc',
    },
    {
        id: 'winter',
        label: 'Zima',
        labelKey: 'configurator.fve_leaf.winter.label',
        swatch: 'linear-gradient(135deg, #F3F7FA 0%, #B8D1E0 50%, #6E8798 100%)',
        price: '+111 990 Kč',
        priceKey: 'configurator.price.plus_112k',
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
        description:
            'Nahrajte vlastní fotku nebo grafiku pro potisk FVE listů.',
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
    if (!rawUserImage.value) {
        return;
    }

    const { fullTexture, editorTexture } = await generateMappedLeafTexture(
        rawUserImage.value,
        {
            offsetX: posX.value,
            offsetY: posY.value,
            scale: scale.value,
            mappingMode: mappingMode.value,
        },
    );
    editorImage.value = editorTexture;
    emit('update:customImage', fullTexture);
}

function resetPosition() {
    posX.value = 0;
    posY.value = 0;
    scale.value = 1.0;
    updateMappedTexture();
}

function zoomIn() {
    scale.value = Math.min(3.0, Number((scale.value + 0.15).toFixed(2)));
    updateMappedTexture();
}

function zoomOut() {
    scale.value = Math.max(0.4, Number((scale.value - 0.15).toFixed(2)));
    updateMappedTexture();
}

function onWheelZoom(event: WheelEvent) {
    if (event.ctrlKey) {
        // Touchpad pinch gesture
        const zoomFactor = -event.deltaY * 0.008;
        scale.value = Math.min(
            3.0,
            Math.max(0.4, Number((scale.value + zoomFactor).toFixed(3))),
        );
    } else {
        // Mouse wheel scroll
        const delta = event.deltaY < 0 ? 0.1 : -0.1;
        scale.value = Math.min(
            3.0,
            Math.max(0.4, Number((scale.value + delta).toFixed(2))),
        );
    }

    updateMappedTexture();
}

/* Helper to safely unwrap Vue 3 template ref (which is an Array when inside v-for) */
function getDragPadElement(): HTMLElement | null {
    if (!dragPad.value) {
        return null;
    }

    if (Array.isArray(dragPad.value)) {
        return (dragPad.value[0] as HTMLElement) || null;
    }

    const el = dragPad.value as any;

    if (el.$el) {
        return el.$el as HTMLElement;
    }

    if (typeof el.getBoundingClientRect === 'function') {
        return el as HTMLElement;
    }

    return null;
}

/* Mouse Dragging Logic */
function startDrag(event: MouseEvent) {
    if (event.button !== 0) {
        return;
    }

    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startPosX = posX.value;
    startPosY = posY.value;

    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', stopDrag);
}

function onDragMove(event: MouseEvent) {
    if (!isDragging) {
        return;
    }

    const padEl = getDragPadElement();

    if (!padEl) {
        return;
    }

    const rect = padEl.getBoundingClientRect();

    if (!rect.width || !rect.height) {
        return;
    }

    const deltaX = ((event.clientX - startX) / rect.width) * 100;
    const deltaY = ((event.clientY - startY) / rect.height) * 100;

    posX.value = Math.min(
        100,
        Math.max(-100, Number((startPosX + deltaX).toFixed(2))),
    );
    posY.value = Math.min(
        100,
        Math.max(-100, Number((startPosY + deltaY).toFixed(2))),
    );

    updateMappedTexture();
}

function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', stopDrag);
}

/* Touch & Touchpad Gesture Logic */
function onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
        const t1 = event.touches[0];
        const t2 = event.touches[1];

        if (t1 && t2) {
            touchStartDist = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY,
            );
            startScale = scale.value;
        }
    } else if (event.touches.length === 1) {
        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        isDragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        startPosX = posX.value;
        startPosY = posY.value;

        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', stopTouchDrag);
    }
}

function onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2 && touchStartDist > 0) {
        event.preventDefault();
        const t1 = event.touches[0];
        const t2 = event.touches[1];

        if (t1 && t2) {
            const dist = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY,
            );
            const factor = dist / touchStartDist;
            scale.value = Math.min(
                3.0,
                Math.max(0.4, Number((startScale * factor).toFixed(2))),
            );
            updateMappedTexture();
        }
    } else if (event.touches.length === 1 && isDragging) {
        event.preventDefault();
        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const padEl = getDragPadElement();

        if (!padEl) {
            return;
        }

        const rect = padEl.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const deltaX = ((touch.clientX - startX) / rect.width) * 100;
        const deltaY = ((touch.clientY - startY) / rect.height) * 100;

        posX.value = Math.min(
            100,
            Math.max(-100, Number((startPosX + deltaX).toFixed(2))),
        );
        posY.value = Math.min(
            100,
            Math.max(-100, Number((startPosY + deltaY).toFixed(2))),
        );

        updateMappedTexture();
    }
}

function stopTouchDrag() {
    isDragging = false;
    touchStartDist = 0;
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

    if (!fileObj) {
        return;
    }

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
