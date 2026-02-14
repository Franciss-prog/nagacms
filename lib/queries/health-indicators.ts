import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ============================================================================
// HEALTH INDICATORS QUERIES
// ============================================================================

export async function getHealthIndicators(residentId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("*")
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching health indicators:", error);
    return [];
  }
}

export async function getLatestHealthIndicators(residentId: string) {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("*")
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error fetching latest health indicator:", error);
    return null;
  }
}

export async function getHealthIndicatorsByType(
  residentId: string,
  indicatorType: string,
) {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("*")
      .eq("resident_id", residentId)
      .eq("indicator_type", indicatorType)
      .order("recorded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching health indicators by type:", error);
    return [];
  }
}

export async function getCriticalHealthIndicators(
  barangay: string,
  daysBack = 7,
) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);

    const { data, error } = await supabase
      .from("health_indicators")
      .select(
        `
        id,
        resident_id,
        indicator_type,
        value,
        unit,
        status,
        recorded_at,
        notes,
        residents(full_name, contact_number)
      `,
      )
      .eq("residents.barangay", barangay)
      .in("status", ["warning", "critical"])
      .gte("recorded_at", date.toISOString())
      .order("recorded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching critical health indicators:", error);
    return [];
  }
}

// ============================================================================
// VITAL SIGNS QUERIES
// ============================================================================

export async function getVitalSignsHistory(residentId: string, daysBack = 30) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);

    const { data, error } = await supabase
      .from("vital_signs_history")
      .select("*")
      .eq("resident_id", residentId)
      .gte("recorded_at", date.toISOString())
      .order("recorded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vital signs history:", error);
    return [];
  }
}

