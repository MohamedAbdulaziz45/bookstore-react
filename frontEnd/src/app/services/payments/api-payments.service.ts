import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Payment } from "../../models/Payments/payment";
import { AdminPayment } from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiPaymentsService {
  constructor(private httpClient: HttpClient) {}

  getByOrderId(orderId: number): Observable<Payment> {
    return this.httpClient.get<Payment>(
      `${environment.baseUrl}/payments/order/${orderId}`,
    );
  }

  getAllPayments(): Observable<AdminPayment[]> {
    return this.httpClient.get<AdminPayment[]>(
      `${environment.baseUrl}/payments`,
    );
  }
}
