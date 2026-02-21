import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateMedicationInventory } from "@/lib/queries/medications";

function canManage(role: string) {
  return role === "workers";
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

    if (!canManage(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    await updateMedicationInventory(
      id,
      {
        medicine_name:
          typeof body?.medicine_name === "string" ? body.medicine_name : undefined,
        category: typeof body?.category === "string" ? body.category : undefined,
        batch_number:
          typeof body?.batch_number === "string" ? body.batch_number : undefined,
        quantity: typeof body?.quantity === "number" ? body.quantity : undefined,
        expiration_date:
          typeof body?.expiration_date === "string"
            ? body.expiration_date
            : undefined,
        low_stock_threshold:
          typeof body?.low_stock_threshold === "number"
            ? body.low_stock_threshold
            : undefined,
      },
      session.user.id,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/medications/:id]", error);
    const message = error instanceof Error ? error.message : "Failed to update medication";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