export async function getLatestVitalSigns(residentId: string) {
  try {
    const { data, error } = await supabase
      .from("vital_signs_history")
      .select("*")
      .eq("resident_id", residentId)
      .order("recorded_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error("Error fetching latest vital signs:", error);
    return null;
  }
}

// ============================================================================
// HEALTH PROGRAMS QUERIES
// ============================================================================

export async function getHealthPrograms(
  barangay: string,
  status?: "active" | "inactive" | "completed",
) {
  try {
    let query = supabase
      .from("health_programs")
      .select("*")
      .eq("barangay", barangay);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching health programs:", error);
    return [];
  }
}

export async function getHealthProgramById(programId: string) {
  try {
    const { data, error } = await supabase
      .from("health_programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching health program:", error);
    return null;
  }
}

export async function getProgramBeneficiaries(
  programId: string,
  status?: "active" | "completed" | "dropped",
) {
  try {
    let query = supabase
      .from("program_beneficiaries")
      .select(
        `
        id,
        resident_id,
        enrollment_date,
        status,
        notes,
        residents(id, full_name, barangay, contact_number)
      `,
      )
      .eq("program_id", programId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("enrollment_date", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching program beneficiaries:", error);
    return [];
  }
}

export async function getProgramStats(barangay: string) {
  try {
    const { data, error } = await supabase
      .from("health_programs")
      .select(
        `
        id,
        program_name,
        program_beneficiaries(id, status)
      `,
      )
      .eq("barangay", barangay);

    if (error) throw error;

    return (
      data?.map((program) => ({
        ...program,
        total_beneficiaries: program.program_beneficiaries?.length || 0,
        active_count:
          program.program_beneficiaries?.filter((b) => b.status === "active")
            .length || 0,
        completed_count:
          program.program_beneficiaries?.filter((b) => b.status === "completed")
            .length || 0,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching program stats:", error);
    return [];
  }
}

// ============================================================================
// VACCINATION RECORDS QUERIES
// ============================================================================

export async function getVaccinationRecords(
  residentId: string,
  status?: "completed" | "pending" | "overdue",
) {
  try {
    let query = supabase
      .from("vaccination_records")
      .select("*")
      .eq("resident_id", residentId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("vaccine_date", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vaccination records:", error);
    return [];
  }
}

export async function getVaccinationCoverage(barangay: string, year: number) {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from("vaccination_records")
      .select(
        `
        vaccine_name,
        resident_id,
        status,
        residents(barangay)
      `,
      )
      .eq("residents.barangay", barangay)
      .gte("vaccine_date", startDate)
      .lte("vaccine_date", endDate);

    if (error) throw error;

    // Group and count by vaccine
    const coverage = (data || []).reduce(
      (acc, record) => {
        const vaccine = record.vaccine_name;
        if (!acc[vaccine]) {
          acc[vaccine] = {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
          };
        }
        acc[vaccine].total++;
        if (record.status === "completed") acc[vaccine].completed++;
        if (record.status === "pending") acc[vaccine].pending++;
        if (record.status === "overdue") acc[vaccine].overdue++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return coverage;
  } catch (error) {
    console.error("Error fetching vaccination coverage:", error);
    return {};
  }
}

export async function getPendingVaccinations(barangay: string) {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("vaccination_records")
      .select(
        `
        id,
        vaccine_name,
        next_dose_date,
        resident_id,
        residents(id, full_name, contact_number)
      `,
      )
      .eq("residents.barangay", barangay)
      .eq("status", "pending")
      .lte("next_dose_date", today)
      .order("next_dose_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching pending vaccinations:", error);
    return [];
  }
}

// ============================================================================
// DISEASE CASES QUERIES
// ============================================================================

export async function getDiseaseCases(
  barangay: string,
  year: number,
  diseaseFilter?: string,
) {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    let query = supabase
      .from("disease_cases")
      .select(
        `
        id,
        disease_name,
        case_classification,
        date_reported,
        outcome,
        resident_id,
        residents(full_name, barangay)
      `,
      )
      .eq("residents.barangay", barangay)
      .gte("date_reported", startDate)
      .lte("date_reported", endDate);

    if (diseaseFilter) {
      query = query.eq("disease_name", diseaseFilter);
    }

    const { data, error } = await query.order("date_reported", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching disease cases:", error);
    return [];
  }
}

export async function getDiseaseSurveillanceReport(
  barangay: string,
  year: number,
) {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from("disease_cases")
      .select(
        `
        disease_name,
        case_classification,
        outcome,
        residents(barangay)
      `,
      )
      .eq("residents.barangay", barangay)
      .gte("date_reported", startDate)
      .lte("date_reported", endDate);

    if (error) throw error;

    // Group and count by disease and classification
    const report = (data || []).reduce(
      (acc, record) => {
        const key = `${record.disease_name}_${record.case_classification}`;
        if (!acc[key]) {
          acc[key] = {
            disease_name: record.disease_name,
            case_classification: record.case_classification,
            total: 0,
            recovered: 0,
            ongoing: 0,
            deaths: 0,
          };
        }
        acc[key].total++;
        if (record.outcome === "recovered") acc[key].recovered++;
        if (record.outcome === "ongoing") acc[key].ongoing++;
        if (record.outcome === "fatal") acc[key].deaths++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(report);
  } catch (error) {
    console.error("Error fetching disease surveillance report:", error);
    return [];
  }
}

export async function getResidentDiseaseHistory(residentId: string) {
  try {
    const { data, error } = await supabase
      .from("disease_cases")
      .select("*")
      .eq("resident_id", residentId)
      .order("date_reported", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching resident disease history:", error);
    return [];
  }
}
// ============================================================================
// HEALTH INDICATORS ANALYTICS (For Dashboard)
// ============================================================================

export async function getAllHealthIndicators(
  barangay?: string,
  indicator_type?: string,
  status?: string,
  limit = 100,
  offset = 0,
) {
  try {
    let query = supabase
      .from("health_indicators")
      .select("*", { count: "exact" })
      .order("recorded_at", { ascending: false });

    if (barangay) {
      query = query.ilike("notes", `%${barangay}%`);
    }

    if (indicator_type) {
      query = query.eq("indicator_type", indicator_type);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (error) throw error;
    return { data: data || [], count: count || 0, error: null };
  } catch (error) {
    console.error("Error fetching health indicators:", error);
    return { data: [], count: 0, error };
  }
}

// Get health indicators by barangay
export async function getHealthIndicatorsByBarangay(barangay: string) {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("*")
      .ilike("notes", `%${barangay}%`)
      .order("recorded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching barangay health indicators:", error);
    return [];
  }
}

// Get critical and warning cases
export async function getCriticalAndWarningCases() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("*")
      .in("status", ["warning", "critical"])
      .order("recorded_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching critical cases:", error);
    return [];
  }
}

// Get indicator statistics across all data
export async function getIndicatorStats() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("indicator_type, value, unit, status");

    if (error) throw error;

    // Process data to calculate stats by type
    const stats: { [key: string]: any } = {};

    data?.forEach((record: any) => {
      const type = record.indicator_type;
      if (!stats[type]) {
        stats[type] = {
          indicator_type: type,
          total_records: 0,
          values: [],
          unit: record.unit,
          normal_count: 0,
          warning_count: 0,
          critical_count: 0,
        };
      }

      stats[type].total_records++;
      stats[type].values.push(record.value);

      if (record.status === "normal") stats[type].normal_count++;
      else if (record.status === "warning") stats[type].warning_count++;
      else if (record.status === "critical") stats[type].critical_count++;
    });

    // Calculate aggregate values
    const result = Object.values(stats).map((stat: any) => ({
      ...stat,
      average_value:
        stat.values.length > 0
          ? stat.values.reduce((a: number, b: number) => a + b, 0) /
            stat.values.length
          : 0,
      min_value: stat.values.length > 0 ? Math.min(...stat.values) : 0,
      max_value: stat.values.length > 0 ? Math.max(...stat.values) : 0,
      values: undefined, // Remove raw values
    }));

    return result;
  } catch (error) {
    console.error("Error fetching indicator stats:", error);
    return [];
  }
}

// Get all unique barangays from health indicators
export async function getBarangaysWithData() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("notes")
      .not("notes", "is", null);

    if (error) throw error;

    const barangays = new Set<string>();
    data?.forEach((record: any) => {
      // Extract barangay from notes (format: "... - BARANGAY")
      const match = record.notes?.match(/([A-Z ]+)$/);
      if (match) barangays.add(match[1]);
    });

    return Array.from(barangays).sort();
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return [];
  }
}
// Get health indicator statistics
export async function getHealthIndicatorStats() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("status");

    if (error) throw error;

    const stats = {
      totalRecords: data?.length || 0,
      normalCount: data?.filter((r: any) => r.status === "normal").length || 0,
      warningCount:
        data?.filter((r: any) => r.status === "warning").length || 0,
      criticalCount:
        data?.filter((r: any) => r.status === "critical").length || 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching health indicator stats:", error);
    return {
      totalRecords: 0,
      normalCount: 0,
      warningCount: 0,
      criticalCount: 0,
    };
  }
}
// Get health indicators grouped by type for charts
export async function getIndicatorsByType() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("indicator_type");

    if (error) throw error;

    const typeCount: { [key: string]: number } = {};
    data?.forEach((record: any) => {
      typeCount[record.indicator_type] =
        (typeCount[record.indicator_type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      type: type.replace(/_/g, " ").toUpperCase(),
      count,
    }));
  } catch (error) {
    console.error("Error fetching indicators by type:", error);
    return [];
  }
}

// Get health indicators grouped by status for pie chart
export async function getIndicatorsByStatus() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("status");

    if (error) throw error;

    const statusMap: {
      [key: string]: { name: string; value: number; color: string };
    } = {
      normal: { name: "Normal", value: 0, color: "#10b981" },
      warning: { name: "Warning", value: 0, color: "#f59e0b" },
      critical: { name: "Critical", value: 0, color: "#ef4444" },
    };

    data?.forEach((record: any) => {
      if (statusMap[record.status]) {
        statusMap[record.status].value++;
      }
    });

    return Object.values(statusMap).filter((item) => item.value > 0);
  } catch (error) {
    console.error("Error fetching indicators by status:", error);
    return [];
  }
}

// Get latest health indicators by type for display
export async function getLatestIndicatorsByType() {
  try {
    const { data, error } = await supabase
      .from("health_indicators")
      .select("indicator_type, value, unit, status, recorded_at")
      .order("recorded_at", { ascending: false });

    if (error) throw error;

    // Group by indicator type and get latest value
    const latestByType: { [key: string]: any } = {};
    data?.forEach((record: any) => {
      if (!latestByType[record.indicator_type]) {
        latestByType[record.indicator_type] = record;
      }
    });

    return Object.values(latestByType).map((item) => ({
      type: item.indicator_type.replace(/_/g, " "),
      value: item.value,
      unit: item.unit,
      status: item.status,
    }));
  } catch (error) {
    console.error("Error fetching latest indicators by type:", error);
    return [];
  }
}

// ============================================================================
// DASHBOARD QUERIES
// ============================================================================

// Get vaccination coverage statistics by barangay
export async function getVaccinationCoverageByBarangay(year: number) {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from("vaccination_records")
      .select(
        `
        id,
        resident_id,
        vaccine_name,
        status,
        residents(id, barangay)
      `,
      )
      .gte("vaccine_date", startDate)
      .lte("vaccine_date", endDate);

    if (error) throw error;

    // Group and calculate coverage by barangay
    const coverage: { [key: string]: any } = {};

    data?.forEach((record: any) => {
      const barangay = record.residents?.barangay || "Unknown";
      if (!coverage[barangay]) {
        coverage[barangay] = {
          barangay,
          total: 0,
          completed: 0,
          pending: 0,
          overdue: 0,
          coverage_percentage: 0,
        };
      }
      coverage[barangay].total++;
      if (record.status === "completed") coverage[barangay].completed++;
      else if (record.status === "pending") coverage[barangay].pending++;
      else if (record.status === "overdue") coverage[barangay].overdue++;
    });

    // Calculate coverage percentage
    return Object.values(coverage).map((item: any) => ({
      ...item,
      coverage_percentage:
        item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
    }));
  } catch (error) {
    console.error("Error fetching vaccination coverage by barangay:", error);
    return [];
  }
}

