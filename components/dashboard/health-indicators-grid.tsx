"use client";

import { useEffect, useState } from "react";
import {
  bulkCreateHealthIndicatorsAction,
  getHealthIndicatorsAction,
  getHealthIndicatorStatsAction,
} from "@/lib/actions/health-indicators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Plus, Upload } from "lucide-react";

interface HealthIndicator {
  id: string;
  resident_id: string;
  indicator_type: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  notes?: string;
  recorded_at: string;
  recorded_by: string;
}

interface HealthIndicatorsGridProps {
  residentId?: string;
  barangay?: string;
  showStats?: boolean;
}

export function HealthIndicatorsGrid({
  residentId,
  barangay,
  showStats = true,
}: HealthIndicatorsGridProps) {
  const [indicators, setIndicators] = useState<HealthIndicator[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkData, setBulkData] = useState<string>("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Load indicators
  useEffect(() => {
    if (!residentId) return;

    const loadIndicators = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getHealthIndicatorsAction(residentId, {
          type: filterType || undefined,
          limit: 100,
        });

        if (result.success && result.data) {
          setIndicators(result.data);
        } else {
          setError(result.error || "Failed to load indicators");
        }

        if (showStats) {
          const statsResult = await getHealthIndicatorStatsAction(residentId);
          if (statsResult.success && statsResult.stats) {
            setStats(statsResult.stats);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();
  }, [residentId, filterType, showStats]);

  const handleBulkUpload = async () => {
    if (!residentId || !bulkData.trim()) return;

    setBulkLoading(true);
    try {
      // Parse CSV or JSON format
      const lines = bulkData.trim().split("\n");
      const indicatorsToInsert = lines
        .map((line) => {
          try {
            const [type, value, unit, status] = line
              .split(",")
              .map((s) => s.trim());
            if (!type || !value || !unit) return null;
            return {
              resident_id: residentId,
              indicator_type: type,
              value: parseFloat(value),
              unit,
              status: (status as "normal" | "warning" | "critical") || "normal",
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as any[];

      if (indicatorsToInsert.length === 0) {
        setError("No valid indicators found in bulk data");
        return;
      }

      const result = await bulkCreateHealthIndicatorsAction(indicatorsToInsert);

      if (result.success) {
        setBulkData("");
        setShowBulkUpload(false);
        // Reload indicators
        const refreshResult = await getHealthIndicatorsAction(residentId, {
          limit: 100,
        });
        if (refreshResult.success && refreshResult.data) {
          setIndicators(refreshResult.data);
        }
      } else {
        setError(result.error || "Failed to upload indicators");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBulkLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {showStats && Object.keys(stats).length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stats).map(([type, data]) => (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{type}</CardTitle>
                <CardDescription className="text-xs">
                  Latest: {data.latest?.value} {data.latest?.unit}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Average:</span>
                    <span className="font-semibold">
                      {data.average?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min:</span>
                    <span>{data.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span>{data.max}</span>
                  </div>
                  <div className="flex gap-1">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Normal: {data.statuses.normal}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Warning: {data.statuses.warning}
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      Critical: {data.statuses.critical}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-type" className="text-sm font-medium">
            Filter Type:
          </Label>
          <Input
            id="filter-type"
            placeholder="Enter indicator type..."
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-64"
          />
        </div>
        {residentId && (
          <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Health Indicators</DialogTitle>
                <DialogDescription>
                  Enter data in CSV format (type, value, unit, status):
                  <br />
                  Hypertension, 140, mmHg, warning
                  <br />
                  Diabetes, 180, mg/dL, normal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="indicator_type, value, unit, status&#10;Hypertension, 140, mmHg, warning"
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  rows={10}
                />
                <Button onClick={handleBulkUpload} disabled={bulkLoading}>
                  {bulkLoading ? "Importing..." : "Import Indicators"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Health Indicators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Health Indicators</CardTitle>
          <CardDescription>
            {indicators.length} record{indicators.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-sm text-gray-500">
              Loading indicators...
            </div>
          ) : indicators.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No health indicators found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded At</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-medium">
                        {indicator.indicator_type}
                      </TableCell>
                      <TableCell>{indicator.value}</TableCell>
                      <TableCell>{indicator.unit}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(indicator.status)}>
                          {indicator.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(indicator.recorded_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {indicator.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
