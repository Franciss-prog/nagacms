"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface BarangayHealthData {
  barangay: string;
  vaccination_coverage: number;
  pending_interventions: number;
  health_status: "normal" | "warning" | "critical";
  maternal_health_visits?: number;
  senior_citizens_assisted?: number;
}

interface BarangayMapProps {
  data: BarangayHealthData[];
  onBarangaySelect?: (barangay: string) => void;
  title?: string;
  description?: string;
}

const statusConfig = {
  normal: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: "Healthy",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "Needs Attention",
  },
  critical: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    icon: <AlertCircle className="w-4 h-4" />,
    label: "Critical",
  },
};

export function BarangayMap({
  data,
  onBarangaySelect,
  title = "Barangay Health Status Map",
  description = "Interactive view of health indicators across barangays",
}: BarangayMapProps) {
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  const handleBarangayClick = (barangay: string) => {
    setSelectedBarangay(barangay);
    onBarangaySelect?.(barangay);
  };

  const getVaccinationColor = (coverage: number) => {
    if (coverage >= 80) return "from-green-400 to-green-600";
    if (coverage >= 60) return "from-blue-400 to-blue-600";
    if (coverage >= 40) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((barangay) => {
            const config = statusConfig[barangay.health_status];
            const vaccinationColor = getVaccinationColor(
              barangay.vaccination_coverage,
            );

            return (
              <div
                key={barangay.barangay}
                onClick={() => handleBarangayClick(barangay.barangay)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${config.bg} ${config.border}
                  ${
                    selectedBarangay === barangay.barangay
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }
                  hover:shadow-lg
                `}
              >
                {/* Header with barangay name and status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base truncate">
                      {barangay.barangay}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={config.text}>{config.icon}</span>
                      <span className="text-xs font-medium">
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${config.bg} ${config.text}`}>
                    {barangay.health_status.toUpperCase()}
                  </Badge>
                </div>

                {/* Vaccination Coverage */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">
                      Vaccination Coverage
                    </span>
                    <span className="text-sm font-bold">
                      {barangay.vaccination_coverage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${vaccinationColor}`}
                      style={{
                        width: `${Math.min(barangay.vaccination_coverage, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Pending Interventions:
                    </span>
                    <span className="font-semibold">
                      {barangay.pending_interventions}
                    </span>
                  </div>

                  {barangay.maternal_health_visits !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Maternal Health Visits:
                      </span>
                      <span className="font-semibold">
                        {barangay.maternal_health_visits}
                      </span>
                    </div>
                  )}

                  {barangay.senior_citizens_assisted !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Senior Citizens Assisted:
                      </span>
                      <span className="font-semibold">
                        {barangay.senior_citizens_assisted}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-semibold text-sm mb-3">
            Vaccination Coverage Scale
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-gradient-to-r from-red-400 to-red-600" />
              <span className="text-xs">0-40%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-gradient-to-r from-yellow-400 to-yellow-600" />
              <span className="text-xs">40-60%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-gradient-to-r from-blue-400 to-blue-600" />
              <span className="text-xs">60-80%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 rounded bg-gradient-to-r from-green-400 to-green-600" />
              <span className="text-xs">80-100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BarangayGridMapProps {
  data: BarangayHealthData[];
  onBarangaySelect?: (barangay: string) => void;
}

export function UnderservedAreasHighlight({
  data,
  onBarangaySelect,
}: BarangayGridMapProps) {
  const criticalBarangays = data.filter(
    (b) => b.health_status === "critical" || b.vaccination_coverage < 50,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Underserved Areas Alert</CardTitle>
        <CardDescription>
          Barangays requiring immediate health intervention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {criticalBarangays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p>All barangays are within healthy parameters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {criticalBarangays.map((barangay) => (
              <div
                key={barangay.barangay}
                onClick={() => onBarangaySelect?.(barangay.barangay)}
                className="p-4 rounded-lg border-l-4 border-red-400 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-red-900">
                      {barangay.barangay}
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      {barangay.pending_interventions} pending interventions •
                      Vaccination coverage: {barangay.vaccination_coverage}%
                    </p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
