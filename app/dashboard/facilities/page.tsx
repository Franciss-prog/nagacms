"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getFacilities } from "@/lib/queries/facilities";
import { FacilitiesGrid } from "@/components/facilities/facilities-grid";
import { Card, CardContent } from "@/components/ui/card";
import type { HealthFacility } from "@/lib/types";

interface PageState {
  facilities: HealthFacility[];
  isLoading: boolean;
  selectedFacility: HealthFacility | null;
}

export default function FacilitiesPage() {
  const [state, setState] = useState<PageState>({
    facilities: [],
    isLoading: true,
    selectedFacility: null,
  });

  // Fetch facilities
  const fetchFacilities = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await getSession();
      if (!session) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const { data } = await getFacilities(
        session.user.assigned_barangay,
        session.user.role === "admin",
        { limit: 50 },
      );

      setState((prev) => ({
        ...prev,
        facilities: data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[fetchFacilities]", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleViewDetails = (id: string) => {
    const facility = state.facilities.find((f) => f.id === id);
    if (facility) {
      setState((prev) => ({
        ...prev,
        selectedFacility: facility,
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Health Facilities
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage barangay health centers and their schedules
        </p>
      </div>

      <FacilitiesGrid
        facilities={state.facilities}
        isLoading={state.isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Facility Details (if selected) */}
      {state.selectedFacility && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">
                  {state.selectedFacility.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {state.selectedFacility.barangay}
                </p>
              </div>

              {state.selectedFacility.contact_json?.address && (
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {state.selectedFacility.contact_json.address}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {state.selectedFacility.contact_json?.phone && (
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {state.selectedFacility.contact_json.phone}
                    </p>
                  </div>
                )}
                {state.selectedFacility.operating_hours && (
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Operating Hours
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {state.selectedFacility.operating_hours.start} -{" "}
                      {state.selectedFacility.operating_hours.end}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
