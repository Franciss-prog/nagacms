import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getResidentForProfiling,
  getPregnancyRecord,
} from "@/lib/queries/pregnancy-profiling";
import { PregnancyProfileForm } from "@/components/pregnancy/pregnancy-profile-form";
import { PregnancyRecordSummary } from "@/components/pregnancy/pregnancy-record-summary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  params: Promise<{ residentId: string }>;
}

export default async function PregnancyProfilePage({ params }: Props) {
  const { residentId } = await params;

  // Auth guard
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  if (!["staff", "admin", "barangay_admin"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  // Fetch data in parallel
  const [resident, record] = await Promise.all([
    getResidentForProfiling(residentId),
    getPregnancyRecord(residentId),
  ]);

  if (!resident) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/pregnancy" passHref>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Pregnancy List
          </Button>
        </Link>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold">Pregnancy Profile</h1>
        <p className="text-sm text-muted-foreground">
          {record
            ? "Update antenatal profile for this patient."
            : "Complete the form below to create a new pregnancy profile."}
        </p>
      </div>

      {/* Tabs: Form vs Summary */}
      <Tabs defaultValue={record ? "summary" : "form"} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="form">
            {record ? "Edit Profile" : "New Profile"}
          </TabsTrigger>
          <TabsTrigger value="summary" disabled={!record}>
            <FileText className="size-3.5 mr-1.5" />
            Summary
          </TabsTrigger>
        </TabsList>

        {/* Summary tab */}
        <TabsContent value="summary" className="mt-4">
          <PregnancyRecordSummary record={record} />
        </TabsContent>

        {/* Form tab */}
        <TabsContent value="form" className="mt-4">
          <PregnancyProfileForm resident={resident} existingRecord={record} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { residentId } = await params;
  const resident = await getResidentForProfiling(residentId);
  return {
    title: resident
      ? `Pregnancy Profile — ${resident.full_name}`
      : "Pregnancy Profile",
  };
}
