"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import { approveYakakSchema, returnYakakSchema } from "@/lib/schemas/yakap";
import { z } from "zod";

/**
 * Server Action: Create new YAKAP application
 */
export async function createYakakAction(formData: {
  resident_id: string;
  membership_type: "individual" | "family" | "senior" | "pwd";
  philhealth_no?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const schema = z.object({
    resident_id: z.string().uuid(),
    membership_type: z.enum(["individual", "family", "senior", "pwd"]),
    philhealth_no: z.string().optional(),
  });

  const validation = schema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { resident_id, membership_type, philhealth_no } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Check if resident exists
    const { data: resident, error: residentError } = await supabase
      .from("residents")
      .select("id, barangay")
      .eq("id", resident_id)
      .single();

    if (residentError || !resident) {
      return { success: false, error: "Resident not found" };
    }

    // Check for duplicate applications for the same resident
    const { data: existing } = await supabase
      .from("yakap_applications")
      .select("id")
      .eq("resident_id", resident_id)
      .eq("status", "pending")
      .single();

    if (existing) {
      return {
        success: false,
        error: "This resident already has a pending YAKAP application",
      };
    }

    // Create new YAKAP application
    const { data: newApp, error: createError } = await supabase
      .from("yakap_applications")
      .insert({
        resident_id,
        membership_type,
        philhealth_no: philhealth_no || null,
        status: "pending",
        applied_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newApp) {
      console.error("[createYakakAction]", createError);
      return { success: false, error: "Failed to create application" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "created",
      resource_type: "yakap_application",
      resource_id: newApp.id,
    });

    return { success: true, id: newApp.id };
  } catch (error) {
    console.error("[createYakakAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Approve YAKAP application
 */
export async function approveYakakAction(formData: {
  id: string;
  remarks?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validation = approveYakakSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { id, remarks } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Update YAKAP application status
    const { error } = await supabase
      .from("yakap_applications")
      .update({
        status: "approved",
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
        remarks: remarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[approveYakakAction]", error);
      return { success: false, error: "Failed to approve application" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "approved",
      resource_type: "yakap_application",
      resource_id: id,
    });

    return { success: true };
  } catch (error) {
    console.error("[approveYakakAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Return YAKAP application
 */
export async function returnYakakAction(formData: {
  id: string;
  remarks: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validation = returnYakakSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Remarks are required when returning" };
  }

  const { id, remarks } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Update YAKAP application status
    const { error } = await supabase
      .from("yakap_applications")
      .update({
        status: "returned",
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
        remarks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[returnYakakAction]", error);
      return { success: false, error: "Failed to return application" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "returned",
      resource_type: "yakap_application",
      resource_id: id,
    });

    return { success: true };
  } catch (error) {
    console.error("[returnYakakAction]", error);
    return { success: false, error: "An error occurred" };
  }
}
