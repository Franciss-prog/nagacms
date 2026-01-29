"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/utils/format";
import type { HealthFacility } from "@/lib/types";

interface FacilitiesGridProps {
  facilities: HealthFacility[];
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
}

export function FacilitiesGrid({
  facilities,
  isLoading = false,
  onViewDetails,
}: FacilitiesGridProps) {
  if (facilities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-40 items-center justify-center text-center">
          <div>
            <MapPin className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No health facilities found.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <Card
          key={facility.id}
          className="overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Simple Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {facility.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {facility.barangay}
            </p>
          </div>

          {/* Minimal Content */}
          <CardContent className="space-y-3 py-3 px-4">
            {/* Address */}
            {facility.address && (
              <div className="flex gap-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  {facility.address}
                </span>
              </div>
            )}

            {/* Operating Hours */}
            {facility.operating_hours && (
              <div className="flex gap-2 text-sm">
                <Clock className="h-4 w-4 flex-shrink-0 text-slate-400 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  {facility.operating_hours}
                </span>
              </div>
            )}

            {/* Main Contact (First one only) */}
            {facility.contact_json &&
              Array.isArray(facility.contact_json) &&
              facility.contact_json.length > 0 && (
                <div className="flex gap-2 text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {facility.contact_json[0].name ||
                        facility.contact_json[0].role}
                    </p>
                    {facility.contact_json[0].phone && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {facility.contact_json[0].phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* YAKAP Badge Only */}
            {facility.yakap_accredited && (
              <Badge className="bg-green-600 text-white w-fit">
                ✓ YAKAP Accredited
              </Badge>
            )}
          </CardContent>
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("[FacilitiesGrid] Clicked View Details for facility:", facility.id, facility.name);
                onViewDetails?.(facility.id);
              }}
              className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface ScheduleTableProps {
  schedules: Array<{
    id: string;
    day_of_week: number;
    service_name: string;
    time_start: string;
    time_end: string;
  }>;
}

export function ScheduleTable({ schedules }: ScheduleTableProps) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-20 items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No schedules found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Service Schedules</CardTitle>
        <CardDescription>
          Available services and their schedules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {dayNames[schedule.day_of_week]}
                  </TableCell>
                  <TableCell>{schedule.service_name}</TableCell>
                  <TableCell>
                    {formatTime(schedule.time_start)} -{" "}
                    {formatTime(schedule.time_end)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
