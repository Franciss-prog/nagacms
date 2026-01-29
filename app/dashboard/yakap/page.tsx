"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getYakakApplications } from "@/lib/queries/yakap";
import { getResidents } from "@/lib/queries/residents";
import { YakakTable } from "@/components/yakap/yakap-table";
import { YakakDetailDialog } from "@/components/yakap/yakap-detail-dialog";
import { YakakForm, type YakakFormData } from "@/components/yakap/yakap-form";
import { createYakakAction } from "@/lib/actions/yakap";
import type { YakakApplication, Resident, User } from "@/lib/types";

interface PageState {
  applications: (YakakApplication & { resident?: Resident; approver?: User })[];
  residents: Resident[];
  isLoading: boolean;
  isLoadingResidents: boolean;
  selectedStatus: string;
  selectedApplication:
    | (YakakApplication & { resident?: Resident; approver?: User })
    | null;
  isDialogOpen: boolean;
}

export default function YakakPage() {
  const [state, setState] = useState<PageState>({
    applications: [],
    residents: [],
    isLoading: true,
    isLoadingResidents: true,
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
          limit: 50,
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

  // Fetch residents
  const fetchResidents = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingResidents: true }));

    try {
      const session = await getSession();
      if (!session) {
        setState((prev) => ({ ...prev, isLoadingResidents: false }));
        return;
      }

      const { data } = await getResidents({
        barangay: session.user.assigned_barangay,
        limit: 100,
      });

      setState((prev) => ({
        ...prev,
        residents: data,
        isLoadingResidents: false,
      }));
    } catch (error) {
      console.error("[fetchResidents]", error);
      setState((prev) => ({ ...prev, isLoadingResidents: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchApplications();
    fetchResidents();
  }, [fetchApplications, fetchResidents]);

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

  const handleFormSubmit = async (formData: YakakFormData) => {
    const result = await createYakakAction(formData);
    if (!result.success) {
      throw new Error(result.error || "Failed to submit application");
    }
    fetchApplications(); // Refresh applications list after submission
  };

  const handleFormSuccess = () => {
    fetchApplications(); // Refresh applications list after successful submission
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          YAKAP Applications (BHW Approval)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          BHW interface for reviewing, verifying, and approving YAKAP residence
          applications. Fields are aligned with PhilHealth Konsulta Registration
          requirements.
        </p>
      </div>

      {/* YAKAP Application Form */}
      <YakakForm
        residents={state.residents}
        isLoading={state.isLoadingResidents}
        onSubmit={handleFormSubmit}
        onSuccess={handleFormSuccess}
      />

      {/* YAKAP Applications Table */}
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
