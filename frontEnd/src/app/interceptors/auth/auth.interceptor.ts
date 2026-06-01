import { HttpInterceptorFn } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { ApiUserService } from "../../services/users/api-user.service";
import { inject } from "@angular/core";
import { CartService } from "../../services/cart.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ApiUserService);
  const cartService = inject(CartService);
  const token = localStorage.getItem("token");
  const isApiCall = req.url.startsWith(environment.baseUrl);

  if (!token || !isApiCall) {
    return next(req);
  }

  if (authService.isTokenExpired()) {
    authService.logout();
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(authReq);
};
