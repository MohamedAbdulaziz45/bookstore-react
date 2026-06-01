import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICart } from "../../models/Cart/icart";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ISyncCartRequest } from "../../models/Cart/isync-cart-request";
@Injectable({
  providedIn: "root",
})
export class ApiCartService {
  private readonly baseUrl = `${environment.baseUrl}/carts`;
  constructor(private httpClient: HttpClient) {}

  getCart(): Observable<ICart> {
    return this.httpClient.get<ICart>(`${this.baseUrl}/me`);
  }

  addOrUpdateCartItem(
    bookId: number,
    quantityChange: number,
  ): Observable<ICart> {
    return this.httpClient.post<ICart>(`${this.baseUrl}/items`, {
      bookId,
      quantityChange,
    });
  }

  removeItem(bookId: number): Observable<ICart> {
    return this.httpClient.delete<ICart>(`${this.baseUrl}/items/${bookId}`);
  }

  clearCart(): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}`);
  }

  syncCart(request: ISyncCartRequest): Observable<ICart> {
    return this.httpClient.post<ICart>(`${this.baseUrl}/sync`, request);
  }

  previewCart(request: ISyncCartRequest): Observable<ICart> {
    return this.httpClient.post<ICart>(`${this.baseUrl}/preview`, request);
  }
}
