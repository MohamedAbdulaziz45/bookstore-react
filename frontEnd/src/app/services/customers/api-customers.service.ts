import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  AdminCustomer,
  AdminCustomerPage,
} from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiCustomersService {
  private readonly baseUrl = `${environment.baseUrl}/customers`;

  constructor(private httpClient: HttpClient) {}

  getAllCustomers(
    searchPhrase?: string,
    pageSize: number = 20,
    pageNumber: number = 1,
    sortBy?: string,
    sortDirection: "Ascending" | "Descending" = "Ascending",
  ): Observable<AdminCustomerPage> {
    let params = new HttpParams()
      .set("pageSize", pageSize)
      .set("pageNumber", pageNumber)
      .set("sortDirection", sortDirection);

    if (searchPhrase) params = params.set("searchPhrase", searchPhrase);
    if (sortBy) params = params.set("sortBy", sortBy);

    return this.httpClient.get<AdminCustomerPage>(this.baseUrl, { params });
  }

  getCustomerById(id: number): Observable<AdminCustomer> {
    return this.httpClient.get<AdminCustomer>(`${this.baseUrl}/${id}`);
  }

  deactivateCustomer(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }
}
