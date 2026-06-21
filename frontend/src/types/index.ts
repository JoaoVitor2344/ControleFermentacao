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
}

export interface Tank {
    id: string;
    name: string;
    capacityLiters: number;
}

export interface FermentationRecord {
    id: string;
    temperature: number;
    ph: number;
    extract: number;
    notes: string;
    recordedAt: string;
    status: 'WithinPattern' | 'Attention' | 'OutOfPattern';
}

export interface FermentationSummary {
    totalRecords: number;
    withinPattern: number;
    attention: number;
    outOfPattern: number;
}
