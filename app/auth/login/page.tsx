import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

/**
 * Staff login page
 * Redirects to dashboard if already authenticated
 */
export default async function LoginPage() {
  // If already logged in, redirect to dashboard
  const session = await getSession();
  if (session) {
    const role = (session.user.role || "").trim().toLowerCase();

    if (role === "workers") {
      redirect("/dashboard-workers");
    }

    if (role === "barangay_admin") {
      redirect("/dashboard-barangay");
    }

    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Health System
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Staff Access Portal
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          <p className="font-medium">Portal Security</p>
          <p className="mt-1 text-xs">
            Admin and worker accounts are blocked from this staff login route.
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Need a different portal?{" "}
            <Link
              href="/auth/admin"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Admin Login
            </Link>{" "}
            or{" "}
            <Link
              href="/auth/workers"
              className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Worker Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
