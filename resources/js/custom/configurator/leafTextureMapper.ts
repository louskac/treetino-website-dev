/**
 * Maps a user-uploaded image onto FVE solar leaves with authentic photovoltaic panel undertones.
 * Supports continuous branch mapping and upright individual leaf mapping with exact leaf rotations,
 * interactive position dragging (offsetX/offsetY), scale (zoom), and print opacity / PV cell transparency control.
 */

export type LeafTextureTransform = {
    offsetX?: number; // -80 to +80 (%)
    offsetY?: number; // -80 to +80 (%)
    scale?: number; // 0.4 to 3.0
    printOpacity?: number; // 0.0 to 1.0 (print opacity over underlying PV solar panel)
    mappingMode?: 'branch' | 'individual'; // 'branch' (Celá větev) vs 'individual' (Jednotlivé listy)
};

// Exact centers, dimensions, and rotation angles for the 5 solar leaves on the branch (1500x1500px canvas)
const LEAF_CONFIGS = [
    { cx: 503, cy: 547, w: 240, h: 170, angleDeg: 29.4 },  // Leaf 1 (top right)
    { cx: 347, cy: 620, w: 260, h: 160, angleDeg: 21.4 },  // Leaf 2 (top left)
    { cx: 652, cy: 779, w: 160, h: 270, angleDeg: -77.6 }, // Leaf 3 (middle right)
    { cx: 464, cy: 817, w: 210, h: 270, angleDeg: -62.3 }, // Leaf 4 (middle left)
    { cx: 235, cy: 802, w: 300, h: 210, angleDeg: -29.5 }, // Leaf 5 (bottom left)
];

export async function generateMappedLeafTexture(
    userImageUrl: string,
    transform: LeafTextureTransform = {},
    maskUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_black_pv_mask.png',
    pvBaseUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_real_pv_panel_base.png',
): Promise<string> {
    const {
        offsetX = 0,
        offsetY = 0,
        scale = 1.0,
        printOpacity = 0.8,
        mappingMode = 'branch',
    } = transform;

    return new Promise((resolve) => {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            resolve(userImageUrl);
            return;
        }

        const maskImg = new Image();
        maskImg.crossOrigin = 'anonymous';

        maskImg.onload = () => {
            const pvBaseImg = new Image();
            pvBaseImg.crossOrigin = 'anonymous';

            pvBaseImg.onload = () => {
                const userImg = new Image();
                userImg.crossOrigin = 'anonymous';

                userImg.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const w = maskImg.width || 1500;
                        const h = maskImg.height || 1500;
                        canvas.width = w;
                        canvas.height = h;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve(userImageUrl);
                            return;
                        }

                        // STEP 1: Draw the base Photovoltaic Panel texture (real 3D rendered black PV solar panel)
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(pvBaseImg, 0, 0, w, h);

                        // STEP 2: Draw user custom photo over PV panel with printOpacity
                        if (printOpacity > 0.001) {
                            const userAspect = userImg.width / userImg.height;
                            ctx.globalAlpha = Math.max(0.0, Math.min(1.0, printOpacity));

                            if (mappingMode === 'individual') {
                                // --- MODE B: Map user image onto EACH INDIVIDUAL LEAF upright aligned with leaf angle ---
                                for (const leaf of LEAF_CONFIGS) {
                                    ctx.save();
                                    ctx.translate(leaf.cx, leaf.cy);
                                    ctx.rotate((leaf.angleDeg * Math.PI) / 180);

                                    const leafAspect = leaf.w / leaf.h;
                                    let baseW = leaf.w;
                                    let baseH = leaf.h;

                                    if (userAspect > leafAspect) {
                                        baseW = leaf.h * userAspect;
                                    } else {
                                        baseH = leaf.w / userAspect;
                                    }

                                    const renderW = baseW * scale;
                                    const renderH = baseH * scale;

                                    const drawX = -renderW / 2 + (offsetX / 100) * leaf.w;
                                    const drawY = -renderH / 2 + (offsetY / 100) * leaf.h;

                                    ctx.drawImage(userImg, drawX, drawY, renderW, renderH);
                                    ctx.restore();
                                }
                            } else {
                                // --- MODE A: Map user image continuously across FULL BRANCH ---
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

                                const drawX = (w - renderW) / 2 + (offsetX / 100) * w;
                                const drawY = (h - renderH) / 2 + (offsetY / 100) * h;

                                ctx.drawImage(userImg, drawX, drawY, renderW, renderH);
                            }
                        }

                        // STEP 3: Overlay photovoltaic cell grid lines and busbars (multiply & overlay)
                        if (printOpacity > 0.05) {
                            ctx.globalCompositeOperation = 'multiply';
                            ctx.globalAlpha = 0.35 * printOpacity;
                            ctx.drawImage(maskImg, 0, 0, w, h);

                            ctx.globalCompositeOperation = 'overlay';
                            ctx.globalAlpha = 0.25 * printOpacity;
                            ctx.drawImage(maskImg, 0, 0, w, h);
                        }

                        // STEP 4: Trim everything outside leaf shape contours using maskImg alpha channel
                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(maskImg, 0, 0, w, h);

                        resolve(canvas.toDataURL('image/png'));
                    } catch {
                        resolve(userImageUrl);
                    }
                };

                userImg.onerror = () => resolve(userImageUrl);
                userImg.src = userImageUrl;
            };

            pvBaseImg.onerror = () => resolve(userImageUrl);
            pvBaseImg.src = pvBaseUrl;
        };

        maskImg.onerror = () => resolve(userImageUrl);
        maskImg.src = maskUrl;
    });
}
