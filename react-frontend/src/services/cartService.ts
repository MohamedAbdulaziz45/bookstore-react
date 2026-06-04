import api from "./api";
import type { AxiosResponse } from "axios";
import type { ICart } from "../types/cart.types";
import type { ISyncCartRequest } from "../types/cart.types";

const BASE = "/carts";

export const getCart = (): Promise<AxiosResponse<ICart>> =>
  api.get<ICart>(`${BASE}/me`);

export const addOrUpdateCartItem = (
  bookId: number,
  quantityChange: number,
): Promise<AxiosResponse<ICart>> =>
  api.post<ICart>(`${BASE}/items`, { bookId, quantityChange });

export const removeItem = (bookId: number): Promise<AxiosResponse<ICart>> =>
  api.delete<ICart>(`${BASE}/items/${bookId}`);

export const clearCart = (): Promise<AxiosResponse<void>> =>
  api.delete<void>(BASE);

export const syncCart = (
  request: ISyncCartRequest,
): Promise<AxiosResponse<ICart>> => api.post<ICart>(`${BASE}/sync`, request);

export const previewCart = (
  request: ISyncCartRequest,
): Promise<AxiosResponse<ICart>> => api.post<ICart>(`${BASE}/preview`, request);
