export interface INotification {
  notificationId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string | null;
}
