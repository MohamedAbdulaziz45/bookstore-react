import api from "./api";
import type { IAddress, ICreateAddressRequest } from "../types/address.types";
import type { AxiosResponse } from "axios";

export const getMyAddresses = (): Promise<AxiosResponse<IAddress[]>> =>
  api.get<IAddress[]>("/addresses/me");

export const createAddress = (
  req: ICreateAddressRequest,
): Promise<AxiosResponse<{ addressId: number }>> =>
  api.post<{ addressId: number }>("/addresses", req);

export const updateAddress = (
  addressId: number,
  req: ICreateAddressRequest,
): Promise<AxiosResponse<void>> =>
  api.put<void>(`/addresses/${addressId}`, req);

export const deleteAddress = (
  addressId: number,
): Promise<AxiosResponse<void>> => api.delete<void>(`/addresses/${addressId}`);

export const setDefaultAddress = (id: number): Promise<AxiosResponse<void>> =>
  api.patch<void>(`/addresses/${id}/default`, {});
