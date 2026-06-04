import api from "./api";
import type { AxiosResponse } from "axios";
import type { IpagedResult } from "../types/common.types";
import type { AdminCustomer } from "../types/admin.types";

const BASE = "/customers";

export const getAllCustomers = (
  searchPhrase?: string,
  pageSize: number = 20,
  pageNumber: number = 1,
  sortBy?: string,
  sortDirection: "Ascending" | "Descending" = "Ascending",
): Promise<AxiosResponse<IpagedResult<AdminCustomer>>> => {
  const params: Record<string, string | number> = {
    pageSize,
    pageNumber,
    sortDirection,
  };
  if (searchPhrase) params.searchPhrase = searchPhrase;
  if (sortBy) params.sortBy = sortBy;
  return api.get<IpagedResult<AdminCustomer>>(BASE, { params });
};

export const getCustomerById = (
  id: number,
): Promise<AxiosResponse<AdminCustomer>> =>
  api.get<AdminCustomer>(`${BASE}/${id}`);

export const deactivateCustomer = (id: number): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/${id}/deactivate`, {});
