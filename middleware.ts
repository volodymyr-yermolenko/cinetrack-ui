import { NextRequest, NextResponse } from "next/server";
import { LOGIN_URL } from "./constants/authentication";

export function middleware(request: NextRequest) {
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
  const accessToken = cookies.get("accessToken")?.value;

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

// Ensure that the middleware runs for all routes under /movies and /watch-entries, but not for other routes like /account/login or API routes.
export const config = {
  matcher: ["/movies/:path*", "/watch-entries/:path*"],
};
