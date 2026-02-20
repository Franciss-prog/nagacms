"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { PregnancyProfilingRecord } from "@/lib/schemas/pregnancy-profiling";

export interface ResidentForProfiling {
  id: string;
  full_name: string;
  barangay: string;
  purok: string;
  birth_date: string | null;
  sex: string | null;
  contact_number: string | null;
  philhealth_no: string | null;
}

/**
 * Fetch a single resident by ID for pregnancy profiling
 */
export async function getResidentForProfiling(
  residentId: string,
): Promise<ResidentForProfiling | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select(
      "id, full_name, barangay, purok, birth_date, sex, contact_number, philhealth_no",
    )
    .eq("id", residentId)
    .single();

  if (error || !data) {
    console.error("[getResidentForProfiling]", error);
    return null;
  }

  return data as ResidentForProfiling;
}

/**
 * Fetch the pregnancy profiling record for a resident (one row per resident)
 */
export async function getPregnancyRecord(
  residentId: string,
): Promise<PregnancyProfilingRecord | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("pregnancy_profiling_records")
    .select("*")
    .eq("resident_id", residentId)
    .maybeSingle();

  if (error) {
    console.error("[getPregnancyRecord]", error);
    return null;
  }

  return data as PregnancyProfilingRecord | null;
}

/**
 * Search residents by name or barangay for the pregnancy profiling list page
 */
export async function searchResidentsForProfiling(params: {
  query?: string;
  barangay?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  residents: (ResidentForProfiling & {
    has_profile: boolean;
    last_visit?: string;
  })[];
  total: number;
}> {
  const { query = "", barangay = "", page = 1, pageSize = 20 } = params;
  const supabase = await createServerSupabaseClient();

  let residentQuery = supabase
    .from("residents")
    .select(
      "id, full_name, barangay, purok, birth_date, sex, contact_number, philhealth_no",
      { count: "exact" },
    )
    .order("full_name", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (query) {
    residentQuery = residentQuery.ilike("full_name", `%${query}%`);
  }

  if (barangay) {
    residentQuery = residentQuery.eq("barangay", barangay);
  }

  const { data: residents, error, count } = await residentQuery;

  if (error || !residents) {
    console.error("[searchResidentsForProfiling]", error);
    return { residents: [], total: 0 };
  }

  // Fetch existing pregnancy records for these residents
  const residentIds = residents.map((r) => r.id);
  const { data: records } = await supabase
    .from("pregnancy_profiling_records")
    .select("resident_id, visit_date, updated_at")
    .in("resident_id", residentIds);

  const recordMap = new Map(
    (records || []).map((r) => [
      r.resident_id,
      {
        visit_date: r.visit_date as string,
        updated_at: r.updated_at as string,
      },
    ]),
  );

  return {
    residents: residents.map((r) => ({
      ...(r as ResidentForProfiling),
      has_profile: recordMap.has(r.id),
      last_visit: recordMap.get(r.id)?.visit_date,
    })),
    total: count ?? 0,
  };
}

/**
 * Fetch distinct barangays for the filter dropdown
 */
export async function getBarangaysForFilter(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select("barangay")
    .order("barangay");

  if (error || !data) return [];

  const unique = [...new Set(data.map((d) => d.barangay as string))].filter(
    Boolean,
  );
  return unique;
}
