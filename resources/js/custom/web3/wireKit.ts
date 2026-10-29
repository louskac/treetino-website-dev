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

// ---------------------------------------------------------------------------------------------
// Treetino Energy Trees (V1, V2 Solar Disc, V2 Hybrid 6× VTE) & Vertical-Axis Turbine Pods
// ---------------------------------------------------------------------------------------------
// AI / DEVELOPER NOTE:
// Reusable 3D wireframe builders for all Treetino tree products:
//   - `treetinoV1()`        -> Commercial 49.8 kW hybrid tree (3 candelabra boughs, 12 spinning VTE pods on cantilever arms, 300-leaf tiered canopy)
//   - `treetinoV2Solar()`   -> Residential/garden 12 kW solar-only tree (`without-turbines`: tilted circular/elliptical shingled TopCon leaf disc on 6 radial primary tubular boughs)
//   - `treetinoV2Hybrid()`  -> Residential/garden 15 kW hybrid tree (`with-turbines`: same tilted V2 solar disc + 6 vertical-axis wind turbine pods rising above the 6 primary boughs)
//   - `treetinoV2({ withTurbines })` -> Configurable V2 builder (`withTurbines: false | true`)
//   - `treetinoTree(variant)` -> Unified dispatcher accepting `'v1' | 'v2-solar' | 'v2-hybrid'`
//   - `podLines(height)`    -> Spinning vertical-axis wind turbine pod (10 outer airfoil blades + 4 structural rings + inner twisted Savonius core)
// ---------------------------------------------------------------------------------------------

export type TreeVariant = 'v1' | 'v2-solar' | 'v2-hybrid';

export interface TreePod {
    base: V3;
    height: number;
}

/**
 * Vertex range of one foliage cluster inside `TreeModel.body` (in vertices, not floats),
 * plus the pivot/axis it can be rolled around to visualise sun tracking or storm stow.
 */
export interface TreePart {
    start: number;
    end: number;
    pivot: V3;
    axis: V3;
}

export interface TreeModel {
    body: LineBuilder;
    pods: TreePod[];
    /** Vertex index where foliage starts (everything before it is trunk, boughs and pod brackets) */
    foliageStart?: number;
    /** Individual foliage clusters, in drawing order (only provided by `treetinoV1`) */
    parts?: TreePart[];
}

// Pre-attenuated colors for THREE.AdditiveBlending so dense overlapping foliage/ribs stay crisp and never blow out to white
const TREE_LEAF_OUTLINE = WIRE.green.clone().multiplyScalar(0.62);
const TREE_LEAF_VEIN = new THREE.Color('#0d9468').multiplyScalar(0.45);
const TREE_TWIG_COLOR = WIRE.white.clone().multiplyScalar(0.58);
const TREE_BOUGH_MAIN = WIRE.white.clone().multiplyScalar(0.82);
const TREE_BOUGH_SUB = WIRE.frame.clone().multiplyScalar(0.55);
const TREE_POD_MAIN = WIRE.white.clone().multiplyScalar(0.72);
const TREE_POD_SUB = WIRE.frame.clone().multiplyScalar(0.58);
const TREE_POD_CORE = WIRE.skin.clone().multiplyScalar(0.48);
const TREE_POD_RING = WIRE.skin.clone().multiplyScalar(0.68);

