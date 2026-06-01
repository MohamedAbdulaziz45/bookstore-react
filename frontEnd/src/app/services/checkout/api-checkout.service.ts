import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiCheckoutService {
  constructor(private httpClient: HttpClient) {}

  createSession(shippingAddressId: number): Observable<{ sessionUrl: string }> {
    return this.httpClient.post<{ sessionUrl: string }>(
      `${environment.baseUrl}/checkout/create-session`,
      { shippingAddressId },
    );
  }
}
