"use server";

import { ActionResult } from "@/types/action-result";
import z from "zod";
import { EMAIL_REGEX } from "../constants";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { forgotPassword } from "../api/forgot-password";
import { execute } from "@/lib/utils/api-utils";

export async function forgotPasswordAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const validatedData = validateForm(formData);

  if (!validatedData.success) {
    const flattened = z.flattenError(validatedData.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const { ...emailData } = validatedData.data;

  const result = await execute(() => forgotPassword(emailData));
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

function validateForm(
  formData: FormData,
): z.ZodSafeParseResult<ForgotPasswordInput> {
  const email = formData.get("email")?.toString() ?? "";
  return validationSchema.safeParse({
    email,
  });
}

const validationSchema = z.object({
  email: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "Email is required",
    })
    .pipe(
      z.email({
        pattern: EMAIL_REGEX,
        message: "Invalid email address",
      }),
    ),
});

type ForgotPasswordInput = z.infer<typeof validationSchema>;
