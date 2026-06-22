import api from "./client.ts";
import type {FermentationRecord, FermentationSummary, PagedResult} from "../types";

export const getSummary = () =>
    api.get<FermentationSummary>('/fermentation/summary').then(r => r.data);

export const getRecordsByBatch = (batchNumber: string) =>
    api.get<FermentationRecord[]>(`/fermentation/batch/${batchNumber}`).then(r => r.data);

export const getAllBatches = () =>
    api.get<string[]>('/fermentation/batches').then(r => r.data);

export const getAllFermentationRecords = (
    page: number,
    pageSize: number,
    filters?: { beerId?: string; tankId?: string; batchNumber?: string; status?: string; ascending?: boolean }
) => {
    const params = new URLSearchParams({page: String(page), pageSize: String(pageSize)});
    if (filters?.beerId) params.append('beerId', filters.beerId);
    if (filters?.tankId) params.append('tankId', filters.tankId);
    if (filters?.batchNumber) params.append('batchNumber', filters.batchNumber);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.ascending) params.append('ascending', 'true');
    return api.get<PagedResult<FermentationRecord>>(`/fermentation/records?${params}`).then(r => r.data);
};

export const updateFermentationRecord = (id: string, data: {
    temperature: number; ph: number; extract: number; notes: string;
}) => api.put(`/fermentation/records/${id}`, {id, ...data});

export const registerFermentation = (data: {
    beerId: string;
    tankId: string;
    batchNumber: string;
    temperature: number;
    ph: number;
    extract: number;
    notes: string;
}) => api.post<string>('/fermentation/records', data).then(r => r.data);
