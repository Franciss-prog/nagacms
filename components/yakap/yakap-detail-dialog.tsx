"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import { getStatusColor } from "@/lib/utils/status-colors";
import { approveYakakAction, returnYakakAction } from "@/lib/actions/yakap";
import type { YakakApplication, Resident, User } from "@/lib/types";

interface YakakDetailDialogProps {
  application:
    | (YakakApplication & { resident?: Resident; approver?: User })
    | null;
  isOpen: boolean;
  onClose: () => void;
  onApprovalChange?: () => void;
}

export function YakakDetailDialog({
  application,
  isOpen,
  onClose,
  onApprovalChange,
}: YakakDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "return" | null>(
    null,
  );

  if (!application) {
    return null;
  }

  const statusColor = getStatusColor(application.status);

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    const result = await approveYakakAction({
      id: application.id,
      remarks: remarks || undefined,
    });

    if (!result.success) {
      setError(result.error || "Failed to approve");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onApprovalChange?.();
    onClose();
  };

  const handleReturn = async () => {
    if (!remarks.trim()) {
      setError("Remarks are required when returning");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await returnYakakAction({
      id: application.id,
      remarks,
    });

    if (!result.success) {
      setError(result.error || "Failed to return");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onApprovalChange?.();
    onClose();
  };

  const isPending = application.status === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>YAKAP Application Details</DialogTitle>
          <DialogDescription>
            Review and take action on this application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className={`${statusColor.bg} ${statusColor.text}`}
                  variant="outline"
                >
                  {statusColor.label}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Membership Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="capitalize font-medium">
                  {application.membership_type.replace("_", " ")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resident Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resident Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Full Name
                </Label>
                <p className="mt-1 font-medium">
                  {application.resident?.full_name}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  PhilHealth No.
                </Label>
                <p className="mt-1 text-sm">
                  {application.philhealth_no || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Barangay
                </Label>
                <p className="mt-1 text-sm">{application.resident?.barangay}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Contact
                </Label>
                <p className="mt-1 text-sm">
                  {application.resident?.contact_number || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {formatDateTime(application.applied_at)}
                  </p>
                </div>
              </div>

              {application.approved_at && (
                <div className="flex items-start gap-3">
                  {application.status === "approved" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {application.status === "approved"
                        ? "Approved"
                        : "Returned"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatDateTime(application.approved_at)}
                    </p>
                    {application.approver && (
                      <p className="mt-1 text-xs text-slate-500">
                        By {application.approver.username} (
                        {application.approver.role})
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remarks */}
          {application.remarks && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {application.remarks}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Section (only for pending) */}
          {isPending && !actionType && (
            <div className="flex gap-2">
              <Button
                onClick={() => setActionType("approve")}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                onClick={() => setActionType("return")}
                variant="destructive"
                className="flex-1"
              >
                Return
              </Button>
            </div>
          )}

          {/* Approve Form */}
          {actionType === "approve" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Approve Application</CardTitle>
                <CardDescription>
                  Add optional remarks before approving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="approve-remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="approve-remarks"
                    placeholder="Add any remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    onClick={() => {
                      setActionType(null);
                      setRemarks("");
                      setError(null);
                    }}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Return Form */}
          {actionType === "return" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Return Application</CardTitle>
                <CardDescription>
                  Remarks are required when returning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="return-remarks">Remarks</Label>
                  <Textarea
                    id="return-remarks"
                    placeholder="Explain why this application is being returned..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={isLoading}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleReturn}
                    disabled={isLoading || !remarks.trim()}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Returning..." : "Return"}
                  </Button>
                  <Button
                    onClick={() => {
                      setActionType(null);
                      setRemarks("");
                      setError(null);
                    }}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
