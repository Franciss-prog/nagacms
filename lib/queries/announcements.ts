"use server";

import { createServerSupabaseClient } from "@/lib/auth";

export type AnnouncementStatus = "draft" | "published";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  poster_image_url?: string | null;
  status: AnnouncementStatus;
  created_by?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  target_barangays: string[];
  is_read?: boolean;
  read_at?: string | null;
}

interface CreateAnnouncementInput {
  title: string;
  content: string;
  posterImageUrl?: string | null;
  status: AnnouncementStatus;
  createdBy: string;
  targetBarangays: string[];
}

interface UpdateAnnouncementInput {
  title: string;
  content: string;
  posterImageUrl?: string | null;
  status: AnnouncementStatus;
  targetBarangays: string[];
}

function normalizeBarangays(values: string[]): string[] {
  return Array.from(
    new Set(values.map((v) => v.trim().toUpperCase()).filter(Boolean)),
  );
}

function normalizeBarangay(value: string) {
  return value.trim().toUpperCase();
}

function isMissingPosterColumnError(error: any) {
  const message = error?.message || "";
  return error?.code === "42703" || message.includes("poster_image_url");
}

async function getSupabase() {
  return createServerSupabaseClient();
}

export async function getAvailableBarangays() {
  const supabase = await getSupabase();

  const [residentsResult, usersResult, facilitiesResult, targetsResult] =
    await Promise.all([
    supabase.from("residents").select("barangay"),
    supabase.from("users").select("assigned_barangay"),
    supabase.from("health_facilities").select("barangay"),
    supabase.from("announcement_targets").select("barangay"),
  ]);

  const barangays = new Set<string>();

  (residentsResult.data || []).forEach((row: any) => {
    if (row.barangay) barangays.add(row.barangay);
  });

  (usersResult.data || []).forEach((row: any) => {
    if (row.assigned_barangay) barangays.add(row.assigned_barangay);
  });

  (facilitiesResult.data || []).forEach((row: any) => {
    if (row.barangay) barangays.add(row.barangay);
  });

  (targetsResult.data || []).forEach((row: any) => {
    if (row.barangay) barangays.add(row.barangay);
  });

  return Array.from(barangays).sort((a, b) => a.localeCompare(b));
}

export async function getAnnouncementsForAdmin() {
  const supabase = await getSupabase();

  const baseSelect = `
      id,
      title,
      content,
      status,
      created_by,
      published_at,
      created_at,
      updated_at,
      announcement_targets(barangay)
    `;

  let { data, error } = await supabase
    .from("announcements")
    .select(
      `
      id,
      title,
      content,
      poster_image_url,
      status,
      created_by,
      published_at,
      created_at,
      updated_at,
      announcement_targets(barangay)
    `,
    )
    .order("created_at", { ascending: false });

  if (error && isMissingPosterColumnError(error)) {
    const fallback = await supabase
      .from("announcements")
      .select(baseSelect)
      .order("created_at", { ascending: false });

    data = (fallback.data || []).map((row: any) => ({
      ...row,
      poster_image_url: null,
    }));
    error = fallback.error;
  }

  if (error) {
    throw error;
  }

  return (data || []).map((row: any) => ({
    ...row,
    target_barangays: (row.announcement_targets || []).map(
      (target: any) => target.barangay,
    ),
  })) as Announcement[];
}

export async function getAnnouncementsForBarangay(barangay: string) {
  const supabase = await getSupabase();
  const normalizedBarangay = normalizeBarangay(barangay);

  const { data: targetRows, error: targetError } = await supabase
    .from("announcement_targets")
    .select("announcement_id")
    .ilike("barangay", normalizedBarangay);

  if (targetError) {
    throw targetError;
  }

  const announcementIds = Array.from(
    new Set((targetRows || []).map((row: any) => row.announcement_id)),
  );

  if (announcementIds.length === 0) {
    return [] as Announcement[];
  }

  const announcementQuery = supabase
    .from("announcements")
    .select(
      `
      id,
      title,
      content,
      poster_image_url,
      status,
      created_by,
      published_at,
      created_at,
      updated_at,
      announcement_targets(barangay)
    `,
    )
    .in("id", announcementIds)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const notificationQuery = supabase
    .from("announcement_notifications")
    .select("announcement_id, is_read, read_at")
    .ilike("barangay", normalizedBarangay)
    .in("announcement_id", announcementIds);

  let [announcementRows, notificationRows] = await Promise.all([
    announcementQuery,
    notificationQuery,
  ]);

  if (announcementRows.error && isMissingPosterColumnError(announcementRows.error)) {
    const fallbackRows = await supabase
      .from("announcements")
      .select(
        `
        id,
        title,
        content,
        status,
        created_by,
        published_at,
        created_at,
        updated_at,
        announcement_targets(barangay)
      `,
      )
      .in("id", announcementIds)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    announcementRows = {
      ...fallbackRows,
      data: (fallbackRows.data || []).map((row: any) => ({
        ...row,
        poster_image_url: null,
      })),
    } as any;
  }

  if (announcementRows.error) {
    throw announcementRows.error;
  }

  if (notificationRows.error) {
    throw notificationRows.error;
  }

  const notificationMap = new Map<string, { is_read: boolean; read_at: string | null }>();
  (notificationRows.data || []).forEach((notification: any) => {
    notificationMap.set(notification.announcement_id, {
      is_read: notification.is_read,
      read_at: notification.read_at,
    });
  });

  return ((announcementRows.data || []).map((row: any) => {
    const notification = notificationMap.get(row.id);

    return {
      ...row,
      target_barangays: (row.announcement_targets || []).map(
        (target: any) => target.barangay,
      ),
      is_read: notification?.is_read ?? false,
      read_at: notification?.read_at ?? null,
    };
  }) || []) as Announcement[];
}

