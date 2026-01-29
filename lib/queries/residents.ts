"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import type { Resident } from "@/lib/types";

/**
 * Fetch all residents for the current user's barangay (or all if admin)
 */
export async function getResidents(filters?: {
  barangay?: string;
  limit?: number;
  offset?: number;
}) {
  const session = await getSession();

  if (!session) {
    return { data: [], count: 0, error: "Unauthorized" };
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("residents")
    .select("*", { count: "exact" })
    .order("full_name", { ascending: true });

  // Filter by barangay (use assigned barangay if not specified)
  const barangay = filters?.barangay || session.user.assigned_barangay;
  if (barangay && session.user.role !== "admin") {
    query = query.eq("barangay", barangay);
  } else if (barangay) {
    // Admin can filter by any barangay
    query = query.eq("barangay", barangay);
  }

  // Apply pagination
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getResidents]", error);
    return { data: [], count: 0, error };
  }

  return { data: (data || []) as Resident[], count: count || 0, error: null };
}

/**
 * Fetch a single resident by ID
 */
export async function getResidentById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getResidentById]", error);
    return { data: null, error };
  }

  return { data: data as Resident, error: null };
}

/**
 * Fetch residents by barangay
 */
export async function getResidentsByBarangay(barangay: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("barangay", barangay)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[getResidentsByBarangay]", error);
    return { data: [], error };
  }

  return { data: (data || []) as Resident[], error: null };
}
