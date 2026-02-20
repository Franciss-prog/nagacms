import { NextResponse } from "next/server";
import { createServerSupabaseClient, getSession } from "@/lib/auth";

type SummaryCard = {
  label: string;
  value: number;
};

type NamedCount = {
  name: string;
  value: number;
};

type TrendPoint = {
  month: string;
  vaccinations: number;
  maternal: number;
  senior: number;
};

type WorkerReportsPayload = {
  barangay: string;
  generatedAt: string;
  summary: SummaryCard[];
  vaccinationStatus: NamedCount[];
  serviceMix: NamedCount[];
  monthlyTrend: TrendPoint[];
};

function monthKey(dateInput?: string | null) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short" });
}

function normalizeLabel(value?: string | null) {
  if (!value) return "Unspecified";
  return value
    .replace(/_/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isMissingTableError(
  error: { code?: string; message?: string } | null,
) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.message?.includes("Could not find the table") === true
  );
}

async function fetchMaternalRecords(
  db: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
) {
  const tableNames = [
    "maternal_health_records",
    "maternal_records",
    "maternal_health",
  ];

  for (const tableName of tableNames) {
    const result = await db
      .schema("public")
      .from(tableName)
      .select("id, visit_date, record_type, status")
      .eq("recorded_by", userId);

    if (!result.error) {
      return result.data || [];
    }

    if (!isMissingTableError(result.error)) {
      throw result.error;
    }
  }

  return [];
}

async function fetchSeniorRecords(
  db: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
) {
  const tableNames = ["senior_assistance_records", "seniors_assistance"];

  for (const tableName of tableNames) {
    const result = await db
      .schema("public")
      .from(tableName)
      .select("id, visit_date, assistance_type")
      .eq("recorded_by", userId);

    if (!result.error) {
      return result.data || [];
    }

    if (!isMissingTableError(result.error)) {
      throw result.error;
    }
  }

  return [];
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "workers") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const barangay = session.user.assigned_barangay;
    const supabase = await createServerSupabaseClient();
    const db = supabase.schema("public");

    const [vaccinationsRes, maternal, senior] = await Promise.all([
      db
        .from("vaccination_records")
        .select("id, vaccine_date, status")
        .eq("administered_by", userId),
      fetchMaternalRecords(supabase, userId),
      fetchSeniorRecords(supabase, userId),
    ]);

    if (vaccinationsRes.error) throw vaccinationsRes.error;
    const vaccinations = vaccinationsRes.data || [];

    const completedVaccinations = vaccinations.filter(
      (record) => record.status === "completed",
    ).length;
    const pendingVaccinations = vaccinations.filter(
      (record) => record.status === "pending",
    ).length;
    const overdueVaccinations = vaccinations.filter(
      (record) => record.status === "overdue",
    ).length;

    const vaccinationStatus: NamedCount[] = [
      { name: "Completed", value: completedVaccinations },
      { name: "Pending", value: pendingVaccinations },
      { name: "Overdue", value: overdueVaccinations },
    ];

    const mixCounter: Record<string, number> = {
      Vaccination: vaccinations.length,
    };

    maternal.forEach((record) => {
      const key = normalizeLabel(record.record_type || "Maternal Visit");
      mixCounter[key] = (mixCounter[key] || 0) + 1;
    });

    senior.forEach((record) => {
      const key = normalizeLabel(record.assistance_type || "Senior Assistance");
      mixCounter[key] = (mixCounter[key] || 0) + 1;
    });

    const serviceMix = Object.entries(mixCounter)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const now = new Date();
    const monthKeys = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return date.toLocaleDateString("en-US", { month: "short" });
    });

    const trendMap: Record<string, TrendPoint> = {};
    monthKeys.forEach((key) => {
      trendMap[key] = {
        month: key,
        vaccinations: 0,
        maternal: 0,
        senior: 0,
      };
    });

    vaccinations.forEach((record) => {
      const key = monthKey(record.vaccine_date);
      if (trendMap[key]) trendMap[key].vaccinations += 1;
    });

    maternal.forEach((record) => {
      const key = monthKey(record.visit_date);
      if (trendMap[key]) trendMap[key].maternal += 1;
    });

    senior.forEach((record) => {
      const key = monthKey(record.visit_date);
      if (trendMap[key]) trendMap[key].senior += 1;
    });

    const summary: SummaryCard[] = [
      { label: "Vaccinations Logged", value: vaccinations.length },
      { label: "Maternal Visits", value: maternal.length },
      { label: "Senior Assistance", value: senior.length },
      {
        label: "Total Activities",
        value: vaccinations.length + maternal.length + senior.length,
      },
    ];

    const payload: WorkerReportsPayload = {
      barangay,
      generatedAt: new Date().toISOString(),
      summary,
      vaccinationStatus,
      serviceMix,
      monthlyTrend: monthKeys.map((key) => trendMap[key]),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[GET /api/dashboard-workers/reports]", error);
    return NextResponse.json(
      { error: "Failed to load worker reports dashboard" },
      { status: 500 },
    );
  }
}
