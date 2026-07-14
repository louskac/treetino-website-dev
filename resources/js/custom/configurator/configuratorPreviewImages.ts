import { ProductId } from '@/types/products';
import type { ProductId as ProductIdType } from '@/types/products';

export type ConfiguratorPreviewSelection = {
    color: string;
    leafColor: string;
    fveLeafDesign: string;
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

const getAddonsPreview = (basePath: string): AddonsPreviewSection => ({
    type: 'addons',
    basePath,
    items: [
        {
            fileName: 'nabijecka-auta.webp',
            label: 'Nabíjení aut',
            alt: 'Nabíjení pro elektromobily',
            isSelected: (selection) => selection.evChargerCount > 0,
        },
        {
            fileName: 'baterie.webp',
            label: 'Baterie',
            alt: 'Fyzická baterie',
            isSelected: (selection) => selection.battery !== 'none',
        },
        {
            fileName: 'nabijecka-kola.webp',
            label: 'Nabíjení kol',
            alt: 'Nabíjení pro elektrokola',
            isSelected: (selection) => selection.bikeChargerRequested,
        },
    ],
});

const getConnectivityPreview = (basePath: string): AddonsPreviewSection => ({
    type: 'addons',
    basePath,
    items: [
        {
            fileName: 'baterie.webp',
            label: 'Premium Connectivity',
            alt: 'Premium Connectivity',
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
            leaf: {
                type: 'layered',
                basePath:
                    '/img/config-images/v1-config-compressed-webp/leaf-color',
                background: 'leaf-color-bg.webp',
                backgroundAlt: 'Pozadi konfiguratoru barvy listu',
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
                ],
            },
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
        return {
            type: 'layers',
            layers: [
                {
                    src: `${section.basePath}/${section.getFileName(selection)}`,
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
            ...section.layers.map((layer) => {
                const value = selection[layer.selection];
                const fileName = `${layer.prefix}_${value}.webp`;

                return {
                    src: `${section.basePath}/${layer.dir}/${fileName}`,
                    alt: layer.alt,
                };
            }),
        ],
    };
}
