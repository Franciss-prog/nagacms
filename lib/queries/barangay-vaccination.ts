/**
 * Example server action for fetching barangay vaccination data
 * This is a template - adapt to your actual database schema
 */

"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { BarangayVaccinationData } from "@/components/dashboard/barangay-gis-map";

/**
 * Fetch vaccination coverage data for all barangays
 *
 * This function queries the database for vaccination statistics by barangay.
 * Includes vaccination coverage percentages, pending interventions, and other health metrics.
 *
 * @returns {Promise<BarangayVaccinationData[]>} Array of vaccination data by barangay
 */
export async function getBarangayVaccinationData(): Promise<
  BarangayVaccinationData[]
> {
  try {
    const supabase = await createServerSupabaseClient();

    // Query vaccination statistics aggregated by barangay
    // This assumes you have a view or table with aggregated vaccination data
    const { data, error } = await supabase
      .from("barangay_vaccination_summary") // Replace with your actual table/view name
      .select(
        `
        barangay_name,
        vaccination_coverage_percentage,
        pending_interventions_count,
        total_residents,
        maternal_health_visits_count,
        senior_citizens_assisted_count,
        last_updated_at
      `,
      )
      .order("barangay_name", { ascending: true });

    if (error) {
      console.error("Error fetching barangay vaccination data:", error);
      return [];
    }

    // Transform database response to match component data structure
    return (
      data?.map((row) => ({
        barangay: row.barangay_name,
        vaccination_coverage: row.vaccination_coverage_percentage,
        pending_interventions: row.pending_interventions_count,
        total_residents: row.total_residents,
        maternal_health_visits: row.maternal_health_visits_count,
        senior_citizens_assisted: row.senior_citizens_assisted_count,
        last_updated: row.last_updated_at,
      })) || []
    );
  } catch (error) {
    console.error("Exception in getBarangayVaccinationData:", error);
    return []; // Return empty array on error - component will use mock data
  }
}

/**
 * Fetch vaccination data for a specific barangay
 *
 * @param {string} barangay - Barangay name to fetch data for
 * @returns {Promise<BarangayVaccinationData | null>} Vaccination data for the barangay
 */
export async function getBarangayVaccinationByName(
  barangay: string,
): Promise<BarangayVaccinationData | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("barangay_vaccination_summary")
      .select("*")
      .eq("barangay_name", barangay)
      .single();

    if (error || !data) {
      console.error(`Error fetching data for ${barangay}:`, error);
      return null;
    }

    return {
      barangay: data.barangay_name,
      vaccination_coverage: data.vaccination_coverage_percentage,
      pending_interventions: data.pending_interventions_count,
      total_residents: data.total_residents,
      maternal_health_visits: data.maternal_health_visits_count,
      senior_citizens_assisted: data.senior_citizens_assisted_count,
      last_updated: data.last_updated_at,
    };
  } catch (error) {
    console.error("Exception in getBarangayVaccinationByName:", error);
    return null;
  }
}

/**
 * Fetch vaccination coverage statistics with optional filters
 *
 * @param {Object} filters - Optional filters for the query
 * @param {number} filters.minCoverage - Minimum vaccination coverage percentage
 * @param {number} filters.maxCoverage - Maximum vaccination coverage percentage
 * @param {string} filters.healthStatus - Filter by health status (good/warning/critical)
 * @returns {Promise<BarangayVaccinationData[]>} Filtered vaccination data
 */
export async function getBarangayVaccinationWithFilters(filters?: {
  minCoverage?: number;
  maxCoverage?: number;
  healthStatus?: "good" | "warning" | "critical";
}): Promise<BarangayVaccinationData[]> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("barangay_vaccination_summary")
      .select("*")
      .order("barangay_name", { ascending: true });

    // Apply coverage filters
    if (filters?.minCoverage !== undefined) {
      query = query.gte("vaccination_coverage_percentage", filters.minCoverage);
    }
    if (filters?.maxCoverage !== undefined) {
      query = query.lte("vaccination_coverage_percentage", filters.maxCoverage);
    }

    let { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered vaccination data:", error);
      return [];
    }

    let results =
      data?.map((row) => ({
        barangay: row.barangay_name,
        vaccination_coverage: row.vaccination_coverage_percentage,
        pending_interventions: row.pending_interventions_count,
        total_residents: row.total_residents,
        maternal_health_visits: row.maternal_health_visits_count,
        senior_citizens_assisted: row.senior_citizens_assisted_count,
        last_updated: row.last_updated_at,
      })) || [];

    // Apply health status filter (client-side since it requires calculation)
    if (filters?.healthStatus) {
      const { getHealthStatus } =
        await import("@/lib/utils/barangay-coverage-utils");

      results = results.filter(
        (r) =>
          getHealthStatus(r.vaccination_coverage, r.pending_interventions) ===
          filters.healthStatus,
      );
    }

    return results;
  } catch (error) {
    console.error("Exception in getBarangayVaccinationWithFilters:", error);
    return [];
  }
}

/**
 * Get vaccination data statistics summary
 *
 * @returns {Promise<{averageCoverage: number, barangaysCount: number, lowestCoverage: number, highestCoverage: number}>}
 */
export async function getVaccinationSummaryStats() {
  try {
    const data = await getBarangayVaccinationData();

    if (data.length === 0) {
      return {
        averageCoverage: 0,
        barangaysCount: 0,
        lowestCoverage: 0,
        highestCoverage: 0,
      };
    }

    const coverages = data.map((d) => d.vaccination_coverage);
    const averageCoverage =
      coverages.reduce((a, b) => a + b, 0) / coverages.length;
    const lowestCoverage = Math.min(...coverages);
    const highestCoverage = Math.max(...coverages);

    return {
      averageCoverage: Math.round(averageCoverage * 10) / 10,
      barangaysCount: data.length,
      lowestCoverage,
      highestCoverage,
    };
  } catch (error) {
    console.error("Exception in getVaccinationSummaryStats:", error);
    return {
      averageCoverage: 0,
      barangaysCount: 0,
      lowestCoverage: 0,
      highestCoverage: 0,
    };
  }
}
