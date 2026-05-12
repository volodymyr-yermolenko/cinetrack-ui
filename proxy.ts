import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, LOGIN_URL } from "./constants";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", request.nextUrl.pathname);

  // Allow action requests pass through without authentication check (it will be handled in the action during the API call)
  if (request.headers.get("next-action")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const cookies = request.cookies;
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

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

// Apply this middleware to all routes under /movies and /watch-entries (the pages that require authentication)
export const config = {
  matcher: ["/movies/:path*", "/watch-entries/:path*"],
};
