export const ProductId = {
    StromV1: 'strom-v1',
    StromV2: 'strom-v2',
    Turbina: 'turbina',
} as const;

export type ProductId = typeof ProductId[keyof typeof ProductId];

export const PRODUCTS: { id: ProductId; label: string; params: { power: string; dailyProduction: string; roi: string } }[] = [
    { id: ProductId.StromV1, label: 'Strom V1', params: { power: '800 W',  dailyProduction: '3,2 kWh', roi: '7 let' } },
    { id: ProductId.StromV2, label: 'Strom V2', params: { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' } },
    { id: ProductId.Turbina,  label: 'Větrná turbína', params: { power: '600 W',  dailyProduction: '2,4 kWh', roi: '8 let' } },
];

export const BASE_PRICES: Record<ProductId, number> = {
    [ProductId.StromV1]: 1250000,
    [ProductId.StromV2]: 3300000,
    [ProductId.Turbina]: 135000,
};