function catmullRomCurve(pts: V3[], samplesPerSeg = 4): V3[] {
    const out: V3[] = [];
    const n = pts.length;

    for (let i = 0; i < n - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(n - 1, i + 2)];

        for (let s = 0; s < samplesPerSeg; s++) {
            const t = s / samplesPerSeg;
            const t2 = t * t;
            const t3 = t2 * t;
            const coord: V3 = [0, 0, 0];

            for (let d = 0; d < 3; d++) {
                coord[d] =
                    0.5 *
                    (2 * p1[d] +
                        (-p0[d] + p2[d]) * t +
                        (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 +
                        (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3);
            }

            out.push(coord);
        }
    }

    out.push(pts[n - 1]);

    return out;
}

function v3Sub(a: V3, b: V3): V3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function v3Norm(v: V3): V3 {
    const l = Math.hypot(v[0], v[1], v[2]);

    return l < 1e-8 ? [0, 1, 0] : [v[0] / l, v[1] / l, v[2] / l];
}

function v3Cross(a: V3, b: V3): V3 {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function tubeAlongCurve(b: LineBuilder, curvePts: V3[], rStart: number, rEnd: number, nRibs = 4, ringStep = 4) {
    const n = curvePts.length;
    const rings: V3[][] = [];

    for (let i = 0; i < n; i++) {
        const t = i / Math.max(1, n - 1);
        const r = rStart * (1 - t) + rEnd * t;
        const tang =
            i === 0
                ? v3Norm(v3Sub(curvePts[1], curvePts[0]))
                : i === n - 1
                  ? v3Norm(v3Sub(curvePts[n - 1], curvePts[n - 2]))
                  : v3Norm(v3Sub(curvePts[i + 1], curvePts[i - 1]));
        const upRef: V3 = Math.abs(tang[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        const b1 = v3Norm(v3Cross(tang, upRef));
        const b2 = v3Norm(v3Cross(tang, b1));
        const ring: V3[] = [];

        for (let k = 0; k < nRibs; k++) {
            const a = (k / nRibs) * Math.PI * 2;
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            const p = curvePts[i];
            ring.push([
                p[0] + r * (ca * b1[0] + sa * b2[0]),
                p[1] + r * (ca * b1[1] + sa * b2[1]),
                p[2] + r * (ca * b1[2] + sa * b2[2]),
            ]);
        }

        rings.push(ring);
    }

    for (let k = 0; k < nRibs; k++) {
        b.poly(
            rings.map((ring) => ring[k]),
            k % 2 === 0 ? TREE_BOUGH_MAIN : TREE_BOUGH_SUB,
        );
    }

    for (let i = 0; i < n; i += ringStep) {
        b.poly(rings[i], TREE_BOUGH_SUB, true);
    }
}

function solarLeafV1(
    b: LineBuilder,
    origin: V3,
    yaw: number,
    pitch: number,
    roll: number,
    length = 0.34,
    width = 0.145,
) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);

    const fwd: V3 = [cy * cp, sp, sy * cp];
    const right0: V3 = [-sy, 0, cy];
    const up0: V3 = [-cy * sp, cp, -sy * sp];
    const right: V3 = [
        right0[0] * cr + up0[0] * sr,
        right0[1] * cr + up0[1] * sr,
        right0[2] * cr + up0[2] * sr,
    ];

    const petLen = length * 0.16;
    const base: V3 = [
        origin[0] + fwd[0] * petLen,
        origin[1] + fwd[1] * petLen,
        origin[2] + fwd[2] * petLen,
    ];
    b.seg(origin, base, TREE_TWIG_COLOR);

    const L = length * 0.84;
    const W = width * 0.5;
    const pt = (u: number, v: number): V3 => [
        base[0] + fwd[0] * (u * L) + right[0] * (v * W),
        base[1] + fwd[1] * (u * L) + right[1] * (v * W),
        base[2] + fwd[2] * (u * L) + right[2] * (v * W),
    ];

    b.poly(
        [
            pt(0.0, 0.0),
            pt(0.14, -0.78),
            pt(0.46, -1.0),
            pt(0.8, -0.82),
            pt(1.0, 0.0),
            pt(0.8, 0.82),
            pt(0.46, 1.0),
            pt(0.14, 0.78),
        ],
        TREE_LEAF_OUTLINE,
        true,
    );
    b.seg(pt(0.0, 0.0), pt(0.9, 0.0), TREE_LEAF_VEIN);
}

function foliageTwigV1(
    b: LineBuilder,
    start: V3,
    angle: number,
    length: number,
    rise: number,
    leafPairs: number,
    leafLen: number,
    leafWid: number,
    pitch: number,
) {
    const end: V3 = [start[0] + Math.cos(angle) * length, start[1] + rise, start[2] + Math.sin(angle) * length];
    const mid: V3 = [
        (start[0] + end[0]) * 0.5,
        (start[1] + end[1]) * 0.5 + length * 0.035,
        (start[2] + end[2]) * 0.5,
    ];
    const pts = catmullRomCurve([start, mid, end], 3);
    b.poly(pts, TREE_TWIG_COLOR);

    for (let i = 0; i < leafPairs; i++) {
        const t = leafPairs > 1 ? 0.22 + (i / (leafPairs - 1)) * 0.64 : 0.5;
        const idx = Math.min(pts.length - 1, Math.round(t * (pts.length - 1)));
        const p = pts[idx];

        for (const s of [-1, 1]) {
            const la = angle + s * 1.05;
            solarLeafV1(b, p, la, pitch, s * 0.18, leafLen, leafWid);
        }
    }

    solarLeafV1(b, end, angle, pitch * 0.85, 0.12, leafLen * 0.95, leafWid * 0.95);
}

function foliageBoughV1(
    b: LineBuilder,
    origin: V3,
    azimuth: number,
    length: number,
    rise: number,
    subBranches: number,
    leafScale: number,
    pitch: number,
) {
    const c = Math.cos(azimuth);
    const s = Math.sin(azimuth);
    const ctrl: V3[] = [
        origin,
        [origin[0] + c * length * 0.36, origin[1] + rise * 0.42 + 0.04, origin[2] + s * length * 0.36],
        [origin[0] + c * length * 0.72, origin[1] + rise * 0.8 + 0.03, origin[2] + s * length * 0.72],
        [origin[0] + c * length, origin[1] + rise, origin[2] + s * length],
    ];
    const pts = catmullRomCurve(ctrl, 3);
    b.poly(pts, TREE_BOUGH_MAIN);
    const halfN = Math.floor((pts.length * 2) / 3);
    b.poly(
        pts.slice(0, halfN).map(([x, y, z]) => [x, y - 0.032, z] as V3),
        TREE_BOUGH_SUB,
    );

    for (let i = 0; i < subBranches; i++) {
        const u = subBranches > 1 ? 0.24 + (i / (subBranches - 1)) * 0.54 : 0.45;
        const idx = Math.min(pts.length - 1, Math.round(u * (pts.length - 1)));
        const p = pts[idx];
        const sc = (1.0 - 0.18 * (i / Math.max(1, subBranches))) * leafScale;

        for (const side of [-1, 1]) {
            const subAng = azimuth + side * (0.64 - i * 0.04);
            const subLen = (0.72 - i * 0.12) * sc;
            foliageTwigV1(
                b,
                p,
                subAng,
                subLen,
                rise * 0.25,
                2,
                0.34 * leafScale,
                0.145 * leafScale,
                pitch,
            );
        }
    }

    const tipStart = pts[Math.floor(pts.length * 0.76)];
    foliageTwigV1(b, tipStart, azimuth, length * 0.26, rise * 0.2, 2, 0.32 * leafScale, 0.138 * leafScale, pitch);
}

function mountPodArmV1(
    b: LineBuilder,
    pods: TreePod[],
    attachPt: V3,
    armAngle: number,
    armLen: number,
    podHeight: number,
) {
    const ca = Math.cos(armAngle);
    const sa = Math.sin(armAngle);
    const elbow: V3 = [
        attachPt[0] + ca * (armLen * 0.58),
        attachPt[1] + 0.025,
        attachPt[2] + sa * (armLen * 0.58),
    ];
    const armTip: V3 = [attachPt[0] + ca * armLen, attachPt[1] + 0.055, attachPt[2] + sa * armLen];
    const armPts = catmullRomCurve([attachPt, elbow, armTip], 3);
    b.poly(armPts, TREE_BOUGH_MAIN);
    b.poly(
        armPts.map(([x, y, z]) => [x, y - 0.032, z] as V3),
        TREE_BOUGH_SUB,
    );

    pods.push({ base: armTip, height: podHeight });
}

/**
 * Treetino V1 (49.8 kW commercial hybrid tree):
 * - Short, sturdy flared white trunk (`y = 0..1.05`, ~21% of total height)
 * - 3 thick tubular candelabra boughs sweeping horizontally outward then curving upward to vertical tips with lightning arresters
 * - 12 vertical-axis wind turbine pods (4 per bough) on horizontal cantilever brackets
 * - Multi-tiered horizontal and upward-sweeping bipinnate solar leaf canopy
 */
export function treetinoV1(): TreeModel {
    const b = new LineBuilder();
    const pods: TreePod[] = [];

    // 1. Foundation ring
    b.circle([0, 0, 0], 0.82, 'y', WIRE.ground, 24);

    // 2. Short, sturdy flared white trunk (y = 0 to y = 1.05)
    const trunkR = (y: number) => 0.165 + 0.2 * Math.exp(-y * 3.5) + 0.028 * Math.pow(Math.max(0, (y - 0.72) / 0.33), 2);
    const trunkHeights = [0.0, 0.12, 0.26, 0.45, 0.68, 0.88, 1.05];
    const trunkRibs = 10;

    for (let i = 0; i < trunkRibs; i++) {
        const a = (i / trunkRibs) * Math.PI * 2;
        b.poly(
            trunkHeights.map((y) => [Math.cos(a) * trunkR(y), y, Math.sin(a) * trunkR(y)] as V3),
            i % 2 === 0 ? TREE_BOUGH_MAIN : TREE_BOUGH_SUB,
        );
    }

    for (const y of [0.0, 0.24, 0.52, 0.8, 1.02]) {
        b.circle([0, y, 0], trunkR(y), 'y', TREE_BOUGH_SUB, 14);
    }

    // 3. Three Primary Candelabra Boughs
    const deg = (d: number) => (d * Math.PI) / 180;
    const boughSpecs = [
        { az: deg(174), reach: 1.56, hScale: 1.02, bracketAz: deg(174) },
        { az: deg(-6), reach: 1.54, hScale: 0.98, bracketAz: deg(-6) },
        { az: deg(-98), reach: 0.95, hScale: 0.9, bracketAz: deg(-32) },
    ];

    const boughSpines: V3[][] = [];

    for (const spec of boughSpecs) {
        const { az, reach, hScale: hs } = spec;
        const ca = Math.cos(az);
        const sa = Math.sin(az);
        const ctrl: V3[] = [
            [ca * 0.08, 1.0, sa * 0.08],
            [ca * (reach * 0.36), 1.08, sa * (reach * 0.36)],
            [ca * (reach * 0.64), 1.2, sa * (reach * 0.64)],
            [ca * (reach * 0.77), 1.56 * hs, sa * (reach * 0.77)],
            [ca * (reach * 0.9), 2.22 * hs, sa * (reach * 0.9)],
            [ca * (reach * 0.98), 2.95 * hs, sa * (reach * 0.98)],
            [ca * reach, 3.65 * hs, sa * reach],
        ];
        const spine = catmullRomCurve(ctrl, 4);
        boughSpines.push(spine);
        tubeAlongCurve(b, spine, 0.115, 0.042, 4, 4);

        const tip = spine[spine.length - 1];
        b.seg(tip, [tip[0], tip[1] + 0.62, tip[2]], TREE_BOUGH_SUB);
    }

    const spineAt = (spine: V3[], u: number): V3 =>
        spine[Math.min(spine.length - 1, Math.max(0, Math.round(u * (spine.length - 1))))];

    // 4. 12 Cantilever Pod Brackets & Motor Cups (4 per bough)
    boughSpecs.forEach((spec, bi) => {
        const spine = boughSpines[bi];
        const baz = spec.bracketAz;
        const loArm = bi < 2 ? 0.56 : 0.34;
        const upArm = bi < 2 ? 0.54 : 0.48;
        mountPodArmV1(b, pods, spineAt(spine, 0.42), baz, loArm, 0.96);
        mountPodArmV1(b, pods, spineAt(spine, 0.5), baz + Math.PI, loArm, 0.96);
        mountPodArmV1(b, pods, spineAt(spine, 0.82), baz + Math.PI, upArm, 0.98);
        mountPodArmV1(b, pods, spineAt(spine, 0.94), baz, upArm, 1.0);
    });

    // 5. Multi-Tiered Horizontal & Upward-Sweeping Solar Leaf Canopies
    const foliageStart = b.vertexCount;
    const parts: TreePart[] = [];
    const foliage = (anchor: V3, az: number, length: number, rise: number, leafScale: number, pitch: number) => {
        const start = b.vertexCount;
        foliageBoughV1(b, anchor, az, length, rise, 2, leafScale, pitch);
        parts.push({
            start,
            end: b.vertexCount,
            pivot: anchor,
            axis: v3Norm([Math.cos(az) * length, rise, Math.sin(az) * length]),
        });
    };

    boughSpecs.forEach((spec, bi) => {
        const spine = boughSpines[bi];
        const az = spec.az;

        const lowAnchor = spineAt(spine, 0.24);

        for (const side of [-1, 1]) {
            foliage(lowAnchor, az + side * 0.52, bi < 2 ? 1.68 : 1.38, 0.18, 0.98, 0.18);
        }

        const midAnchor = spineAt(spine, 0.64);
        foliage(midAnchor, az, bi < 2 ? 1.65 : 1.28, 0.34, 1.02, 0.22);

        for (const side of [-1, 1]) {
            foliage(spineAt(spine, 0.61), az + side * 0.58, 1.28, 0.3, 0.94, 0.2);
        }

        const upperAnchor = spineAt(spine, 0.77);

        for (const side of [-1, 1]) {
            foliage(upperAnchor, az + side * 0.34, 1.15, 0.5, 0.92, 0.26);
        }
    });

    return { body: b, pods, foliageStart, parts };
}

/**
 * Treetino V2 (12–15 kW residential/garden tree):
 * Authentic geometry extracted from `SM-still.webp`, `Still_Strom-v2.png`, `color_white.webp`, `leaf_green.webp`, and `treetino-v2-real.png`:
 * - Sturdy flared white trunk (`y = 0..1.42`) with horizontal collar ring at `y = 1.02`
 * - 6 radial primary cylindrical white boughs with rounded tip caps fanning out into a single sun-facing tilted disc plane (`27°` pitch, `-12°` roll)
 * - Straight secondary herringbone lateral ribs branching off at `±48°` in the tilted disc plane
 * - Interlocking shingled array of TopCon solar leaves (rounded-rectangular base, parallel sides, gothic-arch pointed tip) mounted on L-hook riser stalks
 * - When `options.withTurbines === true` (`v2-hybrid`), mounts 6 vertical-axis wind turbine pods on vertical motor cups rising above the 6 primary boughs
 */
export function treetinoV2(options: { withTurbines?: boolean } = {}): TreeModel {
    const withTurbines = options.withTurbines ?? false;
    const b = new LineBuilder();
    const pods: TreePod[] = [];

    // 1. Foundation ring
    b.circle([0, 0, 0], 0.72, 'y', WIRE.ground, 24);

    // 2. Sturdy flared white trunk (y = 0 to y = 1.42) with collar seam at y = 1.02
    const trunkR = (y: number) => 0.145 + 0.195 * Math.exp(-y * 2.9);
    const trunkHeights = [0.0, 0.14, 0.3, 0.5, 0.76, 1.02, 1.24, 1.42];
    const trunkRibs = 10;

    for (let i = 0; i < trunkRibs; i++) {
        const a = (i / trunkRibs) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        b.poly(
            trunkHeights.map((y) => [ca * trunkR(y), y, sa * trunkR(y)] as V3),
            i % 2 === 0 ? TREE_BOUGH_MAIN : TREE_BOUGH_SUB,
        );
    }

    for (const y of [0.0, 0.25, 0.55, 0.8, 1.02, 1.24, 1.42]) {
        b.circle([0, y, 0], trunkR(y), 'y', Math.abs(y - 1.02) < 0.02 ? TREE_BOUGH_MAIN : TREE_BOUGH_SUB, 14);
    }

    // 3. Tilted Canopy Disc Coordinate Frame (pitched 27° toward +Z, banked -12° around Z)
    const deg = (d: number) => (d * Math.PI) / 180;
    const tiltX = deg(27);
    const tiltZ = deg(-12);
    const hub: V3 = [0.0, 1.68, 0.0];

    const cx = Math.cos(tiltX);
    const sx = Math.sin(tiltX);
    const cz = Math.cos(tiltZ);
    const sz = Math.sin(tiltZ);

    const rotZ = (vec: V3): V3 => [vec[0] * cz - vec[1] * sz, vec[0] * sz + vec[1] * cz, vec[2]];
    const uVec = rotZ([1, 0, 0]);
    const vVec = rotZ([0, sx, -cx]);
    const nVec = rotZ([0, cx, sx]);

    const discPt = (u: number, v: number, h = 0): V3 => [
        hub[0] + u * uVec[0] + v * vVec[0] + h * nVec[0],
        hub[1] + u * uVec[1] + v * vVec[1] + h * nVec[1],
        hub[2] + u * uVec[2] + v * vVec[2] + h * nVec[2],
    ];

    const placedLeafCenters: [number, number][] = [];

    const addV2Leaf = (
        u0: number,
        v0: number,
        theta: number,
        length = 0.4,
        width = 0.156,
        hOffset = 0.08,
        allowClose = false,
    ) => {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        const cu = u0 + ct * (0.03 + length * 0.48);
        const cv = v0 + st * (0.03 + length * 0.48);

        if (!allowClose) {
            for (const [pu, pv] of placedLeafCenters) {
                if (Math.hypot(cu - pu, cv - pv) < 0.145) {
                    return;
                }
            }
        }

        placedLeafCenters.push([cu, cv]);

        // L-hook riser stalk from skeleton tube up to leaf base (matches color_white.webp)
        const stalkBase = discPt(u0, v0, 0.015);
        const stalkTop = discPt(u0, v0, hOffset);
        const leafOrigin = discPt(u0 + ct * 0.03, v0 + st * 0.03, hOffset);
        b.poly([stalkBase, stalkTop, leafOrigin], TREE_TWIG_COLOR);

        const lpt = (along: number, across: number): V3 => {
            const du = ct * along - st * across;
            const dv = st * along + ct * across;

            return discPt(u0 + ct * 0.03 + du, v0 + st * 0.03 + dv, hOffset);
        };

        const L = length;
        const W = width * 0.5;
        // V2 TopCon leaf silhouette (rounded rectangular base, parallel edges, pointed gothic-arch tip)
        b.poly(
            [
                lpt(0.0, -W * 0.68),
                lpt(0.06 * L, -W),
                lpt(0.75 * L, -W),
                lpt(0.9 * L, -W * 0.56),
                lpt(1.0 * L, 0.0),
                lpt(0.9 * L, W * 0.56),
                lpt(0.75 * L, W),
                lpt(0.06 * L, W),
                lpt(0.0, W * 0.68),
            ],
            TREE_LEAF_OUTLINE,
            true,
        );
        b.seg(lpt(0.05 * L, 0.0), lpt(0.88 * L, 0.0), TREE_LEAF_VEIN);
    };

    // 4. Six Radial Primary Boughs in the Tilted Disc Plane
    const boughSpecs: {
        ang: number;
        length: number;
        trunkY: number;
        subRibs: [number, number, number][];
        podFrac: number;
    }[] = [
        { ang: deg(10), length: 2.1, trunkY: 1.36, subRibs: [[0.24, 0.96, 3], [0.48, 0.78, 3], [0.72, 0.52, 2]], podFrac: 0.78 },
        { ang: deg(66), length: 1.98, trunkY: 1.42, subRibs: [[0.26, 0.9, 3], [0.5, 0.72, 3], [0.74, 0.48, 2]], podFrac: 0.46 },
        { ang: deg(122), length: 1.98, trunkY: 1.42, subRibs: [[0.26, 0.9, 3], [0.5, 0.72, 3], [0.74, 0.48, 2]], podFrac: 0.46 },
        { ang: deg(174), length: 2.12, trunkY: 1.36, subRibs: [[0.24, 0.96, 3], [0.48, 0.78, 3], [0.72, 0.52, 2]], podFrac: 0.78 },
        { ang: deg(226), length: 1.74, trunkY: 1.22, subRibs: [[0.3, 0.76, 3], [0.58, 0.52, 2]], podFrac: 0.74 },
        { ang: deg(312), length: 1.74, trunkY: 1.22, subRibs: [[0.3, 0.76, 3], [0.58, 0.52, 2]], podFrac: 0.74 },
    ];

    // Pass 1: Primary tubular white boughs + direct herringbone chevron leaves along each primary spine
    for (const spec of boughSpecs) {
        const { ang, length, trunkY } = spec;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        const pTrunk: V3 = [ca * 0.11, trunkY, -sa * 0.09];
        const pElbow = discPt(ca * 0.28, sa * 0.28, -0.06);
        const pMid = discPt(ca * (length * 0.55), sa * (length * 0.55), 0.0);
        const pTip = discPt(ca * length, sa * length, 0.0);
        const spine = catmullRomCurve([pTrunk, pElbow, pMid, pTip], 4);

        const r0 = 0.072;
        const r1 = 0.04;
        const perpVec: V3 = [
            -sa * uVec[0] + ca * vVec[0],
            -sa * uVec[1] + ca * vVec[1],
            -sa * uVec[2] + ca * vVec[2],
        ];

        for (let k = 0; k < 4; k++) {
            const ka = (k / 4) * Math.PI * 2;
            const cka = Math.cos(ka);
            const ska = Math.sin(ka);
            const rib: V3[] = spine.map((pt, idx) => {
                const t = idx / Math.max(1, spine.length - 1);
                const r = r0 * (1 - t) + r1 * t;

                return [
                    pt[0] + r * (cka * nVec[0] + ska * perpVec[0]),
                    pt[1] + r * (cka * nVec[1] + ska * perpVec[1]),
                    pt[2] + r * (cka * nVec[2] + ska * perpVec[2]),
                ];
            });
            b.poly(rib, k % 2 === 0 ? TREE_BOUGH_MAIN : TREE_BOUGH_SUB);
        }

        // Rounded cap ring at tip of primary white tube
        const capPts: V3[] = [];

        for (let k = 0; k < 8; k++) {
            const ka = (k / 8) * Math.PI * 2;
            const cka = Math.cos(ka);
            const ska = Math.sin(ka);
            capPts.push([
                pTip[0] + r1 * (cka * nVec[0] + ska * perpVec[0]),
                pTip[1] + r1 * (cka * nVec[1] + ska * perpVec[1]),
                pTip[2] + r1 * (cka * nVec[2] + ska * perpVec[2]),
            ]);
        }

        b.poly(capPts, TREE_BOUGH_MAIN, true);

        const nSpine = 7;

        for (let si = 0; si < nSpine; si++) {
            const frac = 0.12 + (si / (nSpine - 1)) * 0.78;
            const lu = ca * (length * frac);
            const lv = sa * (length * frac);

            for (const side of [-1, 1]) {
                const offU = -sa * side * 0.035;
                const offV = ca * side * 0.035;
                addV2Leaf(lu + offU, lv + offV, ang + side * deg(48), 0.4, 0.155, 0.085, si === 0);
            }
        }

        addV2Leaf(ca * (length * 0.94), sa * (length * 0.94), ang, 0.38, 0.15, 0.085);
    }

    // Pass 2: Secondary lateral herringbone ribs & interlocking shingled leaf rows + optional 6× VTE turbine pods
    for (const spec of boughSpecs) {
        const { ang, length, subRibs, podFrac } = spec;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);

        for (const [frac, ribLen, nPairs] of subRibs) {
            const uBase = ca * (length * frac);
            const vBase = sa * (length * frac);
            const pStart = discPt(uBase, vBase, 0.0);

            for (const side of [-1, 1]) {
                const ribAng = ang + side * deg(48);
                const rc = Math.cos(ribAng);
                const rs = Math.sin(ribAng);
                const uEnd = uBase + rc * ribLen;
                const vEnd = vBase + rs * ribLen;
                const pEnd = discPt(uEnd, vEnd, 0.0);

                b.seg(pStart, pEnd, TREE_BOUGH_MAIN);
                b.seg(discPt(uBase, vBase, -0.024), discPt(uEnd, vEnd, -0.024), TREE_BOUGH_SUB);

                for (let li = 0; li < nPairs; li++) {
                    const lt = 0.28 + (li / Math.max(1, nPairs - 1)) * 0.62;
                    const lu = uBase + rc * (ribLen * lt);
                    const lv = vBase + rs * (ribLen * lt);
                    addV2Leaf(lu - rs * -side * 0.025, lv + rc * -side * 0.025, ang, 0.39, 0.152, 0.076);
                    addV2Leaf(lu - rs * side * 0.025, lv + rc * side * 0.025, ribAng + side * deg(34), 0.39, 0.152, 0.076);
                }

                addV2Leaf(uEnd, vEnd, ribAng, 0.37, 0.146, 0.076);
            }
        }

        if (withTurbines) {
            const pu = ca * (length * podFrac);
            const pv = sa * (length * podFrac);
            const attach = discPt(pu, pv, 0.02);
            const cupY = attach[1] + 0.14;
            const cxP = attach[0];
            const czP = attach[2];

            b.seg(attach, [cxP, cupY, czP], TREE_BOUGH_MAIN);

            const podHeight = 0.96;
            pods.push({ base: [cxP, cupY, czP], height: podHeight });
        }
    }

    return { body: b, pods };
}

/** Convenience builder for Treetino V2 Solar Disc (`without-turbines`, 12 kW FVE) */
export function treetinoV2Solar(): TreeModel {
    return treetinoV2({ withTurbines: false });
}

/** Convenience builder for Treetino V2 Hybrid (`with-turbines`, 15 kW FVE + 6× VTE) */
export function treetinoV2Hybrid(): TreeModel {
    return treetinoV2({ withTurbines: true });
}

/** Unified dispatcher returning the requested Treetino 3D wireframe model (`'v1' | 'v2-solar' | 'v2-hybrid'`) */
export function treetinoTree(variant: TreeVariant = 'v1'): TreeModel {
    if (variant === 'v2-solar') {
        return treetinoV2Solar();
    }

    if (variant === 'v2-hybrid') {
        return treetinoV2Hybrid();
    }

    return treetinoV1();
}

/**
 * Treetino Savonius Vertical-Axis Wind Turbine Rotor (`podLines`), origin at its bottom (`y = 0`):
 * Modeled directly from the 3D-printed Treetino Savonius rotor prototype (front/side/top/assembled views)
 * and Treetino Aero studio renders (`aero-updated-blue.jpg` / `aero-updated-glass.jpg`):
 * 1. Bottom beveled circular saucer collar (`y = 0 .. 0.068 * height`)
 * 2. Two 180°-symmetric pairs of curved Savonius scoops (2 primary S-connected deep scoops + 2 nested
 *    secondary splitter scoops) with straight vertical inner edges and barrel-flared outer edges (`0.068 .. 0.924 * height`)
 * 3. Prominent mid-height (`y = 0.50 * height`) horizontal crescent baffle shelf and internal stiffener struts
 * 4. Top rounded mushroom/dome cap (`y = 0.924 .. 1.00 * height`)
 */
export function podLines(height: number): LineBuilder {
    const b = new LineBuilder();
    const rMax = height * 0.272;
    const sBot = 0.068 * height;
    const sTop = 0.924 * height;
    const span = sTop - sBot;
    const rEnd = rMax * 0.43;

    // 1. Bottom Beveled Saucer Collar (y = 0 .. sBot)
    const saucerRings: [number, number, THREE.Color][] = [
        [0.0, rMax * 0.39, TREE_POD_CORE],
        [0.028 * height, rMax * 0.51, TREE_POD_MAIN],
        [0.044 * height, rMax * 0.51, TREE_POD_SUB],
        [sBot, rMax * 0.44, TREE_POD_MAIN],
    ];

    for (const [y, r, col] of saucerRings) {
        b.circle([0, y, 0], r, 'y', col, 20);
    }

    for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        b.poly(
            saucerRings.map(([y, r]) => [ca * r, y, sa * r] as V3),
            k % 2 === 0 ? TREE_POD_SUB : TREE_POD_CORE,
        );
    }

    // 2. Dual-Scoop Savonius Blades (2 symmetric pairs at sign = +1, -1)
    const radialScale = (t: number, u: number) => {
        const bulge = (rMax - rEnd) * Math.pow(Math.sin(Math.PI * u), 0.84);

        return rEnd + bulge * Math.pow(t, 0.72);
    };

    const primaryScoop2D = (t: number, sign: number): [number, number] => {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;
        const x = mt2 * mt * 0.0 + 3 * mt2 * t * 0.68 + 3 * mt * t2 * 0.86 + t2 * t * 0.22;
        const z = mt2 * mt * 0.0 + 3 * mt2 * t * 0.04 + 3 * mt * t2 * 0.56 + t2 * t * 0.9755;

        return [sign * x, sign * z];
    };

    const secondaryScoop2D = (t: number, sign: number): [number, number] => {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;
        const x = mt2 * mt * 0.06 + 3 * mt2 * t * 0.34 + 3 * mt * t2 * 0.24 + t2 * t * -0.24;
        const z = mt2 * mt * 0.15 + 3 * mt2 * t * 0.3 + 3 * mt * t2 * 0.62 + t2 * t * 0.91;

        return [sign * x, sign * z];
    };

    const pt3D = (fn2D: (t: number, s: number) => [number, number], t: number, u: number, sign: number): V3 => {
        const [xn, zn] = fn2D(t, sign);
        const r = radialScale(t, u);

        return [xn * r, sBot + u * span, zn * r];
    };

    const nU = 16;
    const uVals = Array.from({ length: nU + 1 }, (_, i) => i / nU);
    const tSamples = Array.from({ length: 11 }, (_, i) => i / 10);
    const crossU = [0.0, 0.18, 0.34, 0.5, 0.66, 0.82, 1.0];

    for (const sign of [1, -1]) {
        // A. Longitudinal ribs along Primary Scoop
        for (const [ti, t] of [0.0, 0.28, 0.55, 0.8, 1.0].entries()) {
            const isOuterEdge = t === 1.0;
            const isCenter = t === 0.0;

            if (isCenter && sign === -1) {
                continue;
            }

            const pts = uVals.map((u) => pt3D(primaryScoop2D, t, u, sign));
            const col = isOuterEdge || isCenter ? TREE_POD_MAIN : ti === 3 ? TREE_POD_SUB : TREE_POD_CORE;
            b.poly(pts, col);
        }

        // B. Longitudinal ribs along Secondary Splitter Scoop
        for (const [ti, t] of [0.0, 0.38, 0.72, 1.0].entries()) {
            const isOuterEdge = t === 1.0;
            const isInnerEdge = t === 0.0;
            const pts = uVals.map((u) => pt3D(secondaryScoop2D, t, u, sign));
            const col = isOuterEdge ? TREE_POD_MAIN : isInnerEdge || ti === 2 ? TREE_POD_SUB : TREE_POD_CORE;
            b.poly(pts, col);
        }

        // C. Horizontal cross-sectional scoop curves & equatorial crescent baffle shelf
        for (const u of crossU) {
            const isEquator = Math.abs(u - 0.5) < 0.01;
            const isEnd = u === 0.0 || u === 1.0;
            const col = isEquator ? TREE_POD_MAIN : isEnd ? TREE_POD_RING : TREE_POD_CORE;

            b.poly(
                tSamples.map((t) => pt3D(primaryScoop2D, t, u, sign)),
                col,
            );
            b.poly(
                tSamples.map((t) => pt3D(secondaryScoop2D, t, u, sign)),
                col,
            );

            if (isEquator) {
                const tipP = pt3D(primaryScoop2D, 1.0, u, sign);
                const tipS = pt3D(secondaryScoop2D, 1.0, u, sign);
                const innerS = pt3D(secondaryScoop2D, 0.0, u, sign);
                const lipMid: V3 = [
                    (tipP[0] + tipS[0]) * 0.5 - sign * 0.05 * rMax,
                    tipS[1],
                    (tipP[2] + tipS[2]) * 0.5 + sign * 0.04 * rMax,
                ];
                b.poly([tipP, lipMid, tipS, innerS], TREE_POD_MAIN);

                for (const tb of [0.35, 0.68]) {
                    b.seg(pt3D(primaryScoop2D, tb, u, sign), pt3D(secondaryScoop2D, tb, u, sign), TREE_POD_SUB);
                }
            }
        }
    }

    // 3. Top Rounded Mushroom / Dome Cap (y = sTop .. height)
    const domeRings: [number, number, THREE.Color][] = [
        [sTop, rMax * 0.44, TREE_POD_SUB],
        [0.934 * height, rMax * 0.52, TREE_POD_MAIN],
        [0.958 * height, rMax * 0.46, TREE_POD_RING],
        [0.98 * height, rMax * 0.33, TREE_POD_SUB],
        [0.995 * height, rMax * 0.15, TREE_POD_CORE],
    ];

    for (const [y, r, col] of domeRings) {
        b.circle([0, y, 0], r, 'y', col, 20);
    }

    const apex: V3 = [0, height, 0];

    for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        b.poly(
            [...domeRings.map(([y, r]) => [ca * r, y, sa * r] as V3), apex],
            k % 2 === 0 ? TREE_POD_SUB : TREE_POD_CORE,
        );
    }

    return b;
}


