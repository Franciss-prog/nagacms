import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createAnnouncement,
  getAnnouncementsForAdmin,
  getAnnouncementsForBarangay,
} from "@/lib/queries/announcements";

function canManageAnnouncements(role: string) {
  return role === "admin" || role === "workers";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mode = request.nextUrl.searchParams.get("mode") || "admin";

    if (mode === "worker") {
      const barangay = session.user.assigned_barangay;
      const data = await getAnnouncementsForBarangay(barangay);
      const unreadCount = data.filter((item) => !item.is_read).length;

      return NextResponse.json({ data, unreadCount });
    }

    if (!canManageAnnouncements(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await getAnnouncementsForAdmin();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/announcements]", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAnnouncements(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const title = body?.title?.trim();
    const content = body?.content?.trim();
    const posterImageUrl = body?.posterImageUrl?.trim() || null;
    const status = body?.status === "published" ? "published" : "draft";
    const targetBarangays = Array.isArray(body?.targetBarangays)
      ? body.targetBarangays
      : [];

    if (!title || !content || targetBarangays.length === 0) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, content, and at least one target barangay",
        },
        { status: 400 },
      );
    }

    const announcementId = await createAnnouncement({
      title,
      content,
      posterImageUrl,
      status,
      createdBy: session.user.id,
      targetBarangays,
    });

    return NextResponse.json({ id: announcementId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/announcements]", error);

    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : "Failed to create announcement";

    if (errorCode === "42P01" || errorMessage.includes("does not exist")) {
      return NextResponse.json(
        {
          error:
            "Announcements database tables are missing. Run migrations 003_announcements_module.sql and 004_announcements_add_poster_image.sql.",
        },
        { status: 500 },
      );
    }

    if (errorCode === "42703" || errorMessage.includes("poster_image_url")) {
      return NextResponse.json(
        {
          error:
            "Announcements poster column is missing. Run migration 004_announcements_add_poster_image.sql.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to create announcement" },
      { status: 500 },
    );
  }
}
