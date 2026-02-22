import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResidentProfileClientWrapper } from "@/components/qr-scanner/resident-profile-wrapper";
import { getResidentFullProfile } from "@/lib/services/residentService";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResidentProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const { data: profile, error } = await getResidentFullProfile(id);

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link href="/dashboard-workers/scanner">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Scanner
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>
            {error ?? "Resident not found. Please verify the QR code and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Link href="/dashboard-workers/scanner">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </Button>
      </Link>

      {/* Client wrapper provides useRouter for "Scan Another" */}
      <ResidentProfileClientWrapper profile={profile} />
    </div>
  );
}
