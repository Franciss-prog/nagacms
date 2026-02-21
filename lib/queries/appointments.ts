"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { Appointment, Resident, HealthFacility } from "@/lib/types";

export interface AppointmentWithDetails extends Appointment {
  resident?: Resident;
  facility?: HealthFacility;
}

/**
 * Get all appointments with resident and facility details
 */
export async function getAppointments(options?: {
  facility_id?: string;
  status?: string;
  resident_id?: string;
  limit?: number;
  date?: string; // Filter by specific date (YYYY-MM-DD format)
}) {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("appointments")
      .select(
        `
        id,
        facility_id,
        resident_id,
        appointment_date,
        time_slot,
        service_type,
        status,
        booked_at,
        notes,
        created_at,
        updated_at,
        residents:resident_id(
          id,
          full_name,
          barangay,
          contact_number
        ),
        health_facilities:facility_id(
          id,
          name,
          address,
          barangay
        )
      `,
      )
      .order("appointment_date", { ascending: false })
      .order("time_slot", { ascending: true });

    if (options?.facility_id) {
      query = query.eq("facility_id", options.facility_id);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.resident_id) {
      query = query.eq("resident_id", options.resident_id);
    }

    if (options?.date) {
      query = query.eq("appointment_date", options.date);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getAppointments]", error);
      return { data: [], error };
    }

    // Map the response to match our expected structure
    const appointments = (data || []).map((appt: any) => ({
      ...appt,
      resident: appt.residents,
      facility: appt.health_facilities,
    }));

    return { data: appointments, error: null };
  } catch (error) {
    console.error("[getAppointments]", error);
    return { data: [], error };
  }
}

/**
 * Get appointments by facility
 */
export async function getAppointmentsByFacility(facilityId: string) {
  return getAppointments({ facility_id: facilityId });
}

/**
 * Get booked appointments only
 */
export async function getBookedAppointments(options?: {
  facility_id?: string;
  resident_id?: string;
  limit?: number;
}) {
  return getAppointments({
    ...options,
    status: "booked",
  });
}
