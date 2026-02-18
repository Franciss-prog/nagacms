/**
 * GIS Map Data Query Functions
 * Fetches vaccination coverage data aggregated by barangay for the GIS map
 */

"use server";

import { createServerSupabaseClient } from "@/lib/auth";
import type { BarangayVaccinationData } from "@/components/dashboard/barangay-gis-map";

/**
 * Fetch vaccination coverage data for all Naga City barangays
 * Aggregates data from vaccination_records and residents tables
 *
 * @returns {Promise<BarangayVaccinationData[]>} Array of vaccination data by barangay
 */
export async function getGisMapVaccinationData(): Promise<
  BarangayVaccinationData[]
> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all residents grouped by barangay
    const { data: residentData, error: residentError } = await supabase
      .from("residents")
      .select("id, barangay");

    if (residentError) {
      console.error("Error fetching residents:", residentError);
      return [];
    }

    // Get all vaccination records
    const { data: vaccinationData, error: vaccinationError } = await supabase
      .from("vaccination_records")
      .select("id, resident_id, status, next_dose_date");

    if (vaccinationError) {
      console.error("Error fetching vaccination records:", vaccinationError);
      return [];
    }

    // Create a map of resident_id to barangay
    const residentBarangayMap = new Map(
      residentData?.map((r) => [r.id, r.barangay]) || [],
    );

    // Aggregate data by barangay
    const barangayStats = new Map<
      string,
      {
        total_residents: number;
        vaccinated: number;
        pending: number;
        overdue: number;
      }
    >();

    // Count residents per barangay
    residentData?.forEach((resident) => {
      const barangay = resident.barangay;
      if (!barangayStats.has(barangay)) {
        barangayStats.set(barangay, {
          total_residents: 0,
          vaccinated: 0,
          pending: 0,
          overdue: 0,
        });
      }
      const stats = barangayStats.get(barangay)!;
      stats.total_residents++;
    });

    // Count vaccination status per barangay
    const vaccinatedResidents = new Set<string>();
    const currentDate = new Date();

    vaccinationData?.forEach((record) => {
      const barangay = residentBarangayMap.get(record.resident_id);
      if (!barangay || !barangayStats.has(barangay)) return;

      const stats = barangayStats.get(barangay)!;

      if (record.status === "completed") {
        vaccinatedResidents.add(record.resident_id);
      } else if (record.status === "pending") {
        stats.pending++;
      } else if (
        record.status === "overdue" ||
        (record.next_dose_date && new Date(record.next_dose_date) < currentDate)
      ) {
        stats.overdue++;
      }
    });

    // Count unique vaccinated residents per barangay
    vaccinatedResidents.forEach((residentId) => {
      const barangay = residentBarangayMap.get(residentId);
      if (barangay && barangayStats.has(barangay)) {
        barangayStats.get(barangay)!.vaccinated++;
      }
    });

    // Transform to BarangayVaccinationData format
    const result: BarangayVaccinationData[] = [];

    barangayStats.forEach((stats, barangay) => {
      const vaccinationCoverage =
        stats.total_residents > 0
          ? (stats.vaccinated / stats.total_residents) * 100
          : 0;

      result.push({
        barangay,
        vaccination_coverage: Math.round(vaccinationCoverage * 10) / 10,
        pending_interventions: stats.pending + stats.overdue,
        total_residents: stats.total_residents,
        last_updated: new Date().toISOString(),
      });
    });

    // Sort by barangay name
    return result.sort((a, b) => a.barangay.localeCompare(b.barangay));
  } catch (error) {
    console.error("Exception in getGisMapVaccinationData:", error);
    return [];
  }
}

/**
 * Fetch vaccination data for a specific barangay
 *
 * @param {string} barangay - Barangay name to fetch data for
 * @returns {Promise<BarangayVaccinationData | null>} Vaccination data for the barangay
 */
export async function getGisMapBarangayData(
  barangay: string,
): Promise<BarangayVaccinationData | null> {
  try {
    const allData = await getGisMapVaccinationData();
    return allData.find((d) => d.barangay === barangay) || null;
  } catch (error) {
    console.error("Exception in getGisMapBarangayData:", error);
    return null;
  }
}
