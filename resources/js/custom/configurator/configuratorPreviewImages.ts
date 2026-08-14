import { ProductId } from '@/types/products';
import type { ProductId as ProductIdType } from '@/types/products';

export type ConfiguratorPreviewSelection = {
    color: string;
    customFrameColor?: string;
    leafColor: string;
    customLeafColor?: string;
    fveLeafDesign: string;
    customFveLeafImage?: string | null;
    connectivity: string;
    battery: string;
    evChargerCount: number;
    bikeChargerRequested: boolean;
    windTurbines: string;
    turbineSize: string;
    turbineMount: string;
    treeDesign: string;
};

export type ConfiguratorPreviewLayer = {
    src: string;
    alt: string;
};

export type ConfiguratorPreviewAddon = {
    src: string;
    alt: string;
    label: string;
    descriptionKey: string;
    selected: boolean;
};

export type ConfiguratorPreview =
    | {
          type: 'layers';
          layers: ConfiguratorPreviewLayer[];
      }
    | {
          type: 'addons';
          items: ConfiguratorPreviewAddon[];
      };

type DynamicLayer = {
    dir: string;
    prefix: string;
    selection: keyof ConfiguratorPreviewSelection;
    alt: string;
};

type LayeredPreviewSection = {
    type: 'layered';
    basePath: string;
    background: string;
    backgroundAlt: string;
    layers: DynamicLayer[];
};

type CompositePreviewSection = {
    type: 'composite';
    basePath: string;
    alt: string;
    getFileName: (selection: ConfiguratorPreviewSelection) => string;
};

type AddonsPreviewItem = {
    fileName: string;
    label: string;
    alt: string;
    descriptionKey: string;
    isSelected: (selection: ConfiguratorPreviewSelection) => boolean;
};

type AddonsPreviewSection = {
    type: 'addons';
    basePath: string;
    items: AddonsPreviewItem[];
};

type PreviewSection =
    | LayeredPreviewSection
    | CompositePreviewSection
    | AddonsPreviewSection;

type PreviewProductConfig = {
    defaultSectionId?: string;
    sections: Record<string, PreviewSection>;
};

const stromV1CompositePreview: CompositePreviewSection = {
    type: 'composite',
    basePath: '/img/config-images/v1-config-compressed-webp',
    alt: 'Konfigurace stromu V1',
    getFileName: (selection) =>
        `color_${selection.color}_${selection.leafColor}.webp`,
};

const stromV1LeafPreview: LayeredPreviewSection = {
    type: 'layered',
    basePath: '/img/config-images/v1-config-compressed-webp/leaf-color',
    background: 'leaf-color-bg.webp',
    backgroundAlt: 'Pozadi konfiguratoru listu',
    layers: [
        {
            dir: 'construction',
            prefix: 'color',
            selection: 'color',
            alt: 'Barva konstrukce',
        },
        {
            dir: 'leaves',
            prefix: 'leaf',
            selection: 'leafColor',
            alt: 'Barva listu',
        },
        {
            dir: 'fve-design',
            prefix: 'fve',
            selection: 'fveLeafDesign',
            alt: 'Design FVE listu',
        },
    ],
};

const getAddonsPreview = (basePath: string): AddonsPreviewSection => ({
    type: 'addons',
    basePath,
    items: [
        {
            fileName: 'nabijecka-auta.webp',
            label: 'Nabíjení aut',
            alt: 'Nabíjení pro elektromobily',
            descriptionKey: 'configurator.preview.addons.ev_charger.text',
            isSelected: (selection) => selection.evChargerCount > 0,
        },
        {
            fileName: 'baterie.webp',
            label: 'Baterie',
            alt: 'Fyzická baterie',
            descriptionKey: 'configurator.preview.addons.battery.text',
            isSelected: (selection) => selection.battery !== 'none',
        },
        {
            fileName: 'nabijecka-kola.webp',
            label: 'Nabíjení kol',
            alt: 'Nabíjení pro elektrokola',
            descriptionKey: 'configurator.preview.addons.bike_charger.text',
            isSelected: (selection) => selection.bikeChargerRequested,
        },
    ],
});

