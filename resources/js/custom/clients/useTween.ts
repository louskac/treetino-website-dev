import { onBeforeUnmount, ref, watch  } from 'vue';
import type {Ref} from 'vue';

/** Smoothly tweens a numeric ref (ease-out cubic) — for count-up numbers */
export function useTween(source: Ref<number>, duration = 1100, from = 0): Ref<number> {
    const out = ref(from);
    let raf = 0;

    const run = (to: number) => {
        cancelAnimationFrame(raf);

        if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            out.value = to;

            return;
        }

        const start = performance.now();
        const a = out.value;
        const tick = (now: number) => {
            const t = Math.max(0, Math.min(1, (now - start) / duration));
            out.value = a + (to - a) * (1 - Math.pow(1 - t, 3));

            if (t < 1) {
                raf = requestAnimationFrame(tick);
            }
        };
        raf = requestAnimationFrame(tick);
    };

    watch(source, run, { immediate: true });
    onBeforeUnmount(() => cancelAnimationFrame(raf));

    return out;
}
