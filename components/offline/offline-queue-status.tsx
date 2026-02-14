"use client";

import { useEffect, useState } from "react";
import {
  getQueue,
  getSyncStatus,
  removeFromQueue,
  syncOfflineRecords,
} from "@/lib/utils/offline-queue";
import { syncOfflineRecords as performSync } from "@/lib/queries/health-workers";
import type { OfflineQueueItem, SyncStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  RotateCcw,
} from "lucide-react";

/**
 * Offline Queue Status Display
 * Shows pending records and allows manual syncing
 */
export function OfflineQueueStatus() {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load queue on mount
  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadQueue = () => {
    const items = getQueue();
    const status = getSyncStatus();
    setQueue(items);
    setSyncStatus(status);
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      // Perform sync
      await performSync(queue);

      // Clear queue on success
      setQueue([]);
      setSuccess("All pending records synced successfully!");

      // Refresh status
      loadQueue();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      setError(message);
    } finally {
      setSyncing(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromQueue(id);
    loadQueue();
  };

  const handleClearQueue = () => {
    if (confirm("Clear all pending records? This cannot be undone.")) {
      queue.forEach((item) => removeFromQueue(item.id));
      setQueue([]);
      setSuccess("Queue cleared");
    }
  };

  if (queue.length === 0) {
    return null; // Don't show if queue is empty
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle>Pending Records</CardTitle>
            <CardDescription>
              {queue.length} record{queue.length !== 1 ? "s" : ""} waiting to
              sync
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Queue Items */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 bg-white rounded border border-blue-100"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.type.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
                {item.lastError && (
                  <p className="text-xs text-red-600 mt-1">
                    Error: {item.lastError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2">
                {item.retryCount > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Retry {item.retryCount}
                  </span>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Summary */}
        {syncStatus && (
          <div className="p-2 bg-blue-100 rounded text-sm text-blue-900">
            <p>
              <strong>Last sync:</strong>{" "}
              {syncStatus.lastSyncTime
                ? new Date(syncStatus.lastSyncTime).toLocaleString()
                : "Never"}
            </p>
            {syncStatus.errors.length > 0 && (
              <p className="mt-1 text-red-700">
                <strong>Recent errors:</strong> {syncStatus.errors.slice(-1)[0]}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-blue-100">
          <Button
            onClick={handleSync}
            disabled={syncing || queue.length === 0}
            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {syncing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Sync Now ({queue.length})
              </>
            )}
          </Button>

          <Button
            onClick={handleClearQueue}
            variant="outline"
            disabled={syncing}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-2">
          Records sync automatically when you're online
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Inline Offline Queue Indicator
 * Compact display for headers/toolbars
 */
export function OfflineQueueBadge() {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const queue = getQueue();
      setPending(queue.length);
    };

    updateCount();
    const interval = setInterval(updateCount, 2000);
    return () => clearInterval(interval);
  }, []);

  if (pending === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
      <Clock className="w-3 h-3" />
      <span>{pending} pending</span>
    </div>
  );
}

/**
 * Detailed Sync Status Report
 */
export function SyncStatusReport() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);

  useEffect(() => {
    const status = getSyncStatus();
    const items = getQueue();
    setSyncStatus(status);
    setQueue(items);
  }, []);

  if (!syncStatus) {
    return null;
  }

  const recordsByType = queue.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Pending Count */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{syncStatus.pendingCount}</div>
          <p className="text-xs text-gray-600 mt-1">Awaiting sync</p>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                syncStatus.isSyncing
                  ? "bg-blue-600 animate-pulse"
                  : "bg-green-600"
              }`}
            />
            <span className="font-medium">
              {syncStatus.isSyncing ? "Syncing..." : "Idle"}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {syncStatus.lastSyncTime
              ? `Last: ${new Date(syncStatus.lastSyncTime).toLocaleString()}`
              : "Never synced"}
          </p>
        </CardContent>
      </Card>

      {/* Errors */}
      <Card className={syncStatus.errors.length > 0 ? "border-red-200" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {syncStatus.errors.length}
          </div>
          {syncStatus.errors.length > 0 && (
            <p className="text-xs text-red-600 mt-1 truncate">
              {syncStatus.errors[0]}
            </p>
          )}
        </CardContent>
      </Card>

      {/* By Type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">By Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(recordsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
