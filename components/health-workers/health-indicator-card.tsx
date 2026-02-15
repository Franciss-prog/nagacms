"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthIndicatorCardProps {
  title: string;
  value: number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendPercent?: number;
  status?: "normal" | "warning" | "critical";
  icon?: React.ReactNode;
  target?: number;
}

export function HealthIndicatorCard({
  title,
  value,
  unit,
  trend,
  trendPercent,
  status = "normal",
  icon,
  target,
}: HealthIndicatorCardProps) {
  const statusColors = {
    normal: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    critical: "bg-red-50 border-red-200",
  };

  const statusTextColors = {
    normal: "text-green-700",
    warning: "text-yellow-700",
    critical: "text-red-700",
  };

  return (
    <Card className={cn("border-2", statusColors[status])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon || <Activity className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className={cn("text-2xl font-bold", statusTextColors[status])}>
              {value.toFixed(1)}
            </div>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>

          {target && (
            <div className="text-xs text-muted-foreground">
              Target: {target} {unit}
            </div>
          )}

          {trend && trendPercent !== undefined && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 text-gray-500">→</div>
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up"
                    ? "text-red-600"
                    : trend === "down"
                      ? "text-green-600"
                      : "text-gray-600",
                )}
              >
                {trend === "up" ? "+" : ""}
                {trendPercent}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  metrics: Array<{
    title: string;
    value: number;
    unit?: string;
    status?: "normal" | "warning" | "critical";
    trend?: "up" | "down" | "stable";
    trendPercent?: number;
    target?: number;
  }>;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <HealthIndicatorCard key={index} {...metric} />
      ))}
    </div>
  );
}

interface CoverageMetricsProps {
  vaccinationCoverage: number;
  maternalHealthCoverage: number;
  seniorAssistanceCoverage: number;
}

export function CoverageMetrics({
  vaccinationCoverage,
  maternalHealthCoverage,
  seniorAssistanceCoverage,
}: CoverageMetricsProps) {
  const getStatus = (coverage: number) => {
    if (coverage >= 80) return "normal";
    if (coverage >= 60) return "warning";
    return "critical";
  };

  return (
    <MetricsGrid
      metrics={[
        {
          title: "Vaccination Coverage",
          value: vaccinationCoverage,
          unit: "%",
          target: 95,
          status: getStatus(vaccinationCoverage),
        },
        {
          title: "Maternal Health Coverage",
          value: maternalHealthCoverage,
          unit: "%",
          target: 90,
          status: getStatus(maternalHealthCoverage),
        },
        {
          title: "Senior Assistance Coverage",
          value: seniorAssistanceCoverage,
          unit: "%",
          target: 85,
          status: getStatus(seniorAssistanceCoverage),
        },
      ]}
    />
  );
}
