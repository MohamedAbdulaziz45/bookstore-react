import { create } from "zustand";
import {
  isTokenExpired,
  getRoleFromToken,
  getUserIdFromToken,
} from "./tokenUtils";

interface AuthState {
  isLoggedIn: boolean;
  userRole: string | null;
  currentUserId: string | null;
  saveToken: (token: string) => void;
  logout: () => void;
}

const initFromStorage = (): Pick<
  AuthState,
  "isLoggedIn" | "userRole" | "currentUserId"
> => {
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    return {
      isLoggedIn: true,
      userRole: getRoleFromToken(token),
      currentUserId: getUserIdFromToken(token),
    };
  }
  localStorage.removeItem("token");
  return {
    isLoggedIn: false,
    userRole: null,
    currentUserId: null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initFromStorage(),
  saveToken: (token: string) => {
    localStorage.setItem("token", token);
    set({
      isLoggedIn: true,
      userRole: getRoleFromToken(token),
      currentUserId: getUserIdFromToken(token),
    });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      isLoggedIn: false,
      userRole: null,
      currentUserId: null,
    });
  },
}));
