"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import { approveYakakSchema, returnYakakSchema } from "@/lib/schemas/yakap";

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
