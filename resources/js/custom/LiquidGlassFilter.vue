<template>
    <!-- Global liquid-glass SVG filter (#liquid-glass) -->
    <svg aria-hidden="true" class="absolute h-0 w-0 overflow-hidden">
        <defs>
            <filter id="liquid-glass">
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" seed="2" result="turb" />
                <feDisplacementMap in="SourceGraphic" in2="turb" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
</template>