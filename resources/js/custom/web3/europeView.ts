/** Camera framing of the Europe map, shared by the SVG map and the 3D asset overlay on top of it. */

// Map-space coordinates (viewBox 680x520) of the real assets
export const PRESTICE = { x: 334.9, y: 343.1 };
export const KRYRY = { x: 335.7, y: 335.8 };
export const PARIS_NORD = { x: 245.5, y: 349.6 };

// Aspect 1.6. Start: Scandinavia → Mediterranean. End: the battery site in Přeštice.
const FROM = { cx: 345, cy: 262, w: 520 };
const FROM_PORTRAIT = { cx: 338, cy: 308, w: 420 };
const TO = { cx: PRESTICE.x + 0.5, cy: PRESTICE.y - 2, w: 62 };

export interface ViewBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function europeViewBox(zoom: number, isPortrait = false): ViewBox {
    const from = isPortrait ? FROM_PORTRAIT : FROM;
    // Interpolate in log-space for the width so the zoom feels linear to the eye
    const t = Math.min(1, Math.max(0, zoom));
    const w = Math.exp(Math.log(from.w) + (Math.log(TO.w) - Math.log(from.w)) * t);
    const k = (from.w - w) / (from.w - TO.w);
    const cx = from.cx + (TO.cx - from.cx) * k;
    const cy = from.cy + (TO.cy - from.cy) * k;
    const h = w / 1.6;

    return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Pixels per map unit for `preserveAspectRatio="xMidYMid slice"` */
export function viewScale(vb: ViewBox, width: number, height: number): number {
    return Math.max(width / vb.w, height / vb.h);
}

/** Map coordinates → screen pixels inside a width × height box (slice scaling, centred) */
export function mapToScreen(x: number, y: number, vb: ViewBox, width: number, height: number): [number, number] {
    const s = viewScale(vb, width, height);
    const ox = (width - vb.w * s) / 2;
    const oy = (height - vb.h * s) / 2;

    return [(x - vb.x) * s + ox, (y - vb.y) * s + oy];
}
