import { z } from "zod";

// ---------------------------------------------------------------
// Sub-schemas
// ---------------------------------------------------------------

const surveySectionSchema = z.object({
  findings: z.array(z.string()).default([]),
  others: z.string().optional().default(""),
});

export const generalSurveySchema = z.object({
  heent: surveySectionSchema.default({ findings: [], others: "" }),
  chest_lungs: surveySectionSchema.default({ findings: [], others: "" }),
  heart: surveySectionSchema.default({ findings: [], others: "" }),
  abdomen: surveySectionSchema.default({ findings: [], others: "" }),
  genitourinary: surveySectionSchema.default({ findings: [], others: "" }),
  digital_rectal_exam: surveySectionSchema.default({
    findings: [],
    others: "",
  }),
  skin_extremities: surveySectionSchema.default({ findings: [], others: "" }),
  neurological_exam: surveySectionSchema.default({ findings: [], others: "" }),
});

// ---------------------------------------------------------------
// Main Pregnancy Profiling Form Schema
// ---------------------------------------------------------------

export const pregnancyProfilingSchema = z.object({
  // Core tracking
  visit_date: z.string().min(1, "Visit date is required"),
  is_inquirer: z.boolean().default(false),
  inquiry_details: z.string().optional(),

  // 1) Pregnancy History
  gravida: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  para: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  term: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  pre_term: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  abortion: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  living: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or more")
    .optional()
    .nullable(),
  type_of_delivery: z.string().optional(),

  // 2) Physical Exam
  blood_pressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80")
    .optional()
    .or(z.literal("")),
  heart_rate: z.coerce.number().int().min(1).max(300).optional().nullable(),
  respiratory_rate: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .nullable(),
  height: z.coerce.number().min(1).max(300).optional().nullable(),
  weight: z.coerce.number().min(1).max(500).optional().nullable(),
  bmi: z.coerce.number().optional().nullable(),
  temperature: z.coerce.number().min(30).max(45).optional().nullable(),
  visual_acuity_left: z.string().optional(),
  visual_acuity_right: z.string().optional(),

  // 3) Pediatric (0–24 months)
  length: z.coerce.number().min(1).optional().nullable(),
  waist_circumference: z.coerce.number().min(1).optional().nullable(),
  middle_upper_arm_circumference: z.coerce
    .number()
    .min(1)
    .optional()
    .nullable(),
  head_circumference: z.coerce.number().min(1).optional().nullable(),
  hip: z.coerce.number().min(1).optional().nullable(),
  skinfold_thickness: z.coerce.number().min(1).optional().nullable(),
  limbs: z.string().optional(),

  // 4) Pediatric (0–60 months)
  blood_type: z
    .enum(["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"])
    .optional()
    .nullable(),
  z_score_cm: z.coerce.number().optional().nullable(),

  // 5) General Survey
  general_survey: generalSurveySchema.default({
    heent: { findings: [], others: "" },
    chest_lungs: { findings: [], others: "" },
    heart: { findings: [], others: "" },
    abdomen: { findings: [], others: "" },
    genitourinary: { findings: [], others: "" },
    digital_rectal_exam: { findings: [], others: "" },
    skin_extremities: { findings: [], others: "" },
    neurological_exam: { findings: [], others: "" },
  }),

  // 6) NCD High Risk Assessment
  eats_processed_fast_foods: z.enum(["yes", "no"]).optional().nullable(),
  vegetables_3_servings_daily: z.enum(["yes", "no"]).optional().nullable(),
  fruits_2_3_servings_daily: z.enum(["yes", "no"]).optional().nullable(),
  moderate_activity_2_5hrs_weekly: z.enum(["yes", "no"]).optional().nullable(),
  diagnosed_diabetes: z
    .enum(["yes", "no", "do_not_know"])
    .optional()
    .nullable(),
  diabetes_management: z
    .enum(["with_medication", "without_medication"])
    .optional()
    .nullable(),
  diabetes_symptoms: z.array(z.string()).default([]),

  angina_or_heart_attack: z.enum(["yes", "no"]).optional().nullable(),
  chest_pain_pressure: z.enum(["yes", "no"]).optional().nullable(),
  chest_left_arm_pain: z.enum(["yes", "no"]).optional().nullable(),
  chest_pain_with_walking_uphill_hurry: z
    .enum(["yes", "no"])
    .optional()
    .nullable(),
  chest_pain_slows_down_walking: z.enum(["yes", "no"]).optional().nullable(),
  chest_pain_relieved_by_rest_or_tablet: z
    .enum(["yes", "no"])
    .optional()
    .nullable(),
  chest_pain_gone_under_10mins: z.enum(["yes", "no"]).optional().nullable(),
  chest_pain_severe_30mins_or_more: z.enum(["yes", "no"]).optional().nullable(),
  stroke_or_tia: z.enum(["yes", "no"]).optional().nullable(),
  difficulty_talking_or_one_side_weakness: z
    .enum(["yes", "no"])
    .optional()
    .nullable(),
  risk_level: z
    .enum(["lt_10", "10_to_lt_20", "20_to_lt_30", "30_to_lt_40", "gte_40"])
    .optional()
    .nullable(),

  // 7) Lab Results
  raised_blood_glucose: z.enum(["yes", "no"]).optional().nullable(),
  raised_blood_glucose_date: z.string().optional(),
  raised_blood_glucose_result: z.string().optional(),

  raised_blood_lipids: z.enum(["yes", "no"]).optional().nullable(),
  raised_blood_lipids_date: z.string().optional(),
  raised_blood_lipids_result: z.string().optional(),

  urine_ketones_positive: z.enum(["yes", "no"]).optional().nullable(),
  urine_ketones_date: z.string().optional(),
  urine_ketones_result: z.string().optional(),

  urine_protein_positive: z.enum(["yes", "no"]).optional().nullable(),
  urine_protein_date: z.string().optional(),
  urine_protein_result: z.string().optional(),

  notes: z.string().optional(),
});

