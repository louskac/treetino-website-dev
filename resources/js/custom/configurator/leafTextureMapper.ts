/**
 * Maps a user-uploaded image onto FVE solar leaves with authentic photovoltaic panel undertones.
 * Supports continuous branch mapping and upright individual leaf mapping with exact leaf rotations,
 * interactive position dragging (offsetX/offsetY), and scale (zoom).
 */

export type LeafTextureTransform = {
    offsetX?: number; // -80 to +80 (%)
    offsetY?: number; // -80 to +80 (%)
    scale?: number; // 0.4 to 3.0
    mappingMode?: 'branch' | 'individual'; // 'individual' (Jednotlivé listy) vs 'branch' (Celá větev)
};

export type MappedLeafResult = {
    fullTexture: string;   // 1500x1500px full tree branch texture
    editorTexture: string; // 716x550px cropped texture focused on the 5 leaves
};

// Exact stem-to-tip centers, dimensions (sleek aspect ratio matching real leaves -> 0% deformation), and rotation angles (100% coverage)
const LEAF_AXIS_CONFIGS = [
    { cx: 503, cy: 547, w: 345, h: 122, angleDeg: 25.5 },   // Leaf 1 (top right)
    { cx: 347, cy: 620, w: 375, h: 130, angleDeg: 14.3 },   // Leaf 2 (top left)
    { cx: 651, cy: 779, w: 380, h: 135, angleDeg: -82.4 },  // Leaf 3 (middle right)
    { cx: 464, cy: 817, w: 385, h: 135, angleDeg: -60.1 },  // Leaf 4 (middle left)
    { cx: 235, cy: 802, w: 385, h: 130, angleDeg: -27.6 },  // Leaf 5 (bottom left)
];

// Preloaded image cache for synchronous, 60 FPS fast canvas updates during drag/pinch
const imageCache = new Map<string, HTMLImageElement>();

function loadCachedImg(src: string): Promise<HTMLImageElement> {
    const existing = imageCache.get(src);
    if (existing && existing.complete && existing.naturalWidth > 0) {
        return Promise.resolve(existing);
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = () => {
            resolve(img);
        };
        img.src = src;
    });
}

/**
 * Draws a horizontal single geometric leaf path (rounded stem base on right, pointy triangle tip on left).
 * Designed with a sleek, narrower profile (lower top-to-bottom height) to accurately represent real leaf framing.
 */
export function drawHorizontalSingleLeafPath(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    r: number = 18,
) {
    const halfW = w / 2;
    const halfH = h / 2;
    const left = cx - halfW;
    const right = cx + halfW;
    const top = cy - halfH;
    const bottom = cy + halfH;
    const shoulderX = cx - halfW * 0.30;

    ctx.beginPath();
    ctx.moveTo(right - r, top);
    ctx.lineTo(shoulderX, top);
    ctx.arcTo(shoulderX, top, left, cy, r * 0.9);
    ctx.arcTo(left, cy, shoulderX, bottom, r * 0.6);
    ctx.lineTo(shoulderX, bottom);
    ctx.lineTo(right - r, bottom);
    ctx.arcTo(right, bottom, right, top, r);
    ctx.arcTo(right, top, shoulderX, top, r);
    ctx.closePath();
}

/**
 * Helper to render a single horizontal solar leaf element (dark PV surface, user image, solar grid lines, outline).
 */
