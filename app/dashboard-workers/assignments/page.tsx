"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase-client";
import { getSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function AssignmentsPage() {
  const [session, setSession] = useState<any>(null);
  const [assignments, setAssignments] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const sess = await getSession();
        setSession(sess);

        if (!supabase || !sess) return;

        // Fetch resident count for barangay
        const { data: residents, count: residentCount } = await supabase
          .from("residents")
          .select("id", { count: "exact" })
          .eq("barangay", sess.user.assigned_barangay);

        // Fetch vaccination records count
        const { data: vaccRecs } = await supabase
          .from("vaccination_records")
          .select("resident_id")
          .eq("administered_by", sess.user.id);

        const uniqueVaccinated = new Set(
          vaccRecs?.map((r: any) => r.resident_id) || [],
        ).size;

        // Fetch maternal health records
        const { data: maternalRecs } = await supabase
          .from("maternal_health_records")
          .select("resident_id")
          .eq("recorded_by", sess.user.id);

        // Fetch senior assistance records
        const { data: seniorRecs } = await supabase
          .from("senior_assistance_records")
          .select("resident_id")
          .eq("recorded_by", sess.user.id);

        setAssignments({
          barangay: sess.user.assigned_barangay,
          totalResidents: residentCount || 0,
          vaccinationsConducted: vaccRecs?.length || 0,
          uniqueResidentsVaccinated: uniqueVaccinated,
          maternalRecords: maternalRecs?.length || 0,
          seniorRecords: seniorRecs?.length || 0,
          recordsThisMonth:
            (vaccRecs?.length || 0) +
            (maternalRecs?.length || 0) +
            (seniorRecs?.length || 0),
        });
      } catch (err) {
        console.error("Error loading assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (loading || !session) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading assignments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignments) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 dark:text-red-200">
              Failed to load your assignments. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Assignments
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          View your assigned area and current responsibilities
        </p>
      </div>

      {/* Assignment Overview */}
      <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Assigned Barangay
            </CardTitle>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {assignments.barangay}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You are assigned to {assignments.barangay} and responsible for
            health promotion and disease prevention activities.
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Residents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Residents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {assignments.totalResidents}
                </p>
                <p className="text-xs text-slate-500">in your barangay</p>
              </div>
              <Users className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
          </CardContent>
        </Card>

        {/* Vaccinations Conducted */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {assignments.vaccinationsConducted}
                </p>
                <p className="text-xs text-slate-500">
                  {assignments.uniqueResidentsVaccinated} unique residents
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-300 dark:text-blue-700" />
            </div>
          </CardContent>
        </Card>

        {/* Maternal Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Maternal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {assignments.maternalRecords}
                </p>
                <p className="text-xs text-slate-500">visits recorded</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-300 dark:text-pink-700" />
            </div>
          </CardContent>
        </Card>

        {/* Senior Assistance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Senior Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {assignments.seniorRecords}
                </p>
                <p className="text-xs text-slate-500">seniors assisted</p>
              </div>
              <Clock className="h-8 w-8 text-amber-300 dark:text-amber-700" />
            </div>
          </CardContent>
        </Card>

        {/* Total Records This Month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Activity This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {assignments.recordsThisMonth}
                </p>
                <p className="text-xs text-slate-500">total records</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-300 dark:text-emerald-700" />
            </div>
          </CardContent>
        </Card>

        {/* Coverage Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Coverage Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {assignments.totalResidents > 0
                    ? Math.round(
                        (assignments.uniqueResidentsVaccinated /
                          assignments.totalResidents) *
                          100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-slate-500">of population</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-300 dark:text-indigo-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsibilities */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Responsibilities</CardTitle>
          <CardDescription>
            As a health worker in {assignments.barangay}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Conduct vaccinations and immunization programs
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Record all vaccination activities and track coverage rates
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Monitor maternal health and prenatal care
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Track pregnant women and ensure regular health check-ups
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Provide care and support to senior citizens
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor vital signs and assist with medication management
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Report and document all activities
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use the portal to enter health records and maintain accurate
                  data
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
