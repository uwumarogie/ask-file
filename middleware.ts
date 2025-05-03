import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/", "/sign-in", "/sign-up", "/forgot-password"];
  const apiPaths = "/api";

  const cookies = getSessionCookie(request);
  if (path.startsWith(apiPaths)) {
    return NextResponse.next();
  }

  if (!cookies && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard", "/dashboard/:path*"],
};
