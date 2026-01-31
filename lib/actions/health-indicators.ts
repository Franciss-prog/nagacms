"use server";

import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Validation schemas
const createHealthIndicatorSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  indicator_type: z.string().min(1, "Indicator type required"),
  value: z.number().positive("Value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  status: z.enum(["normal", "warning", "critical"]).optional(),
  notes: z.string().optional(),
});

const bulkCreateHealthIndicatorsSchema = z.array(createHealthIndicatorSchema);

const createVitalSignsSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  systolic: z.number().int().min(0).max(300),
  diastolic: z.number().int().min(0).max(300),
  temperature: z.number().optional(),
  heart_rate: z.number().int().optional(),
  respiratory_rate: z.number().int().optional(),
  oxygen_saturation: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  bmi: z.number().optional(),
  notes: z.string().optional(),
});

const createHealthProgramSchema = z.object({
  program_name: z.string().min(1, "Program name is required"),
  barangay: z.string().min(1, "Barangay is required"),
  description: z.string().optional(),
  target_population: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["active", "inactive", "completed"]).default("active"),
});

const addBeneficiarySchema = z.object({
  program_id: z.string().uuid("Invalid program ID"),
  resident_id: z.string().uuid("Invalid resident ID"),
  notes: z.string().optional(),
});

const createVaccinationSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  vaccine_name: z.string().min(1, "Vaccine name is required"),
  dose_number: z.number().int().optional(),
  vaccine_date: z.string(),
  next_dose_date: z.string().optional(),
  vaccination_site: z.string().optional(),
  batch_number: z.string().optional(),
  status: z.enum(["completed", "pending", "overdue"]).default("completed"),
  notes: z.string().optional(),
});

const createDiseaseCaseSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  disease_name: z.string().min(1, "Disease name is required"),
  case_classification: z.enum(["confirmed", "probable", "suspected"]),
  date_reported: z.string(),
  date_onset: z.string().optional(),
  outcome: z.enum(["recovered", "ongoing", "fatal"]).optional(),
  notes: z.string().optional(),
});

// ============================================================================
// HEALTH INDICATORS ACTIONS
// ============================================================================

