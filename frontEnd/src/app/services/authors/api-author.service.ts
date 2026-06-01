import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IAuthorBooksQuery } from "../../models/Author/iauthor-books-query";
import { IAuthor } from "../../models/Author/iauthor";
import { ICreateAuthorRequest } from "../../models/Author/icreate-author-request";
import { IFeaturedAuthor } from "../../models/Author/ifeatured-author";
import { IUpdateAuthorRequest } from "../../models/Author/iupdate-author-request";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { IpagedResult } from "../../models/ipaged-result";
import { AdminAuthorFormValue } from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiAuthorService {
  private readonly baseUrl = `${environment.baseUrl}/authors`;

  constructor(private httpClient: HttpClient) {}

  getAllAuthors(): Observable<IAuthor[]> {
    return this.httpClient.get<IAuthor[]>(this.baseUrl);
  }

  getFeaturedAuthor(): Observable<IFeaturedAuthor> {
    return this.httpClient.get<IFeaturedAuthor>(`${this.baseUrl}/featured`);
  }

  getAuthorById(id: number): Observable<IAuthor> {
    return this.httpClient.get<IAuthor>(`${this.baseUrl}/${id}`);
  }

  getAuthorBooks(
    id: number,
    query: IAuthorBooksQuery = {
      pageNumber: 1,
      pageSize: 4,
      sortDirection: "Ascending",
    },
  ): Observable<IpagedResult<IBookSummary>> {
    const params = this.buildAuthorBooksParams(query);

    return this.httpClient.get<IpagedResult<IBookSummary>>(
      `${this.baseUrl}/${id}/books`,
      { params },
    );
  }

  createAuthor(request: ICreateAuthorRequest): Observable<void> {
    return this.httpClient.post<void>(this.baseUrl, request);
  }

  createAuthorForm(request: AdminAuthorFormValue): Observable<void> {
    return this.httpClient.post<void>(
      this.baseUrl,
      this.toAuthorFormData(request),
    );
  }

  updateAuthor(id: number, request: IUpdateAuthorRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, request);
  }

  updateAuthorForm(
    id: number,
    request: AdminAuthorFormValue,
  ): Observable<void> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/${id}`,
      this.toAuthorFormData(request),
    );
  }

  featureAuthor(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}/feature`, {});
  }

  unfeatureAuthor(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}/unfeature`, {});
  }

  deleteAuthor(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  private buildAuthorBooksParams(query: IAuthorBooksQuery): HttpParams {
    let params = new HttpParams()
      .set("pageNumber", query.pageNumber)
      .set("pageSize", query.pageSize)
      .set("sortDirection", query.sortDirection);

    if (query.searchPhrase) {
      params = params.set("searchPhrase", query.searchPhrase);
    }

    if (query.sortBy) {
      params = params.set("sortBy", query.sortBy);
    }

    return params;
  }

  private toAuthorFormData(request: AdminAuthorFormValue): FormData {
    const formData = new FormData();
    formData.append("Name", request.name);
    formData.append("Bio", request.bio);
    formData.append("IsFeatured", String(request.isFeatured));
    if (request.image) formData.append("ImageFile", request.image);
    return formData;
  }
}
