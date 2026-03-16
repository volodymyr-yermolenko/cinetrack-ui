import { BASE_API_URL } from "@/constants/api";
import { ApiError } from "./errors/api-error";

export const apiClient = {
  async get<T>(
    path: string,
    defaultErrorMessage: string = "Failed to fetch data",
    withCache = false,
  ): Promise<T> {
    const options = withCache
      ? { next: { revalidate: 3600 } }
      : { cache: "no-store" as const };

    const response = await fetch(`${BASE_API_URL}${path}`, options);
    const data = await handleResponse(response, defaultErrorMessage);
    return data as T;
  },

  async post<T>(
    path: string,
    body: any,
    defaultErrorMessage: string = "Failed to post data",
  ): Promise<T> {
    const response = await fetch(`${BASE_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await handleResponse(response, defaultErrorMessage);
    return data as T;
  },

  async put<T>(
    path: string,
    body: any,
    defaultErrorMessage: string = "Failed to update data",
  ): Promise<T> {
    const response = await fetch(`${BASE_API_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await handleResponse(response, defaultErrorMessage);
    return data as T;
  },

  async delete(
    path: string,
    defaultErrorMessage: string = "Failed to delete data",
  ): Promise<void> {
    const response = await fetch(`${BASE_API_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await handleResponse(response, defaultErrorMessage);
  },
};

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
    const error =
      response.status >= 400 && response.status < 500
        ? new ApiError(errorMessage)
        : new Error(errorMessage);
    throw error;
  }

  return data;
}
