import { BASE_API_URL } from "@/constants/api";
import { ApiClientError } from "./errors/api-client-error";
import { ApiAuthError } from "./errors/api-auth-error";
import { cookies } from "next/headers";

export const apiClient = {
  async get<T>(
    path: string,
    defaultErrorMessage: string = "Failed to fetch data",
    withCache = false,
  ): Promise<T> {
    const options: RequestInit = withCache
      ? { next: { revalidate: 3600 } }
      : { cache: "no-store" as const };

    return await request<T>(path, { options, defaultErrorMessage });
  },

  async post<T>(
    path: string,
    body: any,
    defaultErrorMessage: string = "Failed to post data",
  ): Promise<T> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return await request<T>(path, { options, defaultErrorMessage });
  },

  async put<T>(
    path: string,
    body: any,
    defaultErrorMessage: string = "Failed to update data",
  ): Promise<T> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return await request<T>(path, { options, defaultErrorMessage });
  },

  async delete(
    path: string,
    defaultErrorMessage: string = "Failed to delete data",
  ): Promise<void> {
    const options: RequestInit = {
      method: "DELETE",
    };

    await request<void>(path, { options, defaultErrorMessage });
  },
};

async function request<T>(path: string, params: RequestParams): Promise<T> {
  const { options, defaultErrorMessage } = params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  const response = await fetch(`${BASE_API_URL}${path}`, options);
  const data = await handleResponse(response, defaultErrorMessage);
  return data as T;
}

async function handleResponse(
  response: Response,
  defaultErrorMessage: string,
): Promise<unknown> {
  let data: unknown = null;
  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMessage = (data as any)?.error || defaultErrorMessage;
    if (response.status >= 400 && response.status < 500) {
      if (response.status === 401) {
        throw new ApiAuthError(errorMessage);
      }
      throw new ApiClientError(errorMessage);
    }

    throw new Error(errorMessage);
  }

  return data;
}

interface RequestParams {
  options: RequestInit;
  defaultErrorMessage: string;
}
