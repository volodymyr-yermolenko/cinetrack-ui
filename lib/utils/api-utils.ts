import { ApiClientError } from "../errors/api-client-error";
import { ApiAuthError } from "../errors/api-auth-error";
import { LOGIN_URL, LOGOUT_URL } from "@/constants";
import { redirect } from "next/navigation";
import { ExecuteResult } from "@/types/execute-result";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { removeAccessTokenCookie } from "@/app/account/utils/cookie-utils";

// Used for API calls inside server actions (mutation flow)
export async function execute<T>(
  call: () => Promise<T>,
): Promise<ExecuteResult<T>> {
  try {
    const result = await call();
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    // If it's an internal redirect error (when calling redirect method in server actions),
    // just throw it to let Next.js handle the redirection
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ApiClientError) {
      return {
        success: false,
        errors: [error.message],
      };
    }
    // If we get a 401 error from the API (meaning the access token is invalid or expired),
    // we should remove the invalid token cookie and redirect to login page
    if (error instanceof ApiAuthError) {
      await removeAccessTokenCookie();
      await redirectToLoginPage();
    }
    throw error;
  }
}

// Used for API calls during server component rendering (query flow)
export async function query<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error: unknown) {
    // If we get a 401 error from the API (meaning the access token is invalid or expired),
    // we should remove the invalid token cookie and redirect to login page
    // (by calling Logout API route, since we can't remove cookies directly during server component rendering)
    if (error instanceof ApiAuthError) {
      await redirectToLogoutRoute();
    }
    throw error;
  }
}

async function redirectToLoginPage(): Promise<never> {
  let loginUrl = LOGIN_URL;
  const currentPath = await getCurrentPath();
  if (currentPath && currentPath.startsWith("/")) {
    loginUrl += `?returnUrl=${encodeURIComponent(currentPath)}`;
  }
  redirect(loginUrl);
}

async function redirectToLogoutRoute(): Promise<never> {
  const currentPath = await getCurrentPath();
  let logoutUrl = LOGOUT_URL;
  if (currentPath && currentPath.startsWith("/")) {
    logoutUrl += `?returnUrl=${encodeURIComponent(currentPath)}`;
  }
  redirect(logoutUrl);
}

async function getCurrentPath(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("x-current-path");
}
