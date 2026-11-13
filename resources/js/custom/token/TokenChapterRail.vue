<template>
    <nav
        aria-label="Tokenomics chapters navigation"
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

const chapters = computed(() => [
    { id: '01', label: '01 · HARDWARE (10%)' },
    { id: '02', label: '02 · EV CHARGE (0.1%)' },
    { id: '03', label: '03 · RWA & ARBITRAGE (1%)' },
    { id: '04', label: '04 · DEPIN & veTREE' },
    { id: '05', label: '05 · FLYWHEEL' },
    { id: '06', label: '06 · TOKENOMICS' },
    { id: '07', label: '07 · BUYBACK MODEL' },
    { id: '08', label: '08 · WHY TRUST US' },
    { id: '09', label: '09 · DATA ROOM' },
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
