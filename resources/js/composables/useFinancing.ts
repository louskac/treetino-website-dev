export const ANNUAL_RATE = 0;

export function calcMonthlyPayment(principal: number, months: number): number {
    const r = ANNUAL_RATE / 100 / 12;
    const n = months;

    if (principal <= 0) {
        return 0;
    }

    if (r === 0) {
        return principal / n;
    }

    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function formatPrice(v: number, locale: string = 'cs'): string {
    if (locale === 'en') {
        const eur = Math.round(v / 24.5);
        return eur.toLocaleString('en-US');
    }
    return Math.round(v).toLocaleString('cs-CZ');
}

export function formatCurrency(v: number, locale: string = 'cs'): string {
    if (locale === 'en') {
        const eur = Math.round(v / 24.5);
        return `€${eur.toLocaleString('en-US')}`;
    }
    return `${Math.round(v).toLocaleString('cs-CZ')} Kč`;
}

