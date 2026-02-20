import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markAnnouncementAsRead } from "@/lib/queries/announcements";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await markAnnouncementAsRead(id, session.user.assigned_barangay);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/announcements/:id/read]", error);
    return NextResponse.json(
      { error: "Failed to mark announcement as read" },
      { status: 500 },
    );
  }
}