export type PregnancyProfilingFormData = z.infer<
  typeof pregnancyProfilingSchema
>;

// ---------------------------------------------------------------
// DB record type (matches Supabase table shape)
// ---------------------------------------------------------------
export interface PregnancyProfilingRecord {
  id: string;
  resident_id: string;
  visit_date: string;
  is_inquirer: boolean;
  inquiry_details: string | null;
  gravida: number | null;
  para: number | null;
  term: number | null;
  pre_term: number | null;
  abortion: number | null;
  living: number | null;
  type_of_delivery: string | null;
  blood_pressure: string | null;
  heart_rate: number | null;
  respiratory_rate: number | null;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  temperature: number | null;
  visual_acuity_left: string | null;
  visual_acuity_right: string | null;
  length: number | null;
  waist_circumference: number | null;
  middle_upper_arm_circumference: number | null;
  head_circumference: number | null;
  hip: number | null;
  skinfold_thickness: number | null;
  limbs: string | null;
  blood_type: string | null;
  z_score_cm: number | null;
  general_survey: Record<string, { findings: string[]; others: string }>;
  eats_processed_fast_foods: "yes" | "no" | null;
  vegetables_3_servings_daily: "yes" | "no" | null;
  fruits_2_3_servings_daily: "yes" | "no" | null;
  moderate_activity_2_5hrs_weekly: "yes" | "no" | null;
  diagnosed_diabetes: "yes" | "no" | "do_not_know" | null;
  diabetes_management: "with_medication" | "without_medication" | null;
  diabetes_symptoms: string[];
  angina_or_heart_attack: "yes" | "no" | null;
  chest_pain_pressure: "yes" | "no" | null;
  chest_left_arm_pain: "yes" | "no" | null;
  chest_pain_with_walking_uphill_hurry: "yes" | "no" | null;
  chest_pain_slows_down_walking: "yes" | "no" | null;
  chest_pain_relieved_by_rest_or_tablet: "yes" | "no" | null;
  chest_pain_gone_under_10mins: "yes" | "no" | null;
  chest_pain_severe_30mins_or_more: "yes" | "no" | null;
  stroke_or_tia: "yes" | "no" | null;
  difficulty_talking_or_one_side_weakness: "yes" | "no" | null;
  risk_level:
    | "lt_10"
    | "10_to_lt_20"
    | "20_to_lt_30"
    | "30_to_lt_40"
    | "gte_40"
    | null;
  raised_blood_glucose: "yes" | "no" | null;
  raised_blood_glucose_date: string | null;
  raised_blood_glucose_result: string | null;
  raised_blood_lipids: "yes" | "no" | null;
  raised_blood_lipids_date: string | null;
  raised_blood_lipids_result: string | null;
  urine_ketones_positive: "yes" | "no" | null;
  urine_ketones_date: string | null;
  urine_ketones_result: string | null;
  urine_protein_positive: "yes" | "no" | null;
  urine_protein_date: string | null;
  urine_protein_result: string | null;
  notes: string | null;
  recorded_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}
