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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <Card
          key={facility.id}
          className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 border-slate-200 dark:border-slate-800"
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {facility.name}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {facility.barangay}
              </span>
            </div>
          </div>

          {/* Content */}
          <CardContent className="flex-1 space-y-4 py-5 px-6">
            {/* Address */}
            {facility.address && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                  Address
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {facility.address}
                  </span>
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {facility.operating_hours && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                  Hours
                </p>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {facility.operating_hours}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Info - from JSON array */}
            {facility.contact_json &&
              Array.isArray(facility.contact_json) &&
              facility.contact_json.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                    Staff Contacts
                  </p>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                    {facility.contact_json
                      .slice(0, 2)
                      .map((contact: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 pb-2 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {contact.name || contact.role}
                            </p>
                            {contact.role && contact.name && (
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {contact.role}
                              </p>
                            )}
                            {contact.phone && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                                {contact.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    {facility.contact_json.length > 2 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 font-medium">
                        +{facility.contact_json.length - 2} more contacts
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Services & YAKAP Status */}
            {(facility.general_services ||
              facility.specialized_services ||
              facility.yakap_accredited) && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                  Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {facility.yakap_accredited && (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                      ✓ YAKAP Accredited
                    </Badge>
                  )}
                  {facility.general_services && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      General
                    </Badge>
                  )}
                  {facility.specialized_services && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      Specialized
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer Button */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(facility.id)}
              className="w-full gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
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
