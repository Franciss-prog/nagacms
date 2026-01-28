"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getYakakApplications } from "@/lib/queries/yakap";
import { YakakTable } from "@/components/yakap/yakap-table";
import { YakakDetailDialog } from "@/components/yakap/yakap-detail-dialog";
import type { YakakApplication, Resident, User } from "@/lib/types";

interface PageState {
  applications: (YakakApplication & { resident?: Resident; approver?: User })[];
  isLoading: boolean;
  selectedStatus: string;
  selectedApplication:
    | (YakakApplication & { resident?: Resident; approver?: User })
    | null;
  isDialogOpen: boolean;
}

export default function YakakPage() {
  const [state, setState] = useState<PageState>({
    applications: [],
    isLoading: true,
    selectedStatus: "all",
    selectedApplication: null,
    isDialogOpen: false,
  });

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await getSession();
      if (!session) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const { data } = await getYakakApplications(
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
        applications: data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[fetchApplications]", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedStatus]);

  // Initial load
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = (status: string) => {
    setState((prev) => ({ ...prev, selectedStatus: status }));
  };

  const handleViewDetails = (id: string) => {
    const app = state.applications.find((a) => a.id === id);
    if (app) {
      setState((prev) => ({
        ...prev,
        selectedApplication: app,
        isDialogOpen: true,
      }));
    }
  };

  const handleCloseDialog = () => {
    setState((prev) => ({
      ...prev,
      isDialogOpen: false,
      selectedApplication: null,
    }));
  };

  const handleApprovalChange = () => {
    fetchApplications(); // Refresh list after approval/return
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          YAKAP Applications
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage health insurance membership applications
        </p>
      </div>

      <YakakTable
        applications={state.applications}
        isLoading={state.isLoading}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />

      <YakakDetailDialog
        application={state.selectedApplication}
        isOpen={state.isDialogOpen}
        onClose={handleCloseDialog}
        onApprovalChange={handleApprovalChange}
      />
    </div>
  );
}
