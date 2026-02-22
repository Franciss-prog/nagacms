"use client";

import { format } from "date-fns";
import { Monitor, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QrScanLog } from "@/lib/types";

interface ScanLogTableProps {
  logs: QrScanLog[];
}

/** Convert any UTC timestamp to Philippine Time (UTC+8) display string */
function toPHT(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function truncateDevice(info?: string | null): string {
  if (!info) return "—";
  // Show just browser/OS from the full UA string
  const match = info.match(/\(([^)]+)\)/);
  return match ? match[1].split(";")[0].trim() : info.substring(0, 50);
}

export function ScanLogTable({ logs }: ScanLogTableProps) {
  if (logs.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        No scan records found for this resident.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scanned By</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Date &amp; Time (PHT)</TableHead>
            <TableHead>Device</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {(log.scanner as any)?.username ?? log.scanned_by.substring(0, 8) + "…"}
              </TableCell>
              <TableCell>
                {(log.facility as any)?.name ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="h-3 w-3" />
                  {toPHT(log.scanned_at)}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 truncate text-xs text-slate-500">
                  <Monitor className="h-3 w-3 shrink-0" />
                  {truncateDevice(log.device_info)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
