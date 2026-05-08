import { LoginStatus } from "./login-status";

export interface LoginResponse {
  status: LoginStatus;
  accessToken: string | null;
}
