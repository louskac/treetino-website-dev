/**
 * Maps a user-uploaded image onto the FVE solar leaves mask template using HTML5 Canvas
 * with support for mouse dragging (offsetX/offsetY), scale (zoom), and photovoltaic cell grid overlay blending.
 */

export type LeafTextureTransform = {
    offsetX?: number; // -60 to +60 (% of width)
    offsetY?: number; // -60 to +60 (% of height)
    scale?: number; // 0.5 to 3.0
    pvOpacity?: number; // 0.0 to 1.0 (photovoltaic cell grid undertone strength)
};

export async function generateMappedLeafTexture(
    userImageUrl: string,
    transform: LeafTextureTransform = {},
    maskUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_spring.webp',
): Promise<string> {
    const {
        offsetX = 0,
        offsetY = 0,
        scale = 1.0,
        pvOpacity = 0.6,
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

                    // 1. Calculate cover dimensions for user image
                    const userAspect = userImg.width / userImg.height;
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

                    // Step 1: Draw the user photo FIRST as full-color base (never turns dark/black)
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = 1.0;
                    ctx.drawImage(userImg, posX, posY, renderW, renderH);

                    // Step 2: Overlay photovoltaic solar cell grid lines & veins on top
                    if (pvOpacity > 0.02) {
                        ctx.globalCompositeOperation = 'overlay';
                        ctx.globalAlpha = Math.min(1.0, pvOpacity * 0.75);
                        ctx.drawImage(maskImg, 0, 0, w, h);

                        ctx.globalCompositeOperation = 'soft-light';
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
