import api from "./api";
import type { AxiosResponse } from "axios";
import type {
  AdminShipping,
  AdminShippingFormValue,
} from "../types/admin.types";

const BASE = "/shippings";

export const getAllShippings = (): Promise<AxiosResponse<AdminShipping[]>> =>
  api.get<AdminShipping[]>(BASE);

export const getShippingById = (
  id: number,
): Promise<AxiosResponse<AdminShipping>> =>
  api.get<AdminShipping>(`${BASE}/${id}`);

export const createShipping = (
  value: AdminShippingFormValue,
): Promise<AxiosResponse<void>> => api.post<void>(BASE, value);

export const updateShipping = (
  id: number,
  value: AdminShippingFormValue,
): Promise<AxiosResponse<void>> => api.put<void>(`${BASE}/${id}`, value);
