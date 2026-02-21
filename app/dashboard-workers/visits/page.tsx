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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function FieldVisitsPage() {
  const [session, setSession] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const sess = await getSession();
        setSession(sess);

        if (!supabase || !sess) return;

        console.log("Fetching visits for user ID:", sess.user.id);

        // Get all health records as "visits"
        const [vaccinationData, maternalData, seniorData] = await Promise.all([
          supabase
            .from("vaccination_records")
            .select(
              "id, resident_id, visit_date:vaccine_date, activity_type:vaccine_name, status",
            )
            .eq("administered_by", sess.user.id)
            .order("vaccine_date", { ascending: false })
            .limit(50),
          supabase
            .from("maternal_health_records")
            .select(
              "id, resident_id, visit_date, activity_type:record_type, status",
            )
            .eq("recorded_by", sess.user.id)
            .order("visit_date", { ascending: false })
            .limit(50),
          supabase
            .from("senior_assistance_records")
            .select(
              "id, resident_id, visit_date, activity_type:assistance_type, status:vital_status",
            )
            .eq("recorded_by", sess.user.id)
            .order("visit_date", { ascending: false })
            .limit(50),
        ]);

        console.log("Vaccination data:", vaccinationData);
        console.log("Maternal data:", maternalData);
        console.log("Senior data:", seniorData);

        // Combine and sort by date
        const allVisits = [
          ...(vaccinationData.data || []).map((v: any) => ({
            ...v,
            type: "Vaccination",
          })),
          ...(maternalData.data || []).map((v: any) => ({
            ...v,
            type: "Maternal Health",
          })),
          ...(seniorData.data || []).map((v: any) => ({
            ...v,
            type: "Senior Care",
          })),
        ].sort(
          (a, b) =>
            new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime(),
        );

        setVisits(allVisits);
      } catch (err) {
        console.error("Error loading visits:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (loading || !session) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading field visits...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const thisMonth = visits.filter((v) => {
    const visitDate = new Date(v.visit_date);
    const now = new Date();
    return (
      visitDate.getMonth() === now.getMonth() &&
      visitDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const thisWeek = visits.filter((v) => {
    const visitDate = new Date(v.visit_date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return visitDate >= weekAgo && visitDate <= now;
  }).length;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Field Visits Log
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track all your health promotion and monitoring activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {visits.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">recorded activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {thisWeek}
            </p>
            <p className="text-xs text-slate-500 mt-1">visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {thisMonth}
            </p>
            <p className="text-xs text-slate-500 mt-1">visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Visits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            All recorded health promotion and monitoring visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No field visits recorded yet. Start by entering health records
                in the Data Entry section.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={`${visit.type}-${visit.id}`}>
                      <TableCell className="font-medium">
                        {new Date(visit.visit_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            visit.type === "Vaccination"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                              : visit.type === "Maternal Health"
                                ? "bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-100"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                          }
                        >
                          {visit.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {visit.activity_type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            visit.status === "completed" ||
                            visit.status === "stable"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100"
                              : visit.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          }
                        >
                          {visit.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
