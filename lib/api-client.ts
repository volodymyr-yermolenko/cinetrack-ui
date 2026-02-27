import { BASE_API_URL } from "@/constants/api";
import { ValidationError } from "./errors/validation-error";

export const apiClient = {
  async get<T>(
    path: string,
    defaultErrorMessage: string = "Failed to fetch data",
  ): Promise<T> {
    let data: unknown = null;

    const response = await fetch(`${BASE_API_URL}${path}`);

    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    }
    if (!response.ok) {
      const errorMessage = (data as any)?.error || defaultErrorMessage;
      throw new Error(errorMessage);
    }

    return data as T;
  },

  async post<T>(
    path: string,
    body: any,
    defaultErrorMessage: string = "Failed to post data",
  ): Promise<T> {
    let data: unknown = null;

    const response = await fetch(`${BASE_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = (data as any)?.error || defaultErrorMessage;
      const error =
        response.status === 400
          ? new ValidationError(errorMessage)
          : new Error(errorMessage);
      throw error;
    }

    return data as T;
  },
};