// Get maternal health visits statistics
export async function getMaternalHealthStats(barangay?: string, year?: number) {
  try {
    let query = supabase.from("health_indicators").select(
      `
        id,
        resident_id,
        recorded_at,
        status,
        residents(id, full_name, barangay, sex)
      `,
    );

    // Filter by indicator types related to maternal health (pregnancy-related checks)
    query = query.or(
      "indicator_type.eq.blood_pressure,indicator_type.eq.weight,indicator_type.eq.height",
    );

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte("recorded_at", startDate).lte("recorded_at", endDate);
    }

    const { data, error } = await query.order("recorded_at", {
      ascending: false,
    });

    if (error) throw error;

    // Count unique maternal health visits
    const uniqueVisits = new Set(data?.map((r: any) => r.resident_id) || []);

    return {
      total_visits: data?.length || 0,
      unique_mothers: uniqueVisits.size,
      critical_cases:
        data?.filter((r: any) => r.status === "critical").length || 0,
      warning_cases:
        data?.filter((r: any) => r.status === "warning").length || 0,
      normal_cases: data?.filter((r: any) => r.status === "normal").length || 0,
    };
  } catch (error) {
    console.error("Error fetching maternal health stats:", error);
    return {
      total_visits: 0,
      unique_mothers: 0,
      critical_cases: 0,
      warning_cases: 0,
      normal_cases: 0,
    };
  }
}

