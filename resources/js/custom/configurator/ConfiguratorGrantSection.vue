<template>
    <div>
        <!-- Section heading – larger visual break than regular steps -->
        <h2 class="text-base font-semibold tracking-tight text-black dark:text-white mb-1">
            Financování
        </h2>
        <p class="text-xs text-black/40 dark:text-white/30 mb-5 leading-relaxed">
            Vyberte dotační program, na který máte nárok. Cena bude upravena po výběru.
        </p>

        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-3">
            Dotační program
        </p>

        <div class="flex flex-col gap-1">
            <button
                v-for="option in grants"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full py-3 px-3 rounded text-left transition-opacity duration-200 opacity-100"
            >
                <div class="flex items-center justify-between mb-0.5">
                    <div class="flex items-center gap-2.5">
                        <!-- Radio indicator -->
                        <span
                            class="w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors duration-200 flex items-center justify-center"
                            :class="modelValue === option.id
                                ? 'border-black dark:border-white bg-black dark:bg-white'
                                : 'border-black/30 dark:border-white/30'"
                        >
                            <span
                                v-if="modelValue === option.id"
                                class="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"
                            />
                        </span>
                        <span class="text-sm font-medium text-black dark:text-white">
                            {{ option.label }}
                        </span>
                    </div>
                    <span
                        v-if="option.percentage !== null"
                        class="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-t-blue dark:text-t-blue border border-t-blue font-medium"
                    >
                        až {{ option.percentage }}&thinsp;%
                    </span>
                </div>
                <div class="pl-6">
                    <p
                        v-if="option.eligibility"
                        class="text-xs text-black/55 dark:text-white/40"
                    >
                        {{ option.eligibility }}
                    </p>
                    <p
                        v-if="option.description"
                        class="text-xs text-black/35 dark:text-white/25 leading-relaxed mt-0.5"
                    >
                        {{ option.description }}
                    </p>
                </div>
            </button>
        </div>

        <!-- CZ-only notice -->
        <div class="mt-4 flex items-start gap-2 rounded-lg bg-black/4 dark:bg-white/5 px-3 py-2.5">
            <span class="text-black/35 dark:text-white/25 text-xs mt-px shrink-0 select-none">ℹ</span>
            <p class="text-xs text-black/50 dark:text-white/35 leading-relaxed">
                Uvedené dotace jsou dostupné pouze v&nbsp;rámci&nbsp;ČR. Pokud jste ze Slovenska nebo
                jiné země, prosím
                <a
                    href="/kontakt"
                    class="underline underline-offset-2 hover:text-black dark:hover:text-white transition-colors"
                >kontaktujte nás</a>.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();

const grants = [
    {
        id: 'optak',
        label: 'OPTAK',
        percentage: 65,
        eligibility: 'Pro firmy',
        description: 'Operační program Technologie a aplikace pro konkurenceschopnost.',
    },
    {
        id: 'res-plus',
        label: 'RES+',
        percentage: null,   // percentage TBD – will be confirmed
        eligibility: 'Pro obce a města',
        description: 'Podpora komunitní energetiky a obecních obnovitelných zdrojů.',
    },
    {
        id: 'nzu',
        label: 'NZÚ',
        percentage: 30,
        eligibility: 'Pro fyzické osoby',
        description: 'Nová zelená úsporám - podpora pro domácnosti a fyzické osoby.',
    },
    {
        id: 'irop',
        label: 'IROP',
        percentage: 90,
        eligibility: 'Komplexní městské projekty',
        description: 'Integrovaný regionální operační program pro rozsáhlé projekty.',
    },
    {
        id: 'none',
        label: 'Bez dotace',
        percentage: null,
        eligibility: '',
        description: '',
    },
];
</script>
