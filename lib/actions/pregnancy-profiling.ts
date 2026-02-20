"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import {
  pregnancyProfilingSchema,
  type PregnancyProfilingFormData,
} from "@/lib/schemas/pregnancy-profiling";

export type UpsertPregnancyProfileResult =
  | { success: true; id: string; action: "created" | "updated" }
  | { success: false; error: string };

/**
 * Server Action: Upsert a pregnancy profiling record for a resident.
 * The table has a UNIQUE constraint on resident_id, so one record per resident.
 * Subsequent saves update the same row (updated_by is set to current user).
 */
export async function upsertPregnancyProfileAction(
  residentId: string,
  formData: PregnancyProfilingFormData,
): Promise<UpsertPregnancyProfileResult> {
  // Auth check
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  if (!["staff", "admin", "barangay_admin"].includes(session.user.role)) {
    return {
      success: false,
      error: "Access denied. LGU staff only.",
    };
  }

  // Validate input
  const validation = pregnancyProfilingSchema.safeParse(formData);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      success: false,
      error:
        firstError?.message ?? "Invalid form data. Please check all fields.",
    };
  }

  const data = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Check if record already exists
    const { data: existing, error: fetchError } = await supabase
      .from("pregnancy_profiling_records")
      .select("id")
      .eq("resident_id", residentId)
      .maybeSingle();

    if (fetchError) {
      console.error("[upsertPregnancyProfileAction] fetch error:", fetchError);
      return { success: false, error: "Failed to check existing record." };
    }

    const payload = {
      resident_id: residentId,
      visit_date: data.visit_date,
      is_inquirer: data.is_inquirer ?? false,
      inquiry_details: data.inquiry_details || null,

      gravida: data.gravida ?? null,
      para: data.para ?? null,
      term: data.term ?? null,
      pre_term: data.pre_term ?? null,
      abortion: data.abortion ?? null,
      living: data.living ?? null,
      type_of_delivery: data.type_of_delivery || null,

      blood_pressure: data.blood_pressure || null,
      heart_rate: data.heart_rate ?? null,
      respiratory_rate: data.respiratory_rate ?? null,
      height: data.height ?? null,
      weight: data.weight ?? null,
      bmi: data.bmi ?? null,
      temperature: data.temperature ?? null,
      visual_acuity_left: data.visual_acuity_left || null,
      visual_acuity_right: data.visual_acuity_right || null,

      length: data.length ?? null,
      waist_circumference: data.waist_circumference ?? null,
      middle_upper_arm_circumference:
        data.middle_upper_arm_circumference ?? null,
      head_circumference: data.head_circumference ?? null,
      hip: data.hip ?? null,
      skinfold_thickness: data.skinfold_thickness ?? null,
      limbs: data.limbs || null,
      blood_type: data.blood_type ?? null,
      z_score_cm: data.z_score_cm ?? null,

      general_survey: data.general_survey,

      eats_processed_fast_foods: data.eats_processed_fast_foods ?? null,
      vegetables_3_servings_daily: data.vegetables_3_servings_daily ?? null,
      fruits_2_3_servings_daily: data.fruits_2_3_servings_daily ?? null,
      moderate_activity_2_5hrs_weekly:
        data.moderate_activity_2_5hrs_weekly ?? null,
      diagnosed_diabetes: data.diagnosed_diabetes ?? null,
      diabetes_management: data.diabetes_management ?? null,
      diabetes_symptoms: data.diabetes_symptoms ?? [],

      angina_or_heart_attack: data.angina_or_heart_attack ?? null,
      chest_pain_pressure: data.chest_pain_pressure ?? null,
      chest_left_arm_pain: data.chest_left_arm_pain ?? null,
      chest_pain_with_walking_uphill_hurry:
        data.chest_pain_with_walking_uphill_hurry ?? null,
      chest_pain_slows_down_walking: data.chest_pain_slows_down_walking ?? null,
      chest_pain_relieved_by_rest_or_tablet:
        data.chest_pain_relieved_by_rest_or_tablet ?? null,
      chest_pain_gone_under_10mins: data.chest_pain_gone_under_10mins ?? null,
      chest_pain_severe_30mins_or_more:
        data.chest_pain_severe_30mins_or_more ?? null,
      stroke_or_tia: data.stroke_or_tia ?? null,
      difficulty_talking_or_one_side_weakness:
        data.difficulty_talking_or_one_side_weakness ?? null,
      risk_level: data.risk_level ?? null,

      raised_blood_glucose: data.raised_blood_glucose ?? null,
      raised_blood_glucose_date: data.raised_blood_glucose_date || null,
      raised_blood_glucose_result: data.raised_blood_glucose_result || null,

      raised_blood_lipids: data.raised_blood_lipids ?? null,
      raised_blood_lipids_date: data.raised_blood_lipids_date || null,
      raised_blood_lipids_result: data.raised_blood_lipids_result || null,

      urine_ketones_positive: data.urine_ketones_positive ?? null,
      urine_ketones_date: data.urine_ketones_date || null,
      urine_ketones_result: data.urine_ketones_result || null,

      urine_protein_positive: data.urine_protein_positive ?? null,
      urine_protein_date: data.urine_protein_date || null,
      urine_protein_result: data.urine_protein_result || null,

      notes: data.notes || null,
      updated_by: session.user.id,
    };

    if (!existing) {
      // INSERT new record
      const { data: newRecord, error: insertError } = await supabase
        .from("pregnancy_profiling_records")
        .insert({ ...payload, recorded_by: session.user.id })
        .select("id")
        .single();

      if (insertError || !newRecord) {
        console.error(
          "[upsertPregnancyProfileAction] insert error:",
          insertError,
        );
        return {
          success: false,
          error: "Failed to save the profile. Please try again.",
        };
      }

      // Log activity
      await supabase
        .from("activity_logs")
        .insert({
          user_id: session.user.id,
          action: "created",
          resource_type: "pregnancy_profiling_record",
          resource_id: newRecord.id,
        })
        .maybeSingle();

      return { success: true, id: newRecord.id, action: "created" };
    } else {
      // UPDATE existing record
      const { error: updateError } = await supabase
        .from("pregnancy_profiling_records")
        .update(payload)
        .eq("resident_id", residentId);

      if (updateError) {
        console.error(
          "[upsertPregnancyProfileAction] update error:",
          updateError,
        );
        return {
          success: false,
          error: "Failed to update the profile. Please try again.",
        };
      }

      // Log activity
      await supabase
        .from("activity_logs")
        .insert({
          user_id: session.user.id,
          action: "updated",
          resource_type: "pregnancy_profiling_record",
          resource_id: existing.id,
        })
        .maybeSingle();

      return { success: true, id: existing.id, action: "updated" };
    }
  } catch (err) {
    console.error("[upsertPregnancyProfileAction] unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
