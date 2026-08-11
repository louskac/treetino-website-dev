/**
 * Maps a user-uploaded image onto the FVE solar leaves mask template using HTML5 Canvas.
 * Supports both continuous branch mapping and individual leaf mapping, mouse dragging (offsetX/offsetY),
 * scale (zoom), and neutral black photovoltaic grid overlay blending.
 */

export type LeafTextureTransform = {
    offsetX?: number; // -60 to +60 (%)
    offsetY?: number; // -60 to +60 (%)
    scale?: number; // 0.4 to 3.0
    pvOpacity?: number; // 0.0 to 1.0 (black photovoltaic cell grid undertone strength)
    mappingMode?: 'branch' | 'individual'; // 'branch' (Celá větev) vs 'individual' (Jednotlivé listy)
};

const LEAF_BOUNDING_BOXES = [
    { x: 380, y: 460, width: 255, height: 185 }, // Leaf 1 (top right)
    { x: 210, y: 540, width: 275, height: 170 }, // Leaf 2 (top left)
    { x: 570, y: 645, width: 165, height: 280 }, // Leaf 3 (middle right)
    { x: 360, y: 680, width: 215, height: 280 }, // Leaf 4 (middle left)
    { x: 75, y: 685, width: 320, height: 230 },  // Leaf 5 (bottom left)
];

export async function generateMappedLeafTexture(
    userImageUrl: string,
    transform: LeafTextureTransform = {},
    maskUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_black_pv_mask.png',
): Promise<string> {
    const {
        offsetX = 0,
        offsetY = 0,
        scale = 1.0,
        pvOpacity = 0.6,
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

                    const userAspect = userImg.width / userImg.height;

                    if (mappingMode === 'individual') {
                        // --- MODE B: Map user image onto EACH INDIVIDUAL LEAF separately ---
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.globalAlpha = 1.0;

                        for (const box of LEAF_BOUNDING_BOXES) {
                            const boxAspect = box.width / box.height;
                            let baseW = box.width;
                            let baseH = box.height;

                            if (userAspect > boxAspect) {
                                baseW = box.height * userAspect;
                            } else {
                                baseH = box.width / userAspect;
                            }

                            const renderW = baseW * scale;
                            const renderH = baseH * scale;

                            const posX = box.x + (box.width - renderW) / 2 + (offsetX / 100) * box.width;
                            const posY = box.y + (box.height - renderH) / 2 + (offsetY / 100) * box.height;

                            ctx.drawImage(userImg, posX, posY, renderW, renderH);
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

                        const posX = (w - renderW) / 2 + (offsetX / 100) * w;
                        const posY = (h - renderH) / 2 + (offsetY / 100) * h;

                        ctx.globalCompositeOperation = 'source-over';
                        ctx.globalAlpha = 1.0;
                        ctx.drawImage(userImg, posX, posY, renderW, renderH);
                    }

                    // Step 2: Overlay default black photovoltaic panel grid lines on top
                    if (pvOpacity > 0.02) {
                        ctx.globalCompositeOperation = 'multiply';
                        ctx.globalAlpha = Math.min(1.0, pvOpacity * 0.75);
                        ctx.drawImage(maskImg, 0, 0, w, h);

                        ctx.globalCompositeOperation = 'overlay';
                        ctx.globalAlpha = Math.min(1.0, pvOpacity * 0.45);
                        ctx.drawImage(maskImg, 0, 0, w, h);
                    }

                    // Step 3: Trim output strictly to the solar leaf contour shape
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

        maskImg.onerror = () => resolve(userImageUrl);
        maskImg.src = maskUrl;
    });
}
