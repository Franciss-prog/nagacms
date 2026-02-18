"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getHealthStatus,
  calculateHealthScore,
  getCoverageColor,
  formatPercentage,
} from "@/lib/utils/barangay-coverage-utils";
import { X, TrendingUp, AlertCircle, Users, CheckCircle2 } from "lucide-react";

export interface BarangayStatsData {
  barangay: string;
  vaccination_coverage: number;
  pending_interventions: number;
  total_residents: number;
  maternal_health_visits?: number;
  senior_citizens_assisted?: number;
  last_updated?: string;
}

interface BarangayStatsPanelProps {
  data: BarangayStatsData | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: "good" | "warning" | "critical" }) {
  const styles = {
    good: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Healthy",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Needs Attention",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    critical: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Critical",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };

  const style = styles[status];
  return (
    <Badge className={`${style.bg} ${style.text} gap-1`}>
      {style.icon}
      {style.label}
    </Badge>
  );
}

/**
 * Stat row component
 */
function StatRow({
  label,
  value,
  unit = "",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        {Icon && <div className="text-gray-500">{Icon}</div>}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {value}
        {unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
      </span>
    </div>
  );
}

/**
 * Vaccination coverage progress bar
 */
function CoverageProgressBar({
  coverage,
  label = "Vaccination Coverage",
}: {
  coverage: number;
  label?: string;
}) {
  const color = getCoverageColor(coverage);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-lg font-bold" style={{ color: color.fill }}>
          {formatPercentage(coverage)}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(coverage, 100)}%`,
            backgroundColor: color.fill,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Health score meter
 */
function HealthScoreMeter({
  score,
  label = "Overall Health Score",
}: {
  score: number;
  label?: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#3B82F6";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span
          className="text-2xl font-bold"
          style={{ color: getScoreColor(score) }}
        >
          {Math.round(score)}
        </span>
      </div>
      <div className="mb-2">
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(score, 100)}%`,
              backgroundColor: getScoreColor(score),
            }}
          />
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600">
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

/**
 * Main stats panel component
 */
export function BarangayStatsPanel({
  data,
  isOpen,
  onClose,
}: BarangayStatsPanelProps) {
  if (!isOpen || !data) {
    return null;
  }

  const healthStatus = getHealthStatus(
    data.vaccination_coverage,
    data.pending_interventions,
  );
  const healthScore = calculateHealthScore(
    data.vaccination_coverage,
    data.pending_interventions,
    data.total_residents,
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {data.barangay}
            </h2>
            <StatusBadge status={healthStatus} />
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Health Score */}
          <HealthScoreMeter score={healthScore} />

          {/* Coverage Progress */}
          <CoverageProgressBar coverage={data.vaccination_coverage} />

          {/* Key Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Key Statistics
            </h3>
            <div className="space-y-0">
              <StatRow
                label="Population"
                value={data.total_residents.toLocaleString()}
                icon={<Users className="w-4 h-4" />}
              />
              <StatRow
                label="Pending Interventions"
                value={data.pending_interventions}
                icon={<AlertCircle className="w-4 h-4" />}
              />
              {data.maternal_health_visits !== undefined && (
                <StatRow
                  label="Maternal Health Visits"
                  value={data.maternal_health_visits}
                />
              )}
              {data.senior_citizens_assisted !== undefined && (
                <StatRow
                  label="Senior Citizens Assisted"
                  value={data.senior_citizens_assisted}
                />
              )}
              {data.last_updated && (
                <StatRow
                  label="Last Updated"
                  value={new Date(data.last_updated).toLocaleDateString()}
                />
              )}
            </div>
          </div>

          {/* Vaccination Breakdown */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Vaccination Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Fully Vaccinated</span>
                <span className="font-semibold text-blue-600">
                  {Math.round(
                    (data.vaccination_coverage / 100) * data.total_residents,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Awaiting Vaccination
                </span>
                <span className="font-semibold text-amber-600">
                  {Math.round(
                    ((100 - data.vaccination_coverage) / 100) *
                      data.total_residents,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${data.vaccination_coverage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View Detailed Report
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Download Statistics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BarangayStatsPanel;
