import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Root page - redirects to login or dashboard based on auth state
 */
export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
