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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  ClipboardList,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for worker dashboard
const mockWorkerStats = {
  assigned_cases: 24,
  completed_visits: 45,
  pending_followups: 8,
  assigned_residents: 156,
};

const mockWorkerActivity = [
  {
    id: "1",
    type: "visit",
    resident: "Rosa Martinez",
    action: "Home visit completed",
    status: "completed",
    timestamp: "1 hour ago",
    location: "Purok 3",
  },
  {
    id: "2",
    type: "followup",
    resident: "Pedro Garcia",
    action: "Follow-up scheduled",
    status: "pending",
    timestamp: "3 hours ago",
    location: "Purok 1",
  },
  {
    id: "3",
    type: "assessment",
    resident: "Ana Reyes",
    action: "Health assessment",
    status: "completed",
    timestamp: "5 hours ago",
    location: "Purok 2",
  },
  {
    id: "4",
    type: "visit",
    resident: "Carlos Santos",
    action: "Vaccination reminder",
    status: "pending",
    timestamp: "Yesterday",
    location: "Purok 4",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <AlertCircle className="mr-1 h-3 w-3" />
          Unknown
        </Badge>
      );
  }
};

export default function WorkerDashboardPage() {
  const [stats, setStats] = useState(mockWorkerStats);
  const [recentActivity, setRecentActivity] = useState(mockWorkerActivity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Loading worker dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Worker Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track your assigned cases and community health activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Cases
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.assigned_cases}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Active assignments
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Visits
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed_visits}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Follow-ups
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending_followups}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Residents
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.assigned_residents}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              In your area
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest field work and community visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {activity.resident}
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {activity.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950">
        <CardHeader>
          <CardTitle className="text-emerald-900 dark:text-emerald-100">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-emerald-700 dark:text-emerald-300">
            Common tasks for community health workers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <button className="rounded-lg border border-emerald-200 bg-white p-4 text-left transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900 dark:hover:bg-emerald-800">
              <FileText className="mb-2 h-5 w-5 text-emerald-600" />
              <div className="font-medium text-emerald-900 dark:text-emerald-100">
                Log Visit
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Record a home visit
              </div>
            </button>
            <button className="rounded-lg border border-emerald-200 bg-white p-4 text-left transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900 dark:hover:bg-emerald-800">
              <ClipboardList className="mb-2 h-5 w-5 text-emerald-600" />
              <div className="font-medium text-emerald-900 dark:text-emerald-100">
                View Assignments
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Check your cases
              </div>
            </button>
            <button className="rounded-lg border border-emerald-200 bg-white p-4 text-left transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900 dark:hover:bg-emerald-800">
              <MapPin className="mb-2 h-5 w-5 text-emerald-600" />
              <div className="font-medium text-emerald-900 dark:text-emerald-100">
                Area Map
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                View assigned area
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
