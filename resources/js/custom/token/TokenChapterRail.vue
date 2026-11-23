<template>
    <nav
        :aria-label="t('token.rail.aria')"
        class="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:right-10"
        :class="current ? 'opacity-100' : 'opacity-0'"
    >
        <ul class="flex flex-col items-end gap-3.5">
            <li v-for="c in chapters" :key="c.id">
                <a
                    :href="`#chapter-${c.id}`"
                    class="pointer-events-auto group flex items-center gap-3"
                    :aria-current="current === c.id ? 'step' : undefined"
                    @click.prevent="go(c.id)"
                >
                    <span
                        class="text-[11px] font-medium tracking-[0.16em] uppercase transition-all duration-300"
                        :class="
                            current === c.id
                                ? 'text-white/80 xl:text-white/85'
                                : 'translate-x-1 text-white/0 group-hover:translate-x-0 group-hover:text-white/60'
                        "
                    >
                        {{ c.label }}
                    </span>
                    <span
                        class="block h-px transition-all duration-300"
                        :class="current === c.id ? 'w-8 bg-[#8ec5ff]' : 'w-3.5 bg-white/25 group-hover:bg-white/50'"
                    ></span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const chapters = computed(() => [
    { id: '01', label: t('token.rail.c01') },
    { id: '02', label: t('token.rail.c02') },
    { id: '03', label: t('token.rail.c03') },
    { id: '04', label: t('token.rail.c04') },
    { id: '05', label: t('token.rail.c05') },
    { id: '06', label: t('token.rail.c06') },
    { id: '07', label: t('token.rail.c07') },
    { id: '08', label: t('token.rail.c08') },
    { id: '09', label: t('token.rail.c09') },
]);

const current = ref<string | null>(null);
let io: IntersectionObserver | null = null;

function go(id: string) {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`);

    if (el) {
        window.scrollTo({
            top: window.scrollY + el.getBoundingClientRect().top + 2,
            behavior: 'smooth',
        });
    }
}

onMounted(() => {
    const visible = new Set<string>();

    io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                const id = (e.target as HTMLElement).dataset.chapter!;

                if (e.isIntersecting) {
                    visible.add(id);
                } else {
                    visible.delete(id);
                }
            });
            current.value = [...visible].sort().pop() ?? null;
        },
        { rootMargin: '-40% 0px -40% 0px' },
    );

    document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => io!.observe(el));
});

onUnmounted(() => io?.disconnect());
</script>
