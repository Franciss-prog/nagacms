import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createMedicalConsultationRecord,
  getMedicalConsultationRecords,
} from "@/lib/services/health-workers.service";
import { medicalConsultationRecordSchema } from "@/lib/schemas/health-workers.schema";
import { ZodError } from "zod";

/**
 * GET /api/health-workers/medical-consultation-records
 * Get all medical consultation records for the worker's barangay
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || session.user.role !== "workers") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get records for worker's assigned barangay
    const records = await getMedicalConsultationRecords(
      session.user.assigned_barangay,
    );

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching medical consultation records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical consultation records" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/health-workers/medical-consultation-records
 * Create a new medical consultation record
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

    // Ensure the barangay matches the worker's assigned barangay
    const dataWithBarangay = {
      ...body,
      barangay: session.user.assigned_barangay,
    };

    const validated = medicalConsultationRecordSchema.parse(dataWithBarangay);

    // Create the record
    const record = await createMedicalConsultationRecord({
      ...validated,
      recorded_by: session.user.id,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Medical consultation record creation error:", error);
    return NextResponse.json(
      { error: "Failed to create medical consultation record" },
      { status: 500 },
    );
  }
}
