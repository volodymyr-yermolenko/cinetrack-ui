"use server";

import { apiClient } from "@/lib/api-client";
import { ForgotPasswordRequest } from "../types/forgot-password-request";

export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<void> {
  console.log(request);
  return apiClient.post<void>(
    "/auth/forgot-password",
    request,
    "Failed to send forgot password request",
  );
}
