"use server";

import { apiClient } from "@/lib/api-client";
import { ResendConfirmationRequest } from "../types/resend-confirmation-request";

export async function resendConfirmation(
  data: ResendConfirmationRequest,
): Promise<void> {
  return apiClient.post<void>(
    "/auth/resend-confirmation",
    data,
    "Failed to resend email confirmation",
  );
}
