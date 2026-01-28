"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { TrendingUp, Users, Heart, Baby, AlertCircle } from "lucide-react";

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
          title="Total Residents"
          value="342"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          change="↑ 12 this month"
          color="bg-blue-50 dark:bg-blue-950"
        />
        <KPICard
          title="Immunization Rate"
          value="88%"
          icon={<Heart className="h-6 w-6 text-green-600" />}
          change="↑ 3% from last month"
          color="bg-green-50 dark:bg-green-950"
        />
        <KPICard
          title="Pregnant Women"
          value="32"
          icon={<Baby className="h-6 w-6 text-pink-600" />}
          change="Active in prenatal"
          color="bg-pink-50 dark:bg-pink-950"
        />
        <KPICard
          title="Health Concerns"
          value="18"
          icon={<AlertCircle className="h-6 w-6 text-amber-600" />}
          change="Pending review"
          color="bg-amber-50 dark:bg-amber-950"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Immunization Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Immunization Rate Trend</CardTitle>
            <CardDescription>
              Monthly immunization coverage percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={immunizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #64748b",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Resident population by gender</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Age Group Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Age Group Distribution</CardTitle>
          <CardDescription>Population breakdown by age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="group" stroke="#64748b" />
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

      {/* Program Participation */}
      <Card>
        <CardHeader>
          <CardTitle>Program Participation</CardTitle>
          <CardDescription>
            Active participants in health programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programParticipation.map((program, index) => {
              const maxParticipants = Math.max(
                ...programParticipation.map((p) => p.participants),
              );
              const percentage = (program.participants / maxParticipants) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {program.program}
                    </span>
                    <Badge variant="outline">{program.participants}</Badge>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
