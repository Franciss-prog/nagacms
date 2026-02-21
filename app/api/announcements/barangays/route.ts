import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAvailableBarangays } from "@/lib/queries/announcements";

function canManageAnnouncements(role: string) {
  return role === "admin" || role === "workers";
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAnnouncements(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await getAvailableBarangays();
    const merged = new Set(data);

    if (session.user.assigned_barangay) {
      merged.add(session.user.assigned_barangay);
    }

    return NextResponse.json({ data: Array.from(merged).sort() });
  } catch (error) {
    console.error("[GET /api/announcements/barangays]", error);
    return NextResponse.json(
      { error: "Failed to fetch barangays" },
      { status: 500 },
    );
  }
}
