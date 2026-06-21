// Padrão "const object + type alias" — equivalente ao enum mas compatível com erasableSyntaxOnly.
// O objeto existe em runtime (para uso em StatusBadge); o type alias serve para anotações de tipo.
export const FermentationStatus = {
    WithinPattern: 'WithinPattern',
    Attention: 'Attention',
    OutOfPattern: 'OutOfPattern',
} as const;

export type FermentationStatus = typeof FermentationStatus[keyof typeof FermentationStatus];

export interface Beer {
    id: string;
    name: string;
    style: string;
    minTemperature: number;
    maxTemperature: number;
    minPh: number;
    maxPh: number;
    minExtract: number;
    maxExtract: number;
    deletedAt?: string | null; // preenchido quando includeDeleted=true
}

export interface Tank {
    id: string;
    name: string;
    capacityLiters: number;
    deletedAt?: string | null; // preenchido quando includeDeleted=true
}

export interface FermentationRecord {
    id: string;
    temperature: number;
    ph: number;
    extract: number;
    notes: string;
    recordedAt: string;
    status: FermentationStatus;
}

export interface FermentationSummary {
    totalRecords: number;
    withinPattern: number;
    attention: number;
    outOfPattern: number;
}
