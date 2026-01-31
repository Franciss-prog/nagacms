"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthIndicatorsDisplay } from "@/components/dashboard/health-indicators-display";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Heart, AlertCircle } from "lucide-react";
import {
  getHealthIndicatorStats,
  getIndicatorsByType,
  getIndicatorsByStatus,
  getLatestIndicatorsByType,
} from "@/lib/queries/health-indicators";

// Mock analytics data
const immunizationData = [
  { month: "Jan", percentage: 65 },
  { month: "Feb", percentage: 72 },
  { month: "Mar", percentage: 78 },
  { month: "Apr", percentage: 82 },
  { month: "May", percentage: 85 },
  { month: "Jun", percentage: 88 },
];

const genderDistribution = [
  { name: "Male", value: 162, color: "#3b82f6" },
  { name: "Female", value: 180, color: "#ec4899" },
];

const ageGroups = [
  { group: "0-5", count: 45, color: "#ff6b6b" },
  { group: "6-12", count: 68, color: "#ffa94d" },
  { group: "13-18", count: 55, color: "#ffd93d" },
  { group: "19-35", count: 98, color: "#6bcf7f" },
  { group: "36-60", count: 87, color: "#4d96ff" },
  { group: "60+", count: 42, color: "#d946ef" },
];

const programParticipation = [
  { program: "YAKAP", participants: 145 },
  { program: "Prenatal Care", participants: 32 },
  { program: "Child Health", participants: 89 },
  { program: "Immunization", participants: 234 },
  { program: "Disease Prevention", participants: 78 },
];

interface KPICard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: string;
  color: string;
}

const KPICard = ({ title, value, icon, change, color }: KPICard) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{change}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default function HealthIndicatorsPage() {
  const [stats, setStats] = useState({
    totalRecords: 0,
    criticalCount: 0,
    warningCount: 0,
    normalCount: 0,
  });
  const [indicatorsByType, setIndicatorsByType] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [latestIndicators, setLatestIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, typeData, statusData, latestData] = await Promise.all(
          [
            getHealthIndicatorStats(),
            getIndicatorsByType(),
            getIndicatorsByStatus(),
            getLatestIndicatorsByType(),
          ],
        );

        setStats(statsData);
        setIndicatorsByType(typeData);
        setStatusDistribution(statusData);
        setLatestIndicators(latestData);
      } catch (error) {
        console.error("Error loading health indicator data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Health Indicators
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Key performance indicators and analytics for your barangay
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Health Records"
          value={loading ? "..." : stats.totalRecords}
          icon={<Heart className="h-6 w-6 text-blue-600" />}
          change="All indicators"
          color="bg-blue-50 dark:bg-blue-950"
        />
        <KPICard
          title="Normal Status"
          value={loading ? "..." : stats.normalCount}
          icon={<Heart className="h-6 w-6 text-green-600" />}
          change="Healthy readings"
          color="bg-green-50 dark:bg-green-950"
        />
        <KPICard
          title="Warning Status"
          value={loading ? "..." : stats.warningCount}
          icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
          change="Requires attention"
          color="bg-yellow-50 dark:bg-yellow-950"
        />
        <KPICard
          title="Critical Status"
          value={loading ? "..." : stats.criticalCount}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          change="Immediate action"
          color="bg-red-50 dark:bg-red-950"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Health Indicators by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Health Indicators by Type</CardTitle>
            <CardDescription>
              Distribution of health indicator types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={indicatorsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="type"
                  stroke="#64748b"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #64748b",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Health indicators by status</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Latest Indicators by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Health Indicators</CardTitle>
          <CardDescription>
            Most recent reading for each indicator type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {indicator.type}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {indicator.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {indicator.value}
                  </p>
                  <Badge
                    variant={
                      indicator.status === "normal"
                        ? "default"
                        : indicator.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {indicator.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Summary</CardTitle>
          <CardDescription>Current quarter overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium">Immunization Coverage</p>
              </div>
              <p className="mt-2 text-2xl font-bold">88%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Target: 95%
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium">Avg. Health Literacy</p>
              </div>
              <p className="mt-2 text-2xl font-bold">72%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ↑ 5% from Q3
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium">Health Program Adoption</p>
              </div>
              <p className="mt-2 text-2xl font-bold">156</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Active participants
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Indicators Management Section */}
      <div className="mt-8 border-t pt-8">
        <HealthIndicatorsDisplay />
      </div>
    </div>
  );
}
