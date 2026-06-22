// Formata um número decimal usando a localização brasileira (vírgula como separador decimal)
// Exemplo: 10.5 → "10,50" | 4.2 → "4,20"
export const formatDecimal = (value: number, decimals = 2): string =>
    value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

// Converte string digitada pelo usuário para número JS.
// Aceita formatos brasileiros e americanos:
// "1.500,00" -> 1500
// "1,500.00" -> 1500
// "1500,00" -> 1500
// "1500.00" -> 1500
export const parseDecimal = (value: string): number => {
    const normalized = String(value).trim();

    if (!normalized) {
        return Number.NaN;
    }

    const lastComma = normalized.lastIndexOf(',');
    const lastDot = normalized.lastIndexOf('.');
    const decimalSeparatorIndex = Math.max(lastComma, lastDot);

    if (decimalSeparatorIndex === -1) {
        return Number(normalized.replace(/[^\d-]/g, ''));
    }

    const integerPart = normalized.slice(0, decimalSeparatorIndex).replace(/[^\d-]/g, '');
    const decimalPart = normalized.slice(decimalSeparatorIndex + 1).replace(/[^\d]/g, '');

    return Number(`${integerPart}.${decimalPart || '0'}`);
};

const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';

export const formatDateTime = (value: string): string =>
    new Date(value).toLocaleString('pt-BR', {
        timeZone: BRAZIL_TIME_ZONE,
    });

export const formatShortDate = (value: string): string =>
    new Date(value).toLocaleDateString('pt-BR', {
        timeZone: BRAZIL_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
    });
