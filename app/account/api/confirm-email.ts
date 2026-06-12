"use server";

import { apiClient } from "@/lib/api-client";
import { EmailConfirmationResponse } from "../types/email-confirmation-response";

export async function confirmEmail(
  token: string,
): Promise<EmailConfirmationResponse> {
  return apiClient.post<EmailConfirmationResponse>(
    "/auth/confirm-email",
    { emailConfirmationToken: token },
    "Failed to confirm email",
  );
}
