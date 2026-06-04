import api from "./api";
import type { AxiosResponse } from "axios";
import type { icategory } from "../types/category.types";

const BASE = "/Categories";

export const getAllCategories = (): Promise<AxiosResponse<icategory[]>> =>
  api.get<icategory[]>(BASE);

export const createCategory = (
  genreName: string,
): Promise<AxiosResponse<void>> => api.post<void>(BASE, { genreName });

export const updateCategory = (
  genreId: number | string,
  genreName: string,
): Promise<AxiosResponse<void>> =>
  api.put<void>(`${BASE}/${genreId}`, { genreName });

export const deleteCategory = (
  genreId: number | string,
): Promise<AxiosResponse<void>> => api.delete<void>(`${BASE}/${genreId}`);
