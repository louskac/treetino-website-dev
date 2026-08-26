<template>
    <div
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
    >
        <!-- Ambient Studio Lighting -->
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(14,165,233,0.18),rgba(0,0,0,0))]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_88%_60%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>

        <!-- Minimalist City Map Vector SVG Canvas -->
        <svg
            class="h-full w-full opacity-60"
            viewBox="0 0 1600 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <!-- Subtle Gradient for Roads -->
                <linearGradient
                    id="roadGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="white" stop-opacity="0.03" />
                    <stop offset="50%" stop-color="white" stop-opacity="0.06" />
                    <stop
                        offset="100%"
                        stop-color="white"
                        stop-opacity="0.03"
                    />
                </linearGradient>

                <!-- Blue Glow Filter -->
                <filter
                    id="blueGlow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                >
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                    />
                </filter>
            </defs>

            <!-- Minimal City River / Waterway Curve -->
            <path
                d="M -100 250 C 300 350, 500 150, 850 380 C 1200 600, 1400 450, 1750 600"
                stroke="#0ea5e9"
                stroke-opacity="0.07"
                stroke-width="48"
                stroke-linecap="round"
                fill="none"
            />
            <path
                d="M -100 250 C 300 350, 500 150, 850 380 C 1200 600, 1400 450, 1750 600"
                stroke="#0ea5e9"
                stroke-opacity="0.12"
                stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
            />

            <!-- City Grid: Major Arterial Streets (CAD Minimalist Lines) -->
            <g
                stroke="url(#roadGrad)"
                stroke-width="1.2"
                stroke-linecap="round"
            >
                <!-- Diagonal Arteries -->
                <line x1="-100" y1="120" x2="1700" y2="780" />
                <line x1="-100" y1="380" x2="1700" y2="920" />
                <line x1="-100" y1="700" x2="1500" y2="-100" />
                <line x1="200" y1="1100" x2="1750" y2="200" />

                <!-- Horizontal & Vertical Grid Lines -->
                <line
                    x1="220"
                    y1="0"
                    x2="220"
                    y2="1000"
                    stroke-dasharray="6,8"
                    stroke-opacity="0.04"
                />
                <line x1="450" y1="0" x2="450" y2="1000" />
                <line
                    x1="680"
                    y1="0"
                    x2="680"
                    y2="1000"
                    stroke-dasharray="4,6"
                    stroke-opacity="0.03"
                />
                <line
                    x1="920"
                    y1="0"
                    x2="920"
                    y2="1000"
                    stroke-dasharray="4,6"
                    stroke-opacity="0.03"
                />
                <line x1="1150" y1="0" x2="1150" y2="1000" />
                <line
                    x1="1380"
                    y1="0"
                    x2="1380"
                    y2="1000"
                    stroke-dasharray="6,8"
                    stroke-opacity="0.04"
                />

                <line x1="0" y1="180" x2="1600" y2="180" />
                <line
                    x1="0"
                    y1="420"
                    x2="1600"
                    y2="420"
                    stroke-dasharray="8,8"
                    stroke-opacity="0.03"
                />
                <line x1="0" y1="650" x2="1600" y2="650" />
                <line
                    x1="0"
                    y1="840"
                    x2="1600"
                    y2="840"
                    stroke-dasharray="6,6"
                    stroke-opacity="0.04"
                />
            </g>

            <!-- Subtle City Block Rectangles -->
            <g
                stroke="white"
                stroke-opacity="0.03"
                stroke-width="1"
                fill="none"
            >
                <rect x="260" y="240" width="100" height="70" rx="3" />
                <rect x="280" y="480" width="90" height="110" rx="3" />
                <rect x="1220" y="220" width="110" height="80" rx="3" />
                <rect x="1230" y="490" width="90" height="90" rx="3" />
                <rect x="440" y="700" width="140" height="70" rx="3" />
                <rect x="1020" y="710" width="120" height="80" rx="3" />
            </g>
        </svg>

        <!-- HTML Overlay for Flank Locations (Strictly outside central text & laptop) -->
        <div
            v-for="node in nodes"
            :key="'label-' + node.id"
            class="pointer-events-none absolute hidden md:block"
            :style="node.positionStyle"
        >
            <!-- Phase 1: Big Blue Icon + Blue Location Name (Same Matching Color, Zero Background) -->
            <Transition name="fade-quick">
                <div
                    v-if="node.stage === 'location'"
                    class="flex items-center gap-2.5 px-2 py-1"
                    :class="
                        node.isRight
                            ? 'flex-row-reverse text-right'
                            : 'flex-row text-left'
                    "
                >
                    <!-- Matching Blue Icon (Larger size) -->
                    <component
                        :is="node.icon"
                        class="h-6 w-6 shrink-0 text-t-blue drop-shadow-[0_0_12px_rgba(14,165,233,0.7)]"
                        stroke-width="2"
                    />

                    <!-- Matching Blue Title -->
                    <span
                        class="text-sm font-semibold tracking-tight whitespace-nowrap text-t-blue drop-shadow-[0_0_12px_rgba(14,165,233,0.5)] lg:text-base"
                    >
                        {{ $t(node.titleKey) }}
                    </span>
                </div>
            </Transition>

            <!-- Phase 2: Game-Like Cash-Out Float Up Animation (+450 000 Kč) -->
            <div
                v-if="node.stage === 'cashout'"
                class="cashout-number px-2 font-mono text-base font-bold tracking-wider whitespace-nowrap text-t-blue drop-shadow-[0_0_15px_rgba(14,165,233,0.9)] lg:text-lg"
                :class="node.isRight ? 'text-right' : 'text-left'"
            >
                {{ getCashoutAmount(node) }}
            </div>
        </div>

        <!-- Bottom Fade to Light Body Background -->
        <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#fdfdfd]/20 to-[#fdfdfd] sm:h-64"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import {
    Building2,
    Compass,
    Factory,
    Landmark,
    Home,
    Truck,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

