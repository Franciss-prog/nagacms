"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  WifiOff,
  Cloud,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQueueStats, syncQueue } from "@/lib/utils/offline-queue";

interface OfflineSyncStatusProps {
  isOnline: boolean;
  userId: string;
  authToken?: string;
}

export function OfflineSyncStatus({
  isOnline,
  userId,
  authToken,
}: OfflineSyncStatusProps) {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const queueStats = await getQueueStats();
        setStats(queueStats);
      } catch (error) {
        console.error("Error loading queue stats:", error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (!authToken || isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await syncQueue(
        typeof window !== "undefined" ? window.location.origin : "",
        authToken,
      );

      setLastSyncTime(new Date());

      // Reload stats after sync
      const queueStats = await getQueueStats();
      setStats(queueStats);
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!stats) return null;

  const hasPending = stats.pending > 0 || stats.failed > 0;

  if (!isOnline) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <WifiOff className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Offline Mode</p>
              <p className="text-sm text-amber-700">
                {stats.pending} changes will sync when connected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasPending) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">All Synced</p>
              {lastSyncTime && (
                <p className="text-sm text-green-700">
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <Cloud className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Pending Sync</p>
            <p className="text-sm text-blue-700">
              {stats.pending} pending, {stats.failed} failed
            </p>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Show alert when offline data creation happens
 */
interface OfflineDataSavedProps {
  recordType: string;
  show: boolean;
  onDismiss?: () => void;
}

export function OfflineDataSaved({
  recordType,
  show,
  onDismiss,
}: OfflineDataSavedProps) {
  useEffect(() => {
    if (!show || !onDismiss) return;

    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <Card className="border-blue-200 bg-blue-50 fixed bottom-4 right-4 w-96 z-50 animate-in slide-in-from-bottom-2">
      <CardContent className="flex items-center gap-3 pt-4">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        <div>
          <p className="font-semibold text-blue-900">Saved Offline</p>
          <p className="text-sm text-blue-700">
            {recordType} will sync when you're online
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-auto text-blue-600 hover:text-blue-800"
        >
          ✕
        </button>
      </CardContent>
    </Card>
  );
}
