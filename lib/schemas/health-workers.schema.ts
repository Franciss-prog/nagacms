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
  recordType: z.enum(["vaccination", "maternal", "senior"]),
  recordId: z.string().uuid(),
});

export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
