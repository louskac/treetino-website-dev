/**
 * Shared helpers for the line-drawn three.js scenes on /investors.
 * Geometry primitives come from `@/custom/web3/wireKit` (read-only); this file only adds
 * investor-specific objects (charger, car, building, pylon) and small utilities.
 */
import * as THREE from 'three';
import type { V3 } from '@/custom/web3/wireKit';
import { LineBuilder, roundRectPoints, WIRE } from '@/custom/web3/wireKit';

export const dim = (c: THREE.Color, k: number) => c.clone().multiplyScalar(k);

/** Soft round sprite for glowing particles */
export function glowTexture(core = 'rgba(255,236,170,0.95)', edge = 'rgba(251,191,36,0.35)', fade = 'rgba(251,191,36,0)'): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, core);
    g.addColorStop(0.42, edge);
    g.addColorStop(1, fade);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(c);
}

export function glowMaterial(map: THREE.Texture, color: THREE.ColorRepresentation, size: number): THREE.PointsMaterial {
    return new THREE.PointsMaterial({
        map,
        color,
        size,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
}

/** Polyline sampled by arc length, so particles move at a constant speed */
export class Path {
    readonly pts: V3[];
    private readonly cum: number[] = [0];
    readonly length: number;

    constructor(pts: V3[]) {
        this.pts = pts;

        for (let i = 1; i < pts.length; i++) {
            const [ax, ay, az] = pts[i - 1];
            const [bx, by, bz] = pts[i];
            this.cum.push(this.cum[i - 1] + Math.hypot(bx - ax, by - ay, bz - az));
        }

        this.length = this.cum[this.cum.length - 1] || 1;
    }

    at(t: number, out: THREE.Vector3): THREE.Vector3 {
        const d = Math.min(1, Math.max(0, t)) * this.length;
        let i = 1;

        while (i < this.cum.length - 1 && this.cum[i] < d) {
            i++;
        }

        const seg = this.cum[i] - this.cum[i - 1] || 1;
        const k = (d - this.cum[i - 1]) / seg;
        const a = this.pts[i - 1];
        const b = this.pts[i];

        return out.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
    }
}

/** Arc lifted by `h` in the middle (sin profile) */
export function arcPoints(a: V3, b: V3, h: number, n = 28): V3[] {
    const pts: V3[] = [];

    for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * h, a[2] + (b[2] - a[2]) * t]);
    }

    return pts;
}

/** Copy `src` into `dst`, scaled around the origin and then offset */
export function mergeInto(dst: LineBuilder, src: LineBuilder, offset: V3 = [0, 0, 0], scale = 1): LineBuilder {
    for (let i = 0; i < src.positions.length; i += 3) {
        dst.positions.push(src.positions[i] * scale + offset[0], src.positions[i + 1] * scale + offset[1], src.positions[i + 2] * scale + offset[2]);
    }

    dst.colors.push(...src.colors);

    return dst;
}

/** Horizontal rounded rectangle (XZ plane) at height y */
export function roundRectXZ(b: LineBuilder, cx: number, cz: number, w: number, d: number, r: number, y: number, c: THREE.Color, seg = 4): V3[] {
    const pts = roundRectPoints(cx, cz, w, d, r, 0, seg).map(([x, z]) => [x, y, z] as V3);
    b.poly(pts, c, true);

    return pts;
}

// ---------------------------------------------------------------------------------------------
// Objects (origin on the ground, facing +z)
// ---------------------------------------------------------------------------------------------

/** Compact AC charger pillar with screen and card reader; height ≈ 1.9 × scale */
export function chargerPillar(scale = 1, screenColor = WIRE.green): LineBuilder {
    const b = new LineBuilder();
    const s = scale;
    const w = 0.56 * s;
    const d = 0.34 * s;
    const h = 1.9 * s;
    const r = 0.1 * s;
    const fz = d / 2 + 0.005 * s;

    // plinth
    b.box([-w / 2 - 0.08 * s, 0, -d / 2 - 0.08 * s], [w / 2 + 0.08 * s, 0.06 * s, d / 2 + 0.08 * s], WIRE.ground);
    // rounded column: rings + vertical edges
    const rings = [0.06, 0.5, 1.35, h / s].map((y) => roundRectXZ(b, 0, 0, w, d, r, y * s, y === h / s ? WIRE.frame : dim(WIRE.skin, 0.85)));
    const bottom = rings[0];
    const top = rings[rings.length - 1];

    for (let i = 0; i < bottom.length; i += 3) {
        b.seg(bottom[i], top[i], WIRE.frame);
    }

    // screen, card reader, socket
    b.roundRect(0, 1.52 * s, 0.4 * s, 0.26 * s, 0.03 * s, fz, screenColor, 3);
    b.roundRect(0, 1.12 * s, 0.24 * s, 0.16 * s, 0.03 * s, fz, WIRE.detail, 3);
    b.circle([0, 0.72 * s, fz], 0.06 * s, 'z', WIRE.frame, 14);
    b.circle([0, 0.72 * s, fz], 0.03 * s, 'z', WIRE.skin, 10);
    // status light strip
    b.seg([-w / 2 + 0.02 * s, 0.3 * s, fz], [-w / 2 + 0.02 * s, 1.75 * s, fz], dim(WIRE.green, 0.7));

    return b;
}

