import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IAddress } from "../../models/Address/iaddress";
import { Observable } from "rxjs";
import { ICreateAddressRequest } from "../../models/Address/icreate-address-request";

@Injectable({
  providedIn: "root",
})
export class ApiAddressService {
  constructor(private httpClient: HttpClient) {}

  getMyAddresses(): Observable<IAddress[]> {
    return this.httpClient.get<IAddress[]>(
      `${environment.baseUrl}/addresses/me`,
    );
  }

  create(req: ICreateAddressRequest): Observable<{ addressId: number }> {
    return this.httpClient.post<{ addressId: number }>(
      `${environment.baseUrl}/addresses`,
      req,
    );
  }

  update(addressId: number, req: ICreateAddressRequest): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.baseUrl}/addresses/${addressId}`,
      req,
    );
  }

  delete(addressId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.baseUrl}/addresses/${addressId}`,
    );
  }

  setDefault(id: number): Observable<void> {
    return this.httpClient.patch<void>(
      `${environment.baseUrl}/addresses/${id}/default`,
      {},
    );
  }
}
