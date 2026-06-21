import api from "./client.ts";
import type {Tank} from "../types";

export const getTanks = () =>
    api.get<Tank[]>('/tanks').then(r => r.data);

export const getTankById = (id: string) =>
    api.get<Tank>(`/tanks/${id}`).then(r => r.data);

export const createTank = (data: Omit<Tank, 'id'>) =>
    api.post<string>('/tanks', data).then(r => r.data);

export const updateTank = (id: string, data: Omit<Tank, 'id'>) =>
    api.put(`/tanks/${id}`, data);

export const deleteTank = (id: string) =>
    api.delete(`/tanks/${id}`);