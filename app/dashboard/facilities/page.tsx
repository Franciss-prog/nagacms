"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getFacilities } from "@/lib/queries/services";
import { FacilitiesGrid } from "@/components/facilities/facilities-grid";
import { Card, CardContent } from "@/components/ui/card";

interface HealthFacility {
  id: string;
  name: string;
  barangay: string;
  address: string;
  operating_hours?: string;
  contact_json?: any;
  general_services?: string;
  specialized_services?: string;
  service_capability?: string;
  yakap_accredited?: boolean;
  created_at?: string;
  updated_at?: string;
}

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

      // Fetch all facilities (show to all users)
      const facilities = await getFacilities();

      console.log("[fetchFacilities] Retrieved facilities:", facilities);
      setState((prev) => ({
        ...prev,
        facilities: facilities as HealthFacility[],
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
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Health Facilities
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          View and manage barangay health centers
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {state.facilities.length} facilities available
        </p>
        <FacilitiesGrid
          facilities={state.facilities}
          isLoading={state.isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>

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
                      {typeof state.selectedFacility.contact_json ===
                        "object" &&
                      !Array.isArray(state.selectedFacility.contact_json)
                        ? state.selectedFacility.contact_json.phone
                        : "N/A"}
                    </p>
                  </div>
                )}
                {state.selectedFacility.operating_hours && (
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Operating Hours
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {state.selectedFacility.operating_hours}
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
