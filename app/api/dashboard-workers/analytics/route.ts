import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Analytics and Health Indicators were moved to /dashboard/health-indicators.",
    },
    { status: 410 },
  );
}
