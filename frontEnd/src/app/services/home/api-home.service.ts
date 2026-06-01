import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HomeSpotlight } from "../../models/home-spotlight";

@Injectable({
  providedIn: "root",
})
export class ApiHomeService {
  constructor(private httpClient: HttpClient) {}

  getSpotlight(): Observable<HomeSpotlight> {
    return this.httpClient.get<HomeSpotlight>(
      `${environment.baseUrl}/home/spotlight`,
    );
  }
}
