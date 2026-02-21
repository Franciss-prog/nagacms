"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import type { QrScanLog } from "@/lib/types";

export interface InsertScanLogInput {
  resident_id: string;
  device_info?: string;
  notes?: string;
}

/**
 * Insert a QR scan log row.
 * The scanned_by field is taken from the current server session.
 * facility_id is looked up from health_workers.assigned_facility_id if present.
 */
export async function insertScanLog(
  input: InsertScanLogInput,
): Promise<{ data: QrScanLog | null; error: string | null }> {
  const session = await getSession();

  if (!session) {
    return { data: null, error: "Unauthorized" };
  }

  const supabase = await createServerSupabaseClient();

  // Optionally look up the worker's assigned facility
  let facility_id: string | null = null;
  try {
    const { data: workerData } = await supabase
      .from("health_workers")
      .select("assigned_facility_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    facility_id = workerData?.assigned_facility_id ?? null;
  } catch {
    // health_workers table may not exist or worker has no facility — that's fine
  }

  const { data, error } = await supabase
    .from("qr_scan_logs")
    .insert({
      resident_id: input.resident_id,
      scanned_by: session.user.id,
      facility_id,
      device_info: input.device_info ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[insertScanLog]", error);
    return { data: null, error: error.message };
  }

  return { data: data as QrScanLog, error: null };
}

/**
 * Fetch scan logs for a specific resident.
 */
export async function getScanLogsByResident(
  resident_id: string,
): Promise<{ data: QrScanLog[]; error: string | null }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
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
    .eq("resident_id", resident_id)
    .order("scanned_at", { ascending: false });

  if (error) {
    console.error("[getScanLogsByResident]", error);
    return { data: [], error: error.message };
  }

  const logs = ((data as any[]) || []).map((row) => {
    const { users, health_facilities, ...rest } = row;
    return {
      ...rest,
      scanner: users ?? undefined,
      facility: health_facilities ?? undefined,
    } as QrScanLog;
  });

  return { data: logs, error: null };
}
