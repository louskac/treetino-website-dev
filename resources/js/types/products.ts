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
    | 'grant';

export interface ConfiguratorStep {
    id: string;
    component: string;
    configurationFields: ConfigurationField[];
}

export interface Product {
    id: ProductId;
    label: string;
    image: string;
    params: { power: string; dailyProduction: string; roi: string };
    steps: ConfiguratorStep[];
    basePrice: number;
    monthlySavings: number;
}

export const PRODUCTS: Product[] = [
    {
        id: ProductId.StromV1,
        label: 'Strom V1',
        image: '/img/stills/Still_Strom-v1.png',
        params: { power: '800 W', dailyProduction: '3,2 kWh', roi: '7 let' },
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
    },
    {
        id: ProductId.StromV2,
        label: 'Strom V2',
        image: '/img/stills/Still_Strom-v2.png',
        params: { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' },
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
        basePrice: 4000000,
        monthlySavings: 7350,
    },
    {
        id: ProductId.Turbina,
        label: 'Větrná turbína',
        image: '/img/stills/Still_Turbina.png',
        params: { power: '600 W', dailyProduction: '2,4 kWh', roi: '8 let' },
        steps: [
            {
                id: 'color',
                component: 'ConfiguratorColorStep',
                configurationFields: ['color'],
            },
            {
                id: 'connectivity',
                component: 'ConfiguratorConnectivityStep',
                configurationFields: ['connectivity'],
            },
        ],
        basePrice: 150000,
        monthlySavings: 1300,
    },
];
