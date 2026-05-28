import { ApiClientError } from "../errors/api-client-error";
import { ApiAuthError } from "../errors/api-auth-error";
import { ACCESS_TOKEN_COOKIE, LOGIN_URL } from "@/constants";
import { redirect } from "next/navigation";
import { ExecuteResult } from "@/types/execute-result";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";

export async function execute<T>(
  call: () => Promise<T>,
  isPublic: boolean = false,
): Promise<ExecuteResult<T>> {
  try {
    const result = await call();
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof ApiClientError) {
      return {
        success: false,
        errors: [error.message],
      };
    }
    if (error instanceof ApiAuthError && !isPublic) {
      await removeAccessTokenCookie();
      await redirectToLoginUrl();
    }
    throw error;
  }
}

export async function query<T>(
  call: () => Promise<T>,
  isPublic: boolean = false,
): Promise<T> {
  try {
    return await call();
  } catch (error: unknown) {
    if (error instanceof ApiAuthError && !isPublic) {
      await redirectToLoginUrl();
    }
    throw error;
  }
}

async function redirectToLoginUrl(): Promise<void> {
  let loginUrl = LOGIN_URL;
  // Get current path from headers set by middleware
  const headerList = await headers();
  const currentPath = headerList.get("x-current-path");
  if (currentPath && currentPath.startsWith("/")) {
    loginUrl += `?returnUrl=${encodeURIComponent(currentPath)}`;
  }
  redirect(loginUrl);
}

async function removeAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}
