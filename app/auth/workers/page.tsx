import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkerLoginForm } from "@/components/auth/worker-login-form";
import Link from "next/link";

/**
 * Login page for workers
 * Redirects to workers dashboard if already authenticated
 */
export default async function WorkerLoginPage() {
  // If already logged in as worker, redirect to workers dashboard
  const session = await getSession();
  if (session && session.user.role === "workers") {
    redirect("/dashboard-workers");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 dark:from-green-950 dark:to-emerald-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-white">
          City Health Portal
          </h1>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
            City Health Login
          </p>
        </div>

        <WorkerLoginForm />

        <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          <p className="font-medium">Worker Access</p>
          <p className="mt-1 text-xs">
            Contact your supervisor for login credentials
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Are you a staff member?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login as Staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
