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
    basePath: string;
    background: string;
    backgroundAlt: string;
    layers: DynamicLayer[];
};

type LayeredPreviewProductConfig = {
    defaultSectionId?: string;
    sections: Record<string, LayeredPreviewSection>;
};

const layeredPreviewSections: Partial<
    Record<ProductIdType, LayeredPreviewProductConfig>
> = {
    [ProductId.StromV2]: {
        defaultSectionId: 'color',
        sections: {
            color: {
                basePath: '/img/config-images/v2-config-compressed-webp/color',
                background: 'color-bg.webp',
                backgroundAlt: 'Pozadi konfiguratoru barvy konstrukce',
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
            leaf: {
                basePath:
                    '/img/config-images/v2-config-compressed-webp/leaf-color',
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
        },
    },
};

export function getConfiguratorPreviewLayers(
    productId: ProductIdType,
    stepId: string,
    selection: ConfiguratorPreviewSelection,
): ConfiguratorPreviewLayer[] {
    const productConfig = layeredPreviewSections[productId];

    if (!productConfig) {
        return [];
    }

    const sectionId = stepId in productConfig.sections
            ? stepId
            : productConfig.defaultSectionId;
            
    const section = sectionId ? productConfig.sections[sectionId] : null;

    if (!section) {
        return [];
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
