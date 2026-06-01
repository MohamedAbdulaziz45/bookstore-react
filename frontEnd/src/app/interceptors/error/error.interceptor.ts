import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { ApiUserService } from "../../services/users/api-user.service";
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(ApiUserService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        router.navigateByUrl("/");
      }
      if (error.status === 403) {
        // authenticated but not allowed
        router.navigateByUrl("/404");
      }
      return throwError(() => error);
    }),
  );
};
