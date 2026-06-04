import axios from "axios";
import { isTokenExpired } from "./auth/tokenUtils";
import { useAuthStore } from "./auth/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//--------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) return config;

  if (isTokenExpired(token)) {
    useAuthStore.getState().logout();
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//---------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/";
    }
    if (error.response?.status === 403) {
      window.location.href = "/404";
    }
    return Promise.reject(error);
  },
);

export default api;
