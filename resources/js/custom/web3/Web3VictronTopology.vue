<template>
    <div class="h-full w-full">
        <!-- Desktop / Tablet (>= 640px): Full 8-Node SCADA Topology SVG -->
        <svg
            viewBox="0 0 770 480"
            class="hidden sm:block h-full w-full select-none"
            preserveAspectRatio="xMidYMid meet"
        >
        <!-- ================= CONDUIT PIPES LAYER ================= -->
        <g v-for="c in conduits" :key="c.id">
            <path
                :d="c.d"
                class="conduit-shield"
                fill="none"
                pathLength="1"
                :style="drawStyle(c.window)"
            />
            <path
                :d="c.d"
                class="conduit-core"
                fill="none"
                pathLength="1"
                :style="drawStyle(c.window)"
            />
            <path
                :d="c.d"
                :class="`conduit-flow-${c.flow}`"
                fill="none"
                :style="{ opacity: flowOpacity }"
            />
        </g>

        <!-- Junction Dots -->
        <circle
            :cx="130"
            :cy="245"
            :r="5"
            fill="#059669"
            stroke="#ffffff"
            :stroke-width="2"
            :style="{ opacity: win(0.42, 0.52) }"
        />
        <circle
            :cx="512"
            :cy="245"
            :r="5"
            fill="#2563eb"
            stroke="#ffffff"
            :stroke-width="2"
            :style="{ opacity: win(0.42, 0.52) }"
        />

        <!-- ================= HARDWARE NODES LAYER (8 CLEAN WHITE CARDS) ================= -->

        <!-- CARD 1.1: 110/22 kV GRID -->
        <foreignObject :x="25" :y="20" :width="210" :height="125">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-300 bg-white p-3.5"
                :style="cardStyle(0.46, 0.66)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
                >
                    <span>Grid Interconnect</span>
                    <span class="font-bold text-blue-600">ČEZ 22 kV</span>
                </div>
                <div>
                    <div
                        class="font-mono text-2xl font-black tracking-tight text-zinc-950"
                    >
                        6,200 kW
                    </div>
                    <p class="text-[11px] font-semibold text-zinc-600">
                        Přeštice Substation
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-1 font-mono text-[10px] text-zinc-500"
                >
                    <span>Arbitrage Spread:</span>
                    <span class="font-bold text-zinc-900">€95–€98 / MWh</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 1.2: GRID BALANCING -->
        <foreignObject :x="280" :y="20" :width="210" :height="125">
            <div
                class="flex h-full w-full flex-col justify-between border border-emerald-400 bg-emerald-50 p-3.5"
                :style="cardStyle(0.36, 0.56)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-emerald-800 uppercase"
                >
                    <span>Grid Balancing</span>
                    <span class="font-black text-emerald-700">ČEPS aFRR+</span>
                </div>
                <div>
                    <div
                        class="font-mono text-2xl font-black tracking-tight text-emerald-700"
                    >
                        &lt; 10 ms
                    </div>
                    <p class="text-[11px] font-bold text-emerald-900">
                        Fast Primary Response
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-emerald-200/60 pt-1 font-mono text-[10px] text-emerald-800"
                >
                    <span>Regulation:</span>
                    <span class="font-bold text-emerald-950">FCR ±200mHz</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 1.3: THERMAL BUFFER -->
        <foreignObject :x="535" :y="20" :width="210" :height="125">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-300 bg-white p-3.5"
                :style="cardStyle(0.56, 0.76)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
                >
                    <span>Thermal Buffer</span>
                    <span class="font-bold text-rose-600">Passive</span>
                </div>
                <div>
                    <div
                        class="font-mono text-2xl font-black tracking-tight text-rose-600"
                    >
                        31.8 °C
                    </div>
                    <p class="text-[11px] font-semibold text-zinc-600">
                        Optimal Liquid Cooling
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-1 font-mono text-[10px] text-zinc-500"
                >
                    <span>Parasitic Savings:</span>
                    <span class="font-bold text-zinc-900">8–12% Energy</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 2.1: TRANSFORMER -->
        <foreignObject :x="25" :y="180" :width="210" :height="130">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-300 bg-white p-3.5"
                :style="cardStyle(0.4, 0.6)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
                >
                    <span>Substation Trafo</span>
                    <span class="font-bold text-amber-600">Reserved</span>
                </div>
                <div>
                    <div
                        class="font-mono text-2xl font-black tracking-tight text-zinc-950"
                    >
                        8,600 kVA
                    </div>
                    <p class="text-[11px] font-semibold text-zinc-600">
                        Agreement #4122602318
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-1 font-mono text-[10px] text-zinc-500"
                >
                    <span>Interconnect:</span>
                    <span class="font-bold text-zinc-900">22 kV Cabling</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 2.2: WATTINO hBESS (CENTER HERO NODE) -->
        <foreignObject :x="280" :y="180" :width="210" :height="130">
            <div
                class="flex h-full w-full flex-col justify-between border-2 border-blue-600 bg-blue-600 p-3.5 text-white shadow-md select-none"
                :style="cardStyle(0.14, 0.32)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-blue-100 uppercase"
                >
                    <span>WATTINO hBESS</span>
                    <span
                        class="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white"
                    >
                        50 Racks
                    </span>
                </div>
                <div>
                    <div class="font-mono text-xl font-black text-white">
                        PCS 200 kW
                    </div>
                    <p class="text-[11px] font-bold text-blue-100">
                        Peak Discharge Active
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-white/20 pt-1 font-mono text-[10px] text-white"
                >
                    <span>Project IRR:</span>
                    <strong class="font-black text-white">21.8% p.a.</strong>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 2.3: FIRE SAFETY SYSTEM -->
        <foreignObject :x="535" :y="180" :width="210" :height="130">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-300 bg-white p-3.5"
                :style="cardStyle(0.5, 0.7)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
                >
                    <span>Safety System</span>
                    <span class="font-bold text-emerald-700">IP54</span>
                </div>
                <div>
                    <div
                        class="font-mono text-xl font-black tracking-tight text-zinc-950"
                    >
                        Class A1
                    </div>
                    <p class="text-[11px] font-semibold text-zinc-600">
                        100 mm Mineral Barrier
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-1 font-mono text-[10px] text-zinc-500"
                >
                    <span>Extinguish:</span>
                    <span class="font-bold text-zinc-900">Automated Aerosol</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 3.2: SAMSUNG SDI BATTERY RACKS (the 3D battery lands here) -->
        <foreignObject :x="280" :y="345" :width="210" :height="125">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-300 bg-white p-3.5"
                :style="cardStyle(0.0, 0.16, false)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-emerald-700 uppercase"
                >
                    <span>Battery Storage</span>
                    <span class="text-zinc-500">Samsung SDI EU</span>
                </div>
                <div>
                    <div
                        class="flex items-baseline justify-between font-mono text-2xl font-black tracking-tight text-emerald-700"
                    >
                        <span>68.4% SoC</span>
                        <span class="text-[10px] font-bold text-zinc-500">
                            666 VDC
                        </span>
                    </div>
                    <div
                        class="mt-1.5 h-2 w-full overflow-hidden border border-zinc-200 bg-zinc-100"
                    >
                        <div
                            class="h-full bg-emerald-500"
                            :style="{ width: `${68.4 * win(0.1, 0.4)}%` }"
                        />
                    </div>
                </div>
                <div
                    class="flex items-center justify-between border-t border-zinc-100 pt-1 font-mono text-[10px] text-zinc-500"
                >
                    <span>Warranty:</span>
                    <span class="font-bold text-zinc-900">10+10 Years EU</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 3.3: CERBO-S GX SCADA GATEWAY -->
        <foreignObject :x="535" :y="345" :width="210" :height="125">
            <div
                class="flex h-full w-full flex-col justify-between border border-amber-400 bg-amber-50 p-3.5"
                :style="cardStyle(0.3, 0.5)"
            >
                <div
                    class="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-amber-800 uppercase"
                >
                    <span>SCADA Gateway</span>
                    <span class="font-bold text-amber-700">Venus OS</span>
                </div>
                <div>
                    <div
                        class="font-mono text-2xl font-black tracking-tight text-amber-800"
                    >
                        10 ms RTT
                    </div>
                    <p class="text-[11px] font-bold text-amber-900">
                        Modbus TCP / CAN / RS485
                    </p>
                </div>
                <div
                    class="flex items-center justify-between border-t border-amber-200/60 pt-1 font-mono text-[10px] text-amber-900"
                >
                    <span>Oracle Dispatch:</span>
                    <span class="font-bold text-emerald-700">ČEPS Certified</span>
                </div>
            </div>
        </foreignObject>
    </svg>

    <!-- ================= MOBILE VIEW (< 640px): FULL ANIMATED SCADA TOPOLOGY SVG ================= -->
    <svg
        viewBox="0 0 360 496"
        class="block sm:hidden h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
    >
        <!-- Conduits Layer -->
        <g v-for="c in mobileConduits" :key="c.id">
            <path
                :d="c.d"
                class="conduit-shield"
                fill="none"
                pathLength="1"
                :style="drawStyle(c.window)"
            />
            <path
                :d="c.d"
                class="conduit-core"
                fill="none"
                pathLength="1"
                :style="drawStyle(c.window)"
            />
            <path
                :d="c.d"
                :class="`conduit-flow-${c.flow}`"
                fill="none"
                :style="{ opacity: flowOpacity }"
            />
        </g>

        <!-- Junction Dots -->
        <circle :cx="180" :cy="135" :r="4" fill="#059669" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.42, 0.54) }" />
        <circle :cx="92" :cy="135" :r="3.5" fill="#059669" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.42, 0.54) }" />
        <circle :cx="268" :cy="135" :r="3.5" fill="#059669" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.42, 0.54) }" />
        <circle :cx="180" :cy="282" :r="4" fill="#2563eb" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.28, 0.42) }" />
        <circle :cx="92" :cy="282" :r="3.5" fill="#d97706" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.28, 0.42) }" />
        <circle :cx="268" :cy="282" :r="3.5" fill="#2563eb" stroke="#ffffff" :stroke-width="1.5" :style="{ opacity: win(0.28, 0.42) }" />

        <!-- CARD 1.1: GRID INTERCONNECT -->
        <foreignObject :x="10" :y="10" :width="165" :height="96">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-700/60 bg-zinc-900/95 p-2.5 rounded-xl shadow-lg backdrop-blur-md"
                :style="cardStyle(0.46, 0.66)"
            >
                <div class="flex items-center justify-between font-mono text-[9px] tracking-wider text-zinc-400 uppercase">
                    <span>Grid Interconnect</span>
                    <span class="font-bold text-blue-400">ČEZ 22 kV</span>
                </div>
                <div>
                    <div class="font-mono text-base font-black text-white">6,200 kW</div>
                    <p class="text-[9px] font-medium text-zinc-400">Přeštice Substation</p>
                </div>
                <div class="flex items-center justify-between border-t border-zinc-800 pt-1 font-mono text-[8.5px] text-zinc-400">
                    <span>Arbitrage:</span>
                    <span class="font-bold text-emerald-400">€95–€98/MWh</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 1.2: GRID BALANCING -->
        <foreignObject :x="185" :y="10" :width="165" :height="96">
            <div
                class="flex h-full w-full flex-col justify-between border border-emerald-500/40 bg-emerald-950/40 p-2.5 rounded-xl shadow-lg backdrop-blur-md"
                :style="cardStyle(0.36, 0.56)"
            >
                <div class="flex items-center justify-between font-mono text-[9px] font-bold tracking-wider text-emerald-400 uppercase">
                    <span>Balancing</span>
                    <span class="font-black text-emerald-300">ČEPS aFRR+</span>
                </div>
                <div>
                    <div class="font-mono text-base font-black text-emerald-400">&lt; 10 ms</div>
                    <p class="text-[9px] font-bold text-emerald-300">Fast Primary</p>
                </div>
                <div class="flex items-center justify-between border-t border-emerald-900/60 pt-1 font-mono text-[8.5px] text-emerald-400">
                    <span>Regulation:</span>
                    <span class="font-bold text-emerald-200">FCR ±200mHz</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 2: WATTINO hBESS HERO INVERTER HUB -->
        <foreignObject :x="16" :y="155" :width="328" :height="106">
            <div
                class="flex h-full w-full flex-col justify-between border-2 border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-[0_0_24px_rgba(37,99,235,0.4)] backdrop-blur-md"
                :style="cardStyle(0.14, 0.32)"
            >
                <div class="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-blue-100 uppercase">
                    <div class="flex items-center gap-1.5">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span>WATTINO hBESS</span>
                    </div>
                    <span class="border border-white/40 px-1.5 py-0.5 text-[9px] font-bold text-white rounded bg-white/10">50 Racks</span>
                </div>
                <div>
                    <div class="font-mono text-xl font-black text-white">PCS 200 kW</div>
                    <p class="text-[10px] font-semibold text-blue-100">Peak Discharge Active</p>
                </div>
                <div class="flex items-center justify-between border-t border-white/20 pt-1 font-mono text-[9.5px] text-white">
                    <span>Project IRR:</span>
                    <strong class="font-black text-white">21.8% p.a. • SolScan Verified</strong>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 3.1: CERBO-S GX SCADA GATEWAY -->
        <foreignObject :x="10" :y="300" :width="165" :height="86">
            <div
                class="flex h-full w-full flex-col justify-between border border-amber-500/40 bg-zinc-900/95 p-2 rounded-xl shadow-lg backdrop-blur-md"
                :style="cardStyle(0.3, 0.5)"
            >
                <div class="flex items-center justify-between font-mono text-[9px] font-bold tracking-wider text-amber-400 uppercase">
                    <span>Gateway</span>
                    <span class="text-amber-300">Venus OS</span>
                </div>
                <div>
                    <div class="font-mono text-base font-black text-amber-300">10 ms RTT</div>
                    <p class="text-[8.5px] text-zinc-400">Modbus TCP / CAN</p>
                </div>
                <div class="flex items-center justify-between border-t border-zinc-800 pt-0.5 font-mono text-[8.5px] text-zinc-400">
                    <span>Solana Oracle:</span>
                    <span class="font-bold text-emerald-400">ČEPS</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 3.2: THERMAL BUFFER & SAFETY -->
        <foreignObject :x="185" :y="300" :width="165" :height="86">
            <div
                class="flex h-full w-full flex-col justify-between border border-zinc-700/60 bg-zinc-900/95 p-2 rounded-xl shadow-lg backdrop-blur-md"
                :style="cardStyle(0.5, 0.7)"
            >
                <div class="flex items-center justify-between font-mono text-[9px] tracking-wider text-zinc-400 uppercase">
                    <span>Cooling & Safety</span>
                    <span class="font-bold text-rose-400">IP54</span>
                </div>
                <div>
                    <div class="font-mono text-base font-black text-rose-400">31.8 °C</div>
                    <p class="text-[8.5px] text-zinc-400">Liquid Cooling Buffer</p>
                </div>
                <div class="flex items-center justify-between border-t border-zinc-800 pt-0.5 font-mono text-[8.5px] text-zinc-400">
                    <span>Barrier:</span>
                    <span class="font-bold text-zinc-200">Class A1 100mm</span>
                </div>
            </div>
        </foreignObject>

        <!-- CARD 4: SAMSUNG SDI BATTERY RACKS -->
        <foreignObject :x="12" :y="408" :width="336" :height="84">
            <div
                class="flex h-full w-full flex-col justify-between border border-emerald-500/50 bg-zinc-900/95 p-2.5 rounded-xl shadow-xl backdrop-blur-md"
                :style="cardStyle(0.0, 0.16, false)"
            >
                <div class="flex items-center justify-between font-mono text-[9.5px] font-bold tracking-wider text-emerald-400 uppercase">
                    <span>Samsung SDI Battery</span>
                    <span class="text-zinc-400 font-mono">666 VDC</span>
                </div>
                <div>
                    <div class="flex items-baseline justify-between font-mono text-lg font-black text-emerald-400">
                        <span>68.4% SoC</span>
                        <span class="text-[9px] font-normal text-zinc-400">Active Storage</span>
                    </div>
                    <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                            class="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all duration-300 rounded-full"
                            :style="{ width: `${68.4 * win(0.1, 0.4)}%` }"
                        ></div>
                    </div>
                </div>
                <div class="flex items-center justify-between border-t border-zinc-800 pt-1 font-mono text-[9px] text-zinc-400">
                    <span>Warranty:</span>
                    <span class="font-bold text-zinc-200">10+10 Years EU</span>
                </div>
            </div>
        </foreignObject>
    </svg>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ assemble?: number }>(), {
    assemble: 1,
});

