"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getSubmissions } from "@/lib/queries/submissions";
import { SubmissionsTable } from "@/components/submissions/submissions-table";
import { SubmissionDetailDialog } from "@/components/submissions/submission-detail-dialog";
import type { Submission, Resident, User } from "@/lib/types";

interface PageState {
  submissions: (Submission & { resident?: Resident; reviewer?: User })[];
  isLoading: boolean;
  selectedStatus: string;
  selectedSubmission:
    | (Submission & { resident?: Resident; reviewer?: User })
    | null;
  isDialogOpen: boolean;
}

export default function SubmissionsPage() {
  const [state, setState] = useState<PageState>({
    submissions: [],
    isLoading: true,
    selectedStatus: "all",
    selectedSubmission: null,
    isDialogOpen: false,
  });

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await getSession();
      if (!session) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const { data } = await getSubmissions(
        session.user.assigned_barangay,
        session.user.role === "admin",
        {
          status:
            state.selectedStatus === "all"
              ? undefined
              : (state.selectedStatus as any),
          limit: 20,
        },
      );

      setState((prev) => ({
        ...prev,
        submissions: data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[fetchSubmissions]", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedStatus]);

  // Initial load
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = (status: string) => {
    setState((prev) => ({ ...prev, selectedStatus: status }));
  };

  const handleViewDetails = (id: string) => {
    const sub = state.submissions.find((s) => s.id === id);
    if (sub) {
      setState((prev) => ({
        ...prev,
        selectedSubmission: sub,
        isDialogOpen: true,
      }));
    }
  };

  const handleCloseDialog = () => {
    setState((prev) => ({
      ...prev,
      isDialogOpen: false,
      selectedSubmission: null,
    }));
  };

  const handleReviewChange = () => {
    fetchSubmissions(); // Refresh list after approval/return
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Submissions
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Review health concerns and program inquiries from residents
        </p>
      </div>

      <SubmissionsTable
        submissions={state.submissions}
        isLoading={state.isLoading}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />

      <SubmissionDetailDialog
        submission={state.selectedSubmission}
        isOpen={state.isDialogOpen}
        onClose={handleCloseDialog}
        onReviewChange={handleReviewChange}
      />
    </div>
  );
}
