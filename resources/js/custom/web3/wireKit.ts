/**
 * Tiny toolkit for the line-only ("mesh wireframe") 3D models used on the /web3 story.
 * Every model is a THREE.LineSegments with vertex colours, built in the order it should be "drawn",
 * so `geometry.setDrawRange()` can reveal it line by line while scrolling.
 */
import * as THREE from 'three';

export type V3 = [number, number, number];

export const WIRE = {
    ground: new THREE.Color('#1d4ed8'),
    frame: new THREE.Color('#9fd3ff'),
    skin: new THREE.Color('#4d8dff'),
    detail: new THREE.Color('#7dd3fc'),
    white: new THREE.Color('#e6f2ff'),
    green: new THREE.Color('#34d399'),
    amber: new THREE.Color('#fbbf24'),
};

export class LineBuilder {
    positions: number[] = [];
    colors: number[] = [];

    seg(a: V3, b: V3, c: THREE.Color): this {
        this.positions.push(...a, ...b);
        this.colors.push(c.r, c.g, c.b, c.r, c.g, c.b);

        return this;
    }

    poly(points: V3[], c: THREE.Color, closed = false): this {
        for (let i = 0; i < points.length - 1; i++) {
            this.seg(points[i], points[i + 1], c);
        }

        if (closed && points.length > 2) {
            this.seg(points[points.length - 1], points[0], c);
        }

        return this;
    }

    box(min: V3, max: V3, c: THREE.Color): this {
        const [x0, y0, z0] = min;
        const [x1, y1, z1] = max;
        this.poly(
            [
                [x0, y0, z0],
                [x1, y0, z0],
                [x1, y0, z1],
                [x0, y0, z1],
            ],
            c,
            true,
        );
        this.poly(
            [
                [x0, y1, z0],
                [x1, y1, z0],
                [x1, y1, z1],
                [x0, y1, z1],
            ],
            c,
            true,
        );
        this.seg([x0, y0, z0], [x0, y1, z0], c);
        this.seg([x1, y0, z0], [x1, y1, z0], c);
        this.seg([x1, y0, z1], [x1, y1, z1], c);
        this.seg([x0, y0, z1], [x0, y1, z1], c);

        return this;
    }

    /** Circle; axis 'x' → circle in YZ, 'y' → XZ (horizontal), 'z' → XY */
    circle(center: V3, r: number, axis: 'x' | 'y' | 'z', c: THREE.Color, n = 24): this {
        const pts: V3[] = [];

        for (let i = 0; i < n; i++) {
            const t = (i / n) * Math.PI * 2;
            const a = Math.cos(t) * r;
            const b = Math.sin(t) * r;

            if (axis === 'x') {
                pts.push([center[0], center[1] + a, center[2] + b]);
            } else if (axis === 'y') {
                pts.push([center[0] + a, center[1], center[2] + b]);
            } else {
                pts.push([center[0] + a, center[1] + b, center[2]]);
            }
        }

        return this.poly(pts, c, true);
    }

    /** Rounded rectangle in the XY plane at depth z */
    roundRect(cx: number, cy: number, w: number, h: number, r: number, z: number, c: THREE.Color, seg = 6): this {
        return this.poly(roundRectPoints(cx, cy, w, h, r, z, seg), c, true);
    }

    get vertexCount(): number {
        return this.positions.length / 3;
    }

    geometry(): THREE.BufferGeometry {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
        g.computeBoundingSphere();

        return g;
    }
}

export function roundRectPoints(cx: number, cy: number, w: number, h: number, r: number, z: number, seg = 6): V3[] {
    const pts: V3[] = [];
    const corners: [number, number, number][] = [
        [cx + w / 2 - r, cy + h / 2 - r, 0],
        [cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2],
        [cx - w / 2 + r, cy - h / 2 + r, Math.PI],
        [cx + w / 2 - r, cy - h / 2 + r, (Math.PI * 3) / 2],
    ];

    for (const [x, y, a0] of corners) {
        for (let i = 0; i <= seg; i++) {
            const a = a0 + (i / seg) * (Math.PI / 2);
            pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r, z]);
        }
    }

    return pts;
}

export function lineMaterial(opacity = 0.95): THREE.LineBasicMaterial {
    return new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
}

