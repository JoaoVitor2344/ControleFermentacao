// Formata um número decimal usando a localização brasileira (vírgula como separador decimal)
// Exemplo: 10.5 → "10,50" | 4.2 → "4,20"
export const formatDecimal = (value: number, decimals = 2): string =>
    value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
