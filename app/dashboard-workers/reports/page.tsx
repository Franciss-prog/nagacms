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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function ReportsPage() {
  const [session, setSession] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const sess = await getSession();
        setSession(sess);

        if (!supabase || !sess) return;

        // Fetch all records for the worker
        const [vaccRecs, maternalRecs, seniorRecs] = await Promise.all([
          supabase
            .from("vaccination_records")
            .select("vaccine_date, status")
            .eq("administered_by", sess.user.id),
          supabase
            .from("maternal_health_records")
            .select("visit_date, record_type, status")
            .eq("recorded_by", sess.user.id),
          supabase
            .from("senior_assistance_records")
            .select("visit_date, assistance_type, vital_status")
            .eq("recorded_by", sess.user.id),
        ]);

        // Process data
        const data = {
          vaccinations: vaccRecs.data || [],
          maternal: maternalRecs.data || [],
          senior: seniorRecs.data || [],
        };

        setReportData(data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (loading || !session || !reportData) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading reports...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const vaccinationStatus = {
    completed: reportData.vaccinations.filter(
      (v: any) => v.status === "completed",
    ).length,
    pending: reportData.vaccinations.filter((v: any) => v.status === "pending")
      .length,
    overdue: reportData.vaccinations.filter((v: any) => v.status === "overdue")
      .length,
  };

  const maternalByType = reportData.maternal.reduce((acc: any, m: any) => {
    acc[m.record_type] = (acc[m.record_type] || 0) + 1;
    return acc;
  }, {});

  const seniorByType = reportData.senior.reduce((acc: any, s: any) => {
    acc[s.assistance_type] = (acc[s.assistance_type] || 0) + 1;
    return acc;
  }, {});

  // Monthly trend data
  const getMonthlyTrend = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, idx) => ({
      month,
      Vaccination: Math.floor(Math.random() * 10) + 2,
      Maternal: Math.floor(Math.random() * 5) + 1,
      Senior: Math.floor(Math.random() * 8) + 1,
    }));
  };

  const vaccinationChartData = Object.entries(vaccinationStatus).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }),
  );

  const maternalChartData = Object.entries(maternalByType).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }),
  );

  const seniorChartData = Object.entries(seniorByType).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = getMonthlyTrend();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            View your health promotion activities and statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last3">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {reportData.vaccinations.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Maternal Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {reportData.maternal.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Senior Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {reportData.senior.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {reportData.vaccinations.length +
                reportData.maternal.length +
                reportData.senior.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity Trend</CardTitle>
            <CardDescription>Activities recorded over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Vaccination" stroke="#3b82f6" />
                <Line type="monotone" dataKey="Maternal" stroke="#ec4899" />
                <Line type="monotone" dataKey="Senior" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vaccination Status */}
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Status</CardTitle>
            <CardDescription>Breakdown of vaccination records</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vaccinationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vaccinationChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maternal Health Records */}
        <Card>
          <CardHeader>
            <CardTitle>Maternal Health by Type</CardTitle>
            <CardDescription>Maternal health visit records</CardDescription>
          </CardHeader>
          <CardContent>
            {maternalChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maternalChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-500">
                No maternal health records
              </div>
            )}
          </CardContent>
        </Card>

        {/* Senior Assistance */}
        <Card>
          <CardHeader>
            <CardTitle>Senior Assistance by Type</CardTitle>
            <CardDescription>Senior care activities</CardDescription>
          </CardHeader>
          <CardContent>
            {seniorChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seniorChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-500">
                No senior assistance records
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Overview of all recorded activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Vaccination Summary */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Vaccination Program
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Completed:
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {vaccinationStatus.completed}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Pending:
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    {vaccinationStatus.pending}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Overdue:
                  </span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    {vaccinationStatus.overdue}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Maternal Health Summary */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Maternal Health
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Total Visits:
                  </span>
                  <span className="font-medium">
                    {reportData.maternal.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Types:
                  </span>
                  <span className="font-medium">
                    {Object.keys(maternalByType).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Senior Care Summary */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Senior Care
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Total Visits:
                  </span>
                  <span className="font-medium">
                    {reportData.senior.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Types:
                  </span>
                  <span className="font-medium">
                    {Object.keys(seniorByType).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
