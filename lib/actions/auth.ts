"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient, setSession } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas/auth";
import type { Session } from "@/lib/types";
import bcrypt from "bcryptjs";

const GENERIC_LOGIN_ERROR = "Invalid username or password";

function buildSession(user: {
  id: string;
  username: string;
  user_role: string;
  assigned_barangay?: string | null;
  created_at: string;
  updated_at: string;
}): Session {
  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.user_role,
      assigned_barangay: user.assigned_barangay ?? null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

/**
 * Regular login for staff and barangay admins only.
 * Explicitly excludes workers and system admins.
 */
export async function loginAction(formData: {
  username: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: GENERIC_LOGIN_ERROR };
  }

  const { username, password } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .in("user_role", ["staff", "barangay_admin"])
      .single();

    if (error || !user) {
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    await setSession(buildSession(user));

    const role = (user.user_role || "").trim().toLowerCase();
    if (role === "barangay_admin") {
      redirect("/dashboard-barangay");
    }

    redirect("/dashboard");
  } catch (error) {
    console.error("[loginAction]", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Dedicated admin login.
 * Only allows role='admin' users.
 */
export async function adminLoginAction(formData: {
  username: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: GENERIC_LOGIN_ERROR };
  }

  const { username, password } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("user_role", "admin")
      .single();

    if (error || !user) {
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    await setSession(buildSession(user));
    redirect("/dashboard");
  } catch (error) {
    console.error("[adminLoginAction]", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Server Action: Logout
 * Clears session cookie and redirects to login
 */
export async function logoutAction(): Promise<void> {
  const { clearSession } = await import("@/lib/auth");
  await clearSession();
  redirect("/auth/login");
}
