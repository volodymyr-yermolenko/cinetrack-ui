import { ACCESS_TOKEN_COOKIE, ENV } from "@/constants";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE_AGE_MINUTES,
  REGISTRATION_EMAIL_COOKIE,
  REGISTRATION_EMAIL_COOKIE_AGE_MINUTES,
} from "../constants";

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: ENV.isProd,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_COOKIE_AGE_MINUTES * 60,
  });
}

export async function setRegistrationEmailCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(REGISTRATION_EMAIL_COOKIE, email, {
    secure: ENV.isProd,
    sameSite: "lax",
    maxAge: REGISTRATION_EMAIL_COOKIE_AGE_MINUTES * 60,
  });
}

export async function removeAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}