/** Floor grid whose lines fade out radially (fade lives in vertex alpha → no dark seams on a transparent canvas) */
export function fadingGrid(ext: number, step: number, color = '#2f5fd0', squash = 1.6): THREE.LineSegments {
    const pts: number[] = [];
    const cols: number[] = [];
    const base = new THREE.Color(color);
    const sub = step / 2;
    const fade = (x: number, z: number) => Math.max(0, 1 - Math.hypot(x, z * squash) / ext) ** 2;
    const push = (ax: number, az: number, bx: number, bz: number) => {
        pts.push(ax, 0, az, bx, 0, bz);
        cols.push(base.r, base.g, base.b, fade(ax, az), base.r, base.g, base.b, fade(bx, bz));
    };

    for (let v = -ext; v <= ext + 0.001; v += step) {
        for (let u = -ext; u < ext - 0.001; u += sub) {
            push(u, v, u + sub, v);
            push(v, u, v, u + sub);
        }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 4));

    return new THREE.LineSegments(
        g,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false }),
    );
}

// ---------------------------------------------------------------------------------------------
// Models (all with the origin on the ground)
// ---------------------------------------------------------------------------------------------

/** Utility-scale wind turbine; returns the static part and the rotor (spin it around its local Z) */
export function windTurbine(height = 1): { body: LineBuilder; rotor: LineBuilder; hub: V3 } {
    const body = new LineBuilder();
    const H = height;
    const r0 = 0.035 * H;
    const r1 = 0.018 * H;
    const sides = 6;

    // foundation ring
    body.circle([0, 0, 0], r0 * 2.6, 'y', WIRE.ground, 16);

    // tapered tower: longitudinal lines + a few rings
    for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        body.seg([Math.cos(a) * r0, 0, Math.sin(a) * r0], [Math.cos(a) * r1, H * 0.86, Math.sin(a) * r1], WIRE.frame);
    }

    for (const t of [0.0, 0.3, 0.6, 0.86]) {
        body.circle([0, H * t, 0], r0 + (r1 - r0) * (t / 0.86), 'y', WIRE.skin, sides);
    }

    // nacelle
    const top = H * 0.86;
    body.box([-0.035 * H, top, -0.11 * H], [0.035 * H, top + 0.06 * H, 0.05 * H], WIRE.frame);
    const hub: V3 = [0, top + 0.03 * H, 0.07 * H];

    const rotor = new LineBuilder();
    rotor.circle([0, 0, 0], 0.022 * H, 'z', WIRE.amber, 10);
    const L = 0.42 * H;

    for (let b = 0; b < 3; b++) {
        const a = (b / 3) * Math.PI * 2;
        const dir = [Math.cos(a), Math.sin(a)];
        const nrm = [-dir[1], dir[0]];
        const p = (along: number, side: number): V3 => [
            dir[0] * along + nrm[0] * side,
            dir[1] * along + nrm[1] * side,
            0,
        ];
        rotor.poly([p(0.02 * H, 0.012 * H), p(0.12 * H, 0.03 * H), p(L, 0.006 * H), p(L, -0.004 * H), p(0.02 * H, -0.012 * H)], WIRE.white, true);
        rotor.seg(p(0.03 * H, 0), p(L * 0.95, 0), WIRE.detail);
    }

    return { body, rotor, hub };
}

/** Ground-mounted PV array: rows of tilted tables with a cell grid */
export function solarArray(rows = 3, tables = 4): LineBuilder {
    const b = new LineBuilder();
    const tw = 0.34;
    const td = 0.18;
    const gap = 0.05;
    const rowGap = 0.3;
    const tilt = 0.5;
    const w = tables * (tw + gap) - gap;
    const d = rows * rowGap;

    // site boundary
    b.poly(
        [
            [-w / 2 - 0.08, 0, -d / 2 - 0.08],
            [w / 2 + 0.08, 0, -d / 2 - 0.08],
            [w / 2 + 0.08, 0, d / 2 + 0.08],
            [-w / 2 - 0.08, 0, d / 2 + 0.08],
        ],
        WIRE.ground,
        true,
    );

    for (let r = 0; r < rows; r++) {
        const z0 = -d / 2 + r * rowGap + 0.04;

        for (let t = 0; t < tables; t++) {
            const x0 = -w / 2 + t * (tw + gap);
            const x1 = x0 + tw;
            const yLow = 0.05;
            const yHigh = yLow + Math.sin(tilt) * td;
            const zFront = z0 + td * Math.cos(tilt);
            const corner = (x: number, k: number): V3 => [x, yHigh + (yLow - yHigh) * k, z0 + (zFront - z0) * k];

            // legs
            b.seg([x0 + 0.02, 0, z0], corner(x0 + 0.02, 0), WIRE.frame);
            b.seg([x1 - 0.02, 0, z0], corner(x1 - 0.02, 0), WIRE.frame);
            b.seg([x0 + 0.02, 0, zFront], corner(x0 + 0.02, 1), WIRE.frame);
            b.seg([x1 - 0.02, 0, zFront], corner(x1 - 0.02, 1), WIRE.frame);
            // panel outline + cells
            b.poly([corner(x0, 0), corner(x1, 0), corner(x1, 1), corner(x0, 1)], WIRE.detail, true);

            for (let c = 1; c < 4; c++) {
                const x = x0 + (tw / 4) * c;
                b.seg(corner(x, 0), corner(x, 1), WIRE.skin);
            }

            b.seg(corner(x0, 0.5), corner(x1, 0.5), WIRE.skin);
        }
    }

    return b;
}

