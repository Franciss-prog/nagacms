"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Hook to get Supabase client instance
 * Uses browser-side client for real-time subscriptions
 */
export function useSupabaseClient() {
  const [client, setClient] = useState(supabaseInstance);

  useEffect(() => {
    if (!supabaseInstance) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey) {
        console.error("Missing Supabase environment variables");
        return;
      }

      supabaseInstance = createClient(url, anonKey);
      setClient(supabaseInstance);
    } else {
      setClient(supabaseInstance);
    }
  }, []);

  return client;
}
