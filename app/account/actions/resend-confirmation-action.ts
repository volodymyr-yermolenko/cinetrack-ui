"use server";

import { execute } from "@/lib/utils/api-utils";
import { ActionResult } from "@/types/action-result";
import { ResendConfirmation } from "../api/resend-confirmation";
import { EMAIL_REGEX } from "../constants";

export async function resendConfirmationAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString() ?? "";
  if (email.trim().length === 0) {
    return {
      success: false,
      formErrors: ["Email is required"],
    };
  }
  if (!EMAIL_REGEX.test(email)) {
    return {
      success: false,
      formErrors: ["Invalid email address"],
    };
  }

  const result = await execute(() => ResendConfirmation({ email }));
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  return {
    success: true,
  };
}