const mobileConduits = [
    { id: 'm-batt-hub', d: 'M 180 408 V 261', flow: 'emerald', window: [0.16, 0.3] },
    { id: 'm-hub-scada', d: 'M 180 261 V 282 H 92 V 300', flow: 'amber', window: [0.24, 0.38] },
    { id: 'm-hub-thermal', d: 'M 180 261 V 282 H 268 V 300', flow: 'sky', window: [0.3, 0.44] },
    { id: 'm-grid-hub', d: 'M 92 106 V 135 H 180 V 155', flow: 'emerald', window: [0.38, 0.54] },
    { id: 'm-bal-hub', d: 'M 268 106 V 135 H 180 V 155', flow: 'emerald', window: [0.44, 0.58] },
] as const;


// Conduits exactly as in the original (lines expressed as paths so they can be drawn on)
const conduits = [
    // 6. Battery → PCS hub first: power flows out of the storage the 3D model just became
    { id: 'battery-hub', d: 'M 385 345 L 385 310', flow: 'emerald', window: [0.16, 0.3] },
    { id: 'battery-scada', d: 'M 490 410 L 535 410', flow: 'amber', window: [0.24, 0.38] },
    { id: 'ems-hub', d: 'M 385 145 L 385 180', flow: 'emerald', window: [0.3, 0.42] },
    { id: 'trafo-hub', d: 'M 235 245 L 280 245', flow: 'amber', window: [0.34, 0.46] },
    { id: 'grid-drop', d: 'M 130 145 L 130 245', flow: 'emerald', window: [0.4, 0.56] },
    { id: 'hub-safety', d: 'M 490 245 L 535 245', flow: 'sky', window: [0.44, 0.56] },
    { id: 'hub-thermal', d: 'M 512 245 V 145 H 535', flow: 'sky', window: [0.5, 0.66] },
] as const;

