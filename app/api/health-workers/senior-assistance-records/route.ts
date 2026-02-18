import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createSeniorAssistanceRecord } from "@/lib/services/health-workers.service";
import { seniorAssistanceRecordSchema } from "@/lib/schemas/health-workers.schema";
import { ZodError } from "zod";

/**
 * POST /api/health-workers/senior-assistance-records
 * Create a new senior assistance record
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
    const validated = seniorAssistanceRecordSchema.parse(body);

    // Create the record
    const record = await createSeniorAssistanceRecord({
      ...validated,
      recorded_by: session.user.id,
      visit_date: validated.visit_date,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Senior assistance record creation error:", error);
    return NextResponse.json(
      { error: "Failed to create senior assistance record" },
      { status: 500 },
    );
  }
}
