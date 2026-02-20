import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteAnnouncement, updateAnnouncement } from "@/lib/queries/announcements";

function canManageAnnouncements(role: string) {
  return role === "admin" || role === "barangay_admin" || role === "staff";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAnnouncements(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
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

    await updateAnnouncement(id, {
      title,
      content,
      posterImageUrl,
      status,
      targetBarangays,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/announcements/:id]", error);

    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : "Failed to update announcement";

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
      { error: errorMessage || "Failed to update announcement" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageAnnouncements(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await deleteAnnouncement(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/announcements/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 },
    );
  }
}
