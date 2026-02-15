"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase-client";

/**
 * Hook for real-time health metrics
 */
export function useHealthMetrics(barangay: string, type?: string) {
  const supabase = useSupabaseClient();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase || !barangay) return;

    const fetchMetrics = async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        let q = supabase
          .from("health_metrics")
          .select("*")
          .eq("barangay", barangay)
          .gte("metric_date", startDate.toISOString().split("T")[0]);

        if (type) {
          q = q.eq("metric_type", type);
        }

        const { data, error: err } = await q.order("metric_date", {
          ascending: false,
        });

        if (err) throw err;
        setMetrics(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Setup real-time subscription
    const channel = supabase
      .channel(`metrics_${barangay}${type ? `_${type}` : ""}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "health_metrics",
          filter: `barangay=eq.${barangay}${type ? ` AND metric_type=eq.${type}` : ""}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMetrics((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setMetrics((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m)),
            );
          } else if (payload.eventType === "DELETE") {
            setMetrics((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, barangay, type]);

  return { metrics, loading, error };
}

/**
 * Hook for vaccination records with real-time updates
 */
export function useVaccinationRecords(residentId: string | null) {
  const supabase = useSupabaseClient();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchRecords = useCallback(async () => {
    if (!supabase || !residentId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from("vaccination_records")
        .select("*")
        .eq("resident_id", residentId)
        .order("vaccine_date", { ascending: false });

      if (err) throw err;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [supabase, residentId]);

  useEffect(() => {
    fetchRecords();

    if (!supabase || !residentId) return;

    // Setup real-time subscription
    const channel = supabase
      .channel(`vaccination_${residentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vaccination_records",
          filter: `resident_id=eq.${residentId}`,
        },
        (payload) => {
          const handler = (record: any) => {
            if (payload.eventType === "INSERT") {
              setRecords((prev) => [record, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setRecords((prev) =>
                prev.map((r) => (r.id === record.id ? record : r)),
              );
            } else if (payload.eventType === "DELETE") {
              setRecords((prev) => prev.filter((r) => r.id !== record.id));
            }
          };

          if (payload.new) handler(payload.new);
        },
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, residentId, fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

/**
 * Hook for maternal health records with real-time updates
 */
export function useMaternalHealthRecords(residentId: string | null) {
  const supabase = useSupabaseClient();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!supabase || !residentId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from("maternal_health_records")
        .select("*")
        .eq("resident_id", residentId)
        .order("visit_date", { ascending: false });

      if (err) throw err;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [supabase, residentId]);

  useEffect(() => {
    fetchRecords();

    if (!supabase || !residentId) return;

    const channel = supabase
      .channel(`maternal_${residentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "maternal_health_records",
          filter: `resident_id=eq.${residentId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRecords((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRecords((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r)),
            );
          } else if (payload.eventType === "DELETE") {
            setRecords((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, residentId, fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

/**
 * Hook for senior assistance records with real-time updates
 */
export function useSeniorAssistanceRecords(residentId: string | null) {
  const supabase = useSupabaseClient();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!supabase || !residentId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from("senior_assistance_records")
        .select("*")
        .eq("resident_id", residentId)
        .order("visit_date", { ascending: false });

      if (err) throw err;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [supabase, residentId]);

  useEffect(() => {
    fetchRecords();

    if (!supabase || !residentId) return;

    const channel = supabase
      .channel(`senior_${residentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "senior_assistance_records",
          filter: `resident_id=eq.${residentId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRecords((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRecords((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r)),
            );
          } else if (payload.eventType === "DELETE") {
            setRecords((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, residentId, fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

/**
 * Hook for connection status (WebSocket)
 */
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection to server
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/health", { method: "HEAD" });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      }
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isConnected };
}

/**
 * Hook for offline queue synchronization
 */
export function useOfflineQueueSync(userId: string) {
  const supabase = useSupabaseClient();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle",
  );
  const [error, setError] = useState<Error | null>(null);

  const sync = useCallback(async () => {
    if (!supabase) return;

    setSyncStatus("syncing");
    setError(null);

    try {
      const { data: queue, error: err } = await supabase
        .from("offline_queue")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending");

      if (err) throw err;

      for (const item of queue || []) {
        try {
          // Insert the data to the actual table
          const { error: insertErr } = await supabase
            .from(item.table_name)
            .insert([item.data]);

          if (insertErr) throw insertErr;

          // Mark as synced
          await supabase
            .from("offline_queue")
            .update({ status: "synced", synced_at: new Date().toISOString() })
            .eq("id", item.id);
        } catch (itemErr) {
          // Mark as failed
          await supabase
            .from("offline_queue")
            .update({
              status: "failed",
              error_message: String(itemErr),
            })
            .eq("id", item.id);
        }
      }

      setSyncStatus("idle");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setSyncStatus("error");
    }
  }, [supabase, userId]);

  return { sync, syncStatus, error };
}
