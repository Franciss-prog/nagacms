import { z } from "zod";

/**
 * Vaccination Record Schema
 */
export const vaccinationRecordSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  vaccine_name: z.string().min(2, "Vaccine name is required"),
  dose_number: z
    .number()
    .int()
    .positive("Dose number must be positive")
    .optional(),
  vaccine_date: z.string().date("Invalid vaccine date"),
  next_dose_date: z
    .string()
    .date("Invalid next dose date")
    .optional()
    .or(z.literal("")),
  vaccination_site: z.string().optional(),
  batch_number: z.string().optional(),
  status: z.enum(["completed", "pending", "overdue"]).default("completed"),
  notes: z.string().optional(),
});

export type VaccinationRecordInput = z.infer<typeof vaccinationRecordSchema>;

/**
 * Maternal Health Record Schema
 */
export const maternalHealthRecordSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  record_type: z.enum(["antenatal", "postnatal", "delivery"]),
  visit_date: z.string().date("Invalid visit date"),
  trimester: z.number().int().min(1).max(3).optional(),
  blood_pressure_systolic: z
    .number()
    .positive("Systolic BP must be positive")
    .optional(),
  blood_pressure_diastolic: z
    .number()
    .positive("Diastolic BP must be positive")
    .optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  fetal_heart_rate: z
    .number()
    .positive("Fetal heart rate must be positive")
    .optional(),
  complications: z.string().optional(),
  status: z.enum(["normal", "warning", "critical"]).default("normal"),
  notes: z.string().optional(),
});

export type MaternalHealthRecordInput = z.infer<
  typeof maternalHealthRecordSchema
>;

/**
 * Senior Assistance Record Schema
 */
export const seniorAssistanceRecordSchema = z.object({
  resident_id: z.string().uuid("Invalid resident ID"),
  assistance_type: z.enum([
    "medical_support",
    "medication_delivery",
    "home_care",
    "mobility_support",
    "mental_health",
    "social_services",
  ]),
  visit_date: z.string().date("Invalid visit date"),
  blood_pressure_systolic: z.number().positive().optional(),
  blood_pressure_diastolic: z.number().positive().optional(),
  blood_glucose: z.number().positive().optional(),
  medications_given: z.string().optional(),
  vital_status: z.enum(["stable", "improved", "declining"]).default("stable"),
  status: z.enum(["completed", "pending"]).default("completed"),
  notes: z.string().optional(),
  follow_up_date: z.string().date().optional().or(z.literal("")),
});

export type SeniorAssistanceRecordInput = z.infer<
  typeof seniorAssistanceRecordSchema
>;

/**
 * Combined Health Record Schema (for unified data entry)
 */
export const healthRecordBaseSchema = z.object({
  resident_id: z.string().uuid(),
  recorded_date: z.string().date(),
  notes: z.string().optional(),
});

/**
 * Photo Upload Schema
 */
export const photoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    ),
  recordType: z.enum([
    "vaccination",
    "maternal",
    "senior",
    "medical_consultation",
  ]),
  recordId: z.string().uuid(),
});

export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;

/**
 * Medical Consultation Record Schema (CHU/RHU Form)
 */
export const consultationTypeEnum = z.enum([
  "general",
  "family_planning",
  "prenatal",
  "postpartum",
  "tuberculosis",
  "dental_care",
  "child_care",
  "immunization",
  "child_nutrition",
  "sick_children",
  "injury",
  "firecracker_injury",
  "adult_immunization",
]);

export const medicalConsultationRecordSchema = z.object({
  // Patient Information (Section I)
  resident_id: z.string().uuid().optional(), // Optional - can be manual entry
  last_name: z.string().min(1, "Last name is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  age: z
    .number()
    .int()
    .min(0, "Age must be 0 or greater")
    .max(150, "Invalid age"),
  sex: z.enum(["M", "F"], { message: "Sex is required" }),
  address: z.string().min(1, "Address is required"),
  philhealth_id: z.string().optional(),

  // Barangay (auto-filled from worker's assignment)
  barangay: z.string().min(1, "Barangay is required"),

  // CHU/RHU Personnel Fields (Section II)
  mode_of_transaction: z.enum(["walk_in", "visited", "referral"], {
    message: "Mode of transaction is required",
  }),
  referred_from: z.string().optional(),
  referred_to: z.string().optional(),

  // Consultation Details
  consultation_date: z.string().date("Invalid consultation date"),
  consultation_time: z.string().optional(), // HH:MM format

  // Vital Signs
  temperature: z.number().min(30).max(45).optional(),
  blood_pressure_systolic: z.number().int().min(50).max(300).optional(),
  blood_pressure_diastolic: z.number().int().min(30).max(200).optional(),
  weight_kg: z.number().min(0.5).max(500).optional(),
  height_cm: z.number().min(20).max(300).optional(),

  // Provider Info
  attending_provider: z.string().min(1, "Attending provider is required"),
  referral_reason: z.string().optional(),
  referred_by: z.string().optional(),

  // Nature of Visit
  nature_of_visit: z.enum(["new_consultation", "new_admission", "follow_up"], {
    message: "Nature of visit is required",
  }),

  // Type of Consultation (multiple allowed)
  consultation_types: z
    .array(consultationTypeEnum)
    .min(1, "At least one consultation type is required"),

  // Clinical Fields
  chief_complaints: z.string().optional(),
  diagnosis: z.string().optional(),
  consultation_notes: z.string().optional(),
  medication_treatment: z.string().optional(),
  laboratory_findings: z.string().optional(),
  performed_laboratory_test: z.string().optional(),

  // Healthcare Provider Signature
  healthcare_provider_name: z
    .string()
    .min(1, "Healthcare provider name is required"),
});

export type MedicalConsultationRecordInput = z.infer<
  typeof medicalConsultationRecordSchema
>;
export type ConsultationType = z.infer<typeof consultationTypeEnum>;