const getConnectivityPreview = (basePath: string): AddonsPreviewSection => ({
    type: 'addons',
    basePath,
    items: [
        {
            fileName: 'treetino-app-mockup.webp',
            label: 'Premium Connectivity',
            alt: 'Premium Connectivity',
            descriptionKey: 'configurator.preview.connectivity.premium.text',
            isSelected: (selection) => selection.connectivity !== 'none',
        },
    ],
});

const turbineSizeAssetNames: Record<string, string> = {
    large: 'lg',
    medium: 'md',
    small: 'sm',
};

const turbineMountAssetNames: Record<string, string> = {
    roof: 'floor',
    wall: 'wall',
    pole: 'post',
};

const turbineColorAssetNames: Record<string, string> = {
    transparent: 'clear',
    white: 'white',
    grey: 'grey',
    green: 'green',
    custom: 'custom',
};

const turbineCompositePreview: CompositePreviewSection = {
    type: 'composite',
    basePath: '/img/config-images/turbine-config',
    alt: 'Konfigurace vetrne turbiny',
    getFileName: (selection) => {
        const size = turbineSizeAssetNames[selection.turbineSize] ?? 'lg';
        const mount = turbineMountAssetNames[selection.turbineMount] ?? 'floor';
        const color = turbineColorAssetNames[selection.color] ?? 'clear';

        return `${size}/${mount}/${size}-${mount}-${color}.webp`;
    },
};

const configuratorPreviewProducts: Partial<
    Record<ProductIdType, PreviewProductConfig>
> = {
    [ProductId.StromV1]: {
        defaultSectionId: 'color',
        sections: {
            color: stromV1CompositePreview,
            leaf: stromV1LeafPreview,
            'fve-leaf': stromV1LeafPreview,
            connectivity: getConnectivityPreview(
                '/img/config-images/v1-config-compressed-webp/addons',
            ),
            battery: getAddonsPreview(
                '/img/config-images/v1-config-compressed-webp/addons',
                ),
            addons: getAddonsPreview(
                '/img/config-images/v1-config-compressed-webp/addons',
            ),
        },
    },
    [ProductId.Turbina]: {
        defaultSectionId: 'turbine-size',
        sections: {
            'turbine-size': turbineCompositePreview,
            'turbine-mount': turbineCompositePreview,
            'color-turbine': turbineCompositePreview,
        },
    },
    [ProductId.StromV2]: {
        defaultSectionId: 'color',
        sections: {
            color: {
                type: 'layered',
                basePath: '/img/config-images/v2-config-compressed-webp/color',
                background: 'color-bg.webp',
                backgroundAlt: 'Pozadi konfiguratoru barvy konstrukce',
                layers: [
                    {
                        dir: 'leaves',
                        prefix: 'leaf',
                        selection: 'leafColor',
                        alt: 'Barva listu',
                    },
                    {
                        dir: 'construction',
                        prefix: 'color',
                        selection: 'color',
                        alt: 'Barva konstrukce',
                    },
                ],
            },
            leaf: {
                type: 'layered',
                basePath:
                    '/img/config-images/v2-config-compressed-webp/leaf-color',
                background: 'leaf-color-bg.webp',
                backgroundAlt: 'Pozadi konfiguratoru barvy listu',
                layers: [
                    {
                        dir: 'leaves',
                        prefix: 'leaf',
                        selection: 'leafColor',
                        alt: 'Barva listu',
                    },
                    {
                        dir: 'construction',
                        prefix: 'color',
                        selection: 'color',
                        alt: 'Barva konstrukce',
                    },
                ],
            },
            connectivity: getConnectivityPreview(
                '/img/config-images/v2-config-compressed-webp/addons',
            ),
            battery: getAddonsPreview(
                '/img/config-images/v2-config-compressed-webp/addons',
            ),
            addons: getAddonsPreview(
                '/img/config-images/v2-config-compressed-webp/addons',
            ),
        },
    },
};

