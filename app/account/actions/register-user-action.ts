"use server";

import { execute } from "@/lib/utils/api-utils";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { ActionResult } from "@/types/action-result";
import z from "zod";
import { RegisterUser } from "../api/register-user";
import { redirect } from "next/navigation";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USER_NAME_MAX_LENGTH,
  CHECK_EMAIL_URL,
} from "../constants";
import { RegistrationStatus } from "../types/registration-status";
import { setRegistrationEmailCookie } from "../utils/cookie-utils";

export async function registerUserAction(
  prevState: ActionResult<RegistrationStatus>,
  formData: FormData,
): Promise<ActionResult<RegistrationStatus>> {
  const validatedData = validateRegistration(formData);

  if (!validatedData.success) {
    const flattened = z.flattenError(validatedData.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const result = await execute(
    () => RegisterUser({ ...validatedData.data }),
    true,
  );
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }
  const registrationResponse = result.data;
  if (!registrationResponse) {
    return {
      success: false,
      formErrors: ["No response received. Please try again."],
    };
  }

  if (registrationResponse.status === RegistrationStatus.Success) {
    await setRegistrationEmailCookie(validatedData.data.email);
    redirect(CHECK_EMAIL_URL);
  } else {
    return {
      success: true,
      data: registrationResponse.status,
    };
  }
}

function validateRegistration(
  formData: FormData,
): z.ZodSafeParseResult<RegistrationInput> {
  const email = formData.get("email")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  const registration = {
    email,
    name,
    password,
    confirmPassword,
  };

  return validationSchema.safeParse(registration);
}

const passwordSchema = z
  .string()
  .refine((val) => val.length > 0, {
    message: "Password is required",
  })
  .refine((val) => val.trim() === val, {
    message: "Password cannot start or end with spaces",
  })
  .refine((val) => PASSWORD_REGEX.test(val), {
    message:
      "Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers",
  });

const validationSchema = z
  .object({
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
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(
        USER_NAME_MAX_LENGTH,
        `Name must be less than ${USER_NAME_MAX_LENGTH} characters`,
      ),
    password: passwordSchema,
    confirmPassword: z.string().refine((val) => val.length > 0, {
      message: "Password confirmation is required",
    }),
  })
  .refine(
    (data) => {
      if (!passwordSchema.safeParse(data.password).success) {
        // Skip confirm password check if password itself is invalid
        return true;
      }
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type RegistrationInput = z.infer<typeof validationSchema>;