function renderSingleHorizontalLeaf(
    ctx: CanvasRenderingContext2D,
    userImg: HTMLImageElement,
    cx: number,
    cy: number,
    w: number,
    h: number,
    transform: { offsetX: number; offsetY: number; scale: number },
    r: number = 18,
    clipToPath: boolean = true,
) {
    const { offsetX, offsetY, scale } = transform;
    const userAspect = (userImg.width || 1) / (userImg.height || 1);

    ctx.save();

    if (clipToPath) {
        // 1. Clip region to horizontal leaf path for editor preview box
        drawHorizontalSingleLeafPath(ctx, cx, cy, w, h, r);
        ctx.clip();
    }

    // 2. Fill authentic dark Photovoltaic Panel background (deep black-slate silicon)
    const bgGrad = ctx.createLinearGradient(cx - w / 2, cy, cx + w / 2, cy);
    bgGrad.addColorStop(0, '#0c1017');
    bgGrad.addColorStop(0.5, '#101722');
    bgGrad.addColorStop(1, '#0c1017');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(cx - w, cy - h, w * 2, h * 2);

    // 3. Draw user custom photo over PV panel with 0.88 opacity
    const leafAspect = w / h;
    let baseW = w;
    let baseH = h;

    if (userAspect > leafAspect) {
        baseW = h * userAspect;
    } else {
        baseH = w / userAspect;
    }

    const renderW = baseW * scale;
    const renderH = baseH * scale;

    const drawX = cx - renderW / 2 + (offsetX / 100) * w;
    const drawY = cy - renderH / 2 + (offsetY / 100) * h;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.88;
    ctx.drawImage(userImg, drawX, drawY, renderW, renderH);

    // 4. Overlay authentic Photovoltaic solar cell grid & busbars
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - h / 2;
    const bottom = cy + h / 2;
    const shoulderX = cx - (w / 2) * 0.30;

    // A. Main body vertical PV fingers (dense parallel solar cell lines)
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;

    const stepX = 11;
    for (let x = shoulderX + 4; x < right - 16; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, top + 4);
        ctx.lineTo(x, bottom - 4);
        ctx.stroke();
    }

    // B. Tip triangular area longitudinal solar lines (running toward tip)
    ctx.globalAlpha = 0.35;
    const tipLines = 5;
    for (let i = 1; i <= tipLines; i++) {
        const t = i / (tipLines + 1);
        const yOffset = (t - 0.5) * (h - 18);
        const startY = cy + yOffset;
        const fraction = 1 - Math.abs(t - 0.5) * 1.6;
        const lineLen = (shoulderX - left - 12) * Math.max(0.2, fraction);
        ctx.beginPath();
        ctx.moveTo(shoulderX + 2, startY);
        ctx.lineTo(shoulderX - lineLen, cy + yOffset * 0.3);
        ctx.stroke();
    }

    // C. Horizontal solar panel busbars across main body
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.0;

    // Center busbar running full length through main body
    ctx.beginPath();
    ctx.moveTo(right - 12, cy);
    ctx.lineTo(shoulderX - 10, cy);
    ctx.stroke();

    // Upper and lower secondary busbars
    const busbarOffset = h * 0.24;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(right - 18, cy - busbarOffset);
    ctx.lineTo(shoulderX + 6, cy - busbarOffset);
    ctx.moveTo(right - 18, cy + busbarOffset);
    ctx.lineTo(shoulderX + 6, cy + busbarOffset);
    ctx.stroke();

    // D. Circular tip mounting hole / notch with silver rim
    const holeX = left + 16;
    const holeY = cy;
    const holeRadius = 4.8;

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#06080c';
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
    ctx.stroke();

    if (clipToPath) {
        // 5. Draw crisp solar panel edge border outline
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        drawHorizontalSingleLeafPath(ctx, cx, cy, w, h, r);
        ctx.stroke();
    }

    ctx.restore();
}

