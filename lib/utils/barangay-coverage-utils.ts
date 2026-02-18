/**
 * Utility functions for barangay vaccination coverage visualization
 */

export interface VaccinationCoverageColor {
  fill: string;
  border: string;
  text: string;
  label: string;
  range: string;
}

export interface CoverageLevel {
  min: number;
  max: number;
  color: VaccinationCoverageColor;
}

/**
 * Color scheme for vaccination coverage levels
 */
export const COVERAGE_COLORS: CoverageLevel[] = [
  {
    min: 0,
    max: 40,
    color: {
      fill: "#EF4444",
      border: "#DC2626",
      text: "text-red-700",
      label: "Critical",
      range: "0-40%",
    },
  },
  {
    min: 40,
    max: 60,
    color: {
      fill: "#F59E0B",
      border: "#D97706",
      text: "text-amber-700",
      label: "Low",
      range: "40-60%",
    },
  },
  {
    min: 60,
    max: 80,
    color: {
      fill: "#3B82F6",
      border: "#1D4ED8",
      text: "text-blue-700",
      label: "Moderate",
      range: "60-80%",
    },
  },
  {
    min: 80,
    max: 100,
    color: {
      fill: "#10B981",
      border: "#059669",
      text: "text-green-700",
      label: "Good",
      range: "80-100%",
    },
  },
];

/**
 * Get color information for a given vaccination coverage percentage
 */
export function getCoverageColor(coverage: number): VaccinationCoverageColor {
  const level = COVERAGE_COLORS.find(
    (c) => coverage >= c.min && coverage < c.max,
  );

  if (level) return level.color;

  // Default to good if 100%
  if (coverage >= 100) return COVERAGE_COLORS[3].color;

  // Default to critical if below 0
  return COVERAGE_COLORS[0].color;
}

/**
 * Get opacity based on coverage level (for hover effects)
 */
export function getCoverageOpacity(coverage: number): number {
  if (coverage >= 80) return 0.9;
  if (coverage >= 60) return 0.8;
  if (coverage >= 40) return 0.7;
  return 0.6;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Get health status based on coverage and other factors
 */
export function getHealthStatus(
  coverage: number,
  pendingInterventions: number,
): "good" | "warning" | "critical" {
  if (coverage < 50 || pendingInterventions > 10) return "critical";
  if (coverage < 70 || pendingInterventions > 5) return "warning";
  return "good";
}

/**
 * Calculate weighted health score
 */
export function calculateHealthScore(
  coverage: number,
  pendingInterventions: number,
  totalResidents: number,
): number {
  const coverageScore = coverage;
  const interventionScore = Math.max(
    0,
    100 - (pendingInterventions / totalResidents) * 100,
  );
  return coverageScore * 0.7 + interventionScore * 0.3;
}
