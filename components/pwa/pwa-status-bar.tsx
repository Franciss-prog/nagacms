"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Wifi, WifiOff, Download, RefreshCw } from "lucide-react";
import { useHealthWorkerRealtimeStatus } from "@/lib/hooks/useHealthWorkerRealtime";
import {
  initPWA,
  useInstallPrompt,
  useOnlineStatus,
  promptInstall,
} from "@/lib/utils/pwa-utils";
import { Button } from "@/components/ui/button";

interface PWAStatusBarProps {
  showInstallPrompt?: boolean;
  barangay?: string;
}

/**
 * PWA Status Bar Component
 * Displays online/offline status, real-time connection status, and install prompt
 */
export function PWAStatusBar({
  showInstallPrompt = true,
  barangay,
}: PWAStatusBarProps) {
  const isOnline = useOnlineStatus();
  const { isFullyConnected, error } = useHealthWorkerRealtimeStatus(barangay);
  const { showPrompt, handleInstall, dismissPrompt } = useInstallPrompt();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initPWA();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      {/* Install Prompt */}
      {showInstallPrompt && showPrompt && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-200">
          <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              Install Health Workers App
            </p>
            <p className="text-xs text-blue-700">
              Works offline and faster on your device
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Install
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismissPrompt}
            className="text-blue-600 hover:text-blue-700"
          >
            Later
          </Button>
        </div>
      )}

      {/* Connection Status */}
      <div className="px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-gray-700">Offline</span>
              </>
            )}
          </div>

          {/* Separator */}
          <span className="text-gray-300">•</span>

          {/* Real-time Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isFullyConnected && isOnline ? "bg-green-600" : "bg-yellow-600"
              }`}
            />
            <span className="text-gray-600">
              {isFullyConnected && isOnline
                ? "Real-time sync active"
                : "Queue sync pending"}
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Sync error</span>
              </div>
            </>
          )}
        </div>

        {/* Info Icon */}
        <div
          className="text-xs text-gray-500 cursor-help"
          title="Data is saved locally and will sync when online"
        >
          ℹ️
        </div>
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 flex items-center gap-2 text-sm text-yellow-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Your data entries are saved locally. They'll sync when connection is
          restored.
        </div>
      )}
    </div>
  );
}

/**
 * Simpler Offline Status Indicator for header
 * Use when you need a compact status display
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isOnline) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 bg-yellow-100 text-yellow-900 rounded text-xs font-medium">
      <WifiOff className="w-3 h-3" />
      <span>Offline Mode</span>
    </div>
  );
}

/**
 * Real-time Connection Status Indicator
 */
export function RealtimeStatusIndicator({ barangay }: { barangay?: string }) {
  const { isFullyConnected, error } = useHealthWorkerRealtimeStatus(barangay);
  const isOnline = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const status =
    isFullyConnected && isOnline ? "connected" : error ? "error" : "connecting";

  return (
    <div
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      title={
        status === "connected"
          ? "Real-time sync active"
          : status === "error"
            ? "Connection error"
            : "Connecting..."
      }
    >
      <div
        className={`w-2 h-2 rounded-full ${
          status === "connected"
            ? "bg-green-600"
            : status === "error"
              ? "bg-red-600 animate-pulse"
              : "bg-yellow-600 animate-pulse"
        }`}
      />
      <span className="text-gray-600">
        {status === "connected"
          ? "Live"
          : status === "error"
            ? "Error"
            : "Connecting"}
      </span>
    </div>
  );
}

/**
 * Install Prompt Component
 * Use this to show a custom install prompt button
 */
export function InstallPromptButton() {
  const { showPrompt, handleInstall, dismissPrompt, isInstalled } =
    useInstallPrompt();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showPrompt || isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      className="gap-2"
      title="Install app for offline access"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}
