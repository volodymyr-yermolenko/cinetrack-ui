import { NextRequest, NextResponse } from "next/server";
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
    return createErrorRedirectResponse(
      request,
      EmailConfirmationErrorReason.NoToken,
    );
  }

  const confirmResponse = await confirmEmail(token);

  switch (confirmResponse.status) {
    case EmailConfirmationStatus.Success:
      await setAccessTokenCookie(confirmResponse.accessToken!);
      return createRedirectResponse(
        request,
        `/?${REGISTRATION_CONFIRMED_PARAM}=true`,
      );
    case EmailConfirmationStatus.InvalidToken:
      return createErrorRedirectResponse(
        request,
        EmailConfirmationErrorReason.InvalidToken,
      );
    case EmailConfirmationStatus.TokenExpired:
      await setRegistrationEmailCookie(confirmResponse.email!);
      return createErrorRedirectResponse(
        request,
        EmailConfirmationErrorReason.TokenExpired,
      );
  }
}

function createErrorRedirectResponse(
  request: NextRequest,
  reason: EmailConfirmationErrorReason,
): NextResponse<unknown> {
  return createRedirectResponse(
    request,
    `${CONFIRM_EMAIL_ERROR_URL}?reason=${reason}`,
  );
}

function createRedirectResponse(
  request: NextRequest,
  targetPath: string,
): NextResponse<unknown> {
  const redirectUrl = new URL(targetPath, request.url);
  const response = NextResponse.redirect(redirectUrl);
  return response;
}
