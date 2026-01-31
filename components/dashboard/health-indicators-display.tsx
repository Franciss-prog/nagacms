"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, TrendingUp, Users } from "lucide-react";
import {
  getHealthIndicatorsByBarangay,
  getBarangaysWithData,
} from "@/lib/queries/health-indicators";
import { formatDistanceToNow } from "date-fns";

interface HealthIndicatorRecord {
  id: string;
  resident_id: string;
  indicator_type: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  notes?: string;
  recorded_at: string;
}

const statusColors = {
  normal: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
};

const statusBgColors = {
  normal: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  critical: "bg-red-50 border-red-200",
};

const indicatorTypes = [
  "blood_pressure",
  "temperature",
  "glucose",
  "cholesterol",
  "heart_rate",
  "oxygen_saturation",
  "weight",
  "height",
  "bmi",
];

export function HealthIndicatorsDisplay() {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [indicators, setIndicators] = useState<HealthIndicatorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load barangays on mount
  useEffect(() => {
    const loadBarangays = async () => {
      try {
        const data = await getBarangaysWithData();
        setBarangays(data);
        if (data.length > 0) {
          setSelectedBarangay(data[0]);
        }
      } catch (err) {
        setError("Failed to load barangays");
        console.error(err);
      }
    };
    loadBarangays();
  }, []);

  // Load health indicators when barangay changes
  useEffect(() => {
    if (!selectedBarangay) return;

    const loadIndicators = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHealthIndicatorsByBarangay(selectedBarangay);
        setIndicators(data);
      } catch (err) {
        setError("Failed to load health indicators");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();
  }, [selectedBarangay]);

  // Calculate statistics
  const stats = {
    total: indicators.length,
    normal: indicators.filter((i) => i.status === "normal").length,
    warning: indicators.filter((i) => i.status === "warning").length,
    critical: indicators.filter((i) => i.status === "critical").length,
  };

  const normalPercentage =
    stats.total > 0 ? ((stats.normal / stats.total) * 100).toFixed(1) : 0;
  const warningPercentage =
    stats.total > 0 ? ((stats.warning / stats.total) * 100).toFixed(1) : 0;
  const criticalPercentage =
    stats.total > 0 ? ((stats.critical / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Health Indicators
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor health metrics across barangays
          </p>
        </div>
      </div>

      {/* Barangay Selector */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
            <SelectTrigger>
              <SelectValue placeholder="Select a barangay" />
            </SelectTrigger>
            <SelectContent>
              {barangays.map((barangay) => (
                <SelectItem key={barangay} value={barangay}>
                  {barangay}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats.total > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Indicators
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-600">records</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Normal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {stats.normal}
              </div>
              <p className="text-xs text-green-600">{normalPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">
                Warning
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                {stats.warning}
              </div>
              <p className="text-xs text-yellow-600">{warningPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">
                Critical
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {stats.critical}
              </div>
              <p className="text-xs text-red-600">{criticalPercentage}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Loading health indicators...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Health Indicators by Type */}
      {!loading && indicators.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest Readings - {selectedBarangay}</CardTitle>
              <CardDescription>
                Most recent health indicators from {selectedBarangay}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicators.slice(0, 20).map((indicator) => (
                  <div
                    key={indicator.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      statusBgColors[indicator.status]
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold capitalize">
                            {indicator.indicator_type.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDistanceToNow(
                              new Date(indicator.recorded_at),
                              { addSuffix: true },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {indicator.value}{" "}
                          <span className="text-sm text-gray-600">
                            {indicator.unit}
                          </span>
                        </p>
                      </div>
                      <Badge className={statusColors[indicator.status]}>
                        {indicator.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {indicators.length > 20 && (
                <p className="text-sm text-gray-600 mt-4">
                  Showing 20 of {indicators.length} indicators
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!loading && indicators.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                No health indicators found for {selectedBarangay}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
