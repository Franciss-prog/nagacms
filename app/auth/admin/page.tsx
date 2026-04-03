import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import Link from "next/link";

/**
 * Dedicated login page for system administrators.
 */
export default async function AdminLoginPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4 dark:from-slate-950 dark:to-blue-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Health System
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Administrator Access Portal
          </p>
        </div>

        <AdminLoginForm />

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Need a different portal?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Staff Login
            </Link>{" "}
            or{" "}
            <Link
              href="/auth/workers"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Worker Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
