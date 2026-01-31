import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ============================================================================
// GET: Fetch health indicators for a resident
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const residentId = searchParams.get("residentId");
    const indicatorType = searchParams.get("type");
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    if (!residentId) {
      return NextResponse.json(
        { error: "residentId query parameter required" },
        { status: 400 },
      );
    }

    let query = supabase
      .from("health_indicators")
      .select("*", { count: "exact" })
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (indicatorType) {
      query = query.eq("indicator_type", indicatorType);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching health indicators:", error);
    return NextResponse.json(
      { error: "Failed to fetch health indicators" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST: Create a single health indicator
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      resident_id,
      indicator_type,
      value,
      unit,
      status,
      notes,
      recorded_by,
    } = body;

    // Validate required fields
    if (!resident_id || !indicator_type || value === undefined || !unit) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: resident_id, indicator_type, value, unit",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("health_indicators")
      .insert([
        {
          resident_id,
          indicator_type,
          value,
          unit,
          status: status || "normal",
          notes,
          recorded_by: recorded_by || process.env.DEFAULT_USER_ID,
          recorded_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating health indicator:", error);
    return NextResponse.json(
      { error: "Failed to create health indicator" },
      { status: 500 },
    );
  }
}
