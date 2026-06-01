import { CanActivateFn, Router } from "@angular/router";
import { ApiUserService } from "../services/users/api-user.service";
import { inject } from "@angular/core";
import { ToastService } from "../services/toast.service";

export const checkAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(ApiUserService);
  const toastService = inject(ToastService);
  if (authService.isLoggedIn() && authService.userRole() === "Admin") {
    return true;
  } else {
    router.navigateByUrl("");
    return false;
  }
};
