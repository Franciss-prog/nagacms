import { z } from "zod";

export const barangayProfileSchema = z.object({
  // Part 1 – Membership & Personal
  membership_type: z.enum(["member", "dependent"]),
  philhealth_no: z.string().optional().nullable(),
  last_name: z.string().min(1, "Last name is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  age: z.coerce.number().int().min(0).max(150).optional().nullable(),
  birthdate: z.string().optional().nullable(),
  civil_status: z
    .enum(["single", "married", "widowed", "separated", "annulled"])
    .optional()
    .nullable(),
  maiden_last_name: z.string().optional().nullable(),
  maiden_middle_name: z.string().optional().nullable(),
  educational_attainment: z
    .enum([
      "no_formal",
      "elementary",
      "high_school",
      "senior_high",
      "vocational",
      "college",
      "post_grad",
    ])
    .optional()
    .nullable(),
  employment_status: z
    .enum(["employed", "self_employed", "unemployed", "student", "retired"])
    .optional()
    .nullable(),
  employed_in: z.enum(["government", "private"]).optional().nullable(),
  occupation: z.string().optional().nullable(),
  company_address: z.string().optional().nullable(),
  religion: z.string().optional().nullable(),
  blood_type: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional()
    .nullable(),

  // Part 2 – Family Background
  mother_last_name: z.string().optional().nullable(),
  mother_first_name: z.string().optional().nullable(),
  mother_middle_name: z.string().optional().nullable(),
  mother_birthdate: z.string().optional().nullable(),
  father_last_name: z.string().optional().nullable(),
  father_first_name: z.string().optional().nullable(),
  father_middle_name: z.string().optional().nullable(),
  father_birthdate: z.string().optional().nullable(),
  spouse_last_name: z.string().optional().nullable(),
  spouse_first_name: z.string().optional().nullable(),
  spouse_birthdate: z.string().optional().nullable(),

  // Part 3 – Address & Contact
  current_barangay: z.string().optional().nullable(),
  current_street: z.string().optional().nullable(),
  current_city: z.string().optional().nullable(),
  current_province: z.string().optional().nullable(),
  permanent_barangay: z.string().optional().nullable(),
  permanent_street: z.string().optional().nullable(),
  permanent_city: z.string().optional().nullable(),
  permanent_province: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  mobile: z.string().optional().nullable(),
});

export type BarangayProfileInput = z.infer<typeof barangayProfileSchema>;
