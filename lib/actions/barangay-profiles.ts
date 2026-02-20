"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import { barangayProfileSchema } from "@/lib/schemas/barangay-profile";
import { formDataToRow } from "@/lib/utils/barangay-profile-mappers";
import type { BarangayProfileFormData } from "@/components/barangay-profiling/barangay-profile-form";

type ActionResult = { success: boolean; error?: string; id?: string };

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBarangayProfileAction(
  formData: BarangayProfileFormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const row = formDataToRow(formData, session.user.id);

  // Validate via Zod
  const validation = barangayProfileSchema.safeParse(row);
  if (!validation.success) {
    const msg = validation.error.issues[0]?.message ?? "Invalid data";
    return { success: false, error: msg };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("barangay_profiles")
      .insert({ ...row, created_at: new Date().toISOString() })
      .select("id")
      .single();

    if (error) {
      console.error("[createBarangayProfileAction]", error);
      return { success: false, error: error.message };
    }

    // Audit log (best-effort)
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "created",
      resource_type: "barangay_profile",
      resource_id: data.id,
    }).then(() => {});

    return { success: true, id: data.id };
  } catch (err) {
    console.error("[createBarangayProfileAction]", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBarangayProfileAction(
  id: string,
  formData: BarangayProfileFormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const row = formDataToRow(formData);

  const validation = barangayProfileSchema.safeParse(row);
  if (!validation.success) {
    const msg = validation.error.issues[0]?.message ?? "Invalid data";
    return { success: false, error: msg };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("barangay_profiles")
      .update(row)
      .eq("id", id);

    if (error) {
      console.error("[updateBarangayProfileAction]", error);
      return { success: false, error: error.message };
    }

    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "updated",
      resource_type: "barangay_profile",
      resource_id: id,
    }).then(() => {});

    return { success: true, id };
  } catch (err) {
    console.error("[updateBarangayProfileAction]", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteBarangayProfileAction(
  id: string,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("barangay_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteBarangayProfileAction]", error);
      return { success: false, error: error.message };
    }

    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "deleted",
      resource_type: "barangay_profile",
      resource_id: id,
    }).then(() => {});

    return { success: true };
  } catch (err) {
    console.error("[deleteBarangayProfileAction]", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
