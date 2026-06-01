import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiNotificationsService } from "../../../services/notifications/api-notifications.service";
import { Notification } from "../../../models/Notification/notification";
import { ToastService } from "../../../services/toast.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-customer-notifications-panel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./customer-notifications-panel.component.html",
})
export class CustomerNotificationsPanelComponent implements OnInit {
  @Output() unreadCountChange = new EventEmitter<number>();

  private notificationsService = inject(ApiNotificationsService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  notifications: Notification[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.notificationsService.getMine().subscribe({
      next: (items) => {
        this.notifications = items ?? [];
        this.emitUnreadCount();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show("Failed to load notifications", "error");
      },
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        this.emitUnreadCount();
      },
      error: () =>
        this.toastService.show("Failed to mark all as read", "error"),
    });
  }

  openNotification(notification: Notification): void {
    const openLink = () => {
      if (notification.linkUrl)
        void this.router.navigateByUrl(notification.linkUrl);
    };

    if (notification.isRead) {
      openLink();
      return;
    }

    this.notificationsService
      .markAsRead(notification.notificationId)
      .subscribe({
        next: () => {
          notification.isRead = true;
          this.emitUnreadCount();
          openLink();
        },
        error: () =>
          this.toastService.show("Failed to update notification", "error"),
      });
  }

  getIcon(type: string): string {
    return (
      (
        {
          OrderConfirmed: "bi-bag-check",
          OrderStatusChanged: "bi-truck",
          OrderCancelled: "bi-x-circle",
        } as Record<string, string>
      )[type] ?? "bi-bell"
    );
  }

  private emitUnreadCount(): void {
    this.unreadCountChange.emit(
      this.notifications.filter((n) => !n.isRead).length,
    );
  }
}
