export interface IUpdateUserRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  image?: File;
  phoneNumber?: string;
}
export interface IUserDetails {
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  imagePath?: string;
  phoneNumber?: string;
}
export interface IAuthResponse {
  token: string;
}
export interface ILoginRequest {
  email: string;
  password: string;
}
export interface IRegisterRequest {
  email: string;
  password: string;
  displayName: string;
}
