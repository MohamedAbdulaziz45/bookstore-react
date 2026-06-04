import api from "./api";
import type { AxiosResponse } from "axios";
import type { ibook } from "../types/book.types";
import type { IpagedResult, IPagedResultWithMeta } from "../types/common.types";
import type { IBookSummary } from "../types/book.types";
import type { AdminBookFormValue, AdminBookPage } from "../types/admin.types";

const BASE = "/books";

const toBookFormData = (value: AdminBookFormValue): FormData => {
  const formData = new FormData();
  formData.append("Title", value.title);
  formData.append("ISBN", value.isbn);
  formData.append("Price", String(value.price));
  formData.append("QuantityInStock", String(value.quantityInStock));
  formData.append("PublicationDate", value.publicationDate);
  formData.append("AuthorId", String(value.authorId));
  formData.append("AdditionalDetails", value.additionalDetails ?? "");
  formData.append("IsFeatured", String(value.isFeatured));
  formData.append("IsEditorsPick", String(value.isEditorsPick));
  value.genreIds.forEach((genreId) =>
    formData.append("GenreIds", String(genreId)),
  );
  if (value.image) formData.append("Image", value.image);
  return formData;
};

export const getAllBooks = (
  searchPhrase?: string,
  pageSize: number = 10,
  pageNumber: number = 1,
  sortBy?: string,
  sortDirection: "Ascending" | "Descending" = "Ascending",
): Promise<AxiosResponse<IpagedResult<IBookSummary>>> => {
  const params: Record<string, string | number> = {
    pageSize,
    pageNumber,
    sortDirection,
  };
  if (searchPhrase) params.searchPhrase = searchPhrase;
  if (sortBy) params.sortBy = sortBy;
  return api.get<IpagedResult<IBookSummary>>(BASE, { params });
};

export const getAllBooksByGenre = (
  genreId: number,
  searchPhrase?: string,
  pageSize: number = 10,
  pageNumber: number = 1,
  sortBy?: string,
  sortDirection: "Ascending" | "Descending" = "Ascending",
): Promise<AxiosResponse<IpagedResult<IBookSummary>>> => {
  const params: Record<string, string | number> = {
    GenreId: genreId,
    pageSize,
    pageNumber,
    sortDirection,
  };
  if (searchPhrase) params.searchPhrase = searchPhrase;
  if (sortBy) params.sortBy = sortBy;
  return api.get<IpagedResult<IBookSummary>>(`${BASE}/genre/${genreId}`, {
    params,
  });
};

export const getBookById = (id: number): Promise<AxiosResponse<ibook>> =>
  api.get<ibook>(`${BASE}/${id}`);

export const getFeatured = (
  pageSize: number = 10,
  pageNumber: number = 1,
): Promise<AxiosResponse<IPagedResultWithMeta<IBookSummary, boolean>>> =>
  api.get<IPagedResultWithMeta<IBookSummary, boolean>>(`${BASE}/featured`, {
    params: { pageSize, pageNumber },
  });

export const getEditorsPicks = (
  pageSize: number = 10,
  pageNumber: number = 1,
): Promise<AxiosResponse<IPagedResultWithMeta<IBookSummary, boolean>>> =>
  api.get<IPagedResultWithMeta<IBookSummary, boolean>>(
    `${BASE}/editors-picks`,
    {
      params: { pageSize, pageNumber },
    },
  );

export const getAdminBooks = (
  searchPhrase?: string,
  pageSize: number = 20,
  pageNumber: number = 1,
  sortBy?: string,
  sortDirection: "Ascending" | "Descending" = "Ascending",
): Promise<AxiosResponse<AdminBookPage>> => {
  const params: Record<string, string | number> = {
    pageSize,
    pageNumber,
    sortDirection,
  };
  if (searchPhrase) params.searchPhrase = searchPhrase;
  if (sortBy) params.sortBy = sortBy;
  return api.get<AdminBookPage>(`${BASE}/admin`, { params });
};

export const createAdminBook = (
  value: AdminBookFormValue,
): Promise<AxiosResponse<void>> => api.post<void>(BASE, toBookFormData(value));

export const updateAdminBook = (
  id: number,
  value: AdminBookFormValue,
): Promise<AxiosResponse<void>> =>
  api.put<void>(`${BASE}/${id}`, toBookFormData(value));

export const deleteAdminBook = (id: number): Promise<AxiosResponse<void>> =>
  api.delete<void>(`${BASE}/${id}`);
