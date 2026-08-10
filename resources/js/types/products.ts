export const ProductId = {
    StromV1: 'strom-v1',
    StromV2: 'strom-v2',
    Turbina: 'turbina',
} as const;

export type ProductId = typeof ProductId[keyof typeof ProductId];

export type ConfigurationField =
    | 'color'
    | 'leafColor'
    | 'fveLeafDesign'
    | 'connectivity'
    | 'battery'
    | 'evChargerCount'
    | 'bikeChargerRequested'
    | 'windTurbines'
    | 'turbineSize'
    | 'turbineMount'
    | 'treeDesign'
    | 'grant';

export interface ConfiguratorStep {
    id: string;
    component: string;
    configurationFields: ConfigurationField[];
}

export interface ProductParams {
    power: string;
    dailyProduction: string;
    roi: string;
}

export interface ProductStat {
    icon: string;
    value: string;
    description: string;
    descriptionKey: string;
}

export interface Product {
    id: ProductId;
    label: string;
    labelKey: string;
    detail: string;
    image: string;
    numbersTitle: string;
    numbersTitleKey: string;
    numbersDescription: string;
    numbersDescriptionKey: string;
    configureLabel: string;
    configureLabelKey: string;
    params: {
        configField?: ConfigurationField;
        variants: Record<string, ProductParams>;
    };
    steps: ConfiguratorStep[];
    basePrice: number;
    monthlySavings: number;
    reservationPrice: number;
    stats: ProductStat[];
}

