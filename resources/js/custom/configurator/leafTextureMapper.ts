/**
 * Maps a user-uploaded image onto the FVE solar leaves mask template using HTML5 Canvas.
 *
 * @param userImageUrl Data URL or Object URL of the user's uploaded image
 * @param maskUrl Path to the leaf contour mask template
 * @returns Promise<string> Data URL of the composited leaf pattern image
 */
export async function generateMappedLeafTexture(
    userImageUrl: string,
    maskUrl: string = '/img/config-images/v1-config-compressed-webp/leaf-color/fve-design/fve_spring.webp',
): Promise<string> {
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
                    let renderW = w;
                    let renderH = h;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (userAspect > canvasAspect) {
                        renderW = h * userAspect;
                        offsetX = (w - renderW) / 2;
                    } else {
                        renderH = w / userAspect;
                        offsetY = (h - renderH) / 2;
                    }

                    // 1. Draw scaled user image
                    ctx.drawImage(userImg, offsetX, offsetY, renderW, renderH);

                    // 2. Crop to leaf shape mask using destination-in
                    ctx.globalCompositeOperation = 'destination-in';
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
