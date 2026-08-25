<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Award, Download, ExternalLink } from 'lucide-vue-next';

const { t, locale } = useI18n();

const TOTAL_FRAMES = 228;
const canvasRef = ref<HTMLCanvasElement | null>(null);
const currentFrame = ref(0);
const isLoaded = ref(false);
let animationTimer: number | null = null;

const frames: HTMLImageElement[] = [];

// Preload frames
const loadFrames = () => {
    let loadedCount = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/img/features-frames/features_frame_${String(i).padStart(4, '0')}.webp`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount >= 10 && !isLoaded.value) {
                isLoaded.value = true;
                drawFrame(currentFrame.value);
            }
        };
        frames.push(img);
    }
};

const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frames[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect ratio cover/contain
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvas.width / canvas.height;

        let drawW = canvas.width;
        let drawH = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (canvasAspect > imgAspect) {
            drawW = canvas.width;
            drawH = canvas.width / imgAspect;
            drawY = (canvas.height - drawH) / 2;
        } else {
            drawH = canvas.height;
            drawW = canvas.height * imgAspect;
            drawX = (canvas.width - drawW) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
};

const startPlay = () => {
    if (animationTimer) clearInterval(animationTimer);
    animationTimer = window.setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % TOTAL_FRAMES;
        drawFrame(currentFrame.value);
    }, 45);
};

onMounted(() => {
    loadFrames();
    startPlay();
    window.addEventListener('resize', () => drawFrame(currentFrame.value));
});

onUnmounted(() => {
    if (animationTimer) clearInterval(animationTimer);
    window.removeEventListener('resize', () => drawFrame(currentFrame.value));
});

const patentFeatures = [
    {
        title: {
            cs: 'Aktivní dvouosé naklápění větví',
            en: 'Multi-Axis Motorized Articulation',
        },
        description: {
            cs: 'Nezávislé servomotory natáčejí primární i sekundární větve za dráhou slunce. Zajišťují až o 29 % vyšší energetický výnos a eliminují vzájemné stínění listů.',
            en: 'Independent servomotors rotate primary and secondary branch segments along the solar trajectory, boosting annual energy yield by up to 29% and eliminating self-shading.',
        },
    },
    {
        title: {
            cs: 'Soběstačné vytočení ze stínu',
            en: 'Self-Powered Shading Mitigation',
        },
        description: {
            cs: 'Díky patentovanému paralelnímu zapojení generují osvětlené listy dostatek energie k okamžitému otočení zastíněných větví bez odběru ze sítě či vybití baterie.',
            en: 'Patented parallel leaf circuitry ensures illuminated leaves generate sufficient power to drive servomotors and rotate shaded branches without drawing external power.',
        },
    },
    {
        title: {
            cs: 'Ochranný režim proti krupobití',
            en: 'Hail & Storm Auto-Defense',
        },
        description: {
            cs: 'Při detekci vichřice nebo krupobití systém během několika sekund otočí aktivní fotovoltaické plochy směrem dolů, čímž spolehlivě zabrání poškození solárních článků.',
            en: 'Upon storm or hail detection, the tree rapidly rotates active photovoltaic surfaces face-down, fully protecting delicate solar cells from impact damage.',
        },
    },
    {
        title: {
            cs: 'Samočisticí servisní pozice',
            en: 'Ground-Level Jet Cleaning Mode',
        },
        description: {
            cs: 'Otočení listů do spodní polohy umožňuje snadné a bezpečné omytí tlakovým proudem vody přímo ze země bez nutnosti montážních plošin či žebříků.',
            en: 'Rotating leaf surfaces downward enables effortless maintenance and rapid high-pressure water cleaning directly from ground level without ladders.',
        },
    },
];
</script>

<template>
    <section id="patent" class="scroll-mt-32 py-16 lg:py-24 border-b border-black/10">
        <!-- Section Header -->
        <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div class="max-w-3xl">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-t-blue/10 px-3 py-1 text-xs font-semibold tracking-wider text-t-blue uppercase">
                        <Award class="h-3.5 w-3.5" />
                        <span>{{ $t('media.patent_tag', 'Patentovaná Technologie') }}</span>
                    </span>
                    <span class="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-black/70">
                        EP 4 664 750 A1
                    </span>
                    <span class="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-black/70">
                        WO 2025/256678 A1
                    </span>
                </div>
                <h2 class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl">
                    {{ $t('media.patent_title', 'Patentovaný mechanický systém natáčení větví') }}
                </h2>
                <p class="mt-4 text-base sm:text-lg text-black/70 leading-relaxed">
                    {{ $t('media.patent_desc', 'Treetino chrání své inovace evropským i mezinárodním patentem. Naše technologie umožňuje inteligentní vícesměrné natáčení větví, eliminaci stínění a automatickou ochranu proti krupobití.') }}
                </p>
            </div>

            <!-- Patent Certificate Info Card & Downloads -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a
                    href="/docs/patent-ep-4664750.pdf"
                    target="_blank"
                    download="Treetino-Patent-EP4664750A1.pdf"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-t-blue px-4 py-2.5 text-xs font-medium text-white transition hover:bg-t-blue/90 shadow-sm whitespace-nowrap"
                >
                    <Download class="h-3.5 w-3.5" />
                    <span>{{ $t('media.patent_download_ep', 'EU Patent (PDF)') }}</span>
                </a>
                <a
                    href="/docs/patent-wo-2025256678.pdf"
                    target="_blank"
                    download="Treetino-Patent-WO2025256678A1.pdf"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs font-medium text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30 whitespace-nowrap"
                >
                    <ExternalLink class="h-3.5 w-3.5 text-t-blue" />
                    <span>{{ $t('media.patent_download_wo', 'World Patent (PDF)') }}</span>
                </a>
            </div>
        </div>

        <!-- 3D Branch Movement Animation & Simplified Editorial Claims Grid -->
        <div class="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <!-- Left: Clean 3D Animation (7 Cols) -->
            <div class="lg:col-span-7">
                <div class="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-black/10 bg-[#fafafa] shadow-xs flex items-center justify-center">
                    <canvas ref="canvasRef" class="h-full w-full object-contain"></canvas>
                </div>
            </div>

            <!-- Right: 4 Clean Editorial Claim Rows (5 Cols) -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-7">
                <div
                    v-for="(feature, idx) in patentFeatures"
                    :key="idx"
                    class="border-l-2 border-t-blue pl-6"
                >
                    <h3 class="text-base sm:text-lg font-medium text-black">
                        {{ feature.title[$i18n.locale as 'cs' | 'en'] || feature.title.cs }}
                    </h3>
                    <p class="mt-1.5 text-xs sm:text-sm text-black/70 leading-relaxed">
                        {{ feature.description[$i18n.locale as 'cs' | 'en'] || feature.description.cs }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
