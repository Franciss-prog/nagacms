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
      <Card>
        <CardContent className="flex h-32 items-center justify-center text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No health facilities found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <Card key={facility.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-base">{facility.name}</CardTitle>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {facility.barangay}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-3 pb-3">
            {/* Contact Info */}
            {facility.contact_json?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{facility.contact_json.phone}</span>
              </div>
            )}

            {facility.contact_json?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span className="truncate">{facility.contact_json.email}</span>
              </div>
            )}

            {facility.contact_json?.address && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {facility.contact_json.address}
              </div>
            )}

            {/* Operating Hours */}
            {facility.operating_hours && (
              <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800">
                <Clock className="h-3 w-3 flex-shrink-0 text-slate-400" />
                <span>
                  {formatTime(facility.operating_hours.start)} -{" "}
                  {formatTime(facility.operating_hours.end)}
                </span>
              </div>
            )}
          </CardContent>

          <div className="border-t border-slate-200 px-6 py-3 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(facility.id)}
              className="w-full gap-1"
            >
              View Details <ChevronRight className="h-4 w-4" />
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
