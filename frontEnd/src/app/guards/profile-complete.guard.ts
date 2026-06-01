import { CanActivateFn, Router } from "@angular/router";
import { ApiUserService } from "../services/users/api-user.service";
import { inject } from "@angular/core";
import { map } from "rxjs";

export const profileCompleteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(ApiUserService);

  if (!authService.isLoggedIn()) {
    router.navigateByUrl("");
    return false;
  }

  return authService.getUserDetails().pipe(
    map((user) => {
      const isComplete =
        !!user.firstName && !!user.lastName && !!user.phoneNumber;

      if (!isComplete) {
        router.navigateByUrl(
          "/profile?message=Please complete your profile before proceeding to checkout",
        );
        return false;
      }
      return true;
    }),
  );
};
