import api from "./api";
import type { AxiosResponse } from "axios";
import type { Payment } from "../types/payment.types";
import type { AdminPayment } from "../types/admin.types";

const BASE = "/payments";

export const getByOrderId = (
  orderId: number,
): Promise<AxiosResponse<Payment>> =>
  api.get<Payment>(`${BASE}/order/${orderId}`);

export const getAllPayments = (): Promise<AxiosResponse<AdminPayment[]>> =>
  api.get<AdminPayment[]>(BASE);
