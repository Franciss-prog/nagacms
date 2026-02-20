"use client";

import { AnalyticsHealthDashboard } from "@/components/analytics/analytics-health-dashboard";

export default function HealthIndicatorsPage() {
  return <AnalyticsHealthDashboard endpoint="/api/dashboard/analytics" />;
}
