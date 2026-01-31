"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { YakakApplication, Resident, User } from "@/lib/types";

/**
 * Fetch YAKAP applications - optionally filtered by barangay for non-admin users
 */
export async function getYakakApplications(
  userBarangay?: string,
  isAdmin?: boolean,
  filters?: {
    status?: "pending" | "approved" | "returned" | "rejected";
    limit?: number;
    offset?: number;
    barangay?: string;
  },
) {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("yakap_applications")
      .select(`*`, { count: "exact" });

    // Apply barangay filter - only if explicitly provided in filters or userBarangay for non-admin
    if (filters?.barangay) {
      query = query.eq("barangay", filters.barangay);
    } else if (userBarangay && !isAdmin) {
      // Only filter by user's barangay if they are not admin
      query = query.eq("barangay", userBarangay);
    }
    // Admin users see all applications without filtering

    // Apply status filter
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    // Apply ordering
    query = query.order("applied_at", { ascending: false });

    // Apply pagination
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    console.log(
      "[getYakakApplications] Executing query with userBarangay:",
      userBarangay,
      "isAdmin:",
      isAdmin,
      "filters:",
      filters,
    );

    const { data, error, count } = await query;

    if (error) {
      console.error("[getYakakApplications] Error:", error);
      return { data: [], count: 0, error };
    }

    console.log(
      "[getYakakApplications] Success. Found",
      count,
      "records. Data:",
      data,
    );

    return {
      data: (data || []) as YakakApplication[],
      count: count || 0,
      error: null,
    };
  } catch (error) {
    console.error("[getYakakApplications] Exception:", error);
    return { data: [], count: 0, error };
  }
}

/**
 * Fetch a single YAKAP application by ID
 */
export async function getYakakApplicationById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("yakap_applications")
    .select(`*`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getYakakApplicationById]", error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Count pending YAKAP applications
 */
export async function getPendingYakakCount(
  userBarangay?: string,
  isAdmin?: boolean,
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("yakap_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (userBarangay && !isAdmin) {
    query = query.eq("barangay", userBarangay);
  }

  const { count, error } = await query;

  if (error) {
    console.error("[getPendingYakakCount]", error);
    return 0;
  }

  return count || 0;
}
