import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiNewsletterService {
  constructor(private httpClient: HttpClient) {}

  subscribe(email: string): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.baseUrl}/newsletter/subscribe`,
      { email },
    );
  }

  unsubscribe(email: string): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.baseUrl}/newsletter/unsubscribe`,
      { email },
    );
  }
}
