import { LOGIN_URL } from "@/constants";

export interface LoginUrlParams {
  returnUrl?: string;
  isAuthError?: boolean;
}

export function getLoginUrl(params: LoginUrlParams): string {
  const paramsObj = new URLSearchParams();
  if (params.returnUrl) {
    paramsObj.set("returnUrl", params.returnUrl);
  }
  if (params.isAuthError) {
    paramsObj.set("isAuthError", "true");
  }
  return `${LOGIN_URL}?${paramsObj.toString()}`;
}
