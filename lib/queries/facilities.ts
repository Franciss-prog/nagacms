"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type {
  HealthFacility,
  FacilitySchedule,
  PersonnelAvailability,
} from "@/lib/types";

/**
 * Fetch all health facilities for a barangay (or all if admin)
 */
export async function getFacilities(
  userBarangay: string,
  isAdmin: boolean,
  filters?: { limit?: number; offset?: number },
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("health_facilities")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  // Filter by barangay if not admin
  if (!isAdmin) {
    query = query.eq("barangay", userBarangay);
  }

  // Apply pagination
  const limit = filters?.limit || 10;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getFacilities]", error);
    return { data: [], count: 0, error };
  }

  return {
    data: (data || []) as HealthFacility[],
    count: count || 0,
    error: null,
  };
}

/**
 * Fetch a single facility with its schedules and personnel
 */
export async function getFacilityById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data: facility, error: facilityError } = await supabase
    .from("health_facilities")
    .select("*")
    .eq("id", id)
    .single();

  if (facilityError) {
    console.error("[getFacilityById]", facilityError);
    return { data: null, schedules: [], personnel: [], error: facilityError };
  }

  const { data: schedules, error: schedulesError } = await supabase
    .from("facility_schedules")
    .select("*")
    .eq("facility_id", id)
    .order("day_of_week", { ascending: true });

  const { data: personnel, error: personnelError } = await supabase
    .from("personnel_availability")
    .select("*")
    .eq("facility_id", id);

  return {
    data: facility as HealthFacility,
    schedules: (schedules || []) as FacilitySchedule[],
    personnel: (personnel || []) as PersonnelAvailability[],
    error: facilityError || schedulesError || personnelError || null,
  };
}

/**
 * Fetch schedules for a specific facility
 */
export async function getFacilitySchedules(facilityId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("facility_schedules")
    .select("*")
    .eq("facility_id", facilityId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("[getFacilitySchedules]", error);
    return { data: [], error };
  }

  return { data: (data || []) as FacilitySchedule[], error: null };
}

/**
 * Fetch personnel availability for a specific facility
 */
export async function getFacilityPersonnel(facilityId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("personnel_availability")
    .select("*")
    .eq("facility_id", facilityId);

  if (error) {
    console.error("[getFacilityPersonnel]", error);
    return { data: [], error };
  }

  return { data: (data || []) as PersonnelAvailability[], error: null };
}
