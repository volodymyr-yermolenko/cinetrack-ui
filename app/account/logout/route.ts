import { LOGIN_URL } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import { removeAccessTokenCookie } from "../utils/cookie-utils";

export async function GET(request: NextRequest) {
  await removeAccessTokenCookie();

  const loginUrl = new URL(LOGIN_URL, request.url);
  // Preserve the search parameters from the original request (returnUrl)
  loginUrl.search = request.nextUrl.searchParams.toString();

  const response = NextResponse.redirect(loginUrl);
  return response;
}
