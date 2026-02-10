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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { getStatusColor } from "@/lib/utils/status-colors";
import { updateYakakApplicationStatus } from "@/lib/actions/appointments";
import type { YakakApplication, Resident, User } from "@/lib/types";

interface YakakTableProps {
  applications: (YakakApplication & { resident?: Resident; approver?: User })[];
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
  onViewDetails?: (id: string) => void;
  isStaff?: boolean;
  onStatusUpdated?: () => void;
}

const yakakStatuses = ["pending", "approved", "returned", "rejected"];

export function YakakTable({
  applications,
  isLoading = false,
  onStatusChange,
  onViewDetails,
  isStaff = false,
  onStatusUpdated,
}: YakakTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<
    (YakakApplication & { resident?: Resident; approver?: User }) | null
  >(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateYakakApplicationStatus(
        selectedApplication.id,
        newStatus,
        remarks,
      );

      if (result.success) {
        setSelectedApplication(null);
        setNewStatus("");
        setRemarks("");
        onStatusUpdated?.();
      } else {
        alert("Failed to update application: " + result.error);
      }
    } catch (error) {
      alert("Error updating application");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
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
                    {isStaff && (
                      <TableHead className="text-right">Update</TableHead>
                    )}
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
                        {isStaff && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(app);
                                setNewStatus(app.status);
                                setRemarks(app.remarks || "");
                              }}
                            >
                              Update
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null);
            setNewStatus("");
            setRemarks("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update YAKAP Application Status</DialogTitle>
            <DialogDescription>
              Resident:{" "}
              {selectedApplication?.resident?.full_name ||
                selectedApplication?.resident_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {yakakStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Remarks (Optional)</label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks about this status change..."
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedApplication(null);
                setNewStatus("");
                setRemarks("");
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating || !newStatus}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
