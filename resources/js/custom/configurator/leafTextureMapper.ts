/**
 * Maps a user-uploaded image onto the FVE solar leaves mask template using HTML5 Canvas
 * with support for positioning (offset X/Y), scale (zoom), and photovoltaic undertone blending.
 */

export type LeafTextureTransform = {
    offsetX?: number; // -50 to +50 (% of width)
    offsetY?: number; // -50 to +50 (% of height)
    scale?: number; // 0.5 to 2.5
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
        pvOpacity = 0.85,
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

                    // Calculate cover scale for user image
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

                    // 1. Draw base PV Solar Leaf Undertone Texture (original leaf contour with grid lines)
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = 1.0;
                    ctx.drawImage(maskImg, 0, 0, w, h);

                    // 2. Blend user photo over the PV solar grid using multiply mode
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.globalAlpha = Math.max(0.1, Math.min(1.0, pvOpacity));
                    ctx.drawImage(userImg, posX, posY, renderW, renderH);

                    // 3. Add overlay highlight so bright picture details stay crisp
                    ctx.globalCompositeOperation = 'overlay';
                    ctx.globalAlpha = (1 - pvOpacity) * 0.4;
                    ctx.drawImage(userImg, posX, posY, renderW, renderH);

                    // 4. Crop output strictly to the solar leaf shape mask contour
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
