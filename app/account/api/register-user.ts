"use server";

import { apiClient } from "@/lib/api-client";
import { Registration } from "../types/registration";
import { RegistrationResponse } from "../types/registration-response";

export async function RegisterUser(
  login: Registration,
): Promise<RegistrationResponse> {
  return apiClient.post<RegistrationResponse>(
    "/auth/register",
    login,
    "Failed to register",
  );
}
