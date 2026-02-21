"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type {
  Resident,
  Appointment,
  HealthFacility,
  PregnancyProfile,
  YakakApplication,
  QrScanLog,
  ResidentFullProfile,
  User,
} from "@/lib/types";

/**
 * Fetch a resident's complete health profile in a single round-trip.
 * Includes appointments, pregnancy records, yakap applications, and scan logs.
 */
export async function getResidentFullProfile(
  residentId: string,
): Promise<{ data: ResidentFullProfile | null; error: string | null }> {
  const supabase = await createServerSupabaseClient();

  // Run all fetches concurrently
  const [
    residentResult,
    appointmentsResult,
    pregnancyResult,
    yakapResult,
    scanLogsResult,
  ] = await Promise.all([
    // 1. Personal info
    supabase.from("residents").select("*").eq("id", residentId).single(),

    // 2. Appointment history with facility details
    supabase
      .from("appointments")
      .select(
        `
        id, facility_id, resident_id,
        appointment_date, time_slot, service_type, status,
        booked_at, notes, created_at, updated_at,
        health_facilities:facility_id (
          id, name, barangay, address
        )
      `,
      )
      .eq("resident_id", residentId)
      .order("appointment_date", { ascending: false }),

    // 3. Pregnancy / prenatal records
    supabase
      .from("pregnancy_profiling_records")
      .select(
        "id, resident_id, visit_date, lmp, aog_weeks, gravida, para, risk_level, attending_midwife, created_at, updated_at",
      )
      .eq("resident_id", residentId)
      .order("visit_date", { ascending: false }),

    // 4. Yakap / PhilHealth Konsulta applications
    supabase
      .from("yakap_applications")
      .select("*")
      .eq("resident_id", residentId)
      .order("applied_at", { ascending: false }),

    // 5. Scan history
    supabase
      .from("qr_scan_logs")
      .select(
        `
        id, resident_id, scanned_by, scanned_at, facility_id, device_info, notes,
        users:scanned_by (
          id, username
        ),
        health_facilities:facility_id (
          id, name, barangay
        )
      `,
      )
      .eq("resident_id", residentId)
      .order("scanned_at", { ascending: false }),
  ]);

  if (residentResult.error || !residentResult.data) {
    console.error("[getResidentFullProfile] resident fetch:", residentResult.error);
    return {
      data: null,
      error: residentResult.error?.message ?? "Resident not found",
    };
  }

  // Map appointments with nested facility
  const appointments = ((appointmentsResult.data as any[]) || []).map(
    (row) => {
      const { health_facilities, ...rest } = row;
      return {
        ...rest,
        facility: health_facilities ?? undefined,
      } as Appointment & { facility?: HealthFacility };
    },
  );

  // Map scan logs with nested scanner user and facility
  const scanLogs = ((scanLogsResult.data as any[]) || []).map((row) => {
    const { users, health_facilities, ...rest } = row;
    return {
      ...rest,
      scanner: users ?? undefined,
      facility: health_facilities ?? undefined,
    } as QrScanLog;
  });

  return {
    data: {
      resident: residentResult.data as Resident,
      appointments,
      pregnancyProfiles: (pregnancyResult.data ?? []) as PregnancyProfile[],
      yakap: (yakapResult.data ?? []) as YakakApplication[],
      scanLogs,
    },
    error: null,
  };
}
