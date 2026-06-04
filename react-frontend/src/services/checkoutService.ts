import api from "./api";
import type { AxiosResponse } from "axios";

const BASE = "/checkout";

export const createSession = (
  shippingAddressId: number,
): Promise<AxiosResponse<{ sessionUrl: string }>> =>
  api.post<{ sessionUrl: string }>(`${BASE}/create-session`, {
    shippingAddressId,
  });
