import api from "./client.ts";
import type { Tank } from "../types";

// includeDeleted: quando true envia ?includeDeleted=true para o backend retornar registros removidos
export const getTanks = (includeDeleted = false) =>
    api.get<Tank[]>('/tanks', { params: { includeDeleted } }).then(r => r.data);

export const getTankById = (id: string) =>
    api.get<Tank>(`/tanks/${id}`).then(r => r.data);

export const createTank = (data: Omit<Tank, 'id' | 'deletedAt'>) =>
    api.post<string>('/tanks', data).then(r => r.data);

export const updateTank = (id: string, data: Omit<Tank, 'id' | 'deletedAt'>) =>
    api.put(`/tanks/${id}`, data);

export const deleteTank = (id: string) =>
    api.delete(`/tanks/${id}`);
