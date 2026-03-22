<template>
    <div
        class="relative inline-flex items-center justify-center overflow-hidden
               rounded-3xl border border-white/30
               bg-linear-to-br from-white/20 via-white/8 to-white/5
               transition-transform duration-700
               [backdrop-filter:url(#liquid-glass)]
               ease-[cubic-bezier(0.175,0.885,0.32,2.2)]"
        :style="{ WebkitBackdropFilter: 'url(#liquid-glass)' }"
    >
        <span aria-hidden="true" class="lg-noise pointer-events-none absolute inset-0 z-1 rounded-[inherit] opacity-[0.03]" />

        <div class="relative z-2 p-6">
            <slot>Placeholder</slot>
        </div>
    </div>
</template>

<style scoped>
.lg-noise {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
