import api from "./api";
import type { AxiosResponse } from "axios";
import type { INotification } from "../types/notification.types";

const BASE = "/notifications";

export const getMine = (): Promise<AxiosResponse<INotification[]>> =>
  api.get<INotification[]>(`${BASE}/me`);

export const getUnreadCount = (): Promise<
  AxiosResponse<{ unreadCount: number }>
> => api.get<{ unreadCount: number }>(`${BASE}/me/unread-count`);

export const markAsRead = (
  notificationId: number,
): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/${notificationId}/read`, {});

export const markAllAsRead = (): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/me/read-all`, {});
