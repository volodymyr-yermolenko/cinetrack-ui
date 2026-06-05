import { ApiClientError } from "../errors/api-client-error";
import { ApiAuthError } from "../errors/api-auth-error";
import { redirect } from "next/navigation";
import { ExecuteResult } from "@/types/execute-result";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { getLoginUrl, LoginUrlParams } from "@/app/account/utils/url-utils";

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
    // If we get a 401 error from the API (the access token is invalid or expired),
    // we should redirect to login page
    if (error instanceof ApiAuthError) {
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
    // If we get a 401 error from the API (the access token is invalid or expired),
    // we should redirect to login page
    if (error instanceof ApiAuthError) {
      await redirectToLoginPage();
    }
    throw error;
  }
}

async function redirectToLoginPage(): Promise<never> {
  const currentPath = await getCurrentPath();
  const loginParams: LoginUrlParams = {
    isAuthError: true,
    returnUrl:
      currentPath && currentPath.startsWith("/") ? currentPath : undefined,
  };
  const loginUrl = getLoginUrl(loginParams);
  redirect(loginUrl);
}

async function getCurrentPath(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("x-current-path");
}
