import { NextRequest, NextResponse } from "next/server";
import { getYakakApplications } from "@/lib/queries/yakap";

export async function GET(request: NextRequest) {
  try {
    const result = await getYakakApplications(undefined, true, {
      limit: 100,
    });

    console.log("API route result:", result);

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count,
      error: result.error,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
