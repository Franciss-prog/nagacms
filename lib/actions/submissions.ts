"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import {
  approveSubmissionSchema,
  returnSubmissionSchema,
} from "@/lib/schemas/submissions";

/**
 * Server Action: Approve submission
 */
export async function approveSubmissionAction(formData: {
  id: string;
  remarks?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validation = approveSubmissionSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { id, remarks } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Update submission status
    const { error } = await supabase
      .from("submissions")
      .update({
        status: "approved",
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString(),
        remarks: remarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[approveSubmissionAction]", error);
      return { success: false, error: "Failed to approve submission" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "approved",
      resource_type: "submission",
      resource_id: id,
    });

    return { success: true };
  } catch (error) {
    console.error("[approveSubmissionAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Return submission
 */
export async function returnSubmissionAction(formData: {
  id: string;
  remarks: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const validation = returnSubmissionSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Remarks are required when returning" };
  }

  const { id, remarks } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Update submission status
    const { error } = await supabase
      .from("submissions")
      .update({
        status: "returned",
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString(),
        remarks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[returnSubmissionAction]", error);
      return { success: false, error: "Failed to return submission" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "returned",
      resource_type: "submission",
      resource_id: id,
    });

    return { success: true };
  } catch (error) {
    console.error("[returnSubmissionAction]", error);
    return { success: false, error: "An error occurred" };
  }
}
