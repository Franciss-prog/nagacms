/**
 * PWA utilities for Health Workers app
 * Handles service worker registration, install prompts, and offline detection
 */

import React from "react";

let deferredPrompt: any = null;
let serviceWorkerReady = false;

/**
 * Initialize PWA features
 * Call this from your root layout component
 */
export async function initPWA() {
  if (typeof window === "undefined") {
    return;
  }

  // Register service worker
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      console.log("[PWA] Service Worker registered:", registration);
      serviceWorkerReady = true;

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

      // Handle service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker ready
              notifyUpdate();
            }
          });
        }
      });
    } catch (error) {
      console.error("[PWA] Service Worker registration failed:", error);
    }
  }

  // Listen for install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("[PWA] Install prompt available");
    triggerInstallPrompt();
  });

  // Listen for install event
  window.addEventListener("appinstalled", () => {
    console.log("[PWA] App installed");
    deferredPrompt = null;
  });

  // Handle online/offline state
  window.addEventListener("online", () => {
    console.log("[PWA] App is online");
    notifyOnline();
  });

  window.addEventListener("offline", () => {
    console.log("[PWA] App is offline");
    notifyOffline();
  });

  // Listen for messages from service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      const { type, data } = event.data;

      if (type === "SYNC_OFFLINE_QUEUE") {
        console.log("[PWA] Syncing offline queue from SW");
        notifySyncRequired();
      }

      if (type === "sw-activated") {
        console.log("[PWA] Service worker activated");
        serviceWorkerReady = true;
      }
    });
  }

  // Setup cache preloading
  preloadCriticalAssets();
}

/**
 * Prompt user to install app
 */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn("[PWA] Install prompt not available");
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("[PWA] User accepted install prompt");
      deferredPrompt = null;
      return true;
    } else {
      console.log("[PWA] User dismissed install prompt");
      return false;
    }
  } catch (error) {
    console.error("[PWA] Error during install prompt:", error);
    return false;
  }
}

/**
 * Check if app is installable
 */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
}

/**
 * Check if running as installed app
 */
export function isInstalledApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    (window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes("android-app://")) &&
    !isRunningInBrowser()
  );
}

/**
 * Check if running in browser
 */
export function isRunningInBrowser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: browser)").matches &&
    !window.matchMedia("(display-mode: standalone)").matches
  );
}

/**
 * Force update service worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!serviceWorkerReady) {
    console.warn("[PWA] Service Worker not ready");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log("[PWA] Service Worker updated");
    }
  } catch (error) {
    console.error("[PWA] Error updating service worker:", error);
  }
}

/**
 * Clear all caches
 */
export async function clearCaches(): Promise<void> {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("[PWA] All caches cleared");
  } catch (error) {
    console.error("[PWA] Error clearing caches:", error);
  }
}

/**
 * Preload critical assets to cache
 */
async function preloadCriticalAssets(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    return;
  }

  const criticalAssets = ["/manifest.json", "/offline.html"];

  controller.postMessage({
    type: "REQUEST_PRELOAD",
    data: { urls: criticalAssets },
  });
}

/**
 * React hook for PWA installation prompt
 */
export function useInstallPrompt() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowPrompt(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    isInstalled,
    handleInstall,
    dismissPrompt,
  };
}

/**
 * React hook for online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// Notification callbacks (can be overridden)
let onInstallAvailable: (() => void) | null = null;
let onUpdate: (() => void) | null = null;
let onOnline: (() => void) | null = null;
let onOffline: (() => void) | null = null;
let onSyncRequired: (() => void) | null = null;

export function setOnInstallAvailable(callback: () => void) {
  onInstallAvailable = callback;
}

export function setOnUpdate(callback: () => void) {
  onUpdate = callback;
}

export function setOnOnline(callback: () => void) {
  onOnline = callback;
}

export function setOnOffline(callback: () => void) {
  onOffline = callback;
}

export function setOnSyncRequired(callback: () => void) {
  onSyncRequired = callback;
}

// Internal notification functions
function triggerInstallPrompt() {
  onInstallAvailable?.();
}

function notifyUpdate() {
  console.log("[PWA] Update available");
  onUpdate?.();
}

function notifyOnline() {
  console.log("[PWA] Device online");
  onOnline?.();
}

function notifyOffline() {
  console.log("[PWA] Device offline");
  onOffline?.();
}

function notifySyncRequired() {
  console.log("[PWA] Sync required");
  onSyncRequired?.();
}
