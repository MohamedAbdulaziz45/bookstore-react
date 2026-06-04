import api from "./api";
import type { AxiosResponse } from "axios";

const BASE = "/newsletter";

export const subscribe = (email: string): Promise<AxiosResponse<void>> =>
  api.post<void>(`${BASE}/subscribe`, { email });

export const unsubscribe = (email: string): Promise<AxiosResponse<void>> =>
  api.post<void>(`${BASE}/unsubscribe`, { email });
