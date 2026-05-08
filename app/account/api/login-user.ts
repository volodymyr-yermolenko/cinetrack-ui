"use server";

import { apiClient } from "@/lib/api-client";
import { Login } from "../types/login";
import { LoginResponse } from "../types/login-response";

export async function LoginUser(login: Login): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", login, "Failed to login");
}
