import api from "./client.ts";
import type { Beer } from "../types";

export interface BeerFilters {
    name?: string;
    style?: string;
}

// includeDeleted: quando true envia ?includeDeleted=true para o backend retornar registros removidos
export const getBeers = (includeDeleted = false, filters: BeerFilters = {}) =>
    api.get<Beer[]>('/beers', {params: {includeDeleted, ...filters}}).then(r => r.data);

export const getBeerById = (id: string) =>
    api.get<Beer>(`/beers/${id}`).then(r => r.data);

export const createBeer = (data: Omit<Beer, 'id' | 'deletedAt'>) =>
    api.post<string>('/beers', data).then(r => r.data);

export const updateBeer = (id: string, data: Omit<Beer, 'id' | 'deletedAt'>) =>
    api.put(`/beers/${id}`, data);

export const deleteBeer = (id: string) =>
    api.delete(`/beers/${id}`);