function win(a: number, b: number): number {
    return Math.min(1, Math.max(0, (props.assemble - a) / (b - a)));
}

function drawStyle(window: readonly [number, number]) {
    const t = win(window[0], window[1]);

    return { strokeDasharray: '1', strokeDashoffset: `${1 - t}`, opacity: t > 0 ? 1 : 0 };
}

function cardStyle(a: number, b: number, lift = true) {
    const t = win(a, b);
    const eased = 1 - Math.pow(1 - t, 3);

    return {
        opacity: eased,
        transform: lift ? `translateY(${(1 - eased) * 14}px) scale(${0.96 + 0.04 * eased})` : undefined,
    };
}

const flowOpacity = computed(() => win(0.78, 0.95));
</script>

<style scoped>
/* Same CSS block as the original component */
@keyframes pulseFlow {
    from {
        stroke-dashoffset: 24;
    }
    to {
        stroke-dashoffset: 0;
    }
}
.conduit-flow-emerald {
    stroke: #059669;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 6 6;
    animation: pulseFlow 1.2s linear infinite;
}
.conduit-flow-amber {
    stroke: #d97706;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 6 6;
    animation: pulseFlow 1.4s linear infinite;
}
.conduit-flow-sky {
    stroke: #2563eb;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 6 6;
    animation: pulseFlow 1.2s linear infinite;
}
.conduit-shield {
    stroke: rgba(0, 0, 0, 0.06);
    stroke-width: 8;
    stroke-linecap: round;
}
.conduit-core {
    stroke: #cbd5e1;
    stroke-width: 3;
    stroke-linecap: round;
}
</style>