// Get senior citizen assistance statistics
export async function getSeniorCitizenStats(barangay?: string, year?: number) {
  try {
    // Get health programs targeting senior citizens
    let programQuery = supabase
      .from("health_programs")
      .select("id, program_name, barangay, program_beneficiaries(id, status)");

    if (barangay) {
      programQuery = programQuery.eq("barangay", barangay);
    }

    const { data: programs, error: progError } = await programQuery;
    if (progError) throw progError;

    // Get health indicators for elderly population (age-related)
    let indicatorQuery = supabase.from("health_indicators").select(
      `
        id,
        resident_id,
        indicator_type,
        status,
        recorded_at,
        residents(id, birth_date, barangay)
      `,
    );

    // Include relevant indicators for senior health
    const indicatorTypes = [
      "blood_pressure",
      "heart_rate",
      "cholesterol",
      "glucose",
    ];

    if (barangay) {
      indicatorQuery = indicatorQuery.eq("residents.barangay", barangay);
    }

    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      indicatorQuery = indicatorQuery
        .gte("recorded_at", startDate)
        .lte("recorded_at", endDate);
    }

    const { data: indicators, error: indError } = await indicatorQuery;
    if (indError) throw indError;

    // Calculate statistics
    let totalBeneficiaries = 0;
    const programStatus: { [key: string]: number } = {};

    programs?.forEach((program: any) => {
      program.program_beneficiaries?.forEach((b: any) => {
        totalBeneficiaries++;
        programStatus[b.status] = (programStatus[b.status] || 0) + 1;
      });
    });

    return {
      total_seniors_assisted: totalBeneficiaries,
      active_assistance: programStatus["active"] || 0,
      completed_assistance: programStatus["completed"] || 0,
      total_health_checks: indicators?.length || 0,
      critical_cases:
        indicators?.filter((i: any) => i.status === "critical").length || 0,
      warning_cases:
        indicators?.filter((i: any) => i.status === "warning").length || 0,
    };
  } catch (error) {
    console.error("Error fetching senior citizen stats:", error);
    return {
      total_seniors_assisted: 0,
      active_assistance: 0,
      completed_assistance: 0,
      total_health_checks: 0,
      critical_cases: 0,
      warning_cases: 0,
    };
  }
}