export function getConfiguratorPreview(
    productId: ProductIdType,
    stepId: string,
    selection: ConfiguratorPreviewSelection,
): ConfiguratorPreview {
    const productConfig = configuratorPreviewProducts[productId];

    if (!productConfig) {
        return { type: 'layers', layers: [] };
    }

    const sectionId =
        stepId in productConfig.sections
            ? stepId
            : productConfig.defaultSectionId;

    const section = sectionId ? productConfig.sections[sectionId] : null;

    if (!section) {
        return { type: 'layers', layers: [] };
    }

    if (section.type === 'composite') {
        const relativePath = section.getFileName(selection);
        let src = `${section.basePath}/${relativePath}`;

        if (
            selection.color === 'custom' &&
            selection.customFrameColor &&
            relativePath.includes('-custom.webp')
        ) {
            src = getTintedTurbineUrl(src, selection.customFrameColor);
        } else if (
            selection.color === 'custom' &&
            selection.customFrameColor &&
            relativePath.startsWith('color_custom_')
        ) {
            src = getTintedV1TreeUrl(selection);
        }

        return {
            type: 'layers',
            layers: [
                {
                    src,
                    alt: section.alt,
                },
            ],
        };
    }

    if (section.type === 'addons') {
        return {
            type: 'addons',
            items: section.items.map((item) => ({
                src: `${section.basePath}/${item.fileName}`,
                alt: item.alt,
                label: item.label,
                descriptionKey: item.descriptionKey,
                selected: item.isSelected(selection),
            })),
        };
    }

    return {
        type: 'layers',
        layers: [
            {
                src: `${section.basePath}/${section.background}`,
                alt: section.backgroundAlt,
            },
            ...section.layers.flatMap((layer) => {
                const value = selection[layer.selection];

                if (value === 'none') {
                    return [];
                }

                if (
                    layer.selection === 'fveLeafDesign' &&
                    value === 'custom' &&
                    selection.customFveLeafImage
                ) {
                    return [
                        {
                            src: selection.customFveLeafImage,
                            alt: 'Vlastní fotka FVE listů na míru',
                        },
                    ];
                }

                if (
                    layer.selection === 'color' &&
                    value === 'custom' &&
                    selection.customFrameColor
                ) {
                    const baseSrc = `${section.basePath}/${layer.dir}/color_custom.webp`;
                    const tintedSrc = getTintedTextureUrl(baseSrc, selection.customFrameColor);

                    return [
                        {
                            src: tintedSrc,
                            alt: 'Vlastní barva konstrukce',
                        },
                    ];
                }

                if (
                    layer.selection === 'leafColor' &&
                    value === 'custom' &&
                    selection.customLeafColor
                ) {
                    const baseSrc = `${section.basePath}/${layer.dir}/leaf_custom.webp`;
                    const tintedSrc = getTintedTextureUrl(baseSrc, selection.customLeafColor);

                    return [
                        {
                            src: tintedSrc,
                            alt: 'Vlastní barva listů',
                        },
                    ];
                }

                const fileName = `${layer.prefix}_${value}.webp`;

                return [
                    {
                        src: `${section.basePath}/${layer.dir}/${fileName}`,
                        alt: layer.alt,
                    },
                ];
            }),
        ],
    };
}

const tintCache = new Map<string, string>();
const imgCache = new Map<string, HTMLImageElement>();

export function getTintedTextureUrl(src: string, targetHex: string): string {
    if (typeof window === 'undefined') {
        return src;
    }

    const key = `${src}_${targetHex}`;
    if (tintCache.has(key)) {
        return tintCache.get(key)!;
    }

    let img = imgCache.get(src);
    if (!img) {
        img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        imgCache.set(src, img);
    }

    if (!img.complete || img.naturalWidth === 0) {
        img.onload = () => {
            getTintedTextureUrl(src, targetHex);
        };
        return src;
    }

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 1500;
    canvas.height = img.naturalHeight || 1500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return src;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const hex = targetHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2) || 'FF', 16) / 255;
    const g = parseInt(hex.substring(2, 4) || 'FF', 16) / 255;
    const b = parseInt(hex.substring(4, 6) || 'FF', 16) / 255;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness < 248) {
                const weight = Math.min(1.0, (248 - brightness) / 30);
                data[i] = Math.round(data[i] * (1 - weight) + data[i] * r * weight);
                data[i + 1] = Math.round(data[i + 1] * (1 - weight) + data[i + 1] * g * weight);
                data[i + 2] = Math.round(data[i + 2] * (1 - weight) + data[i + 2] * b * weight);
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    tintCache.set(key, dataUrl);
    return dataUrl;
}

