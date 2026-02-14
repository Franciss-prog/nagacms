"use client";

import { useEffect } from "react";
import { initPWA } from "@/lib/utils/pwa-utils";

/**
 * PWA Initializer Component
 * Initializes PWA features when the app loads
 * This must be in a client component to access browser APIs
 */
export function PWAInitializer() {
  useEffect(() => {
    // Initialize PWA on mount
    initPWA();
  }, []);

  return null; // This component doesn't render anything
}
