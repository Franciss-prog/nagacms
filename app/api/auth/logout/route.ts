import { logoutAction } from "@/lib/actions/auth";

/**
 * Logout endpoint
 * POST to /api/auth/logout to trigger logout Server Action
 */
export async function POST() {
  await logoutAction();

  return Response.redirect(
    new URL(
      "/auth/login",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ),
  );
}
