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
}

export interface Product {
    id: ProductId;
    label: string;
    detail: string;
    image: string;
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
        detail: 'treetino-v1',
        image: '/img/stills/Still_Strom-v1.png',
        params: {
            variants: {
                default: { power: '800 W', dailyProduction: '3,2 kWh', roi: '7 let' },
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
            { icon: 'leaf',              value: '300',    description: 'Solárních listů nejvyšší kvality' },
            { icon: 'wind',              value: '12',     description: 'Větrných turbín generujících energii i v noci' },
            { icon: 'asterisk',          value: '49 kW',  description: 'Výkon přizpůsobený podmínkám státní dotace' },
            { icon: 'cube',              value: '300 m²', description: 'Průměrná úspora plochy oproti klasickým FV panelům' },
            { icon: 'two-points-circle', value: '1 m²',   description: 'Zastavěná plocha - bez nutnosti stavebního povolení' },
            { icon: 'home',              value: '60',     description: 'Jedna instalace napájí až 60 moderních domácností' },
        ],
    },
    {
        id: ProductId.StromV2,
        label: 'Strom V2',
        detail: 'treetino-v2',
        image: '/img/stills/Still_Strom-v2.png',
        params: {
            configField: 'windTurbines',
            variants: {
                'with-turbines':    { power: '1800 W', dailyProduction: '7,0 kWh', roi: '5 let' },
                'without-turbines': { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' },
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
            { icon: 'leaf',              value: '122',      description: 'Solárních listů nejvyšší kvality' },
            { icon: 'wind',              value: '6',       description: 'Větrných turbín generujících energii i v noci' },
            { icon: 'flash',             value: '12 kW',  description: 'Špičkový výkon s aktivními turbínami' },
            { icon: 'cube',              value: '140 m²',   description: 'Průměrná úspora plochy oproti klasickým FV panelům' },
            { icon: 'two-points-circle', value: '1 m²',     description: 'Zastavěná plocha - bez nutnosti stavebního povolení' },
            { icon: 'home',              value: '15',       description: 'Jedna instalace napájí až 15 moderních domácností' },
        ],
    },
    {
        id: ProductId.Turbina,
        label: 'Větrná turbína',
        detail: 'turbine',
        image: '/img/stills/Still_Turbina.png',
        params: {
            configField: 'turbineSize',
            variants: {
                large:  { power: '3 kW',   dailyProduction: '12 kWh', roi: '6 let' },
                medium: { power: '1,5 kW', dailyProduction: '6 kWh',  roi: '8 let' },
                small:  { power: '1 kW',   dailyProduction: '4 kWh',  roi: '10 let' },
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
            { icon: 'flash',     value: '1,5 - 3 kW',      description: 'Výkon větrné turbíny' },
            { icon: 'map-pin',   value: '3 varianty', description: 'Montáž na sloup, stěnu nebo střechu' },
            { icon: 'palette',   value: 'Na přání',  description: 'Barva rámu přizpůsobená vašim požadavkům' },
        ],
    },
];
