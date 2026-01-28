import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * Middleware to protect dashboard routes
 * Redirects unauthenticated users to /auth/login
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");

  // Public routes that don't require auth
  const isPublicRoute = pathname.startsWith("/auth") || pathname === "/";

  if (isProtectedRoute) {
    const session = await getSession();

    if (!session) {
      // Redirect to login page
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check if session has expired
    if (session.expires_at < Date.now()) {
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear expired session
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
