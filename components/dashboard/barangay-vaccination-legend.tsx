"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COVERAGE_COLORS } from "@/lib/utils/barangay-coverage-utils";
import { Info } from "lucide-react";

interface BarangayVaccinationLegendProps {
  title?: string;
  description?: string;
  showDetail?: boolean;
}

export type { BarangayVaccinationLegendProps };

/**
 * Vaccination coverage legend component
 */
export function BarangayVaccinationLegend({
  title = "Vaccination Coverage Scale",
  description = "Color-coded representation of vaccination coverage rates across barangays",
  showDetail = true,
}: BarangayVaccinationLegendProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-green-500 rounded" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend items */}
          <div className="grid gap-3">
            {COVERAGE_COLORS.map((level) => (
              <div
                key={`${level.min}-${level.max}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Color swatch */}
                <div
                  className="w-8 h-8 rounded border-2"
                  style={{
                    backgroundColor: level.color.fill,
                    borderColor: level.color.border,
                  }}
                />

                {/* Label and range */}
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {level.color.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {level.color.range}
                  </div>
                </div>

                {/* Coverage percentage */}
                <div className="text-sm font-semibold text-gray-700">
                  {level.min}-{level.max}%
                </div>
              </div>
            ))}
          </div>

          {/* Additional information */}
          {showDetail && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Coverage Interpretation:</p>
                  <ul className="space-y-1 text-xs">
                    <li>
                      <strong>Critical (0-40%):</strong> Immediate intervention
                      needed
                    </li>
                    <li>
                      <strong>Low (40-60%):</strong> Accelerated vaccination
                      needed
                    </li>
                    <li>
                      <strong>Moderate (60-80%):</strong> Ongoing monitoring
                      required
                    </li>
                    <li>
                      <strong>Good (80-100%):</strong> Maintain current efforts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Hover interaction info */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold mb-2">Map Interaction:</p>
            <ul className="space-y-1">
              <li>
                ✓ <strong>Hover:</strong> See barangay name and vaccination
                coverage
              </li>
              <li>
                ✓ <strong>Click:</strong> View detailed statistics in side panel
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BarangayVaccinationLegend;
