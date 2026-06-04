import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { ApiUserService } from "../services/users/api-user.service";
import { ToastService } from "../services/toast.service";
// import { AuthService } from '../services/auth.service'; // TODO: use real service

export const CheckLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const toastService = inject(ToastService);

  let _UserAuthSer = inject(ApiUserService);

  if (_UserAuthSer.isLoggedIn()) {
    return true;
  } else {
    router.navigateByUrl("");
    toastService.show("Login First", "error");
    return false;
  }
};
