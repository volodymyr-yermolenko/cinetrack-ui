import { ApiClientError } from "../errors/api-client-error";
import { ApiAuthError } from "../errors/api-auth-error";
import { LOGIN_URL } from "@/constants/authentication";
import { redirect } from "next/navigation";
import { ExecuteResult } from "@/types/execute-result";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
      redirect(LOGIN_URL);
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
      redirect(LOGIN_URL);
    }
    throw error;
  }
}
