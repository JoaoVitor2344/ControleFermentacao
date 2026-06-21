import api from "./client.ts";
import type {Beer} from "../types";

export const getBeers= () =>
    api.get<Beer[]>('/beers').then(r => r.data);

export const getBeerById = (id: string) =>
    api.get<Beer>(`/beers/${id}`).then(r => r.data);

export const createBeer = (data: Omit<Beer, 'id'>) =>
    api.post<string>('/beers', data).then(r => r.data);

export const updateBeer = (id: string, data: Omit<Beer, 'id'>) =>
    api.put(`/beers/${id}`, data);

export const deleteBeer = (id: string) =>
    api.delete(`/beers/${id}`);