const turbineTintCache = new Map<string, string>();

export function getTintedTurbineUrl(customSrc: string, targetHex: string): string {
    if (typeof window === 'undefined') {
        return customSrc;
    }

    const key = `${customSrc}_${targetHex}`;
    if (turbineTintCache.has(key)) {
        return turbineTintCache.get(key)!;
    }

    const clearSrc = customSrc.replace('-custom.webp', '-clear.webp');
    const customImg = loadHtmlImage(customSrc);
    const clearImg = loadHtmlImage(clearSrc);

    if (
        !customImg.complete || customImg.naturalWidth === 0 ||
        !clearImg.complete || clearImg.naturalWidth === 0
    ) {
        const onLoaded = () => {
            if (customImg.complete && clearImg.complete) {
                getTintedTurbineUrl(customSrc, targetHex);
            }
        };
        customImg.onload = onLoaded;
        clearImg.onload = onLoaded;
        return customSrc;
    }

    const width = customImg.naturalWidth || 1000;
    const height = customImg.naturalHeight || 1500;

    const canvasCustom = document.createElement('canvas');
    canvasCustom.width = width;
    canvasCustom.height = height;
    const ctxCustom = canvasCustom.getContext('2d');
    if (!ctxCustom) return customSrc;

    ctxCustom.drawImage(customImg, 0, 0);
    const customData = ctxCustom.getImageData(0, 0, width, height);

    const canvasClear = document.createElement('canvas');
    canvasClear.width = width;
    canvasClear.height = height;
    const ctxClear = canvasClear.getContext('2d');
    if (!ctxClear) return customSrc;

    ctxClear.drawImage(clearImg, 0, 0);
    const clearData = ctxClear.getImageData(0, 0, width, height);

    const dataC = customData.data;
    const dataL = clearData.data;

    const hex = targetHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2) || 'FF', 16) / 255;
    const g = parseInt(hex.substring(2, 4) || 'FF', 16) / 255;
    const b = parseInt(hex.substring(4, 6) || 'FF', 16) / 255;

    // Spatially bounded difference mask (restricts mask to turbine body egg)
    const cy = 460;
    const cx = 750;
    const ry = 300;
    const rx = 200;

    for (let y = 0; y < height; y++) {
        const dy = (y - cy) / ry;
        for (let x = 0; x < width; x++) {
            const dx = (x - cx) / rx;
            const dist = dx * dx + dy * dy;

            if (dist > 1.15) {
                continue;
            }

            const i = (y * width + x) * 4;
            const diffR = Math.abs(dataC[i] - dataL[i]);
            const diffG = Math.abs(dataC[i + 1] - dataL[i + 1]);
            const diffB = Math.abs(dataC[i + 2] - dataL[i + 2]);
            const totalDiff = diffR + diffG + diffB;

            if (totalDiff > 25) {
                const spatialWeight = Math.min(1.0, (1.15 - dist) / 0.25);
                const diffWeight = Math.min(1.0, (totalDiff - 20) / 30);
                const weight = spatialWeight * diffWeight;

                dataC[i] = Math.round(dataC[i] * (1 - weight) + dataC[i] * r * weight);
                dataC[i + 1] = Math.round(dataC[i + 1] * (1 - weight) + dataC[i + 1] * g * weight);
                dataC[i + 2] = Math.round(dataC[i + 2] * (1 - weight) + dataC[i + 2] * b * weight);
            }
        }
    }

    ctxCustom.putImageData(customData, 0, 0);
    const dataUrl = canvasCustom.toDataURL('image/png');
    turbineTintCache.set(key, dataUrl);
    return dataUrl;
}

const v1TreeTintCache = new Map<string, string>();

