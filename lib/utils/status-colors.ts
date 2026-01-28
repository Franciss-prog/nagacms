import { SubmissionStatus, YakakStatus } from "../types";

/**
 * Map submission/yakap status to Tailwind CSS classes for Badge component
 */

export const statusColorMap: Record<
  SubmissionStatus | YakakStatus,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-200",
    label: "Pending",
  },
  approved: {
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-200",
    label: "Approved",
  },
  returned: {
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-700 dark:text-red-200",
    label: "Returned",
  },
  rejected: {
    bg: "bg-gray-50 dark:bg-gray-900",
    text: "text-gray-700 dark:text-gray-200",
    label: "Rejected",
  },
};

export function getStatusColor(status: SubmissionStatus | YakakStatus) {
  return statusColorMap[status] || statusColorMap.pending;
}

export function getStatusLabel(status: SubmissionStatus | YakakStatus): string {
  return getStatusColor(status).label;
}