export const PRODUCTS: Product[] = [
    {
        id: ProductId.StromV1,
        label: 'Strom V1',
        labelKey: 'products.v1.title',
        detail: 'treetino-v1',
        image: '/img/stills/LG-still.webp',
        numbersTitle: 'Strom V1 v číslech',
        numbersTitleKey: 'products.v1.numbers_title',
        numbersDescription: 'Navrženo pro byznys centra, průmyslové parky, městská náměstí a EV nabíjecí huby.',
        numbersDescriptionKey: 'products.v1.numbers_description',
        configureLabel: 'Konfigurovat Strom V1',
        configureLabelKey: 'products.v1.configure_label',
        params: {
            variants: {
                default: { power: '49,8 kW', dailyProduction: '350-450 kWh', roi: 'configurator.header.roi_value.v1' },
            },
        },
        steps: [
            {
                id: 'color',
                component: 'ConfiguratorColorStep',
                configurationFields: ['color'],
            },
            {
                id: 'leaf',
                component: 'ConfiguratorLeafColorStep',
                configurationFields: ['leafColor'],
            },
            {
                id: 'fve-leaf',
                component: 'ConfiguratorFveLeafStep',
                configurationFields: ['fveLeafDesign'],
            },
            {
                id: 'connectivity',
                component: 'ConfiguratorConnectivityStep',
                configurationFields: ['connectivity'],
            },
            {
                id: 'battery',
                component: 'ConfiguratorBatteryStep',
                configurationFields: ['battery'],
            },
            {
                id: 'addons',
                component: 'ConfiguratorAddonsStep',
                configurationFields: ['evChargerCount', 'bikeChargerRequested'],
            },
        ],
        basePrice: 3500000,
        monthlySavings: 5700,
        reservationPrice: 12000,
        stats: [
            { icon: 'flash',              value: '49,8 kW',   description: '13,8 kWp FVE + 36 kW VTE', descriptionKey: 'products.v1.stats.1' },
            { icon: 'leaf',               value: '60 ks',     description: 'Články TopCon s účinností 20,2 %', descriptionKey: 'products.v1.stats.2' },
            { icon: 'wind',               value: '4 ks',      description: 'Generátory 4× 3 kW (výška 2,8 m)', descriptionKey: 'products.v1.stats.3' },
            { icon: 'shield-check',       value: 'Až 90 %',   description: 'Dotační programy pro firmy a město', descriptionKey: 'products.v1.stats.4' },
            { icon: 'clock',              value: '3 měsíce',  description: 'Od předání staveniště po spuštění', descriptionKey: 'products.v1.stats.5' },
            { icon: 'two-points-circle',  value: '1 m²',      description: 'Průměr kmenu 1,0 m u paty', descriptionKey: 'products.v1.stats.6' },
        ],
    },
    {
        id: ProductId.StromV2,
        label: 'Strom V2',
        labelKey: 'products.v2.title',
        detail: 'treetino-v2',
        image: '/img/stills/SM-still.webp',
        numbersTitle: 'Strom V2 v číslech',
        numbersTitleKey: 'products.v2.numbers_title',
        numbersDescription: 'Ideální řešení pro dokonalé proporce na zahradě bez zabírání trávníku.',
        numbersDescriptionKey: 'products.v2.numbers_description',
        configureLabel: 'Konfigurovat Strom V2',
        configureLabelKey: 'products.v2.configure_label',
        params: {
            configField: 'windTurbines',
            variants: {
                'with-turbines':    { power: '15 kW', dailyProduction: '110-135 kWh', roi: 'configurator.header.roi_value.v2_with' },
                'without-turbines': { power: '12 kW', dailyProduction: '85-115 kWh', roi: 'configurator.header.roi_value.v2_without' },
            },
        },
        steps: [
            {
                id: 'wind-turbines',
                component: 'ConfiguratorWindTurbinesStep',
                configurationFields: ['windTurbines'],
            },
            {
                id: 'tree-design',
                component: 'ConfiguratorTreeDesignStep',
                configurationFields: ['treeDesign'],
            },
            {
                id: 'color',
                component: 'ConfiguratorColorStep',
                configurationFields: ['color'],
            },
            {
                id: 'leaf',
                component: 'ConfiguratorLeafColorStep',
                configurationFields: ['leafColor'],
            },
            {
                id: 'fve-leaf',
                component: 'ConfiguratorFveLeafStep',
                configurationFields: ['fveLeafDesign'],
            },
            {
                id: 'connectivity',
                component: 'ConfiguratorConnectivityStep',
                configurationFields: ['connectivity'],
            },
            {
                id: 'battery',
                component: 'ConfiguratorBatteryStep',
                configurationFields: ['battery'],
            },
            {
                id: 'addons',
                component: 'ConfiguratorAddonsStep',
                configurationFields: ['evChargerCount', 'bikeChargerRequested'],
            },
        ],
        basePrice: 4000000,
        monthlySavings: 7350,
        reservationPrice: 12000,
        stats: [
            { icon: 'flash',              value: '6 – 12 kW', description: '5,61 kWp FVE + 6 kW VTE kit', descriptionKey: 'products.v2.stats.1' },
            { icon: 'leaf',               value: '61 ks',     description: 'Zabere jen 1 m² trávníku', descriptionKey: 'products.v2.stats.2' },
            { icon: 'wind',               value: '6 ks',      description: '6× tiché vertikální turbíny', descriptionKey: 'products.v2.stats.3' },
            { icon: 'shield-check',       value: 'Až 90 %',   description: 'Pro rodinné domy a vily', descriptionKey: 'products.v2.stats.4' },
            { icon: 'clock',              value: '2 měsíce',  description: 'Rychlá montáž za 1 den', descriptionKey: 'products.v2.stats.5' },
            { icon: 'two-points-circle',  value: '< 1 m²',    description: 'Průměr kmenu 0,6 m u paty', descriptionKey: 'products.v2.stats.6' },
        ],
    },
    {
        id: ProductId.Turbina,
        label: 'Větrná turbína',
        labelKey: 'products.turbine.title',
        detail: 'turbine',
        image: '/img/stills/Still_Turbina.png',
        numbersTitle: 'Větrná Turbína v číslech',
        numbersTitleKey: 'products.turbine.numbers_title',
        numbersDescription: 'Ideální doplněk pro střechy budov, parkovací domy nebo městskou infrastrukturu.',
        numbersDescriptionKey: 'products.turbine.numbers_description',
        configureLabel: 'Konfigurovat Turbínu',
        configureLabelKey: 'products.turbine.configure_label',
        params: {
            configField: 'turbineSize',
            variants: {
                large:  { power: '3 kW',   dailyProduction: '12 kWh', roi: 'configurator.header.roi_value.turb_large' },
                medium: { power: '1,5 kW', dailyProduction: '6 kWh',  roi: 'configurator.header.roi_value.turb_medium' },
                small:  { power: '1 kW',   dailyProduction: '4 kWh',  roi: 'configurator.header.roi_value.turb_small' },
            },
        },
        steps: [
            {
                id: 'turbine-size',
                component: 'ConfiguratorTurbinaSizeStep',
                configurationFields: ['turbineSize'],
            },
            {
                id: 'turbine-mount',
                component: 'ConfiguratorTurbinaMountStep',
                configurationFields: ['turbineMount'],
            },
            {
                id: 'color-turbine',
                component: 'ConfiguratorTurbineColorStep',
                configurationFields: ['color'],
            },
        ],
        basePrice: 150000,
        monthlySavings: 1300,
        reservationPrice: 6000,
        stats: [
            { icon: 'flash',              value: '1 – 3 kW',   description: 'Max. výkon jedné turbíny', descriptionKey: 'products.turbine.stats.1' },
            { icon: 'map-pin',            value: '3 varianty', description: 'Tichý provoz s nízkým startem', descriptionKey: 'products.turbine.stats.2' },
            { icon: 'wind',               value: '1,8 m/s',    description: 'Odolnost vůči větru až 45 m/s', descriptionKey: 'products.turbine.stats.3' },
            { icon: 'shield-check',       value: 'Bezpečné',   description: 'Transparentní polymerový design', descriptionKey: 'products.turbine.stats.4' },
            { icon: 'clock',              value: '2 měsíce',   description: 'Snadná montáž na stožár i střechu', descriptionKey: 'products.turbine.stats.5' },
            { icon: 'cube',               value: '3 roky',     description: 'Bezúdržbový provoz s životností 20 let', descriptionKey: 'products.turbine.stats.6' },
        ],
    },
];