// Get pending health interventions
export async function getPendingHealthInterventions(barangay?: string) {
  try {
    let query = supabase
      .from("health_indicators")
      .select(
        `
        id,
        resident_id,
        indicator_type,
        value,
        unit,
        status,
        recorded_at,
        residents(id, full_name, barangay, contact_number)
      `,
      )
      .in("status", ["warning", "critical"])
      .order("recorded_at", { ascending: false });

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching pending interventions:", error);
    return [];
  }
}

// Get health trends over time (last 30 days)
export async function getHealthTrendsOverTime(
  barangay?: string,
  daysBack = 30,
) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);

    let query = supabase
      .from("health_indicators")
      .select(
        `
        id,
        indicator_type,
        status,
        recorded_at,
        residents(barangay)
      `,
      )
      .gte("recorded_at", date.toISOString());

    if (barangay) {
      query = query.eq("residents.barangay", barangay);
    }

    const { data, error } = await query.order("recorded_at", {
      ascending: true,
    });

    if (error) throw error;

    // Group data by date for trend visualization
    const trends: { [key: string]: any } = {};

    data?.forEach((record: any) => {
      const dateStr = new Date(record.recorded_at).toISOString().split("T")[0];
      if (!trends[dateStr]) {
        trends[dateStr] = {
          date: dateStr,
          total: 0,
          normal: 0,
          warning: 0,
          critical: 0,
        };
      }
      trends[dateStr].total++;
      if (record.status === "normal") trends[dateStr].normal++;
      else if (record.status === "warning") trends[dateStr].warning++;
      else if (record.status === "critical") trends[dateStr].critical++;
    });

    return Object.values(trends).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } catch (error) {
    console.error("Error fetching health trends:", error);
    return [];
  }
}

// Get underserved areas analysis
export async function getUnderservedAreas() {
  try {
    const { data: barangayData, error: barangayError } = await supabase
      .from("health_programs")
      .select("barangay");

    if (barangayError) throw barangayError;

    const { data: residentsData, error: residentsError } = await supabase
      .from("residents")
      .select("barangay, id");

    if (residentsError) throw residentsError;

    // Count residents per barangay
    const residentsPerBarangay: { [key: string]: number } = {};
    residentsData?.forEach((r: any) => {
      residentsPerBarangay[r.barangay] =
        (residentsPerBarangay[r.barangay] || 0) + 1;
    });

    // Count programs per barangay
    const programsPerBarangay: { [key: string]: number } = {};
    barangayData?.forEach((p: any) => {
      programsPerBarangay[p.barangay] =
        (programsPerBarangay[p.barangay] || 0) + 1;
    });

    // Identify underserved areas (high population, few programs)
    const underserved = Object.entries(residentsPerBarangay)
      .map(([barangay, populationCount]) => ({
        barangay,
        population: populationCount,
        programs: programsPerBarangay[barangay] || 0,
        ratio: populationCount / ((programsPerBarangay[barangay] || 1) * 10),
      }))
      .filter((item) => item.ratio > 1) // Ratio > 1 indicates underserved
      .sort((a, b) => b.ratio - a.ratio);

    return underserved;
  } catch (error) {
    console.error("Error fetching underserved areas:", error);
    return [];
  }
}

// Get all barangays with their health status
export async function getBarangayHealthStatus() {
  try {
    const { data: residentsData, error: residentsError } = await supabase
      .from("residents")
      .select("barangay");

    if (residentsError) throw residentsError;

    // Get unique barangays
    const barangays = Array.from(
      new Set(residentsData?.map((r: any) => r.barangay) || []),
    );

    // Get health metrics for each barangay
    const barangayStatus = await Promise.all(
      barangays.map(async (barangay) => {
        const vaccinationStats = await getVaccinationCoverageByBarangay(
          new Date().getFullYear(),
        );
        const vaccinationData = vaccinationStats.find(
          (v: any) => v.barangay === barangay,
        );

        const interventions = await getPendingHealthInterventions(barangay);

        return {
          barangay,
          vaccination_coverage: vaccinationData?.coverage_percentage || 0,
          pending_interventions: interventions.length,
          health_status:
            interventions.length > 5
              ? "critical"
              : interventions.length > 2
                ? "warning"
                : "normal",
        };
      }),
    );

    return barangayStatus;
  } catch (error) {
    console.error("Error fetching barangay health status:", error);
    return [];
  }
}
