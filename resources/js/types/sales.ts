export interface SalesOpportunity {
    id: string;
    tag: string;
    segmentKey: string;
    titleKey: string;
    descKey: string;
    modelKey: string;
    payoutKey: string;
    payoutValCs: string;
    payoutValEn: string;
    imageSrc: string;
    overlayLine1: string;
    overlayLine2: string;
}

export const SALES_OPPORTUNITIES: SalesOpportunity[] = [
    {
        id: 'dev',
        tag: '01',
        segmentKey: 'sales.ideas.dev_segment',
        titleKey: 'sales.ideas.dev_title',
        descKey: 'sales.ideas.dev_desc',
        modelKey: 'sales.ideas.dev_model',
        payoutKey: 'sales.ideas.dev_payout',
        payoutValCs: '980 000 Kč',
        payoutValEn: '€40,000',
        imageSrc: '/img/sales/opp-dev.jpg',
        overlayLine1: 'RESIDENTIAL',
        overlayLine2: 'PROJECTS',
    },
    {
        id: 'village',
        tag: '02',
        segmentKey: 'sales.ideas.village_segment',
        titleKey: 'sales.ideas.village_title',
        descKey: 'sales.ideas.village_desc',
        modelKey: 'sales.ideas.village_model',
        payoutKey: 'sales.ideas.village_payout',
        payoutValCs: '490 000 Kč',
        payoutValEn: '€20,000',
        imageSrc: '/img/sales/opp-village.jpg',
        overlayLine1: 'MUNICIPAL &',
        overlayLine2: 'VILLAGES',
    },
    {
        id: 'zoo',
        tag: '03',
        segmentKey: 'sales.ideas.zoo_segment',
        titleKey: 'sales.ideas.zoo_title',
        descKey: 'sales.ideas.zoo_desc',
        modelKey: 'sales.ideas.zoo_model',
        payoutKey: 'sales.ideas.zoo_payout',
        payoutValCs: '534 000 Kč',
        payoutValEn: '€21,800',
        imageSrc: '/img/sales/opp-zoo.jpg',
        overlayLine1: 'SAFARI &',
        overlayLine2: 'ZOO PARKS',
    },
    {
        id: 'metal',
        tag: '04',
        segmentKey: 'sales.ideas.metal_segment',
        titleKey: 'sales.ideas.metal_title',
        descKey: 'sales.ideas.metal_desc',
        modelKey: 'sales.ideas.metal_model',
        payoutKey: 'sales.ideas.metal_payout',
        payoutValCs: '1 470 000 Kč',
        payoutValEn: '€60,000',
        imageSrc: '/img/sales/opp-metal.jpg',
        overlayLine1: 'HEAVY',
        overlayLine2: 'INDUSTRY',
    },
    {
        id: 'bank',
        tag: '05',
        segmentKey: 'sales.ideas.bank_segment',
        titleKey: 'sales.ideas.bank_title',
        descKey: 'sales.ideas.bank_desc',
        modelKey: 'sales.ideas.bank_model',
        payoutKey: 'sales.ideas.bank_payout',
        payoutValCs: '490 000 Kč',
        payoutValEn: '€20,000',
        imageSrc: '/img/sales/opp-bank.jpg',
        overlayLine1: 'CORPORATE',
        overlayLine2: 'BANK HQ',
    },
    {
        id: 'community',
        tag: '06',
        segmentKey: 'sales.ideas.community_segment',
        titleKey: 'sales.ideas.community_title',
        descKey: 'sales.ideas.community_desc',
        modelKey: 'sales.ideas.community_model',
        payoutKey: 'sales.ideas.community_payout',
        payoutValCs: '144 000 Kč',
        payoutValEn: '€5,880',
        imageSrc: '/img/sales/opp-community.jpg',
        overlayLine1: 'COMMUNITY',
        overlayLine2: 'HOUSING',
    },
    {
        id: 'retail',
        tag: '07',
        segmentKey: 'sales.ideas.retail_segment',
        titleKey: 'sales.ideas.retail_title',
        descKey: 'sales.ideas.retail_desc',
        modelKey: 'sales.ideas.retail_model',
        payoutKey: 'sales.ideas.retail_payout',
        payoutValCs: '1 046 000 Kč',
        payoutValEn: '€42,700',
        imageSrc: '/img/sales/opp-retail.jpg',
        overlayLine1: 'LOGISTICS &',
        overlayLine2: 'RETAIL',
    },
];
