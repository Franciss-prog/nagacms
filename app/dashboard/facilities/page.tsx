"use client";

import { useState, useCallback, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { getFacilities } from "@/lib/queries/services";
import { FacilitiesGrid } from "@/components/facilities/facilities-grid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    console.log("[handleViewDetails] Called with id:", id);
    console.log("[handleViewDetails] Current facilities:", state.facilities);
    const facility = state.facilities.find((f) => f.id === id);
    console.log("[handleViewDetails] Found facility:", facility);
    if (facility) {
      console.log(
        "[handleViewDetails] Setting selectedFacility:",
        facility.name,
      );
      setState((prev) => ({
        ...prev,
        selectedFacility: facility,
      }));
    } else {
      console.warn("[handleViewDetails] Facility not found!");
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

      {/* Facility Details Modal */}
      <Dialog
        open={!!state.selectedFacility}
        onOpenChange={(open) => {
          if (!open) {
            setState((prev) => ({ ...prev, selectedFacility: null }));
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {state.selectedFacility && (
            <>
              <DialogHeader>
                <div>
                  <DialogTitle className="text-2xl">
                    {state.selectedFacility.name}
                  </DialogTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {state.selectedFacility.barangay}
                  </p>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {state.selectedFacility.address && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                      Address
                    </p>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">
                      {state.selectedFacility.address}
                    </p>
                  </div>
                )}

                {state.selectedFacility.operating_hours && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                      Operating Hours
                    </p>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">
                      {state.selectedFacility.operating_hours}
                    </p>
                  </div>
                )}

                {state.selectedFacility.contact_json &&
                  Array.isArray(state.selectedFacility.contact_json) &&
                  state.selectedFacility.contact_json.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                        Staff Contacts
                      </p>
                      <div className="mt-2 space-y-2">
                        {state.selectedFacility.contact_json.map(
                          (contact: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700"
                            >
                              <p className="font-medium text-slate-900 dark:text-white">
                                {contact.name}
                              </p>
                              {contact.role && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {contact.role}
                                </p>
                              )}
                              {contact.phone && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                  {contact.phone}
                                </p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {(state.selectedFacility.general_services ||
                  state.selectedFacility.specialized_services) && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                      Services
                    </p>
                    <div className="mt-2 space-y-1">
                      {state.selectedFacility.general_services && (
                        <p className="text-slate-700 dark:text-slate-300">
                          • {state.selectedFacility.general_services}
                        </p>
                      )}
                      {state.selectedFacility.specialized_services && (
                        <p className="text-slate-700 dark:text-slate-300">
                          • {state.selectedFacility.specialized_services}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
