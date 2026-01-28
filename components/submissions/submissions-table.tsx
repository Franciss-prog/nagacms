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
import { ChevronRight, FileText } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { getStatusColor } from "@/lib/utils/status-colors";
import type { Submission, Resident, User } from "@/lib/types";

interface SubmissionsTableProps {
  submissions: (Submission & { resident?: Resident; reviewer?: User })[];
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
  onViewDetails?: (id: string) => void;
}

export function SubmissionsTable({
  submissions,
  isLoading = false,
  onStatusChange,
  onViewDetails,
}: SubmissionsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Health concerns and program inquiries
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
        {submissions.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No submissions found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const statusColor = getStatusColor(sub.status);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.resident?.full_name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          {sub.submission_type.replace("_", " ")}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {sub.program_name || "—"}
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
                          {formatDate(sub.submitted_at)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          {formatRelativeTime(sub.submitted_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails?.(sub.id)}
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
