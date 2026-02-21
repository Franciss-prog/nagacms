"use client";

import { useRouter } from "next/navigation";
import { ResidentProfile } from "./resident-profile";
import type { ResidentFullProfile } from "@/lib/types";

interface Props {
  profile: ResidentFullProfile;
}

/**
 * Thin client boundary that provides `onScanAnother` (requires router).
 * This keeps the parent page.tsx as a pure Server Component.
 */
export function ResidentProfileClientWrapper({ profile }: Props) {
  const router = useRouter();

  const handleScanAnother = () => {
    router.push("/dashboard-workers/scanner");
  };

  return <ResidentProfile profile={profile} onScanAnother={handleScanAnother} />;
}
