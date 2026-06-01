import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { ApiUserService } from "../services/users/api-user.service";
import { ToastService } from "../services/toast.service";
// import { AuthService } from '../services/auth.service'; // TODO: use real service

export const CheckLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const toastService = inject(ToastService);
  // TODO: Replace with actual auth/user service call
  // For the purpose of the UI test, we will assume it's incomplete if there's no data
  // but if the user hasn't created a proper auth service, we'll mock it based on localStorage or just return false

  // MOCK:

  let _UserAuthSer = inject(ApiUserService);

  if (_UserAuthSer.isLoggedIn()) {
    return true;
  } else {
    router.navigateByUrl("");
    toastService.show("Login First", "error");
    return false;
  }
};