export async function createHealthIndicatorAction(
  data: z.infer<typeof createHealthIndicatorSchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = createHealthIndicatorSchema.parse(data);

    // Verify resident exists
    const { data: resident } = await supabase
      .from("residents")
      .select("id")
      .eq("id", validated.resident_id)
      .single();

    if (!resident) {
      return { error: "Resident not found" };
    }

    const { data: indicator, error } = await supabase
      .from("health_indicators")
      .insert({
        resident_id: validated.resident_id,
        indicator_type: validated.indicator_type,
        value: validated.value,
        unit: validated.unit,
        status: validated.status || "normal",
        notes: validated.notes,
        recorded_by: session.user.id,
        recorded_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error creating health indicator:", error);
      return { error: error.message };
    }

    return { data: indicator, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to create health indicator" };
  }
}

// ============================================================================
// VITAL SIGNS ACTIONS
// ============================================================================

export async function createVitalSignsAction(
  data: z.infer<typeof createVitalSignsSchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = createVitalSignsSchema.parse(data);

    // Verify resident exists
    const { data: resident } = await supabase
      .from("residents")
      .select("id")
      .eq("id", validated.resident_id)
      .single();

    if (!resident) {
      return { error: "Resident not found" };
    }

    const { data: vitalSigns, error } = await supabase
      .from("vital_signs_history")
      .insert({
        resident_id: validated.resident_id,
        systolic: validated.systolic,
        diastolic: validated.diastolic,
        temperature: validated.temperature || null,
        heart_rate: validated.heart_rate || null,
        respiratory_rate: validated.respiratory_rate || null,
        oxygen_saturation: validated.oxygen_saturation || null,
        weight: validated.weight || null,
        height: validated.height || null,
        bmi: validated.bmi || null,
        recorded_by: session.user.id,
        recorded_at: new Date().toISOString(),
        notes: validated.notes,
      })
      .select();

    if (error) {
      console.error("Error creating vital signs:", error);
      return { error: error.message };
    }

    return { data: vitalSigns, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to create vital signs record" };
  }
}

// ============================================================================
// HEALTH PROGRAMS ACTIONS
// ============================================================================

export async function createHealthProgramAction(
  data: z.infer<typeof createHealthProgramSchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = createHealthProgramSchema.parse(data);

    const { data: program, error } = await supabase
      .from("health_programs")
      .insert({
        program_name: validated.program_name,
        barangay: validated.barangay,
        description: validated.description,
        target_population: validated.target_population,
        start_date: validated.start_date,
        end_date: validated.end_date,
        status: validated.status,
        created_by: session.user.id,
      })
      .select();

    if (error) {
      console.error("Error creating health program:", error);
      return { error: error.message };
    }

    return { data: program, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to create health program" };
  }
}

export async function updateHealthProgramAction(
  programId: string,
  data: Partial<z.infer<typeof createHealthProgramSchema>>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { data: program, error } = await supabase
      .from("health_programs")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", programId)
      .select();

    if (error) {
      console.error("Error updating health program:", error);
      return { error: error.message };
    }

    return { data: program, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to update health program" };
  }
}

export async function deleteHealthProgramAction(programId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("health_programs")
      .delete()
      .eq("id", programId);

    if (error) {
      console.error("Error deleting health program:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to delete health program" };
  }
}

// ============================================================================
// PROGRAM BENEFICIARIES ACTIONS
// ============================================================================

export async function addBeneficiaryAction(
  data: z.infer<typeof addBeneficiarySchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = addBeneficiarySchema.parse(data);

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("program_beneficiaries")
      .select("id")
      .eq("program_id", validated.program_id)
      .eq("resident_id", validated.resident_id)
      .single();

    if (existing) {
      return { error: "Resident is already enrolled in this program" };
    }

    const { data: beneficiary, error } = await supabase
      .from("program_beneficiaries")
      .insert({
        program_id: validated.program_id,
        resident_id: validated.resident_id,
        enrollment_date: new Date().toISOString().split("T")[0],
        status: "active",
        notes: validated.notes,
      })
      .select();

    if (error) {
      console.error("Error adding beneficiary:", error);
      return { error: error.message };
    }

    return { data: beneficiary, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to add beneficiary" };
  }
}

export async function removeBeneficiaryAction(beneficiaryId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("program_beneficiaries")
      .delete()
      .eq("id", beneficiaryId);

    if (error) {
      console.error("Error removing beneficiary:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to remove beneficiary" };
  }
}

// ============================================================================
// VACCINATION RECORDS ACTIONS
// ============================================================================

export async function createVaccinationAction(
  data: z.infer<typeof createVaccinationSchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = createVaccinationSchema.parse(data);

    const { data: vaccination, error } = await supabase
      .from("vaccination_records")
      .insert({
        resident_id: validated.resident_id,
        vaccine_name: validated.vaccine_name,
        dose_number: validated.dose_number,
        vaccine_date: validated.vaccine_date,
        next_dose_date: validated.next_dose_date,
        vaccination_site: validated.vaccination_site,
        administered_by: session.user.id,
        batch_number: validated.batch_number,
        status: validated.status,
        notes: validated.notes,
      })
      .select();

    if (error) {
      console.error("Error creating vaccination record:", error);
      return { error: error.message };
    }

    return { data: vaccination, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to create vaccination record" };
  }
}

export async function updateVaccinationStatusAction(
  vaccinationId: string,
  status: "completed" | "pending" | "overdue",
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { data: vaccination, error } = await supabase
      .from("vaccination_records")
      .update({ status })
      .eq("id", vaccinationId)
      .select();

    if (error) {
      console.error("Error updating vaccination status:", error);
      return { error: error.message };
    }

    return { data: vaccination, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to update vaccination status" };
  }
}

// ============================================================================
// DISEASE CASES ACTIONS
// ============================================================================

export async function createDiseaseCaseAction(
  data: z.infer<typeof createDiseaseCaseSchema>,
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const validated = createDiseaseCaseSchema.parse(data);

    const { data: diseaseCase, error } = await supabase
      .from("disease_cases")
      .insert({
        resident_id: validated.resident_id,
        disease_name: validated.disease_name,
        case_classification: validated.case_classification,
        date_reported: validated.date_reported,
        date_onset: validated.date_onset,
        outcome: validated.outcome,
        reported_by: session.user.id,
        notes: validated.notes,
      })
      .select();

    if (error) {
      console.error("Error creating disease case:", error);
      return { error: error.message };
    }

    return { data: diseaseCase, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to create disease case" };
  }
}

export async function updateDiseaseCaseOutcomeAction(
  casesId: string,
  outcome: "recovered" | "ongoing" | "fatal",
) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { data: diseaseCase, error } = await supabase
      .from("disease_cases")
      .update({ outcome })
      .eq("id", casesId)
      .select();

    if (error) {
      console.error("Error updating disease case:", error);
      return { error: error.message };
    }

    return { data: diseaseCase, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to update disease case" };
  }
}

