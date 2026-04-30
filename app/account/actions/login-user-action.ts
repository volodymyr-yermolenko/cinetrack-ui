"use server";

import { ActionResult } from "@/types/action-result";
import { ENV } from "@/constants/env";
import { EMAIL_REGEX } from "@/constants/email";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { LoginUser } from "../api/login-user";
import { redirect } from "next/navigation";
import z from "zod";
import { LoginStatus } from "../types/login-status";
import { cookies } from "next/headers";
import { execute } from "@/lib/utils/api-utils";

export async function loginUserAction(
  prevState: ActionResult<LoginStatus>,
  formData: FormData,
): Promise<ActionResult<LoginStatus>> {
  const validatedData = validateLogin(formData);

  if (!validatedData.success) {
    const flattened = z.flattenError(validatedData.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const { returnUrl, ...loginData } = validatedData.data;

  const result = await execute(() => LoginUser({ ...loginData }), true);
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }
  const loginResponse = result.data;
  if (!loginResponse) {
    return {
      success: false,
      formErrors: ["No response received. Please try again."],
    };
  }

  if (
    loginResponse.status === LoginStatus.Success &&
    loginResponse.accessToken
  ) {
    // On successful login we redirect and do not return a result
    await setAccessTokenCookie(loginResponse.accessToken);
    const redirectUrl = returnUrl?.startsWith("/") ? returnUrl : "/";
    redirect(redirectUrl);
  } else {
    return {
      success: true,
      data: loginResponse.status,
    };
  }
}

async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: ENV.isProd,
    sameSite: "lax",
  });
}

function validateLogin(formData: FormData): z.ZodSafeParseResult<LoginInput> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const returnUrl = formData.get("returnUrl")?.toString();

  const login = {
    email,
    password,
    returnUrl,
  };

  return loginValidationSchema.safeParse(login);
}

const loginValidationSchema = z.object({
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
  password: z.string().refine((val) => val.trim().length > 0, {
    message: "Password is required",
  }),
  returnUrl: z.string().optional(),
});

type LoginInput = z.infer<typeof loginValidationSchema>;
