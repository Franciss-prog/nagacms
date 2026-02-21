"use server";

import { getSession } from "@/lib/auth";

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
  notes?: string,
) {
  const session = await getSession();

  if (
    !session ||
    !["admin", "barangay_admin", "staff"].includes(session.user.role)
  ) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/appointments/update-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          status,
          notes,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("[updateAppointmentStatus]", error);
    return { success: false, error: "Failed to update appointment" };
  }
}

/**
 * Update YAKAP application status
 */
export async function updateYakakApplicationStatus(
  yakakId: string,
  status: string,
  remarks?: string,
) {
  const session = await getSession();

  if (!session || !["admin", "barangay_admin"].includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/yakap/update-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yakakId,
          status,
          remarks,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("[updateYakakApplicationStatus]", error);
    return { success: false, error: "Failed to update YAKAP application" };
  }
}