// ============================================================================
// BULK OPERATIONS FOR HEALTH INDICATORS
// ============================================================================

/**
 * Get health indicators for a resident with filters
 */
export async function getHealthIndicatorsAction(
  residentId: string,
  options?: { type?: string; limit?: number; offset?: number },
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    let query = supabase
      .from("health_indicators")
      .select("*")
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.type) {
      query = query.eq("indicator_type", options.type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching health indicators:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Bulk insert health indicators from CSV/array data
 * Perfect for importing disease surveillance data
 */
export async function bulkCreateHealthIndicatorsAction(
  indicators: z.infer<typeof bulkCreateHealthIndicatorsSchema>,
): Promise<{ success: boolean; error?: string; count?: number }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = bulkCreateHealthIndicatorsSchema.safeParse(indicators);
  if (!validation.success) {
    return {
      success: false,
      error: `Validation error: ${validation.error.message}`,
    };
  }

  try {
    const validatedData = validation.data;

    // Transform data to include user ID and timestamp
    const insertData = validatedData.map((item) => ({
      ...item,
      status: item.status || "normal",
      recorded_by: session.user?.id,
      recorded_at: new Date().toISOString(),
    }));

    const { error, data } = await supabase
      .from("health_indicators")
      .insert(insertData)
      .select();

    if (error) throw error;

    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error("Error bulk creating health indicators:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get health indicator statistics by type for a resident
 */
export async function getHealthIndicatorStatsAction(
  residentId: string,
): Promise<{
  success: boolean;
  stats?: Record<string, any>;
  error?: string;
}> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("indicator_type, value, status, recorded_at")
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    // Group by indicator type and calculate stats
    const stats: Record<string, any> = {};
    data?.forEach((indicator) => {
      const type = indicator.indicator_type;
      if (!stats[type]) {
        stats[type] = {
          count: 0,
          values: [],
          statuses: { normal: 0, warning: 0, critical: 0 },
          latest: null,
        };
      }
      stats[type].count += 1;
      stats[type].values.push(indicator.value);
      stats[type].statuses[indicator.status]++;
      if (
        !stats[type].latest ||
        new Date(indicator.recorded_at) >
          new Date(stats[type].latest.recorded_at)
      ) {
        stats[type].latest = indicator;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach((type) => {
      const values = stats[type].values;
      stats[type].average =
        values.reduce((a: number, b: number) => a + b, 0) / values.length;
      stats[type].min = Math.min(...values);
      stats[type].max = Math.max(...values);
      delete stats[type].values; // Remove raw values from response
    });

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching health indicator stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all health indicators for barangay with pagination
 */
export async function getBarangayHealthIndicatorsAction(
  barangay: string,
  options?: { limit?: number; offset?: number },
): Promise<{
  success: boolean;
  data?: any[];
  total?: number;
  error?: string;
}> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const limit = options?.limit || 100;
    const offset = options?.offset || 0;

    // First get all residents in barangay
    const { data: residents, error: residentsError } = await supabase
      .from("residents")
      .select("id")
      .eq("barangay", barangay);

    if (residentsError) throw residentsError;

    const residentIds = residents?.map((r) => r.id) || [];

    if (residentIds.length === 0) {
      return { success: true, data: [], total: 0 };
    }

    // Get health indicators for all residents
    const { data, error, count } = await supabase
      .from("health_indicators")
      .select("*", { count: "exact" })
      .in("resident_id", residentIds)
      .order("recorded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { success: true, data, total: count || 0 };
  } catch (error) {
    console.error("Error fetching barangay health indicators:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
