import api from "./api";
import type { AxiosResponse } from "axios";
import type { AdminDashboardSummary } from "../types/admin.types";

export const getDashboardSummary = (): Promise<
  AxiosResponse<AdminDashboardSummary>
> => api.get<AdminDashboardSummary>("/admin/dashboard-summary");
