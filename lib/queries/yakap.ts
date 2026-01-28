"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { YakakApplication, Resident, User } from "@/lib/types";

/**
 * Fetch YAKAP applications for the current user's barangay (or all if admin)
 */
export async function getYakakApplications(
  userBarangay: string,
  isAdmin: boolean,
  filters?: {
    status?: "pending" | "approved" | "returned" | "rejected";
    limit?: number;
    offset?: number;
  },
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("yakap_applications")
    .select(
      `
      *,
      resident:residents (
        id,
        full_name,
        barangay,
        purok,
        philhealth_no,
        contact_number
      ),
      approver:users!approved_by (
        id,
        username,
        role
      )
    `,
      { count: "exact" },
    )
    .order("applied_at", { ascending: false });

  // Apply barangay filter if not admin
  if (!isAdmin) {
    const { data: residents } = await supabase
      .from("residents")
      .select("id")
      .eq("barangay", userBarangay);

    const residentIds = residents?.map((r) => r.id) || [];
    if (residentIds.length > 0) {
      query = query.in("resident_id", residentIds);
    } else {
      return { data: [], count: 0, error: null };
    }
  }

  // Apply status filter
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  // Apply pagination
  const limit = filters?.limit || 10;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getYakakApplications]", error);
    return { data: [], count: 0, error };
  }

  return {
    data: (data || []) as (YakakApplication & {
      resident?: Resident;
      approver?: User;
    })[],
    count: count || 0,
    error: null,
  };
}

/**
 * Fetch a single YAKAP application by ID
 */
export async function getYakakApplicationById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("yakap_applications")
    .select(
      `
      *,
      resident:residents (*),
      approver:users!approved_by (id, username, role)
    `,
    )
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
  userBarangay: string,
  isAdmin: boolean,
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("yakap_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (!isAdmin) {
    const { data: residents } = await supabase
      .from("residents")
      .select("id")
      .eq("barangay", userBarangay);

    const residentIds = residents?.map((r) => r.id) || [];
    if (residentIds.length > 0) {
      query = query.in("resident_id", residentIds);
    } else {
      return 0;
    }
  }

  const { count, error } = await query;

  if (error) {
    console.error("[getPendingYakakCount]", error);
    return 0;
  }

  return count || 0;
}
