import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * Proxy to protect dashboard routes and enforce role-based access
 * - Redirects unauthenticated users to /auth/login
 * - Routes users to appropriate dashboard based on role
 * - Enforces health worker access control
 */
export async function proxy(request: NextRequest) {
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

    // Role-based route protection
    const healthWorkerRoute = pathname.startsWith("/dashboard/health-workers");
    const staffRoute = pathname.startsWith("/dashboard/staff");

    if (healthWorkerRoute && session.user.role !== "workers") {
      // Non-health workers trying to access health worker routes
      const approporiateRoute =
        session.user.role === "staff" ? "/dashboard/staff" : "/dashboard";
      return NextResponse.redirect(new URL(approporiateRoute, request.url));
    }

    if (staffRoute && session.user.role !== "staff") {
      // Non-staff trying to access staff routes
      const appropriateRoute =
        session.user.role === "workers"
          ? "/dashboard/health-workers"
          : "/dashboard";
      return NextResponse.redirect(new URL(appropriateRoute, request.url));
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