export function getTintedV1TreeUrl(selection: ConfiguratorPreviewSelection): string {
    if (typeof window === 'undefined') {
        return '/img/config-images/v1-config-compressed-webp/color_white_green.webp';
    }

    const leafColor = selection.leafColor === 'custom' ? 'green' : selection.leafColor;
    const targetHex = selection.customFrameColor || '#FF6B00';

    const whiteSrc = `/img/config-images/v1-config-compressed-webp/color_white_${leafColor}.webp`;
    const brownSrc = `/img/config-images/v1-config-compressed-webp/color_brown_${leafColor}.webp`;

    const key = `${whiteSrc}_${targetHex}`;
    if (v1TreeTintCache.has(key)) {
        return v1TreeTintCache.get(key)!;
    }

    const whiteImg = loadHtmlImage(whiteSrc);
    const brownImg = loadHtmlImage(brownSrc);

    if (
        !whiteImg.complete || whiteImg.naturalWidth === 0 ||
        !brownImg.complete || brownImg.naturalWidth === 0
    ) {
        const onLoaded = () => {
            if (whiteImg.complete && brownImg.complete) {
                getTintedV1TreeUrl(selection);
            }
        };
        whiteImg.onload = onLoaded;
        brownImg.onload = onLoaded;
        return whiteSrc;
    }

    const width = whiteImg.naturalWidth || 1500;
    const height = whiteImg.naturalHeight || 1500;

    const canvasWhite = document.createElement('canvas');
    canvasWhite.width = width;
    canvasWhite.height = height;
    const ctxWhite = canvasWhite.getContext('2d');
    if (!ctxWhite) return whiteSrc;

    ctxWhite.drawImage(whiteImg, 0, 0);
    const whiteData = ctxWhite.getImageData(0, 0, width, height);

    const canvasBrown = document.createElement('canvas');
    canvasBrown.width = width;
    canvasBrown.height = height;
    const ctxBrown = canvasBrown.getContext('2d');
    if (!ctxBrown) return whiteSrc;

    ctxBrown.drawImage(brownImg, 0, 0);
    const brownData = ctxBrown.getImageData(0, 0, width, height);

    const dataW = whiteData.data;
    const dataB = brownData.data;

    const hex = targetHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2) || 'FF', 16) / 255;
    const g = parseInt(hex.substring(2, 4) || 'FF', 16) / 255;
    const b = parseInt(hex.substring(4, 6) || 'FF', 16) / 255;

    const cutoffY = Math.round(height * 0.805); // Y ~ 1208px out of 1500px (covers full flared root base seamlessly)

    for (let y = 0; y < cutoffY; y++) {
        const rowOffset = y * width * 4;
        for (let x = 0; x < width; x++) {
            const i = rowOffset + x * 4;

            const lum = (dataW[i] + dataW[i + 1] + dataW[i + 2]) / 3;
            if (lum >= 248) continue;

            const diffR = Math.abs(dataB[i] - dataW[i]);
            const diffG = Math.abs(dataB[i + 1] - dataW[i + 1]);
            const diffB = Math.abs(dataB[i + 2] - dataW[i + 2]);
            const totalDiff = diffR + diffG + diffB;

            if (totalDiff > 55) {
                const weight = Math.min(1.0, (totalDiff - 55) / 30);
                const normLum = Math.min(1.5, Math.max(0.1, lum / 255));

                const targetR = Math.min(255, Math.round(255 * r * normLum));
                const targetG = Math.min(255, Math.round(255 * g * normLum));
                const targetB = Math.min(255, Math.round(255 * b * normLum));

                dataW[i] = Math.round(dataW[i] * (1 - weight) + targetR * weight);
                dataW[i + 1] = Math.round(dataW[i + 1] * (1 - weight) + targetG * weight);
                dataW[i + 2] = Math.round(dataW[i + 2] * (1 - weight) + targetB * weight);
            }
        }
    }

    ctxWhite.putImageData(whiteData, 0, 0);
    const dataUrl = canvasWhite.toDataURL('image/png');
    v1TreeTintCache.set(key, dataUrl);
    return dataUrl;
}

function loadHtmlImage(src: string): HTMLImageElement {
    let img = imgCache.get(src);
    if (!img) {
        img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        imgCache.set(src, img);
    }
    return img;
}
