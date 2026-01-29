"use server";

import { createServerSupabaseClient, getSession } from "@/lib/auth";
import { z } from "zod";

/**
 * Server Action: Create health facility
 */
export async function createFacilityAction(formData: {
  name: string;
  barangay: string;
  latitude: number;
  longitude: number;
  operating_hours?: { start: string; end: string };
  contact_json: {
    phone?: string;
    email?: string;
    address?: string;
  };
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  const schema = z.object({
    name: z.string().min(3),
    barangay: z.string().min(3),
    latitude: z.number(),
    longitude: z.number(),
    operating_hours: z
      .object({ start: z.string(), end: z.string() })
      .optional(),
    contact_json: z.object({
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
    }),
  });

  const validation = schema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { name, barangay, latitude, longitude, operating_hours, contact_json } =
    validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { data: newFacility, error: createError } = await supabase
      .from("health_facilities")
      .insert({
        name,
        barangay,
        latitude,
        longitude,
        operating_hours: operating_hours || { start: "08:00", end: "17:00" },
        contact_json,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newFacility) {
      console.error("[createFacilityAction]", createError);
      return { success: false, error: "Failed to create facility" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "created",
      resource_type: "facility",
      resource_id: newFacility.id,
    });

    return { success: true, id: newFacility.id };
  } catch (error) {
    console.error("[createFacilityAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Update health facility
 */
export async function updateFacilityAction(
  id: string,
  formData: {
    name?: string;
    barangay?: string;
    latitude?: number;
    longitude?: number;
    operating_hours?: { start: string; end: string };
    contact_json?: {
      phone?: string;
      email?: string;
      address?: string;
    };
  },
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const updateData = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("health_facilities")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("[updateFacilityAction]", error);
      return { success: false, error: "Failed to update facility" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "updated",
      resource_type: "facility",
      resource_id: id,
      changes: formData,
    });

    return { success: true };
  } catch (error) {
    console.error("[updateFacilityAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Delete health facility
 */
export async function deleteFacilityAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("health_facilities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteFacilityAction]", error);
      return { success: false, error: "Failed to delete facility" };
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      action: "deleted",
      resource_type: "facility",
      resource_id: id,
    });

    return { success: true };
  } catch (error) {
    console.error("[deleteFacilityAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Create facility schedule
 */
export async function createFacilityScheduleAction(formData: {
  facility_id: string;
  service_name: string;
  day_of_week: number;
  time_start?: string;
  time_end?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  const schema = z.object({
    facility_id: z.string().uuid(),
    service_name: z.string().min(3),
    day_of_week: z.number().min(0).max(6),
    time_start: z.string().optional(),
    time_end: z.string().optional(),
  });

  const validation = schema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const { facility_id, service_name, day_of_week, time_start, time_end } =
    validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { data: newSchedule, error: createError } = await supabase
      .from("facility_schedules")
      .insert({
        facility_id,
        service_name,
        day_of_week,
        time_start: time_start || null,
        time_end: time_end || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newSchedule) {
      console.error("[createFacilityScheduleAction]", createError);
      return { success: false, error: "Failed to create schedule" };
    }

    return { success: true, id: newSchedule.id };
  } catch (error) {
    console.error("[createFacilityScheduleAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Delete facility schedule
 */
export async function deleteFacilityScheduleAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("facility_schedules")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteFacilityScheduleAction]", error);
      return { success: false, error: "Failed to delete schedule" };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteFacilityScheduleAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Create personnel availability
 */
export async function createPersonnelAction(formData: {
  facility_id: string;
  personnel_name: string;
  personnel_role: string;
  available_days: number[];
  contact_number?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  const schema = z.object({
    facility_id: z.string().uuid(),
    personnel_name: z.string().min(3),
    personnel_role: z.string().min(3),
    available_days: z.array(z.number().min(0).max(6)),
    contact_number: z.string().optional(),
  });

  const validation = schema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Invalid request data" };
  }

  const {
    facility_id,
    personnel_name,
    personnel_role,
    available_days,
    contact_number,
  } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    const { data: newPersonnel, error: createError } = await supabase
      .from("personnel_availability")
      .insert({
        facility_id,
        personnel_name,
        personnel_role,
        available_days,
        contact_number: contact_number || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newPersonnel) {
      console.error("[createPersonnelAction]", createError);
      return { success: false, error: "Failed to create personnel record" };
    }

    return { success: true, id: newPersonnel.id };
  } catch (error) {
    console.error("[createPersonnelAction]", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Server Action: Delete personnel availability
 */
export async function deletePersonnelAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized - admin only" };
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("personnel_availability")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deletePersonnelAction]", error);
      return { success: false, error: "Failed to delete personnel" };
    }

    return { success: true };
  } catch (error) {
    console.error("[deletePersonnelAction]", error);
    return { success: false, error: "An error occurred" };
  }
}
