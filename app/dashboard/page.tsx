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
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for now - will be replaced with real API calls
const mockStats = {
  pending_submissions: 12,
  pending_yakap: 8,
  approved_yakap: 145,
  returned_submissions: 5,
  total_residents: 342,
  total_applications: 158,
};

const mockRecentActivity = [
  {
    id: "1",
    type: "yakap",
    resident: "Maria Santos",
    action: "Application submitted",
    status: "pending",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "submission",
    resident: "Juan Dela Cruz",
    action: "Health concern filed",
    status: "pending",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "yakap",
    resident: "Ana Garcia",
    action: "Application approved",
    status: "approved",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "submission",
    resident: "Pedro Reyes",
    action: "Submission returned",
    status: "returned",
    timestamp: "2 days ago",
  },
];

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCard) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In production, fetch real data from API
    // For now, use mock data
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back. Here's an overview of your health system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Submissions"
          value={mockStats.pending_submissions}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          color="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          title="Pending YAKAP"
          value={mockStats.pending_yakap}
          icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
          color="bg-yellow-50 dark:bg-yellow-950"
        />
        <StatCard
          title="Approved YAKAP"
          value={mockStats.approved_yakap}
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
          color="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Returned Submissions"
          value={mockStats.returned_submissions}
          icon={<FileText className="h-6 w-6 text-red-600" />}
          color="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          title="Total Residents"
          value={mockStats.total_residents}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Total Applications"
          value={mockStats.total_applications}
          icon={<FileText className="h-6 w-6 text-indigo-600" />}
          color="bg-indigo-50 dark:bg-indigo-950"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest submissions and YAKAP applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.resident}
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {activity.type === "yakap" ? "YAKAP" : "Submission"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                            : activity.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                        }
                      >
                        {activity.status.charAt(0).toUpperCase() +
                          activity.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-500 dark:text-slate-400">
                      {activity.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
