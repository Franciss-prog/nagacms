"use client";

import { getSession } from "@/lib/auth";
import { DataEntryPage } from "@/components/health-workers/data-entry-page";
import { useEffect, useState } from "react";

export default function HealthDataEntryPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const sess = await getSession();
      setSession(sess);
      setLoading(false);
    };

    loadSession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "workers") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center text-red-600">Unauthorized access.</p>
      </div>
    );
  }

  return <DataEntryPage barangay={session.user.assigned_barangay} />;
}
