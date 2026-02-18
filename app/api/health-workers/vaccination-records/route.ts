import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createVaccinationRecord } from "@/lib/services/health-workers.service";
import { vaccinationRecordSchema } from "@/lib/schemas/health-workers.schema";
import { ZodError } from "zod";

/**
 * POST /api/health-workers/vaccination-records
 * Create a new vaccination record
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
    const validated = vaccinationRecordSchema.parse(body);

    // Create the record
    const record = await createVaccinationRecord({
      ...validated,
      administered_by: session.user.id,
      next_dose_date: validated.next_dose_date || null,
      vaccine_date: validated.vaccine_date,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Vaccination record creation error:", error);
    return NextResponse.json(
      { error: "Failed to create vaccination record" },
      { status: 500 },
    );
  }
}
