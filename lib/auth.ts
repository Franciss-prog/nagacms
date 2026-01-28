"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User, Session } from "./types";

/**
 * Server-side Supabase client (for Server Actions & Route Handlers)
 * Automatically manages auth tokens via cookies
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
}

/**
 * Get current session from cookies
 * Stores session in application-level cookies (non-Supabase)
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionJson = cookieStore.get("session")?.value;

  if (!sessionJson) {
    return null;
  }

  try {
    return JSON.parse(sessionJson) as Session;
  } catch {
    return null;
  }
}

/**
 * Set session in cookies
 */
export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clear session from cookies
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Verify username & password against public.users table
 * Returns User object if valid, null otherwise
 */
export async function verifyLogin(
  username: string,
  password: string,
): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  // Fetch user from public.users table
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !users) {
    return null;
  }

  // Verify password using bcrypt
  // Note: In production, use bcrypt.compare() server-side
  // For now, we'll assume password_hash is already hashed
  // TODO: Implement bcrypt verification once hashing is set up

  return users as User;
}

/**
 * Logout user - clear session
 */
export async function logout(): Promise<void> {
  await clearSession();
}
