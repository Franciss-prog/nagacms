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
  TrendingUp,
  TrendingDown,
  Users,
  Syringe,
  Heart,
  AlertCircle,
  Activity,
  Clock,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  bgColor = "bg-blue-50",
  textColor = "text-blue-700",
}: MetricCardProps) {
  return (
    <Card className={bgColor}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${textColor} p-2 rounded-lg bg-white`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-xs font-semibold ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(trend.value)}% this month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface VaccinationMetricsProps {
  total: number;
  completed: number;
  pending: number;
  overdue?: number;
}

export function VaccinationMetrics({
  total,
  completed,
  pending,
  overdue = 0,
}: VaccinationMetricsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Syringe className="w-5 h-5 text-blue-600" />
          Vaccination Administration
        </CardTitle>
        <CardDescription>Overall campaign performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Administered:</span>
            <span className="text-2xl font-bold">{completed}</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Completion Rate</span>
              <span className="font-semibold">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {completed}
              </div>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{pending}</div>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{overdue}</div>
              <p className="text-xs text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MaternalHealthMetricsProps {
  totalVisits: number;
  uniqueMothers: number;
  criticalCases: number;
  warningCases: number;
  normalCases: number;
}

export function MaternalHealthMetrics({
  totalVisits,
  uniqueMothers,
  criticalCases,
  warningCases,
  normalCases,
}: MaternalHealthMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Maternal Health Monitoring
        </CardTitle>
        <CardDescription>Health visits and wellness tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold">{totalVisits}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Unique Mothers</p>
              <p className="text-2xl font-bold">{uniqueMothers}</p>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Normal
              </span>
              <span className="font-semibold">{normalCases}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                Needs Attention
              </span>
              <span className="font-semibold">{warningCases}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Critical
              </span>
              <span className="font-semibold">{criticalCases}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SeniorCitizenMetricsProps {
  totalAssisted: number;
  activeAssistance: number;
  completedAssistance: number;
  totalHealthChecks: number;
  criticalCases: number;
  warningCases: number;
}

export function SeniorCitizenMetrics({
  totalAssisted,
  activeAssistance,
  completedAssistance,
  totalHealthChecks,
  criticalCases,
  warningCases,
}: SeniorCitizenMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Senior Citizens Assistance
        </CardTitle>
        <CardDescription>Active programs and health monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div>
            <p className="text-xs text-gray-600">Total Seniors Assisted</p>
            <p className="text-2xl font-bold">{totalAssisted}</p>
          </div>

          {/* Program status */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <p className="text-xs text-gray-600">Active Programs</p>
              <p className="text-lg font-bold text-blue-600">
                {activeAssistance}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Completed</p>
              <p className="text-lg font-bold text-green-600">
                {completedAssistance}
              </p>
            </div>
          </div>

          {/* Health checks */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Total Health Checks:</span>
              <span className="font-semibold">{totalHealthChecks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cases Needing Attention:</span>
              <span className="font-semibold text-yellow-600">
                {warningCases}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Critical Cases:</span>
              <span className="font-semibold text-red-600">
                {criticalCases}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PendingInterventionsMetricsProps {
  count: number;
  criticalCount: number;
  warningCount: number;
  averageWaitTime?: string;
}

export function PendingInterventionsMetrics({
  count,
  criticalCount,
  warningCount,
  averageWaitTime,
}: PendingInterventionsMetricsProps) {
  const getStatusColor = () => {
    if (count === 0) return "bg-green-50";
    if (count <= 5) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Pending Health Interventions
        </CardTitle>
        <CardDescription>
          Actionable health cases awaiting attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main metric */}
          <div>
            <p className="text-xs text-gray-600">Total Pending</p>
            <p className="text-3xl font-bold">{count}</p>
          </div>

          {/* Severity breakdown */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Critical Priority
              </span>
              <Badge className="bg-red-500">{criticalCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-yellow-500" />
                Needs Attention
              </span>
              <Badge className="bg-yellow-500">{warningCount}</Badge>
            </div>
          </div>

          {/* Wait time estimate */}
          {averageWaitTime && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600">Avg Wait Time</p>
              <p className="font-semibold">{averageWaitTime}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface KeyMetricsGridProps {
  vaccinationCompleted: number;
  maternalHealthVisits: number;
  seniorsCared: number;
  pendingInterventions: number;
}

export function KeyMetricsGrid({
  vaccinationCompleted,
  maternalHealthVisits,
  seniorsCared,
  pendingInterventions,
}: KeyMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Vaccinations Administered"
        value={vaccinationCompleted}
        description="Total completed this month"
        icon={<Syringe className="w-5 h-5" />}
        trend={{ value: 12, isPositive: true }}
        bgColor="bg-blue-50"
        textColor="text-blue-700"
      />

      <MetricCard
        title="Maternal Health Visits"
        value={maternalHealthVisits}
        description="Total wellness checks"
        icon={<Heart className="w-5 h-5" />}
        trend={{ value: 8, isPositive: true }}
        bgColor="bg-pink-50"
        textColor="text-pink-700"
      />

      <MetricCard
        title="Seniors Receiving Care"
        value={seniorsCared}
        description="Active assistance programs"
        icon={<Users className="w-5 h-5" />}
        trend={{ value: 5, isPositive: true }}
        bgColor="bg-purple-50"
        textColor="text-purple-700"
      />

      <MetricCard
        title="Pending Interventions"
        value={pendingInterventions}
        description="Awaiting action"
        icon={<AlertCircle className="w-5 h-5" />}
        trend={{ value: 3, isPositive: false }}
        bgColor={pendingInterventions > 10 ? "bg-red-50" : "bg-orange-50"}
        textColor={
          pendingInterventions > 10 ? "text-red-700" : "text-orange-700"
        }
      />
    </div>
  );
}
