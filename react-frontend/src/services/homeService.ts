import api from "./api";
import type { AxiosResponse } from "axios";
import type { HomeSpotlight } from "../types/home-spotlight";

const BASE = "/home";

export const getSpotlight = (): Promise<AxiosResponse<HomeSpotlight>> =>
  api.get<HomeSpotlight>(`${BASE}/spotlight`);
