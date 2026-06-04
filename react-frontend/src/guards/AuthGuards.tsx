import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../services/auth/useAuthStore";

interface GuardProps {
  children: ReactNode;
}

export function CheckLoginGuard({ children }: GuardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Login First");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export function CheckAdminGuard({ children }: GuardProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.userRole);

  if (!isLoggedIn || userRole !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
