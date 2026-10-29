/**
 * One design language for the /investors page.
 * Every chapter pulls its container, headline and stat styles from here so nothing drifts.
 */

/** Same content width as the navbar and the rest of the site */
export const CONTAINER =
    'mx-auto w-[calc(100%-48px)] sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] lg:max-w-[1400px] xl:w-[calc(100%-400px)] max-w-[1400px]';

/** The only headline size used on the page */
export const HEADLINE =
    'text-[1.85rem] leading-[1.08] font-medium tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-[clamp(2.75rem,4vw,4rem)]';

/** Text column position inside every pinned stage (clears the floating navbar) */
export const TEXT_COLUMN =
    'absolute inset-x-0 top-32 max-w-[30rem] sm:top-36 lg:top-44 lg:max-w-[min(30rem,44%)] xl:top-[21vh] xl:max-w-[min(30rem,46%)] 2xl:max-w-[min(36rem,46%)]';

/** Stats row position inside every pinned stage */
export const STATS_ROW =
    'absolute inset-x-0 bottom-8 max-w-[30rem] sm:bottom-10 lg:bottom-[9vh] lg:max-w-[min(30rem,44%)] xl:max-w-[min(30rem,46%)] 2xl:max-w-[min(36rem,46%)]';

/** Visual area inside every pinned stage: right ~54% on desktop, lower half on mobile */
export const VISUAL_AREA =
    'absolute inset-x-0 top-[40%] bottom-28 sm:bottom-32 lg:top-[10vh] lg:bottom-[6vh] lg:left-auto lg:w-[52%]';

export const PAGE_BG = 'bg-zinc-950';

/** The only two button styles on the page */
export const BTN_PRIMARY =
    'pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-t-blue px-5 py-3 text-sm font-medium whitespace-nowrap text-white shadow-[0_0_32px_rgba(77,141,255,0.35)] transition-all duration-200 hover:shadow-[0_0_44px_rgba(77,141,255,0.6)] sm:px-6 sm:py-3.5 sm:text-base';
export const BTN_SECONDARY =
    'pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-5 py-3 text-sm font-medium whitespace-nowrap text-white backdrop-blur-md transition-colors duration-200 hover:border-white/45 hover:bg-white/[0.07] sm:px-6 sm:py-3.5 sm:text-base';

export const DATABOOK_EN = '/docs/Treetino_Technical_Databook_2026_EN.pdf';
export const DATABOOK_CS = '/docs/Treetino_Technical_Databook_2026_CS.pdf';

export interface Stat {
    value: string;
    label: string;
}

export function clamp01(v: number): number {
    return Math.min(1, Math.max(0, v));
}

export function smoothstep(a: number, b: number, v: number): number {
    const t = clamp01((v - a) / (b - a));

    return t * t * (3 - 2 * t);
}

/** Opacity/visibility style for an element that fades in with `inV` and out with `outV` */
export function fadeStyle(inV: number, outV = 0, lift = 16) {
    const op = clamp01(inV) * (1 - clamp01(outV));

    return {
        opacity: op,
        transform: `translateY(${(1 - clamp01(inV)) * lift - clamp01(outV) * lift}px)`,
        visibility: (op > 0.01 ? 'visible' : 'hidden') as 'visible' | 'hidden',
    };
}
