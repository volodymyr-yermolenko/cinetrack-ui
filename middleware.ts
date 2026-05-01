import { NextRequest, NextResponse } from "next/server";
import { LOGIN_URL } from "./constants/authentication";

export function middleware(request: NextRequest) {
  // Allow action requests pass through without authentication check (it will be handled in the action itself)
  if (request.headers.get("next-action")) {
    return NextResponse.next();
  }

  const cookies = request.cookies;
  const accessToken = cookies.get("accessToken")?.value;

  if (!accessToken) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("returnUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/movies/:path*", "/watch-entries/:path*"],
};
