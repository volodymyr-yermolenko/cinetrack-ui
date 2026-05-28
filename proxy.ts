import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, LOGIN_URL } from "./constants";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", request.nextUrl.pathname);

  // If it's an action request, let it through without authentication check, it will be handled in the action (method "execute")
  if (request.headers.get("next-action")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For other requests (loading pages), check for access token cookie and redirect to login if not present
  const cookies = request.cookies;
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("returnUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply this middleware to the following routes (the pages requiring authentication)
export const config = {
  matcher: ["/movies/:path*", "/watch-entries/:path*"],
};
