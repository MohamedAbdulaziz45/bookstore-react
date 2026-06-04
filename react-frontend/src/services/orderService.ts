import api from "./api";
import type { AxiosResponse } from "axios";
import type { Order, MyOrderSummary } from "../types/orders.types";
import type { AdminOrder } from "../types/admin.types";

const BASE = "/orders";

export const getMyOrders = (): Promise<AxiosResponse<Order[]>> =>
  api.get<Order[]>(`${BASE}/me`);

export const getMySummary = (): Promise<AxiosResponse<MyOrderSummary>> =>
  api.get<MyOrderSummary>(`${BASE}/me/summary`);

export const getById = (orderId: number): Promise<AxiosResponse<Order>> =>
  api.get<Order>(`${BASE}/${orderId}`);

export const getAllOrders = (): Promise<AxiosResponse<AdminOrder[]>> =>
  api.get<AdminOrder[]>(BASE);

export const updateOrderStatus = (
  orderId: number,
  newStatus: number,
): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/${orderId}/status`, { newStatus });

export const getBySessionId = (
  sessionId: string,
): Promise<AxiosResponse<Order>> =>
  api.get<Order>(`${BASE}/by-session/${encodeURIComponent(sessionId)}`);

export const cancelOrder = (orderId: number): Promise<AxiosResponse<void>> =>
  api.post<void>(`${BASE}/${orderId}/cancel`, {});