export async function generateMappedLeafTexture(
    userImageUrl: string,
    transform: LeafTextureTransform = {},
    maskUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_black_pv_mask.png',
    pvBaseUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_real_pv_panel_base.png',
): Promise<MappedLeafResult> {
    const {
        offsetX = 0,
        offsetY = 0,
        scale = 1.0,
        mappingMode = 'individual',
    } = transform;

    const emptyResult: MappedLeafResult = {
        fullTexture: userImageUrl,
        editorTexture: userImageUrl,
    };

    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return emptyResult;
    }

    try {
        const [maskImg, pvBaseImg, userImg] = await Promise.all([
            loadCachedImg(maskUrl),
            loadCachedImg(pvBaseUrl),
            loadCachedImg(userImageUrl),
        ]);

        const canvas = document.createElement('canvas');
        const w = maskImg.width || 1500;
        const h = maskImg.height || 1500;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) return emptyResult;

        const userAspect = (userImg.width || 1) / (userImg.height || 1);

        if (mappingMode === 'individual') {
            // --- MODE B: Render ONE MASTER SINGLE LEAF (sleek 500x145 aspect) and map it IDENTICALLY onto each of the 5 leaves ---
            const masterW = 500;
            const masterH = 145;
            const masterCanvas = document.createElement('canvas');
            masterCanvas.width = masterW;
            masterCanvas.height = masterH;

            const masterCtx = masterCanvas.getContext('2d');
            if (masterCtx) {
                renderSingleHorizontalLeaf(masterCtx, userImg, masterW / 2, masterH / 2, masterW, masterH, { offsetX, offsetY, scale }, 18, false);
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
            ctx.drawImage(pvBaseImg, 0, 0, w, h);

            for (const leaf of LEAF_AXIS_CONFIGS) {
                ctx.save();
                ctx.translate(leaf.cx, leaf.cy);
                ctx.rotate((leaf.angleDeg * Math.PI) / 180);

                ctx.drawImage(masterCanvas, -leaf.w / 2, -leaf.h / 2, leaf.w, leaf.h);

                ctx.restore();
            }
        } else {
            // --- MODE A: Map user image continuously across FULL BRANCH ---
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
            ctx.drawImage(pvBaseImg, 0, 0, w, h);

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.88;

            const canvasAspect = w / h;
            let baseW = w;
            let baseH = h;

            if (userAspect > canvasAspect) {
                baseW = h * userAspect;
            } else {
                baseH = w / userAspect;
            }

            const renderW = baseW * scale;
            const renderH = baseH * scale;

            const drawX = (w - renderW) / 2 + (offsetX / 100) * 716;
            const drawY = (h - renderH) / 2 + (offsetY / 100) * 550;

            ctx.drawImage(userImg, drawX, drawY, renderW, renderH);

            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.35;
            ctx.drawImage(pvBaseImg, 0, 0, w, h);

            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.20;
            ctx.drawImage(pvBaseImg, 0, 0, w, h);
        }

        // STEP 4: Trim everything outside leaf shape contours using maskImg alpha channel
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1.0;
        ctx.drawImage(maskImg, 0, 0, w, h);

        const fullTexture = canvas.toDataURL('image/png');

        // STEP 5: Create editorTexture DataURL for the editor viewport
        const editorCanvas = document.createElement('canvas');
        const cropW = 716;
        const cropH = 550;
        editorCanvas.width = cropW;
        editorCanvas.height = cropH;

        const editorCtx = editorCanvas.getContext('2d');
        if (!editorCtx) {
            return { fullTexture, editorTexture: fullTexture };
        }

        if (mappingMode === 'individual') {
            // --- SINGLE HORIZONTAL GEOMETRIC LEAF EDITOR VIEWPORT FOR INDIVIDUAL MODE (Sleek 500x145 matching real leaf) ---
            const cx = cropW / 2; // 358
            const cy = cropH / 2; // 275
            const leafW = 500;
            const leafH = 145;

            renderSingleHorizontalLeaf(editorCtx, userImg, cx, cy, leafW, leafH, { offsetX, offsetY, scale }, 18, true);
        } else {
            // --- 5-LEAF BRANCH EDITOR VIEWPORT FOR BRANCH MODE ---
            const cropX = 49;
            const cropY = 435;
            editorCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        }

        const editorTexture = editorCanvas.toDataURL('image/png');

        return { fullTexture, editorTexture };
    } catch {
        return emptyResult;
    }
}