/** Contactless symbol: three arcs in the XY plane */
export function contactless(b: LineBuilder, cx: number, cy: number, z: number, size: number, c: THREE.Color) {
    for (let k = 1; k <= 3; k++) {
        const r = size * (0.32 + k * 0.22);
        const pts: V3[] = [];

        for (let i = 0; i <= 10; i++) {
            const a = -0.75 + (i / 10) * 1.5;
            pts.push([cx - size * 0.35 + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
        }

        b.poly(pts, c);
    }
}

/** Passenger car, long axis along z, centred on the origin; length ≈ 4.6 × scale */
export function carLines(scale = 1): LineBuilder {
    const b = new LineBuilder();
    const s = scale;
    const profile: [number, number][] = [
        [-2.3, 0.38],
        [-2.32, 0.75],
        [-2.05, 0.95],
        [-1.05, 1.05],
        [-0.45, 1.45],
        [0.85, 1.45],
        [1.55, 1.02],
        [2.2, 0.88],
        [2.3, 0.55],
        [2.25, 0.38],
    ];
    const halfW = 0.9;
    const at = (z: number, y: number, x: number): V3 => [x * s, y * s, z * s];

    for (const sx of [-halfW, halfW]) {
        b.poly(profile.map(([z, y]) => at(z, y, sx)), WIRE.white);
        b.seg(at(-2.25, 0.38, sx), at(-1.85, 0.38, sx), WIRE.white);
        b.seg(at(-0.95, 0.38, sx), at(0.95, 0.38, sx), WIRE.white);
        b.seg(at(1.85, 0.38, sx), at(2.25, 0.38, sx), WIRE.white);
        b.poly([at(-0.95, 1.06, sx), at(-0.4, 1.38, sx), at(0.8, 1.38, sx), at(1.38, 1.04, sx)], WIRE.detail, true);

        for (const wz of [-1.4, 1.4]) {
            b.circle(at(wz, 0.36, sx), 0.36 * s, 'x', WIRE.frame, 18);
            b.circle(at(wz, 0.36, sx), 0.18 * s, 'x', WIRE.skin, 12);
        }
    }

    for (const [z, y] of profile) {
        b.seg(at(z, y, -halfW), at(z, y, halfW), dim(WIRE.skin, 0.8));
    }

    return b;
}

/** Two-storey office block with a window grid, centred on the origin */
export function buildingLines(w = 2.6, d = 1.8, h = 2.1): LineBuilder {
    const b = new LineBuilder();
    b.box([-w / 2, 0, -d / 2], [w / 2, h, d / 2], WIRE.frame);
    // parapet
    b.box([-w / 2 + 0.06, h, -d / 2 + 0.06], [w / 2 - 0.06, h + 0.1, d / 2 - 0.06], dim(WIRE.skin, 0.8));
    // floor line
    b.seg([-w / 2, h / 2, d / 2], [w / 2, h / 2, d / 2], dim(WIRE.skin, 0.7));
    b.seg([w / 2, h / 2, -d / 2], [w / 2, h / 2, d / 2], dim(WIRE.skin, 0.7));

    const win = (x0: number, x1: number, y0: number, y1: number, z: number) =>
        b.poly(
            [
                [x0, y0, z],
                [x1, y0, z],
                [x1, y1, z],
                [x0, y1, z],
            ],
            WIRE.detail,
            true,
        );
    const winSide = (z0: number, z1: number, y0: number, y1: number, x: number) =>
        b.poly(
            [
                [x, y0, z0],
                [x, y0, z1],
                [x, y1, z1],
                [x, y1, z0],
            ],
            WIRE.detail,
            true,
        );

    for (const [y0, y1] of [
        [0.25, h / 2 - 0.2],
        [h / 2 + 0.2, h - 0.25],
    ]) {
        const n = 4;
        const cw = w / n;

        for (let i = 0; i < n; i++) {
            if (y0 < 0.5 && i === 1) {
                // entrance
                b.poly(
                    [
                        [-w / 2 + cw * i + 0.12, 0, d / 2],
                        [-w / 2 + cw * i + 0.12, h / 2 - 0.2, d / 2],
                        [-w / 2 + cw * (i + 1) - 0.12, h / 2 - 0.2, d / 2],
                        [-w / 2 + cw * (i + 1) - 0.12, 0, d / 2],
                    ],
                    WIRE.white,
                );
                continue;
            }

            win(-w / 2 + cw * i + 0.1, -w / 2 + cw * (i + 1) - 0.1, y0, y1, d / 2);
        }

        for (let i = 0; i < 3; i++) {
            const cd = d / 3;
            winSide(-d / 2 + cd * i + 0.1, -d / 2 + cd * (i + 1) - 0.1, y0, y1, w / 2);
        }
    }

    return b;
}

/** Lattice transmission pylon; returns the lines and the insulator tips (wire attachment points) */
export function pylonLines(h = 3.6): { lines: LineBuilder; tips: V3[] } {
    const b = new LineBuilder();
    const base = 0.5;
    const top = 0.12;
    const levels = 6;
    const half = (y: number) => base + (top - base) * (y / h);
    const corners = (y: number): V3[] => {
        const r = half(y);

        return [
            [-r, y, -r],
            [r, y, -r],
            [r, y, r],
            [-r, y, r],
        ];
    };

    for (let k = 0; k < 4; k++) {
        b.seg(corners(0)[k], corners(h)[k], WIRE.frame);
    }

    for (let l = 0; l < levels; l++) {
        const y0 = (h / levels) * l;
        const y1 = (h / levels) * (l + 1);
        const c0 = corners(y0);
        const c1 = corners(y1);
        b.poly(c1, dim(WIRE.skin, 0.8), true);

        for (let k = 0; k < 4; k++) {
            b.seg(c0[k], c1[(k + 1) % 4], dim(WIRE.skin, 0.55));
            b.seg(c0[(k + 1) % 4], c1[k], dim(WIRE.skin, 0.55));
        }
    }

    // cross arms with hanging insulators
    const tips: V3[] = [];

    for (const [y, span] of [
        [h * 0.78, 1.05],
        [h * 0.95, 0.75],
    ]) {
        b.seg([-span, y, 0], [span, y, 0], WIRE.frame);
        b.seg([-half(y), y - 0.25, 0], [-span, y, 0], dim(WIRE.skin, 0.7));
        b.seg([half(y), y - 0.25, 0], [span, y, 0], dim(WIRE.skin, 0.7));

        for (const x of [-span + 0.05, span - 0.05]) {
            b.seg([x, y, 0], [x, y - 0.22, 0], WIRE.detail);
            tips.push([x, y - 0.22, 0]);
        }
    }

    b.seg([0, h, 0], [0, h + 0.25, 0], WIRE.frame);

    return { lines: b, tips };
}

/** Bank card in the XY plane, centred on the origin */
export function cardLines(w = 0.3): LineBuilder {
    const b = new LineBuilder();
    const h = w * 0.63;
    b.roundRect(0, 0, w, h, w * 0.06, 0, WIRE.white, 4);
    // chip
    b.roundRect(-w * 0.28, h * 0.08, w * 0.16, h * 0.22, w * 0.02, 0, WIRE.amber, 2);
    b.seg([-w * 0.36, h * 0.08, 0], [-w * 0.2, h * 0.08, 0], dim(WIRE.amber, 0.7));
    contactless(b, w * 0.3, h * 0.16, 0, w * 0.12, WIRE.detail);

    // number + name
    for (let i = 0; i < 4; i++) {
        const x = -w * 0.4 + i * w * 0.2;
        b.seg([x, -h * 0.16, 0], [x + w * 0.15, -h * 0.16, 0], dim(WIRE.white, 0.7));
    }

    b.seg([-w * 0.4, -h * 0.32, 0], [-w * 0.1, -h * 0.32, 0], dim(WIRE.white, 0.5));

    return b;
}
