export interface Grant {
    id: string;
    label: string;
    percentage: number | null;
    eligibility: string;
    description: string;
}

export const GRANTS: Grant[] = [
    {
        id: 'optak',
        label: 'OPTAK',
        percentage: 65,
        eligibility: 'Pro firmy',
        description: 'Operační program Technologie a aplikace pro konkurenceschopnost.',
    },
    {
        id: 'res-plus',
        label: 'RES+',
        percentage: 50,
        eligibility: 'Pro obce a města',
        description: 'Podpora komunitní energetiky a obecních obnovitelných zdrojů.',
    },
    {
        id: 'nzu',
        label: 'NZÚ',
        percentage: 30,
        eligibility: 'Pro fyzické osoby',
        description: 'Nová zelená úsporám - podpora pro domácnosti a fyzické osoby.',
    },
    {
        id: 'irop',
        label: 'IROP',
        percentage: 90,
        eligibility: 'Komplexní městské projekty',
        description: 'Integrovaný regionální operační program pro rozsáhlé projekty.',
    },
    {
        id: 'none',
        label: 'Bez dotace',
        percentage: null,
        eligibility: '',
        description: '',
    },
];

export function getGrantById(id: string): Grant | undefined {
    return GRANTS.find((g) => g.id === id);
}
