"use client";

import React, { useState } from "react";
import {
  BarangayGisMap,
  COVERAGE_METRIC_OPTIONS,
  getMetricCoverage,
  getMetricCoverageLabel,
  type BarangayVaccinationData,
  type CoverageMetricType,
} from "./barangay-gis-map";
import { fallbackBarangayHealthData } from "./fallback-barangay-health-data";
import {
  BarangayStatsPanel,
  type BarangayStatsData,
} from "./barangay-stats-panel";
import { BarangayVaccinationLegend } from "./barangay-vaccination-legend";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

interface BarangayGisMapIntegratedProps {
  data?: BarangayVaccinationData[];
  useFallbackData?: boolean;
  title?: string;
  description?: string;
  mapHeight?: string;
  showLegend?: boolean;
  showMapLegend?: boolean;
}

function getFallbackData(): BarangayVaccinationData[] {
  return fallbackBarangayHealthData.map((record) => ({ ...record }));
}

export function BarangayGisMapIntegrated({
  data,
  useFallbackData = true,
  title = "Naga City Barangay Health Coverage",
  description = "Interactive marker-based visualization of health service coverage across Naga City, Bicol barangays",
  mapHeight = "h-[600px]",
  showLegend = false,
  showMapLegend = true,
}: BarangayGisMapIntegratedProps) {
  const [selectedBarangay, setSelectedBarangay] =
    useState<BarangayStatsData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] =
    useState<CoverageMetricType>("vaccination");
  const [minimumCoverage, setMinimumCoverage] = useState("0");

  const sourceData = data || (useFallbackData ? getFallbackData() : []);
  const minCoverageValue = parseInt(minimumCoverage, 10);
  const selectedMetricLabel = getMetricCoverageLabel(selectedMetric);

  const displayData = sourceData.filter(
    (record) => getMetricCoverage(record, selectedMetric) >= minCoverageValue,
  );

  const totalCoverage = sourceData.reduce(
    (sum, record) => sum + getMetricCoverage(record, selectedMetric),
    0,
  );
  const averageCoverage =
    sourceData.length > 0
      ? Math.round((totalCoverage / sourceData.length) * 10) / 10
      : 0;
  const criticalCount = sourceData.filter(
    (record) => getMetricCoverage(record, selectedMetric) < 40,
  ).length;

  const handleBarangaySelect = (
    _barangayName: string,
    barangayData: BarangayVaccinationData,
  ) => {
    setSelectedBarangay(barangayData as BarangayStatsData);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-3">
      <Card className="border-slate-200/70 shadow-none py-2">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[230px] flex-1 max-w-[340px]">
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Category
                </span>
              </label>
              <Select
                value={selectedMetric}
                onValueChange={(value) =>
                  setSelectedMetric(value as CoverageMetricType)
                }
              >
                <SelectTrigger className="h-9 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_METRIC_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[210px] flex-1 max-w-[300px]">
              <label className="mb-1 block text-[11px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" />
                  Min Coverage
                </span>
              </label>
              <Select
                value={minimumCoverage}
                onValueChange={setMinimumCoverage}
              >
                <SelectTrigger className="h-9 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Barangays</SelectItem>
                  <SelectItem value="40">40% and above</SelectItem>
                  <SelectItem value="60">60% and above</SelectItem>
                  <SelectItem value="80">80% and above</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="h-8 bg-white text-xs">
              {selectedMetricLabel}
            </Badge>
            <Badge variant="outline" className="h-8 bg-white text-xs">
              {displayData.length}/{sourceData.length} barangays
            </Badge>
            <Badge className="h-8 text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200">
              <TrendingUp className="mr-1 h-3 w-3" />
              {averageCoverage}%
            </Badge>
            <Badge className="h-8 text-xs bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200">
              <ShieldAlert className="mr-1 h-3 w-3" />
              {criticalCount} critical
            </Badge>
          </div>
        </CardContent>
      </Card>

      <BarangayGisMap
        data={displayData}
        onBarangaySelect={handleBarangaySelect}
        metricType={selectedMetric}
        minCoverage={minCoverageValue}
        title={`${title}: ${selectedMetricLabel}`}
        description={`${description} Filtered to ${selectedMetricLabel.toLowerCase()}.`}
        height={mapHeight}
        showLegend={showMapLegend}
      />

      {showLegend && (
        <BarangayVaccinationLegend
          title={`${selectedMetricLabel} Guide`}
          description={`Understand the color coding and interaction features for ${selectedMetricLabel.toLowerCase()}.`}
          showDetail={true}
        />
      )}

      <BarangayStatsPanel
        data={selectedBarangay}
        metricType={selectedMetric}
        metricLabel={selectedMetricLabel}
        metricCoverage={
          selectedBarangay
            ? getMetricCoverage(selectedBarangay, selectedMetric)
            : undefined
        }
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}

export default BarangayGisMapIntegrated;
