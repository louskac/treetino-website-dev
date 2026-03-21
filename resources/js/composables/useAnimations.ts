import { onMounted, onUnmounted, ref } from "vue";

export function useParallax(strength = 0.15) {
    const el = ref<HTMLElement | null>(null);
    const translateY = ref(0);

    function update() {
        if (!el.value) return;
        const rect = el.value.getBoundingClientRect();
        const windowH = window.innerHeight;

        const progress = (windowH - rect.top) / (windowH + rect.height);
        translateY.value = (progress - 0.5) * strength * 400;
    }

    onMounted(() => {
        window.addEventListener('scroll', update, { passive: true });
        update();
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', update);
    });

    return { el, translateY };
}