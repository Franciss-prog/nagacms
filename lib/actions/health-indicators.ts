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
  indicator_type: z.enum([
    "blood_pressure",
    "temperature",
    "weight",
    "height",
    "bmi",
    "heart_rate",
    "glucose",
    "cholesterol",
    "oxygen_saturation",
    "respiratory_rate",
  ]),
  value: z.number().positive("Value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  status: z.enum(["normal", "warning", "critical"]).optional(),
  notes: z.string().optional(),
});

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
