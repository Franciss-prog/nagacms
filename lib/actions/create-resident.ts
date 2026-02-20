"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";

export interface CreateResidentInput {
  full_name: string;
  birth_date: string; // ISO date string e.g. "1995-04-12"
  barangay: string;
  purok: string;
  contact_number?: string;
  philhealth_no?: string;
}

export type CreateResidentResult =
  | { success: true; id: string; full_name: string }
  | { success: false; error: string };

/**
 * Server Action: Register a new resident record, primarily for pregnancy intake.
 * Sex defaults to "Female" since this is used from the pregnancy module.
 */
export async function createResidentAction(
  input: CreateResidentInput,
): Promise<CreateResidentResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  if (!["staff", "admin", "barangay_admin"].includes(session.user.role)) {
    return { success: false, error: "Access denied. LGU staff only." };
  }

  const {
    full_name,
    birth_date,
    barangay,
    purok,
    contact_number,
    philhealth_no,
  } = input;

  if (!full_name.trim())
    return { success: false, error: "Full name is required." };
  if (!birth_date)
    return { success: false, error: "Date of birth is required." };
  if (!barangay) return { success: false, error: "Barangay is required." };
  if (!purok.trim()) return { success: false, error: "Purok is required." };

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("residents")
      .insert({
        full_name: full_name.trim(),
        birth_date,
        sex: "Female",
        barangay,
        purok: purok.trim(),
        contact_number: contact_number?.trim() || null,
        philhealth_no: philhealth_no?.trim() || null,
        created_by: session.user.id,
      })
      .select("id, full_name")
      .single();

    if (error) {
      console.error("[createResidentAction]", error);
      return {
        success: false,
        error: "Failed to create resident. Please try again.",
      };
    }

    return { success: true, id: data.id, full_name: data.full_name };
  } catch (err) {
    console.error("[createResidentAction] unexpected error:", err);
    return { success: false, error: "Unexpected error. Please try again." };
  }
}
