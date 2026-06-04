import api from "../api";
import type { AxiosResponse } from "axios";
import type { IAuthResponse } from "../../types/auth.types";
import type { IUserDetails, IUpdateUserRequest } from "../../types/auth.types";

const BASE = "/identity";

const toUpdateUserFormData = (request: IUpdateUserRequest): FormData => {
  const formData = new FormData();
  if (request.displayName) formData.append("displayName", request.displayName);
  if (request.firstName) formData.append("firstName", request.firstName);
  if (request.lastName) formData.append("lastName", request.lastName);
  if (request.phoneNumber) formData.append("phoneNumber", request.phoneNumber);
  if (request.image) formData.append("image", request.image);
  return formData;
};

export const registerUser = (
  email: string,
  password: string,
  displayName: string,
): Promise<AxiosResponse<IAuthResponse>> =>
  api.post<IAuthResponse>(`${BASE}/registerUser`, {
    email,
    password,
    displayName,
  });

export const login = (
  email: string,
  password: string,
): Promise<AxiosResponse<IAuthResponse>> =>
  api.post<IAuthResponse>(`${BASE}/loginUser`, { email, password });

export const getUserDetails = (): Promise<AxiosResponse<IUserDetails>> =>
  api.get<IUserDetails>(`${BASE}/me`);

export const updateUser = (
  request: IUpdateUserRequest,
): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/user`, toUpdateUserFormData(request));

export const changePassword = (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
): Promise<AxiosResponse<void>> =>
  api.patch<void>(`${BASE}/password`, {
    currentPassword,
    newPassword,
    confirmNewPassword,
  });
