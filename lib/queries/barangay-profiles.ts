"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import { rowToProfile } from "@/lib/utils/barangay-profile-mappers";
import type { BarangayProfile } from "@/components/barangay-profiling/barangay-profiles-list";

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Fetch all barangay profiles, with optional search
 */
export async function getBarangayProfiles(options?: {
  search?: string;
  barangay?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: BarangayProfile[]; count: number; error: unknown }> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("barangay_profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.search) {
      const s = options.search;
      query = query.or(
        `last_name.ilike.%${s}%,first_name.ilike.%${s}%,philhealth_no.ilike.%${s}%,current_barangay.ilike.%${s}%`,
      );
    }

    if (options?.barangay) {
      query = query.eq("current_barangay", options.barangay);
    }

    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[getBarangayProfiles]", error);
      return { data: [], count: 0, error };
    }

    return {
      data: (data ?? []).map(rowToProfile),
      count: count ?? 0,
      error: null,
    };
  } catch (error) {
    console.error("[getBarangayProfiles]", error);
    return { data: [], count: 0, error };
  }
}

/**
 * Fetch a single barangay profile by ID
 */
export async function getBarangayProfileById(
  id: string,
): Promise<{ data: BarangayProfile | null; error: unknown }> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("barangay_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getBarangayProfileById]", error);
      return { data: null, error };
    }

    return { data: data ? rowToProfile(data as Record<string, unknown>) : null, error: null };
  } catch (error) {
    console.error("[getBarangayProfileById]", error);
    return { data: null, error };
  }
}
