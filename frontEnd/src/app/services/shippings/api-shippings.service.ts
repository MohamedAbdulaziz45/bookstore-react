import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  AdminShipping,
  AdminShippingFormValue,
} from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiShippingsService {
  private readonly baseUrl = `${environment.baseUrl}/shippings`;

  constructor(private httpClient: HttpClient) {}

  getAllShippings(): Observable<AdminShipping[]> {
    return this.httpClient.get<AdminShipping[]>(this.baseUrl);
  }

  getShippingById(id: number): Observable<AdminShipping> {
    return this.httpClient.get<AdminShipping>(`${this.baseUrl}/${id}`);
  }

  createShipping(value: AdminShippingFormValue): Observable<void> {
    return this.httpClient.post<void>(this.baseUrl, value);
  }

  updateShipping(id: number, value: AdminShippingFormValue): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, value);
  }
}
