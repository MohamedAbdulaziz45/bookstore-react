import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ibook } from "../../models/Book/ibook";
import { IpagedResult, IPagedResultWithMeta } from "../../models/ipaged-result";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { AdminBookFormValue, AdminBookPage } from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiBookService {
  private readonly baseUrl = `${environment.baseUrl}/books`;
  constructor(private httpClient: HttpClient) {}

  getAllBooks(
    searchPhrase?: string,
    pageSize: number = 10,
    pageNumber: number = 1,
    sortBy?: string,
    sortDirection: "Ascending" | "Descending" = "Ascending",
  ): Observable<IpagedResult<IBookSummary>> {
    let params = new HttpParams()

      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("sortDirection", sortDirection);

    if (searchPhrase) params = params.set("searchPhrase", searchPhrase);
    if (sortBy) params = params.set("sortBy", sortBy);

    return this.httpClient.get<IpagedResult<IBookSummary>>(this.baseUrl, {
      params,
    });
  }

  getAllBooksByGenre(
    genreId: number,
    searchPhrase?: string,
    pageSize: number = 10,
    pageNumber: number = 1,
    sortBy?: string,
    sortDirection: "Ascending" | "Descending" = "Ascending",
  ): Observable<IpagedResult<IBookSummary>> {
    let params = new HttpParams()
      .set("GenreId", genreId)
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("sortDirection", sortDirection);

    if (searchPhrase) params = params.set("searchPhrase", searchPhrase);
    if (sortBy) params = params.set("sortBy", sortBy);

    return this.httpClient.get<IpagedResult<IBookSummary>>(
      `${this.baseUrl}/genre/${genreId}`,
      { params },
    );
  }
  getBookById(id: number): Observable<ibook> {
    return this.httpClient.get<ibook>(`${this.baseUrl}/${id}`);
  }
  getFeatured(
    pageSize: number = 10,
    pageNumber: number = 1,
  ): Observable<IPagedResultWithMeta<IBookSummary, boolean>> {
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber);

    return this.httpClient.get<IPagedResultWithMeta<IBookSummary, boolean>>(
      `${this.baseUrl}/featured`,
      { params },
    );
  }

  getEditorsPicks(
    pageSize: number = 10,
    pageNumber: number = 1,
  ): Observable<IPagedResultWithMeta<IBookSummary, boolean>> {
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber);

    return this.httpClient.get<IPagedResultWithMeta<IBookSummary, boolean>>(
      `${this.baseUrl}/editors-picks`,
      { params },
    );
  }

  getAdminBooks(
    searchPhrase?: string,
    pageSize: number = 20,
    pageNumber: number = 1,
    sortBy?: string,
    sortDirection: "Ascending" | "Descending" = "Ascending",
  ): Observable<AdminBookPage> {
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("sortDirection", sortDirection);

    if (searchPhrase) params = params.set("searchPhrase", searchPhrase);
    if (sortBy) params = params.set("sortBy", sortBy);

    return this.httpClient.get<AdminBookPage>(`${this.baseUrl}/admin`, {
      params,
    });
  }

  createAdminBook(value: AdminBookFormValue): Observable<void> {
    return this.httpClient.post<void>(this.baseUrl, this.toBookFormData(value));
  }

  updateAdminBook(id: number, value: AdminBookFormValue): Observable<void> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/${id}`,
      this.toBookFormData(value),
    );
  }

  deleteAdminBook(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toBookFormData(value: AdminBookFormValue): FormData {
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
  }
}