/** EV charging hub: canopy on posts, chargers with cables, marked bays */
export function evHub(bays = 3): LineBuilder {
    const b = new LineBuilder();
    const bw = 0.26;
    const w = bays * bw;
    const d = 0.5;

    // bays
    for (let i = 0; i <= bays; i++) {
        const x = -w / 2 + i * bw;
        b.seg([x, 0, 0], [x, 0, d], WIRE.ground);
    }

    b.seg([-w / 2, 0, d], [w / 2, 0, d], WIRE.ground);

    // canopy
    const ch = 0.42;

    for (const x of [-w / 2, w / 2]) {
        for (const z of [-0.04, d * 0.7]) {
            b.seg([x, 0, z], [x, ch, z], WIRE.frame);
        }
    }

    b.box([-w / 2 - 0.05, ch, -0.08], [w / 2 + 0.05, ch + 0.035, d * 0.78], WIRE.frame);

    // chargers + cables
    for (let i = 0; i < bays; i++) {
        const x = -w / 2 + i * bw + bw / 2;
        b.box([x - 0.035, 0, -0.03], [x + 0.035, 0.22, 0.02], WIRE.detail);
        b.roundRect(x, 0.16, 0.04, 0.04, 0.008, 0.021, WIRE.green, 2);
        const cable: V3[] = [];

        for (let k = 0; k <= 8; k++) {
            const t = k / 8;
            cable.push([x + 0.035 + t * 0.04, 0.12 - Math.sin(t * Math.PI) * 0.08, 0.0 + t * 0.08]);
        }

        b.poly(cable, WIRE.amber);
    }

    return b;
}

/** 40 ft battery container (simplified version of the hero model), origin at its centre on the ground */
export function batteryContainer(scale = 1): LineBuilder {
    const b = new LineBuilder();
    const L = 6.06 * scale;
    const H = 2.6 * scale;
    const D = 2.44 * scale;
    const x0 = -L / 2;
    const z0 = -D / 2;

    b.box([x0 - 0.2 * scale, -0.15 * scale, z0 - 0.2 * scale], [x0 + L + 0.2 * scale, 0, z0 + D + 0.2 * scale], WIRE.ground);
    b.box([x0, 0, z0], [x0 + L, H, z0 + D], WIRE.frame);

    for (let x = x0 + 0.27 * scale; x < x0 + L - 0.1 * scale; x += 0.27 * scale) {
        b.seg([x, 0.1 * scale, z0 + D], [x, H - 0.1 * scale, z0 + D], WIRE.skin);
        b.seg([x, 0.1 * scale, z0], [x, H - 0.1 * scale, z0], WIRE.skin);
    }

    for (let r = 0; r < 4; r++) {
        const rx = x0 + 0.5 * scale + r * 1.3 * scale;
        b.box([rx, 0.12 * scale, z0 + 0.2 * scale], [rx + 1.1 * scale, H - 0.4 * scale, z0 + 0.9 * scale], WIRE.green);
        b.box([rx, 0.12 * scale, z0 + D - 0.9 * scale], [rx + 1.1 * scale, H - 0.4 * scale, z0 + D - 0.2 * scale], WIRE.green);
    }

    // HVAC on the end wall
    b.box([x0 + L, 0.5 * scale, z0 + 0.4 * scale], [x0 + L + 0.3 * scale, 1.5 * scale, z0 + D - 0.4 * scale], WIRE.detail);
    b.circle([x0 + L + 0.31 * scale, 1.0 * scale, 0], 0.32 * scale, 'x', WIRE.detail, 20);

    return b;
}
