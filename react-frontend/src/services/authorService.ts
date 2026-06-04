import api from "./api";
import type { AxiosResponse } from "axios";
import type {
  IAuthor,
  ICreateAuthorRequest,
  IUpdateAuthorRequest,
  IFeaturedAuthor,
  IAuthorBooksQuery,
} from "../types/author.types";
import type { IBookSummary } from "../types/book.types";
import type { IpagedResult } from "../types/common.types";
import type { AdminAuthorFormValue } from "../types/admin.types";

const BASE = "/authors";

const buildAuthorBooksParams = (
  query: IAuthorBooksQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    pageNumber: query.pageNumber,
    pageSize: query.pageSize,
    sortDirection: query.sortDirection,
  };

  if (query.searchPhrase) params.searchPhrase = query.searchPhrase;
  if (query.sortBy) params.sortBy = query.sortBy;

  return params;
};

const toAuthorFormData = (request: AdminAuthorFormValue): FormData => {
  const formData = new FormData();
  formData.append("Name", request.name);
  formData.append("Bio", request.bio);
  formData.append("IsFeatured", String(request.isFeatured));
  if (request.image) formData.append("ImageFile", request.image);
  return formData;
};

export const getAllAuthors = (): Promise<AxiosResponse<IAuthor[]>> =>
  api.get<IAuthor[]>(BASE);

export const getFeaturedAuthor = (): Promise<AxiosResponse<IFeaturedAuthor>> =>
  api.get<IFeaturedAuthor>(`${BASE}/featured`);

export const getAuthorById = (id: number): Promise<AxiosResponse<IAuthor>> =>
  api.get<IAuthor>(`${BASE}/${id}`);

export const getAuthorBooks = (
  id: number,
  query: IAuthorBooksQuery = {
    pageNumber: 1,
    pageSize: 4,
    sortDirection: "Ascending",
  },
): Promise<AxiosResponse<IpagedResult<IBookSummary>>> =>
  api.get<IpagedResult<IBookSummary>>(`${BASE}/${id}/books`, {
    params: buildAuthorBooksParams(query),
  });

export const createAuthor = (
  request: ICreateAuthorRequest,
): Promise<AxiosResponse<void>> => api.post<void>(BASE, request);

export const createAuthorForm = (
  request: AdminAuthorFormValue,
): Promise<AxiosResponse<void>> =>
  api.post<void>(BASE, toAuthorFormData(request));

export const updateAuthor = (
  id: number,
  request: IUpdateAuthorRequest,
): Promise<AxiosResponse<void>> => api.put<void>(`${BASE}/${id}`, request);

export const updateAuthorForm = (
  id: number,
  request: AdminAuthorFormValue,
): Promise<AxiosResponse<void>> =>
  api.put<void>(`${BASE}/${id}`, toAuthorFormData(request));

export const featureAuthor = (id: number): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/${id}/feature`, {});

export const unfeatureAuthor = (id: number): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/${id}/unfeature`, {});

export const deleteAuthor = (id: number): Promise<AxiosResponse<void>> =>
  api.delete<void>(`${BASE}/${id}`);
