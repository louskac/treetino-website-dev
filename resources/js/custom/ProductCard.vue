<template>
    <div
        class="group relative flex aspect-4/5 flex-col overflow-clip rounded-2xl border border-white/20 p-4 backdrop-blur-2xl sm:p-5 lg:p-6"
    >
        <div
            class="pointer-events-none absolute top-0 left-0 h-full w-full overflow-clip rounded-2xl"
        >
            <img
                class="h-full w-full rounded-2xl object-cover transition-all duration-600 group-hover:scale-110"
                :src="product.image"
                :alt="product.label"
            />
        </div>

        <div
            class="pointer-events-none absolute bottom-0 left-0 h-50 w-full rounded-b-2xl bg-linear-to-b from-transparent to-black to-50%"
        ></div>

        <div class="relative mt-auto text-white">
            <div class="relative mb-3 text-2xl font-medium sm:mb-4 sm:text-3xl">
                {{ product.label }}
            </div>

            <div class="grid grid-cols-2 gap-2 items-stretch">
                <ButtonWhite
                    :href="`/products/${product.detail}`"
                    variant="slim"
                    class="h-full w-full text-center"
                    @click="$emit('click')"
                >
                    {{ $t('common.actions.info') }}
                </ButtonWhite>
                <ButtonPrimary
                    :href="`/configurator/${product.id}`"
                    variant="slim"
                    class="h-full w-full text-center"
                    @click="$emit('click')"
                >
                    {{ $t('common.actions.preorder') }}
                </ButtonPrimary>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import type { Product } from '@/types/products';
import type { PropType } from 'vue';

defineProps({
    product: {
        type: Object as PropType<Product>,
        required: true,
    },
});

defineEmits(['click']);
</script>
