import { createServerSupabaseClient } from "@/lib/auth";

type VaccinationRecord = any;
type MaternalHealthRecord = any;
type SeniorAssistanceRecord = any;

/**
 * Vaccination Records Service
 */
export async function getVaccinationRecords(
  residentId: string,
  barangay: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("vaccination_records")
    .select("*")
    .eq("resident_id", residentId)
    .order("vaccine_date", { ascending: false });

  if (error) throw error;
  return data as VaccinationRecord[];
}

export async function createVaccinationRecord(
  record: Omit<VaccinationRecord, "id" | "created_at" | "updated_at">,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("vaccination_records")
    .insert([record])
    .select()
    .single();

  if (error) throw error;
  return data as VaccinationRecord;
}

export async function updateVaccinationRecord(
  id: string,
  updates: Partial<VaccinationRecord>,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("vaccination_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as VaccinationRecord;
}

/**
 * Maternal Health Records Service
 */
export async function getMaternalHealthRecords(
  residentId: string,
  barangay: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("maternal_health_records")
    .select("*")
    .eq("resident_id", residentId)
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return data as MaternalHealthRecord[];
}

export async function createMaternalHealthRecord(
  record: Omit<MaternalHealthRecord, "id" | "created_at" | "updated_at">,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("maternal_health_records")
    .insert([record])
    .select()
    .single();

  if (error) throw error;
  return data as MaternalHealthRecord;
}

/**
 * Senior Assistance Records Service
 */
export async function getSeniorAssistanceRecords(
  residentId: string,
  barangay: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("senior_assistance_records")
    .select("*")
    .eq("resident_id", residentId)
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return data as SeniorAssistanceRecord[];
}

export async function createSeniorAssistanceRecord(
  record: Omit<SeniorAssistanceRecord, "id" | "created_at" | "updated_at">,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("senior_assistance_records")
    .insert([record])
    .select()
    .single();

  if (error) throw error;
  return data as SeniorAssistanceRecord;
}

/**
 * Health Metrics Service
 */
export async function getHealthMetricsForBarangay(
  barangay: string,
  daysBack: number = 30,
) {
  const supabase = await createServerSupabaseClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const { data, error } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("barangay", barangay)
    .gte("metric_date", startDate.toISOString().split("T")[0])
    .order("metric_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVaccinationCoverage(barangay: string) {
  const supabase = await createServerSupabaseClient();

  // Get all residents in barangay
  const { data: residents } = await supabase
    .from("residents")
    .select("id")
    .eq("barangay", barangay);

  if (!residents || residents.length === 0) return 0;

  // Get vaccinated residents (with at least one vaccination)
  const { data: vaccinated } = await supabase
    .from("vaccination_records")
    .select("resident_id", { count: "exact", head: false })
    .in(
      "resident_id",
      residents.map((r) => r.id),
    );

  const coverage = vaccinated
    ? (vaccinated.length / residents.length) * 100
    : 0;
  return Math.round(coverage);
}

export async function getMaternalHealthCoverage(barangay: string) {
  const supabase = await createServerSupabaseClient();

  const { data: residents } = await supabase
    .from("residents")
    .select("id")
    .eq("barangay", barangay)
    .eq("sex", "Female");

  if (!residents || residents.length === 0) return 0;

  const { data: mothers } = await supabase
    .from("maternal_health_records")
    .select("resident_id", { count: "exact", head: false })
    .in(
      "resident_id",
      residents.map((r) => r.id),
    );

  const coverage = mothers ? (mothers.length / residents.length) * 100 : 0;
  return Math.round(coverage);
}

/**
 * Offline Queue Service
 */
export async function addToOfflineQueue(
  userId: string,
  action: string,
  tableName: string,
  data: Record<string, any>,
) {
  const supabase = await createServerSupabaseClient();

  const { data: result, error } = await supabase
    .from("offline_queue")
    .insert([
      {
        user_id: userId,
        action,
        table_name: tableName,
        data,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getPendingOfflineQueue(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("offline_queue")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function markQueueItemSynced(queueId: string, recordId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("offline_queue")
    .update({
      status: "synced",
      synced_at: new Date().toISOString(),
    })
    .eq("id", queueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markQueueItemFailed(
  queueId: string,
  errorMessage: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("offline_queue")
    .update({
      status: "failed",
      error_message: errorMessage,
    })
    .eq("id", queueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Residents Service for Health Workers
 */
export async function getResidentsInBarangay(barangay: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("barangay", barangay)
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getResidentById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("residents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Health Facilities Service
 */
export async function getHealthFacilitiesByBarangay(barangay: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("health_facilities")
    .select("*")
    .eq("barangay", barangay)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
