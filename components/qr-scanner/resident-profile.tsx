"use client";

import { useState } from "react";
import { format, differenceInYears, parseISO } from "date-fns";
import {
  User,
  Calendar,
  Phone,
  CreditCard,
  MapPin,
  Activity,
  Baby,
  Heart,
  FileText,
  ScanLine,
  Eye,
  EyeOff,
  Printer,
  ScanQrCode,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScanLogTable } from "./scan-log-table";
import type { ResidentFullProfile } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function toPHT(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function computeAge(birthDate?: string | null): string {
  if (!birthDate) return "—";
  try {
    return `${differenceInYears(new Date(), parseISO(birthDate))} yrs`;
  } catch {
    return "—";
  }
}

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "completed":
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
    case "rejected":
    case "no_show":
      return "destructive";
    case "returned":
      return "outline";
    default:
      return "secondary";
  }
}

// ── Masked field ─────────────────────────────────────────────────────────────

function MaskedField({ value }: { value?: string | null }) {
  const [visible, setVisible] = useState(false);

  if (!value) return <span className="text-slate-400">—</span>;

  return (
    <span className="flex items-center gap-2">
      {visible ? (
        <span className="font-mono text-sm">{value}</span>
      ) : (
        <span className="font-mono text-sm tracking-widest">
          {"•".repeat(Math.min(value.length, 12))}
        </span>
      )}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-slate-400 hover:text-slate-600"
        aria-label={visible ? "Hide value" : "Show value"}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
}

// ── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </span>
      <span className="text-sm text-slate-900 dark:text-slate-100">
        {children}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ResidentProfileProps {
  profile: ResidentFullProfile;
  onScanAnother?: () => void;
}

export function ResidentProfile({ profile, onScanAnother }: ResidentProfileProps) {
  const { resident, appointments, pregnancyProfiles, yakap, scanLogs } =
    profile;

  const isMale = resident.sex === "Male";

  const handlePrint = () => {
    // Open a print-friendly version of the page
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{resident.full_name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {resident.barangay}
                  {resident.purok ? `, Purok ${resident.purok}` : ""}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1"
              >
                <Printer className="h-4 w-4" />
                Print / Export
              </Button>
              {onScanAnother && (
                <Button
                  size="sm"
                  onClick={onScanAnother}
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <ScanQrCode className="h-4 w-4" />
                  Scan Another
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed content */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-2 flex h-auto flex-wrap gap-1 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="personal" className="gap-1.5 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5" />
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Calendar className="h-3.5 w-3.5" />
            Appointments
            {appointments.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {appointments.length}
              </Badge>
            )}
          </TabsTrigger>
          {!isMale && (
            <TabsTrigger value="pregnancy" className="gap-1.5 text-xs sm:text-sm">
              <Baby className="h-3.5 w-3.5" />
              Prenatal
              {pregnancyProfiles.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {pregnancyProfiles.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="yakap" className="gap-1.5 text-xs sm:text-sm">
            <Heart className="h-3.5 w-3.5" />
            Yakap
            {yakap.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {yakap.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scanlogs" className="gap-1.5 text-xs sm:text-sm">
            <ScanLine className="h-3.5 w-3.5" />
            Scan History
            {scanLogs.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {scanLogs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Personal Information ─────────────────────────────────── */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Full Name">{resident.full_name}</InfoRow>
              <InfoRow label="Barangay">{resident.barangay || "—"}</InfoRow>
              <InfoRow label="Purok">{resident.purok || "—"}</InfoRow>
              <InfoRow label="Sex">{resident.sex || "—"}</InfoRow>
              <InfoRow label="Date of Birth">
                {resident.birth_date ? toPHT(resident.birth_date) : "—"}
              </InfoRow>
              <InfoRow label="Age">{computeAge(resident.birth_date)}</InfoRow>
              <Separator />
              <InfoRow label="Contact Number">
                <MaskedField value={resident.contact_number} />
              </InfoRow>
              <InfoRow label="PhilHealth No.">
                <MaskedField value={resident.philhealth_no} />
              </InfoRow>
              <Separator />
              <InfoRow label="Date Registered">
                {toPHT(resident.created_at)}
              </InfoRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Appointment History ───────────────────────────────────── */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointment History</CardTitle>
              <CardDescription>
                {appointments.length} record{appointments.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No appointments found.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Facility</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                          <TableCell className="whitespace-nowrap">
                            {toPHT(appt.appointment_date)}
                          </TableCell>
                          <TableCell>
                            {(appt.facility as any)?.name ?? "—"}
                          </TableCell>
                          <TableCell>{appt.service_type ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant(appt.status)}>
                              {appt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-500">
                            {appt.notes ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 3: Pregnancy & Prenatal Records (hidden for male residents) ── */}
        {!isMale && <TabsContent value="pregnancy">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Pregnancy &amp; Prenatal Records
              </CardTitle>
              <CardDescription>
                {pregnancyProfiles.length} visit record
                {pregnancyProfiles.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pregnancyProfiles.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No prenatal records found.
                </p>
              ) : (
                pregnancyProfiles.map((rec) => (
                  <Card key={rec.id} className="border-slate-200 bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Visit: {toPHT(rec.visit_date)}
                        </span>
                        {rec.risk_level && (
                          <Badge
                            variant={
                              rec.risk_level.toLowerCase().includes("high")
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {rec.risk_level}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                        <InfoRow label="LMP">{toPHT(rec.lmp)}</InfoRow>
                        <InfoRow label="AOG">
                          {rec.aog_weeks != null ? `${rec.aog_weeks} wks` : "—"}
                        </InfoRow>
                        <InfoRow label="G / P">
                          {rec.gravida != null ? `G${rec.gravida}` : "—"} /{" "}
                          {rec.para != null ? `P${rec.para}` : "—"}
                        </InfoRow>
                        <InfoRow label="Attending Midwife">
                          {rec.attending_midwife ?? "—"}
                        </InfoRow>
                        <InfoRow label="Encoded">
                          {toPHT(rec.created_at)}
                        </InfoRow>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                          asChild
                        >
                          <a
                            href={`/dashboard-workers/data-entry?resident=${resident.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Full Form
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>}

        {/* ── Tab 4: Yakap / PhilHealth Konsulta ──────────────────────────── */}
        <TabsContent value="yakap">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Yakap / PhilHealth Konsulta
              </CardTitle>
              <CardDescription>
                {yakap.length} application{yakap.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {yakap.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No Yakap applications found.
                </p>
              ) : (
                yakap.map((app) => (
                  <Card key={app.id} className="border-slate-200 bg-slate-50 dark:bg-slate-800">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {app.membership_type} — {toPHT(app.applied_at)}
                        </span>
                        <Badge variant={statusBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <InfoRow label="Date Submitted">
                          {toPHT(app.applied_at)}
                        </InfoRow>
                        {app.approved_at && (
                          <InfoRow label="Approved At">
                            {toPHT(app.approved_at)}
                          </InfoRow>
                        )}
                        {app.remarks && (
                          <InfoRow label="Remarks">{app.remarks}</InfoRow>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 5: Scan History ──────────────────────────────────────────── */}
        <TabsContent value="scanlogs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scan History</CardTitle>
              <CardDescription>
                All times shown in Philippine Time (UTC+8)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScanLogTable logs={scanLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
