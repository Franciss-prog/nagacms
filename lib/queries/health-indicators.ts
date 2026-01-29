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
