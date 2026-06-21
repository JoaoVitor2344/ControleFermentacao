// Enum espelhando o FermentationStatus do backend.
// Usar enum em vez de union literal permite autocompletar e evita erros de digitação.
export enum FermentationStatus {
    WithinPattern = 'WithinPattern',
    Attention = 'Attention',
    OutOfPattern = 'OutOfPattern',
}

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
