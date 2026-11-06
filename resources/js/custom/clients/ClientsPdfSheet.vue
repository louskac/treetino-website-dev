<script setup lang="ts">
import LogoType from '@/custom/LogoType.vue';

defineProps<{
    /** Shown top-right, e.g. "Cenová nabídka" */
    doc: string;
    page: number;
    total: number;
}>();
</script>

<template>
    <section class="pdf-sheet">
        <header class="pdf-sheet-head">
            <LogoType class-name="pdf-logo" />
            <span class="pdf-mono">{{ doc }}</span>
        </header>

        <div class="pdf-sheet-body">
            <slot />
        </div>

        <footer class="pdf-sheet-foot">
            <span>Treetino Corp s.r.o. · IČO 10800107 · info@treetino.eu · treetino.com</span>
            <span class="pdf-tabular">{{ String(page).padStart(2, '0') }} / {{ String(total).padStart(2, '0') }}</span>
        </footer>
    </section>
</template>

<style>
/* One print language for both client documents. Everything is sized in mm/pt so the A4 output is exact. */
.pdf-doc {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10mm;
    font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
    font-feature-settings: 'tnum' 1;
    color: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

.pdf-sheet {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 210mm;
    height: 297mm;
    padding: 14mm 16mm 11mm;
    overflow: hidden;
    background: #09090b;
    break-after: page;
    page-break-after: always;
}

.pdf-sheet:last-child {
    break-after: auto;
    page-break-after: auto;
}

/* Faint blueprint glow in the top-right corner — the only decoration */
.pdf-sheet::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(60% 40% at 85% 0%, rgba(47, 95, 208, 0.16), transparent 70%);
}

.pdf-sheet-head,
.pdf-sheet-foot {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pdf-logo {
    height: 4.2mm !important;
    width: auto;
    fill: #fff;
}

.pdf-sheet-body {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: 14mm;
}

.pdf-sheet-foot {
    padding-top: 4mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.1);
    font-size: 6.8pt;
    color: rgba(255, 255, 255, 0.35);
}

.pdf-mono {
    font-size: 6.8pt;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
}

.pdf-tabular {
    font-variant-numeric: tabular-nums;
}

/* Chapter mark: 01 —— LABEL (same as the /investors pages) */
.pdf-mark {
    display: flex;
    align-items: center;
    gap: 3mm;
    font-size: 7pt;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
}

.pdf-mark b {
    font-weight: 500;
    color: #8ec5ff;
}

.pdf-mark i {
    display: block;
    width: 8mm;
    height: 0.25mm;
    background: rgba(255, 255, 255, 0.2);
}

.pdf-h1 {
    margin: 5mm 0 0;
    font-size: 30pt;
    line-height: 1.06;
    font-weight: 500;
    letter-spacing: -0.035em;
}

.pdf-accent {
    color: #8ec5ff;
}

.pdf-lead {
    margin: 5mm 0 0;
    max-width: 128mm;
    font-size: 9.5pt;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.55);
}

.pdf-label {
    font-size: 7.6pt;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.45);
}

.pdf-section-title {
    font-size: 7pt;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
}

/* Stats row, identical in rhythm to <InvestorStats> */
.pdf-stats {
    display: grid;
    gap: 6mm;
    padding-top: 4.5mm;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.12);
}

.pdf-stat-value {
    font-size: 19pt;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.03em;
    white-space: nowrap;
}

.pdf-stat-value small {
    margin-left: 1mm;
    font-size: 9pt;
    letter-spacing: 0;
    color: rgba(255, 255, 255, 0.4);
}

.pdf-stat-label {
    margin-top: 2mm;
    font-size: 7.6pt;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.45);
}

/* Key/value rows */
.pdf-rows {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.8pt;
}

.pdf-rows th {
    padding: 0 0 2.4mm;
    text-align: right;
    font-size: 7pt;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
}

.pdf-rows th:not(:first-child),
.pdf-rows td:not(:first-child) {
    padding-left: 4mm;
}

.pdf-rows th:first-child {
    text-align: left;
}

.pdf-rows td {
    padding: 2.3mm 0;
    border-top: 0.25mm solid rgba(255, 255, 255, 0.08);
    text-align: right;
    white-space: nowrap;
}

.pdf-rows td:first-child {
    text-align: left;
    white-space: normal;
    color: rgba(255, 255, 255, 0.6);
}

.pdf-rows tr.is-strong td {
    font-weight: 500;
    color: #fff;
}

.pdf-rows tr.is-key td {
    border-top-color: rgba(255, 255, 255, 0.22);
    font-size: 10.5pt;
    font-weight: 500;
    color: #fff;
}

.pdf-rows tr.is-key td:not(:first-child) {
    color: #8ec5ff;
}

.pdf-rows tr.is-gap td {
    padding: 1.6mm 0;
    border-top: none;
}

.pdf-note {
    font-size: 6.9pt;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.38);
}

.pdf-img {
    display: block;
    width: 100%;
    object-fit: cover;
}

.pdf-chart text {
    font-family: 'DM Sans', sans-serif;
    font-size: 2.3px;
    fill: rgba(255, 255, 255, 0.4);
}

.pdf-chart .grid {
    stroke: rgba(255, 255, 255, 0.07);
    stroke-width: 0.2;
}

.pdf-chart .axis {
    stroke: rgba(255, 255, 255, 0.22);
    stroke-width: 0.25;
}

.pdf-legend {
    display: flex;
    gap: 5mm;
    font-size: 7pt;
    color: rgba(255, 255, 255, 0.45);
}

.pdf-legend span {
    display: inline-flex;
    align-items: center;
    gap: 1.6mm;
}

.pdf-legend i {
    display: inline-block;
    width: 4mm;
    height: 1.6mm;
}

@media print {
    @page {
        size: A4 portrait;
        margin: 0;
    }

    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #09090b !important;
    }

    .pdf-doc {
        gap: 0;
    }
}
</style>
