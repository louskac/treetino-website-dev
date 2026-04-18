export const ProductId = {
    StromV1: 'strom-v1',
    StromV2: 'strom-v2',
    Turbina: 'turbina',
} as const;

export type ProductId = typeof ProductId[keyof typeof ProductId];

export type ConfigurationField =
    | 'color'
    | 'leafColor'
    | 'connectivity'
    | 'battery'
    | 'evChargerCount'
    | 'bikeChargerRequested';

export interface ConfiguratorStep {
    id: string;
    component: string;
    configurationFields: ConfigurationField[];
}

export interface Product {
    id: ProductId;
    label: string;
    params: { power: string; dailyProduction: string; roi: string };
    steps: ConfiguratorStep[];
    basePrice: number;
}

export const PRODUCTS: Product[] = [
    { 
        id: ProductId.StromV1, 
        label: 'Strom V1', 
        params: { power: '800 W', dailyProduction: '3,2 kWh', roi: '7 let' },
        steps: [
            { id: 'color', component: 'ConfiguratorColorStep', configurationFields: ['color'] },
            { id: 'leaf', component: 'ConfiguratorLeafColorStep', configurationFields: ['leafColor'] },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep', configurationFields: ['connectivity'] },
            { id: 'battery', component: 'ConfiguratorBatteryStep', configurationFields: ['battery'] },
            { id: 'addons', component: 'ConfiguratorAddonsStep', configurationFields: ['evChargerCount', 'bikeChargerRequested'] }
        ],
        basePrice: 1250000
    },
    { 
        id: ProductId.StromV2, 
        label: 'Strom V2', 
        params: { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' },
        steps: [
            { id: 'color', component: 'ConfiguratorColorStep', configurationFields: ['color'] },
            { id: 'leaf', component: 'ConfiguratorLeafColorStep', configurationFields: ['leafColor'] },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep', configurationFields: ['connectivity'] },
            { id: 'battery', component: 'ConfiguratorBatteryStep', configurationFields: ['battery'] },
            { id: 'addons', component: 'ConfiguratorAddonsStep', configurationFields: ['evChargerCount', 'bikeChargerRequested'] }
        ],
        basePrice: 3300000
    },
    { 
        id: ProductId.Turbina,  
        label: 'Větrná turbína', 
        params: { power: '600 W', dailyProduction: '2,4 kWh', roi: '8 let' },
        steps: [
            { id: 'color', component: 'ConfiguratorColorStep', configurationFields: ['color'] },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep', configurationFields: ['connectivity'] }
        ],
        basePrice: 135000
    },
];