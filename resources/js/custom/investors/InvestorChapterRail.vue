<template>
    <nav
        aria-label="Chapters"
        class="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 transition-opacity duration-500 lg:block xl:right-10"
        :class="current ? 'opacity-100' : 'opacity-0'"
    >
        <ul class="flex flex-col items-end gap-4">
            <li v-for="c in chapters" :key="c.id">
                <a
                    :href="`#chapter-${c.id}`"
                    class="pointer-events-auto group flex items-center gap-3"
                    :aria-current="current === c.id ? 'step' : undefined"
                    @click.prevent="go(c.id)"
                >
                    <span
                        class="text-[11px] font-medium tracking-[0.18em] uppercase transition-all duration-300"
                        :class="current === c.id ? 'text-white/0 group-hover:text-white/60 xl:text-white/70' : 'translate-x-1 text-white/0 group-hover:translate-x-0 group-hover:text-white/50'"
                    >
                        {{ c.label }}
                    </span>
                    <span
                        class="block h-px transition-all duration-300"
                        :class="current === c.id ? 'w-8 bg-[#8ec5ff]' : 'w-4 bg-white/25 group-hover:bg-white/50'"
                    ></span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const chapters = [
    { id: '01', label: 'The tree' },
    { id: '02', label: 'The system' },
    { id: '03', label: 'The products' },
    { id: '04', label: 'Payment gate' },
    { id: '05', label: 'Traction' },
    { id: '06', label: 'Data room' },
];

const current = ref<string | null>(null);
let io: IntersectionObserver | null = null;

function go(id: string) {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`);

    if (el) {
        window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top + 2, behavior: 'smooth' });
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
        { rootMargin: '-50% 0px -50% 0px' },
    );

    document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => io!.observe(el));
});

onUnmounted(() => io?.disconnect());
</script>
