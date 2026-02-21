import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface RealtimeRecord {
  id: string;
  type: "vaccination" | "maternal_health" | "senior_assistance";
  data: any;
  timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
}

interface UseHealthWorkerRealtimeOptions {
  table: "vaccination_records" | "health_indicators" | "seniors_assistance";
  barangay?: string;
  onInsert?: (record: RealtimeRecord) => void;
  onUpdate?: (record: RealtimeRecord) => void;
  onDelete?: (record: RealtimeRecord) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Real-time subscription hook for health worker data
 * Listens to Supabase Postgres changes and triggers callbacks on INSERT/UPDATE/DELETE
 *
 * Usage:
 * ```
 * const { isConnected, data } = useHealthWorkerRealtime({
 *   table: 'vaccination_records',
 *   barangay: 'San Vicente',
 *   onInsert: (record) => console.log('New vaccination:', record),
 *   enabled: true
 * });
 * ```
 */
export function useHealthWorkerRealtime({
  table,
  barangay,
  onInsert,
  onUpdate,
  onDelete,
  onError,
  enabled = true,
}: UseHealthWorkerRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<RealtimeRecord[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const subscriptionRef = useRef<any>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    const setupSubscription = async () => {
      try {
        // Determine filter for barangay if provided
        const filter =
          barangay && table !== "health_indicators"
            ? `resident_id=eq.${barangay}`
            : undefined;

        // Create channel with unique name
        const channelName = `health-worker-${table}-${barangay || "all"}`;
        channelRef.current = supabase.channel(channelName, {
          config: {
            broadcast: { self: true },
            presence: { key: channelName },
          },
        });

        // Subscribe to database changes
        subscriptionRef.current = channelRef.current
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
              filter: filter,
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              if (!isMounted) return;

              const eventType = payload.eventType as
                | "INSERT"
                | "UPDATE"
                | "DELETE";
              const payloadNew = payload.new as { id?: string } | undefined;
              const payloadOld = payload.old as { id?: string } | undefined;
              const newRecord: RealtimeRecord = {
                id: payloadNew?.id || payloadOld?.id || "",
                type: mapTableToType(table),
                data: eventType === "DELETE" ? payload.old : payload.new,
                timestamp: new Date().toISOString(),
                eventType,
              };

              // Update local data
              setData((prev) => {
                const updated = [...prev, newRecord];
                // Keep only last 100 records to prevent memory issues
                return updated.slice(-100);
              });

              // Trigger appropriate callback
              if (eventType === "INSERT" && onInsert) {
                onInsert(newRecord);
              } else if (eventType === "UPDATE" && onUpdate) {
                onUpdate(newRecord);
              } else if (eventType === "DELETE" && onDelete) {
                onDelete(newRecord);
              }
            },
          )
          .subscribe((status: string) => {
            if (isMounted) {
              setIsConnected(status === "SUBSCRIBED");
              if (status === "CHANNEL_ERROR") {
                const err = new Error(`Channel error for ${table}`);
                setError(err);
                onError?.(err);
              }
            }
          });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (isMounted) {
          setError(error);
          onError?.(error);
        }
      }
    };

    setupSubscription();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [table, barangay, enabled, onInsert, onUpdate, onDelete, onError]);

  return {
    isConnected,
    data,
    error,
    subscribe: (callback: (record: RealtimeRecord) => void) => {
      // Allow external subscription to all changes
      return () => {
        // cleanup
      };
    },
  };
}

/**
 * Hook to monitor all real-time data across multiple tables
 * Returns aggregated connection status and error state
 */
export function useHealthWorkerRealtimeStatus(barangay?: string) {
  const [statusChecks, setStatusChecks] = useState({
    vaccinationConnected: false,
    maternalHealthConnected: false,
    seniorAssistanceConnected: false,
  });

  const [aggregateError, setAggregateError] = useState<Error | null>(null);

  const { isConnected: vaccConnected } = useHealthWorkerRealtime({
    table: "vaccination_records",
    barangay,
    onError: (err) => setAggregateError(err),
  });

  const { isConnected: maternalConnected } = useHealthWorkerRealtime({
    table: "health_indicators",
    barangay,
    onError: (err) => setAggregateError(err),
  });

  // Note: seniors_assistance table may need to be created
  // const { isConnected: seniorConnected } = useHealthWorkerRealtime({
  //   table: 'seniors_assistance',
  //   barangay,
  //   onError: (err) => setAggregateError(err),
  // });

  useEffect(() => {
    setStatusChecks({
      vaccinationConnected: vaccConnected,
      maternalHealthConnected: maternalConnected,
      seniorAssistanceConnected: false, // maternalConnected as fallback
    });
  }, [vaccConnected, maternalConnected]);

  const isFullyConnected = vaccConnected && maternalConnected;

  return {
    isFullyConnected,
    statusChecks,
    error: aggregateError,
  };
}

/**
 * Helper to map table names to record types
 */
function mapTableToType(
  table: string,
): "vaccination" | "maternal_health" | "senior_assistance" {
  switch (table) {
    case "vaccination_records":
      return "vaccination";
    case "health_indicators":
      return "maternal_health";
    case "seniors_assistance":
      return "senior_assistance";
    default:
      return "vaccination";
  }
}

/**
 * Hook for refetching health worker data when changes are detected
 * Usage:
 * ```
 * const { refetch, isRefetching } = useHealthWorkerDataRefresh({
 *   onVaccinationChange: refetchVaccinations,
 *   onMaternalHealthChange: refetchMaternalRecords,
 *   barangay: currentBarangay
 * });
 * ```
 */
export function useHealthWorkerDataRefresh({
  barangay,
  onVaccinationChange,
  onMaternalHealthChange,
  onSeniorAssistanceChange,
}: {
  barangay?: string;
  onVaccinationChange?: () => void;
  onMaternalHealthChange?: () => void;
  onSeniorAssistanceChange?: () => void;
}) {
  const [isRefetching, setIsRefetching] = useState(false);

  const { isConnected: vaccConnected } = useHealthWorkerRealtime({
    table: "vaccination_records",
    barangay,
    onInsert: () => {
      setIsRefetching(true);
      onVaccinationChange?.();
      setTimeout(() => setIsRefetching(false), 1000);
    },
    onUpdate: () => {
      setIsRefetching(true);
      onVaccinationChange?.();
      setTimeout(() => setIsRefetching(false), 1000);
    },
  });

  const { isConnected: maternalConnected } = useHealthWorkerRealtime({
    table: "health_indicators",
    barangay,
    onInsert: () => {
      setIsRefetching(true);
      onMaternalHealthChange?.();
      setTimeout(() => setIsRefetching(false), 1000);
    },
    onUpdate: () => {
      setIsRefetching(true);
      onMaternalHealthChange?.();
      setTimeout(() => setIsRefetching(false), 1000);
    },
  });

  return {
    isRefetching,
    isConnected: vaccConnected && maternalConnected,
    refetch: async () => {
      onVaccinationChange?.();
      onMaternalHealthChange?.();
      onSeniorAssistanceChange?.();
    },
  };
}
