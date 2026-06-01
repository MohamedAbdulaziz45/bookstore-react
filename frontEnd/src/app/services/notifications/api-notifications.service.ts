import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Notification } from "../../models/Notification/notification";

@Injectable({
  providedIn: "root",
})
export class ApiNotificationsService {
  constructor(private httpClient: HttpClient) {}

  getMine(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(
      `${environment.baseUrl}/notifications/me`,
    );
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.httpClient.get<{ unreadCount: number }>(
      `${environment.baseUrl}/notifications/me/unread-count`,
    );
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.httpClient.patch<void>(
      `${environment.baseUrl}/notifications/${notificationId}/read`,
      {},
    );
  }

  markAllAsRead(): Observable<void> {
    return this.httpClient.patch<void>(
      `${environment.baseUrl}/notifications/me/read-all`,
      {},
    );
  }
}
