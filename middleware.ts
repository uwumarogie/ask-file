import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth/";

export async function middleware(request: NextRequest) {
  const authRes = await auth.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  const session = await auth.getSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  await auth.updateSession(request, authRes, {
    ...session,
    user: {
      ...session.user,
      updatedAt: Date.now(),
    },
  });
  return authRes;
}