async function upsertAnnouncementTargets(announcementId: string, targetBarangays: string[]) {
  const supabase = await getSupabase();
  const normalizedTargets = normalizeBarangays(targetBarangays);

  await supabase.from("announcement_targets").delete().eq("announcement_id", announcementId);

  if (normalizedTargets.length === 0) {
    return;
  }

  const { error } = await supabase.from("announcement_targets").insert(
    normalizedTargets.map((barangay) => ({
      announcement_id: announcementId,
      barangay,
    })),
  );

  if (error) {
    throw error;
  }
}

async function upsertNotificationsForAnnouncement(announcementId: string) {
  const supabase = await getSupabase();

  const { data: targets, error: targetsError } = await supabase
    .from("announcement_targets")
    .select("barangay")
    .eq("announcement_id", announcementId);

  if (targetsError) {
    throw targetsError;
  }

  const targetBarangays = normalizeBarangays(
    (targets || []).map((target: any) => target.barangay),
  );

  if (targetBarangays.length === 0) {
    return;
  }

  const payload = targetBarangays.map((barangay) => ({
    announcement_id: announcementId,
    barangay,
    is_read: false,
    read_at: null,
  }));

  const { error } = await supabase
    .from("announcement_notifications")
    .upsert(payload, { onConflict: "announcement_id,barangay" });

  if (error) {
    throw error;
  }
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const supabase = await getSupabase();

  let { data, error } = await supabase
    .from("announcements")
    .insert({
      title: input.title,
      content: input.content,
      poster_image_url: input.posterImageUrl || null,
      status: input.status,
      created_by: input.createdBy,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error && isMissingPosterColumnError(error)) {
    const fallbackInsert = await supabase
      .from("announcements")
      .insert({
        title: input.title,
        content: input.content,
        status: input.status,
        created_by: input.createdBy,
        published_at:
          input.status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    data = fallbackInsert.data;
    error = fallbackInsert.error;
  }

  if (error || !data) {
    throw error;
  }

  await upsertAnnouncementTargets(data.id, input.targetBarangays);

  if (input.status === "published") {
    await upsertNotificationsForAnnouncement(data.id);
  }

  return data.id;
}

export async function updateAnnouncement(
  announcementId: string,
  input: UpdateAnnouncementInput,
) {
  const supabase = await getSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("announcements")
    .select("status")
    .eq("id", announcementId)
    .single();

  if (existingError || !existing) {
    throw existingError;
  }

  const shouldSetPublishedAt =
    input.status === "published" && existing.status !== "published";

  let { error } = await supabase
    .from("announcements")
    .update({
      title: input.title,
      content: input.content,
      poster_image_url: input.posterImageUrl || null,
      status: input.status,
      published_at: shouldSetPublishedAt ? new Date().toISOString() : undefined,
    })
    .eq("id", announcementId);

  if (error && isMissingPosterColumnError(error)) {
    const fallbackUpdate = await supabase
      .from("announcements")
      .update({
        title: input.title,
        content: input.content,
        status: input.status,
        published_at: shouldSetPublishedAt ? new Date().toISOString() : undefined,
      })
      .eq("id", announcementId);

    error = fallbackUpdate.error;
  }

  if (error) {
    throw error;
  }

  await upsertAnnouncementTargets(announcementId, input.targetBarangays);

  if (input.status === "published") {
    await upsertNotificationsForAnnouncement(announcementId);
  }
}

export async function deleteAnnouncement(announcementId: string) {
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  if (error) {
    throw error;
  }
}

export async function markAnnouncementAsRead(
  announcementId: string,
  barangay: string,
) {
  const supabase = await getSupabase();
  const normalizedBarangay = normalizeBarangay(barangay);

  const { error } = await supabase.from("announcement_notifications").upsert(
    {
      announcement_id: announcementId,
      barangay: normalizedBarangay,
      is_read: true,
      read_at: new Date().toISOString(),
    },
    { onConflict: "announcement_id,barangay" },
  );

  if (error) {
    throw error;
  }
}
