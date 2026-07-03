import { ProductId } from '@/types/products';
import type { ProductId as ProductIdType } from '@/types/products';

export type ConfiguratorPreviewSelection = {
    color: string;
    leafColor: string;
    fveLeafDesign: string;
    connectivity: string;
    battery: string;
    windTurbines: string;
    turbineSize: string;
    turbineMount: string;
    treeDesign: string;
};

export type ConfiguratorPreviewLayer = {
    src: string;
    alt: string;
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

type PreviewSection = LayeredPreviewSection | CompositePreviewSection;

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

const turbineSizeAssetNames: Record<string, string> = {
    large: 'lg',
    medium: 'md',
    small: 'sm',
};

const turbineMountAssetNames: Record<string, string> = {
    roof: 'floor',
    wall: 'wall',
    pole: 'floor',
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
            leaf: stromV1CompositePreview,
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
        },
    },
};

export function getConfiguratorPreviewLayers(
    productId: ProductIdType,
    stepId: string,
    selection: ConfiguratorPreviewSelection,
): ConfiguratorPreviewLayer[] {
    const productConfig = configuratorPreviewProducts[productId];

    if (!productConfig) {
        return [];
    }

    const sectionId =
        stepId in productConfig.sections
            ? stepId
            : productConfig.defaultSectionId;

    const section = sectionId ? productConfig.sections[sectionId] : null;

    if (!section) {
        return [];
    }

    if (section.type === 'composite') {
        return [
            {
                src: `${section.basePath}/${section.getFileName(selection)}`,
                alt: section.alt,
            },
        ];
    }

    return [
        {
            src: `${section.basePath}/${section.background}`,
            alt: section.backgroundAlt,
        },
        ...section.layers.map((layer) => {
            const value = selection[layer.selection];

            return {
                src: `${section.basePath}/${layer.dir}/${layer.prefix}_${value}.webp`,
                alt: layer.alt,
            };
        }),
    ];
}
