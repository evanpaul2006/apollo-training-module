import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const session = request.cookies.get("apollo_session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/learn")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const parsed = JSON.parse(session);
      if (!["admin", "learner"].includes(parsed.role)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && session) {
    try {
      const parsed = JSON.parse(session);
      return NextResponse.redirect(new URL(
        parsed.role === "admin" ? "/admin" : "/learn",
        request.url
      ));
    } catch {
      // invalid session, ignore and let them login
    }
  }

  // Redirect root to login
  if (pathname === "/") {
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return NextResponse.redirect(new URL(
          parsed.role === "admin" ? "/admin" : "/learn",
          request.url
        ));
      } catch {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/learn/:path*", "/login", "/"],
};
