"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { getStatusColor } from "@/lib/utils/status-colors";
import type { YakakApplication, Resident, User } from "@/lib/types";

interface YakakTableProps {
  applications: (YakakApplication & { resident?: Resident; approver?: User })[];
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
  onViewDetails?: (id: string) => void;
}

export function YakakTable({
  applications,
  isLoading = false,
  onStatusChange,
  onViewDetails,
}: YakakTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>YAKAP Applications</CardTitle>
          <CardDescription>
            Health insurance membership applications
          </CardDescription>
        </div>
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {applications.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No YAKAP applications found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident Name</TableHead>
                  <TableHead>Membership Type</TableHead>
                  <TableHead>PhilHealth No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const statusColor = getStatusColor(app.status);
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        {app.resident?.full_name || "Unknown"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {app.membership_type.replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {app.philhealth_no || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusColor.bg} ${statusColor.text}`}
                          variant="outline"
                        >
                          {statusColor.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-slate-600 dark:text-slate-400">
                          {formatDate(app.applied_at)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          {formatRelativeTime(app.applied_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails?.(app.id)}
                          className="gap-1"
                        >
                          View <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
