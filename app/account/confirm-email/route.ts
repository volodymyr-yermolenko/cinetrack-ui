import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { confirmEmail } from "../api/confirm-email";
import { EmailConfirmationStatus } from "../types/email.confirmation-status";
import { CONFIRM_EMAIL_ERROR_URL } from "../constants";
import { REGISTRATION_CONFIRMED_PARAM } from "@/constants/auth";
import { EmailConfirmationErrorReason } from "../types/email-confirmation-error-reason";
import {
  setAccessTokenCookie,
  setRegistrationEmailCookie,
} from "../utils/cookie-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    redirectToErrorPage(EmailConfirmationErrorReason.NoToken);
  }

  const confirmResponse = await confirmEmail(token);

  switch (confirmResponse.status) {
    case EmailConfirmationStatus.Success:
      await setAccessTokenCookie(confirmResponse.accessToken!);
      redirect(`/?${REGISTRATION_CONFIRMED_PARAM}=true`);
    case EmailConfirmationStatus.InvalidToken:
      redirectToErrorPage(EmailConfirmationErrorReason.InvalidToken);
    case EmailConfirmationStatus.TokenExpired:
      await setRegistrationEmailCookie(confirmResponse.email!);
      redirectToErrorPage(EmailConfirmationErrorReason.TokenExpired);
  }
}

function redirectToErrorPage(reason: EmailConfirmationErrorReason): never {
  redirect(`${CONFIRM_EMAIL_ERROR_URL}?reason=${reason}`);
}
