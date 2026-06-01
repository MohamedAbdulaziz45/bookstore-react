import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AdminDashboardSummary } from "../../models/admin/admin.models";

@Injectable({
  providedIn: "root",
})
export class ApiAdminDashboardService {
  constructor(private httpClient: HttpClient) {}

  getDashboardSummary(): Observable<AdminDashboardSummary> {
    return this.httpClient.get<AdminDashboardSummary>(
      `${environment.baseUrl}/admin/dashboard-summary`,
    );
  }
}
