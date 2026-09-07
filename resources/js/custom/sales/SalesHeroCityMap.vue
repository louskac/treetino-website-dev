<template>
    <div
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
    >
        <!-- Ambient Studio Lighting -->
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(14,165,233,0.14),rgba(0,0,0,0))]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_88%_60%,rgba(14,165,233,0.08),transparent_50%)]"
        ></div>

        <!-- Authentic City Map Vector Layer (White on Dark Cartographic Street Network) -->
        <div class="absolute inset-0 opacity-80 mix-blend-screen">
            <img
                src="/img/sales/city-map-blueprint.webp"
                alt="City Map Blueprint"
                class="h-full w-full object-cover object-bottom"
            />
        </div>

        <!-- Center Readability Vignette (Softly dims the center to keep headline typography super crisp) -->
        <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.4)_50%,transparent_100%)]"
        ></div>

        <!-- HTML Overlay for Flank Locations (Strictly outside central text & laptop) -->
        <div
            v-for="node in nodes"
            :key="'label-' + node.id"
            class="pointer-events-none absolute hidden md:block"
            :style="node.positionStyle"
        >
            <!-- Phase 1: White Icon + White Location Name (High Contrast against dark city map) -->
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
                    <!-- Pure White Icon -->
                    <component
                        :is="node.icon"
                        class="h-6 w-6 shrink-0 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.75)]"
                        stroke-width="2"
                    />

                    <!-- Pure White Title -->
                    <span
                        class="text-sm font-semibold tracking-tight whitespace-nowrap text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] lg:text-base"
                    >
                        {{ $t(node.titleKey) }}
                    </span>
                </div>
            </Transition>

            <!-- Phase 2: Game-Like Cash-Out Float Up Animation (+450 000 Kč) in Pure White -->
            <div
                v-if="node.stage === 'cashout'"
                class="cashout-number px-2 font-mono text-base font-bold tracking-wider whitespace-nowrap text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.95)] lg:text-lg"
                :class="node.isRight ? 'text-right' : 'text-left'"
            >
                {{ getCashoutAmount(node) }}
            </div>
        </div>

        <!-- Bottom Fade to Light Body Background directly aligning with base of Mac -->
        <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#fdfdfd]"
        ></div>
    </div>
</template>

<script setup lang="ts">
import {
    Building2,
    Compass,
    Factory,
    Landmark,
    Home,
    Truck,
} from 'lucide-vue-next';
import { reactive, onMounted, onUnmounted } from 'vue';
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
        amountCs: '+980 000 Kč',
        amountEn: '+€40,000',
        positionStyle: { left: '3.5%', top: '22%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'zoo',
        icon: Compass,
        titleKey: 'sales.ideas.zoo_title',
        amountCs: '+534 000 Kč',
        amountEn: '+€21,800',
        positionStyle: { right: '3.5%', top: '22%' },
        isRight: true,
        stage: 'idle',
    },
    {
        id: 'metal',
        icon: Factory,
        titleKey: 'sales.ideas.metal_title',
        amountCs: '+1 470 000 Kč',
        amountEn: '+€60,000',
        positionStyle: { left: '2.5%', top: '46%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'bank',
        icon: Landmark,
        titleKey: 'sales.ideas.bank_title',
        amountCs: '+490 000 Kč',
        amountEn: '+€20,000',
        positionStyle: { right: '2.5%', top: '46%' },
        isRight: true,
        stage: 'idle',
    },
    {
        id: 'community',
        icon: Home,
        titleKey: 'sales.ideas.community_title',
        amountCs: '+144 000 Kč',
        amountEn: '+€5,880',
        positionStyle: { left: '3.5%', top: '64%' },
        isRight: false,
        stage: 'idle',
    },
    {
        id: 'retail',
        icon: Truck,
        titleKey: 'sales.ideas.retail_title',
        amountCs: '+1 046 000 Kč',
        amountEn: '+€42,700',
        positionStyle: { right: '3.5%', top: '64%' },
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
    if (!isRunning) {
        return;
    }

    const node = nodes[index];

    if (!node || node.stage !== 'idle') {
        return;
    }

    // Step 1: Display white icon + location title in pure white with glow
    node.stage = 'location';

    // Step 2: After 2.3s, switch to game cashout animation in pure white
    const cashoutTimeout = setTimeout(() => {
        if (!isRunning) {
            return;
        }

        node.stage = 'cashout';

        // Step 3: After float-up animation completes (1.4s), reset to idle
        const resetTimeout = setTimeout(() => {
            if (!isRunning) {
                return;
            }

            node.stage = 'idle';
        }, 1400);

        activeTimeouts.push(resetTimeout);
    }, 2300);

    activeTimeouts.push(cashoutTimeout);
}

// Organic loop scheduling random inactive nodes at staggered delays
function scheduleNextOrganic() {
    if (!isRunning) {
        return;
    }

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
