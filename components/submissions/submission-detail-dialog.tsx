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
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
  FileText,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import { getStatusColor } from "@/lib/utils/status-colors";
import {
  approveSubmissionAction,
  returnSubmissionAction,
} from "@/lib/actions/submissions";
import type { Submission, Resident, User } from "@/lib/types";

interface SubmissionDetailDialogProps {
  submission: (Submission & { resident?: Resident; reviewer?: User }) | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewChange?: () => void;
}

export function SubmissionDetailDialog({
  submission,
  isOpen,
  onClose,
  onReviewChange,
}: SubmissionDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "return" | null>(
    null,
  );

  if (!submission) {
    return null;
  }

  const statusColor = getStatusColor(submission.status);

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    const result = await approveSubmissionAction({
      id: submission.id,
      remarks: remarks || undefined,
    });

    if (!result.success) {
      setError(result.error || "Failed to approve");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onReviewChange?.();
    onClose();
  };

  const handleReturn = async () => {
    if (!remarks.trim()) {
      setError("Remarks are required when returning");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await returnSubmissionAction({
      id: submission.id,
      remarks,
    });

    if (!result.success) {
      setError(result.error || "Failed to return");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onReviewChange?.();
    onClose();
  };

  const isPending = submission.status === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Review and take action on this submission
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
                <CardTitle className="text-sm">Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="capitalize font-medium">
                  {submission.submission_type.replace("_", " ")}
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
                  {submission.resident?.full_name}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Barangay
                </Label>
                <p className="mt-1 text-sm">{submission.resident?.barangay}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Purok
                </Label>
                <p className="mt-1 text-sm">
                  {submission.resident?.purok || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Contact
                </Label>
                <p className="mt-1 text-sm">
                  {submission.resident?.contact_number || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {submission.description}
              </p>
            </CardContent>
          </Card>

          {/* Program */}
          {submission.program_name && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{submission.program_name}</p>
              </CardContent>
            </Card>
          )}

          {/* Document Link */}
          {submission.document_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attached Document</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => window.open(submission.document_url, "_blank")}
                >
                  <FileText className="h-4 w-4" />
                  View Document
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {formatDateTime(submission.submitted_at)}
                  </p>
                </div>
              </div>

              {submission.reviewed_at && (
                <div className="flex items-start gap-3">
                  {submission.status === "approved" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {submission.status === "approved"
                        ? "Approved"
                        : "Returned"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatDateTime(submission.reviewed_at)}
                    </p>
                    {submission.reviewer && (
                      <p className="mt-1 text-xs text-slate-500">
                        By {submission.reviewer.username} (
                        {submission.reviewer.role})
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remarks */}
          {submission.remarks && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {submission.remarks}
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
                <CardTitle className="text-base">Approve Submission</CardTitle>
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
                <CardTitle className="text-base">Return Submission</CardTitle>
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
                    placeholder="Explain why this submission is being returned..."
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
