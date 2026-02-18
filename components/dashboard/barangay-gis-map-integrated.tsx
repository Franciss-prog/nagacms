"use client";

import React, { useState } from "react";
import type { BarangayVaccinationData } from "./barangay-gis-map";
import { BarangayGisMap } from "./barangay-gis-map";
import {
  BarangayStatsPanel,
  type BarangayStatsData,
} from "./barangay-stats-panel";
import { BarangayVaccinationLegend } from "./barangay-vaccination-legend";

interface BarangayGisMapIntegratedProps {
  data?: BarangayVaccinationData[];
  useMockData?: boolean;
  title?: string;
  description?: string;
  mapHeight?: string;
  showLegend?: boolean;
  showMapLegend?: boolean;
}

/**
 * Mock vaccination data for demonstration
 * Using all 27 actual barangays from Naga City, Bicol
 */
function generateMockData(): BarangayVaccinationData[] {
  const barangays = [
    "Abella",
    "Bagumbayan Norte",
    "Bagumbayan Sur",
    "Balatas",
    "Calauag",
    "Cararayan",
    "Carolina",
    "Concepcion Pequeña",
    "Concepcion Grande",
    "Dayangdang",
    "Del Rosario",
    "Dinaga",
    "Igualdad Interior",
    "Lerma",
    "Liboton",
    "Mabolo",
    "Pangpang",
    "Panicuason",
    "Peñafrancia",
    "Sabang",
    "San Felipe",
    "San Francisco (Poblacion)",
    "San Isidro",
    "Santa Cruz",
    "Santo Niño",
    "Tabuco",
    "Triangulo",
  ];

  return barangays.map((barangay) => ({
    barangay,
    vaccination_coverage: Math.floor(Math.random() * 100),
    pending_interventions: Math.floor(Math.random() * 30),
    total_residents: Math.floor(Math.random() * 8000 + 2000),
    maternal_health_visits: Math.floor(Math.random() * 50),
    senior_citizens_assisted: Math.floor(Math.random() * 100),
    last_updated: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }));
}

/**
 * Integrated GIS Map Component with Stats Panel
 *
 * This component combines the Leaflet map, stats panel, and legend into a cohesive feature.
 * It handles state management for selected barangays and provides a complete user experience.
 *
 * Usage:
 * <BarangayGisMapIntegrated useMockData={true} />
 *
 * or with real data:
 * <BarangayGisMapIntegrated data={realVaccinationData} />
 */
export function BarangayGisMapIntegrated({
  data,
  useMockData = true,
  title = "Naga City Barangay Health Coverage",
  description = "Interactive marker-based visualization of vaccination coverage across Naga City, Bicol barangays",
  mapHeight = "h-[600px]",
  showLegend = true,
  showMapLegend = true,
}: BarangayGisMapIntegratedProps) {
  const [selectedBarangay, setSelectedBarangay] =
    useState<BarangayStatsData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Use mock data if none provided
  const displayData = data || (useMockData ? generateMockData() : []);

  const handleBarangaySelect = (
    barangayName: string,
    barangayData: BarangayVaccinationData,
  ) => {
    setSelectedBarangay(barangayData as BarangayStatsData);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Main Map Component */}
      <BarangayGisMap
        data={displayData}
        onBarangaySelect={handleBarangaySelect}
        title={title}
        description={description}
        height={mapHeight}
        showLegend={showMapLegend}
      />

      {/* Legend Component */}
      {showLegend && (
        <BarangayVaccinationLegend
          title="Vaccination Coverage Guide"
          description="Understand the color coding and interaction features of the map"
          showDetail={true}
        />
      )}

      {/* Stats Panel - slides in from right when barangay is clicked */}
      <BarangayStatsPanel
        data={selectedBarangay}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}

export default BarangayGisMapIntegrated;
