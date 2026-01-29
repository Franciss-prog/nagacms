"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import {
  approveSubmissionSchema,
  returnSubmissionSchema,
} from "@/lib/schemas/submissions";
import { z } from "zod";

/**
 * Server Action: Create submission
 */
export async function createSubmissionAction(formData: {
  resident_id: string;
  submission_type:
    | "health_concern"
    | "program_inquiry"
    | "appointment_request"
    | "other";
  program_name?: string;
  description: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const schema = z.object({
    resident_id: z.string().uuid(),
    submission_type: z.enum([
      "health_concern",
      "program_inquiry",
      "appointment_request",
      "other",
    ]),
    program_name: z.string().optional(),
    description: z.string().min(5, "Description must be at least 5 characters"),
  });

  const validation = schema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { resident_id, submission_type, program_name, description } =
    validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    // Check if resident exists
    const { data: resident, error: residentError } = await supabase
      .from("residents")
      .select("id")
      .eq("id", resident_id)
      .single();

    if (residentError || !resident) {
      return { success: false, error: "Resident not found" };
    }

    // Create new submission
    const { data: newSubmission, error: createError } = await supabase
      .from("submissions")
      .insert({
        resident_id,
        submission_type,
        program_name: program_name || null,
        description,
        status: "pending",
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newSubmission) {
      console.error("[createSubmissionAction]", createError);
      return { success: false, error: "Failed to create submission" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "created",
      resource_type: "submission",
      resource_id: newSubmission.id,
    });

    return { success: true, id: newSubmission.id };
  } catch (error) {
    console.error("[createSubmissionAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

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
