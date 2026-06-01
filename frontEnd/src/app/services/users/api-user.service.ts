import { HttpClient } from "@angular/common/http";
import { Injectable, Signal, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IRegisterRequest } from "../../models/Auth/iregister-request";
import { IAuthResponse } from "../../models/Auth/iauth-response";
import { Observable } from "rxjs";
import { ILoginResponse } from "../../models/Auth/ilogin-response";
import { IUserDetails } from "../../models/Auth/UserDetails/iuser-details";
import { IUpdateUserRequest } from "../../models/Auth/UserDetails/iupdate-user-request";
@Injectable({
  providedIn: "root",
})
export class ApiUserService {
  isLoggedIn = signal<boolean>(false);
  userRole = signal<string | null>(null);
  currentUserId = signal<string | null>(null);
  constructor(private httpClient: HttpClient) {
    const token = localStorage.getItem("token");

    if (token && !this.isTokenExpired()) {
      this.isLoggedIn.set(!!token);
      this.userRole.set(this.getRoleFromToken(token));
      this.currentUserId.set(this.getUserIdFromToken(token));
    } else {
      this.logout();
    }
  }

  registerUser(
    email: string,
    password: string,
    displayName: string,
  ): Observable<IAuthResponse> {
    const body: IRegisterRequest = { email, password, displayName };

    return this.httpClient.post<IAuthResponse>(
      `${environment.baseUrl}/identity/registerUser`,
      body,
    );
  }
  isTokenExpired(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload["exp"]; // expiry in seconds
      return Date.now() >= expiry * 1000;
    } catch {
      return true;
    }
  }
  login(email: string, password: string): Observable<IAuthResponse> {
    const body: ILoginResponse = { email, password };
    return this.httpClient.post<IAuthResponse>(
      `${environment.baseUrl}/identity/loginUser`,
      body,
    );
  }
  saveToken(token: string): void {
    localStorage.setItem("token", token);
    this.isLoggedIn.set(true);
    this.userRole.set(this.getRoleFromToken(token));
    this.currentUserId.set(this.getUserIdFromToken(token)); // ← add
  }
  logout(): void {
    localStorage.removeItem("token");
    this.isLoggedIn.set(false);
    this.userRole.set(null);
    this.currentUserId.set(null);
  }

  private getRoleFromToken(token: string): string | null {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      return (
        parsedPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        parsedPayload["role"] ||
        null
      );
    } catch {
      return null;
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["sub"] || null;
    } catch {
      return null;
    }
  }

  getUserDetails(): Observable<IUserDetails> {
    return this.httpClient.get<IUserDetails>(
      `${environment.baseUrl}/identity/me`,
    );
  }

  updateUser(request: IUpdateUserRequest): Observable<void> {
    const formData = new FormData();

    if (request.displayName)
      formData.append("displayName", request.displayName);
    if (request.firstName) formData.append("firstName", request.firstName);
    if (request.lastName) formData.append("lastName", request.lastName);
    if (request.phoneNumber)
      formData.append("phoneNumber", request.phoneNumber);
    if (request.image) formData.append("image", request.image);

    return this.httpClient.patch<void>(
      `${environment.baseUrl}/identity/user`,
      formData,
    );
  }
  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Observable<void> {
    return this.httpClient.patch<void>(
      `${environment.baseUrl}/identity/password`,
      { currentPassword, newPassword, confirmNewPassword },
    );
  }
}
