import api from "./client.ts";
import type {FermentationRecord, FermentationSummary} from "../types";

export const getSummary = () =>
    api.get<FermentationSummary>('/fermentation/summary').then(r => r.data);

export const getRecordsByBatch = (batchNumber: string) =>
    api.get<FermentationRecord[]>(`/fermentation/batch/${batchNumber}`).then(r => r.data);

export const registerFermentation = (data: {
    beerId: string;
    tankId: string;
    batchNumber: string;
    temperature: number;
    ph: number;
    extract: number;
    notes: string;
}) => api.post<string>('/fermentation/records', data).then(r => r.data);