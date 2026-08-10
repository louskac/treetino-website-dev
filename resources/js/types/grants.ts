export interface Grant {
    id: string;
    label: string;
    labelKey?: string;
    percentage: number | null;
    eligibility: string;
    eligibilityKey?: string;
    description: string;
    descriptionKey?: string;
}

export const GRANTS: Grant[] = [
    {
        id: 'optak',
        label: 'OPTAK',
        percentage: 65,
        eligibility: 'Pro firmy',
        eligibilityKey: 'configurator.grants.optak.eligibility',
        description: 'Operační program Technologie a aplikace pro konkurenceschopnost.',
        descriptionKey: 'configurator.grants.optak.desc',
    },
    {
        id: 'res-plus',
        label: 'RES+',
        percentage: 50,
        eligibility: 'Pro obce a města',
        eligibilityKey: 'configurator.grants.res_plus.eligibility',
        description: 'Podpora komunitní energetiky a obecních obnovitelných zdrojů.',
        descriptionKey: 'configurator.grants.res_plus.desc',
    },
    {
        id: 'nzu',
        label: 'NZÚ',
        percentage: 30,
        eligibility: 'Pro fyzické osoby',
        eligibilityKey: 'configurator.grants.nzu.eligibility',
        description: 'Nová zelená úsporám - podpora pro domácnosti a fyzické osoby.',
        descriptionKey: 'configurator.grants.nzu.desc',
    },
    {
        id: 'irop',
        label: 'IROP',
        percentage: 90,
        eligibility: 'Komplexní městské projekty',
        eligibilityKey: 'configurator.grants.irop.eligibility',
        description: 'Integrovaný regionální operační program pro rozsáhlé projekty.',
        descriptionKey: 'configurator.grants.irop.desc',
    },
    {
        id: 'none',
        label: 'Bez dotace',
        labelKey: 'configurator.grants.none.label',
        percentage: null,
        eligibility: '',
        description: '',
    },
];

export function getGrantById(id: string): Grant | undefined {
    return GRANTS.find((g) => g.id === id);
}
