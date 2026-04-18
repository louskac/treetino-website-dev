export const ProductId = {
    StromV1: 'strom-v1',
    StromV2: 'strom-v2',
    Turbina: 'turbina',
} as const;

export type ProductId = typeof ProductId[keyof typeof ProductId];

export interface ConfiguratorStep {
    id: string;
    component: string;
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
            { id: 'color', component: 'ConfiguratorColorStep' },
            { id: 'leaf', component: 'ConfiguratorLeafColorStep' },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep' },
            { id: 'battery', component: 'ConfiguratorBatteryStep' },
            { id: 'addons', component: 'ConfiguratorAddonsStep' }
        ],
        basePrice: 1250000
    },
    { 
        id: ProductId.StromV2, 
        label: 'Strom V2', 
        params: { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' },
        steps: [
            { id: 'color', component: 'ConfiguratorColorStep' },
            { id: 'leaf', component: 'ConfiguratorLeafColorStep' },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep' },
            { id: 'battery', component: 'ConfiguratorBatteryStep' },
            { id: 'addons', component: 'ConfiguratorAddonsStep' }
        ],
        basePrice: 3300000
    },
    { 
        id: ProductId.Turbina,  
        label: 'Větrná turbína', 
        params: { power: '600 W', dailyProduction: '2,4 kWh', roi: '8 let' },
        steps: [
            { id: 'color', component: 'ConfiguratorColorStep' },
            { id: 'connectivity', component: 'ConfiguratorConnectivityStep' }
        ],
        basePrice: 135000
    },
];