type NodeStage = 'idle' | 'location' | 'cashout';

interface MapNode {
    id: string;
    icon: any;
    titleKey: string;
    amountCs: string;
    amountEn: string;
    positionStyle: Record<string, string>;
    isRight: boolean;
    stage: NodeStage;
}

// Strictly positioned in the open outer flanks (never behind central headline, buttons, or 3D laptop)
const nodes = reactive<MapNode[]>([
    {
        id: 'dev',
        icon: Building2,
        titleKey: 'sales.ideas.dev_title',
        amountCs: '+900 000 Kč',
        amountEn: '+€37,000',
        positionStyle: { left: '3.5%', top: '22%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'zoo',
        icon: Compass,
        titleKey: 'sales.ideas.zoo_title',
        amountCs: '+495 000 Kč',
        amountEn: '+€20,340',
        positionStyle: { right: '3.5%', top: '22%' },
        isRight: true,
        stage: 'idle',
    },
    {
        id: 'metal',
        icon: Factory,
        titleKey: 'sales.ideas.metal_title',
        amountCs: '+1 350 000 Kč',
        amountEn: '+€55,500',
        positionStyle: { left: '2.5%', top: '48%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'bank',
        icon: Landmark,
        titleKey: 'sales.ideas.bank_title',
        amountCs: '+450 000 Kč',
        amountEn: '+€18,500',
        positionStyle: { right: '2.5%', top: '48%' },
        isRight: true,
        stage: 'idle',
    },
    {
        id: 'community',
        icon: Home,
        titleKey: 'sales.ideas.community_title',
        amountCs: '+195 000 Kč',
        amountEn: '+€8,040',
        positionStyle: { left: '3.5%', top: '74%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'retail',
        icon: Truck,
        titleKey: 'sales.ideas.retail_title',
        amountCs: '+967 500 Kč',
        amountEn: '+€39,760',
        positionStyle: { right: '3.5%', top: '74%' },
        isRight: true,
        stage: 'idle',
    },
]);

function getCashoutAmount(node: MapNode) {
    const l = (locale.value || 'cs') as 'cs' | 'en';
    return l === 'cs' ? node.amountCs : node.amountEn;
}

const activeTimeouts: ReturnType<typeof setTimeout>[] = [];
let isRunning = false;

// Trigger lifecycle: Location -> Cash-Out Float -> Idle
function triggerNode(index: number) {
    if (!isRunning) return;
    const node = nodes[index];
    if (!node || node.stage !== 'idle') return;

    // Step 1: Display big blue icon + location title in matching blue
    node.stage = 'location';

    // Step 2: After 2.3s, switch to game cashout animation
    const cashoutTimeout = setTimeout(() => {
        if (!isRunning) return;
        node.stage = 'cashout';

        // Step 3: After float-up animation completes (1.4s), reset to idle
        const resetTimeout = setTimeout(() => {
            if (!isRunning) return;
            node.stage = 'idle';
        }, 1400);

        activeTimeouts.push(resetTimeout);
    }, 2300);

    activeTimeouts.push(cashoutTimeout);
}

// Organic loop scheduling random inactive nodes at staggered delays
function scheduleNextOrganic() {
    if (!isRunning) return;

    const idleIndices = nodes
        .map((n, idx) => (n.stage === 'idle' ? idx : -1))
        .filter((idx) => idx !== -1);

    if (idleIndices.length > 0) {
        const randomIdx =
            idleIndices[Math.floor(Math.random() * idleIndices.length)];
        triggerNode(randomIdx);
    }

    // Next node delay between 1.8s and 2.8s
    const nextDelay = 1800 + Math.random() * 1000;
    const nextTimeout = setTimeout(() => {
        scheduleNextOrganic();
    }, nextDelay);

    activeTimeouts.push(nextTimeout);
}

onMounted(() => {
    isRunning = true;
    // Initial organic staggered launches
    triggerNode(0);
    const t1 = setTimeout(() => {
        triggerNode(3);
        scheduleNextOrganic();
    }, 1500);
    activeTimeouts.push(t1);
});

onUnmounted(() => {
    isRunning = false;
    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts.length = 0;
});
</script>

<style scoped>
.fade-quick-enter-active,
.fade-quick-leave-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-quick-enter-from {
    opacity: 0;
    transform: scale(0.92);
}
.fade-quick-leave-to {
    opacity: 0;
    transform: scale(0.96);
}

/* Game-Like Cash-Out Float-Up Animation */
.cashout-number {
    animation: cashoutFloat 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cashoutFloat {
    0% {
        opacity: 0;
        transform: translateY(6px) scale(0.85);
    }
    20% {
        opacity: 1;
        transform: translateY(0px) scale(1.12);
    }
    65% {
        opacity: 0.95;
        transform: translateY(-16px) scale(1.05);
    }
    100% {
        opacity: 0;
        transform: translateY(-34px) scale(0.95);
    }
}
</style>
