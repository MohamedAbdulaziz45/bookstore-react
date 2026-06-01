import { Injectable } from "@angular/core";
import { icategory } from "../../models/icategory";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  getAllCategories(): Observable<icategory[]> {
    return this.httpClient.get<icategory[]>(
      `${environment.baseUrl}/Categories`,
    );
  }

  createCategory(genreName: string): Observable<void> {
    return this.httpClient.post<void>(`${environment.baseUrl}/Categories`, {
      genreName,
    });
  }

  updateCategory(genreId: number | string, genreName: string): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.baseUrl}/Categories/${genreId}`,
      { genreName },
    );
  }

  deleteCategory(genreId: number | string): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.baseUrl}/Categories/${genreId}`,
    );
  }
}
