import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createMaternalHealthRecord } from "@/lib/services/health-workers.service";
import { maternalHealthRecordSchema } from "@/lib/schemas/health-workers.schema";
import { ZodError } from "zod";

/**
 * POST /api/health-workers/maternal-health-records
 * Create a new maternal health record
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || session.user.role !== "workers") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = maternalHealthRecordSchema.parse(body);

    // Create the record
    const record = await createMaternalHealthRecord({
      ...validated,
      recorded_by: session.user.id,
      visit_date: validated.visit_date,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Maternal health record creation error:", error);
    return NextResponse.json(
      { error: "Failed to create maternal health record" },
      { status: 500 },
    );
  }
}
