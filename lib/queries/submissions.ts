"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { Submission, Resident, User } from "@/lib/types";

/**
 * Fetch submissions for the current user's barangay (or all if admin)
 */
export async function getSubmissions(
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
    .from("submissions")
    .select(
      `
      *,
      resident:residents (
        id,
        full_name,
        barangay,
        purok,
        contact_number
      ),
      reviewer:users!reviewed_by (
        id,
        username,
        role
      )
    `,
      { count: "exact" },
    )
    .order("submitted_at", { ascending: false });

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
    console.error("[getSubmissions]", error);
    return { data: [], count: 0, error };
  }

  return {
    data: (data || []) as (Submission & {
      resident?: Resident;
      reviewer?: User;
    })[],
    count: count || 0,
    error: null,
  };
}

/**
 * Fetch a single submission by ID
 */
export async function getSubmissionById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      resident:residents (*),
      reviewer:users!reviewed_by (id, username, role)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getSubmissionById]", error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Count pending submissions
 */
export async function getPendingSubmissionsCount(
  userBarangay: string,
  isAdmin: boolean,
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("submissions")
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
    console.error("[getPendingSubmissionsCount]", error);
    return 0;
  }

  return count || 0;
}
