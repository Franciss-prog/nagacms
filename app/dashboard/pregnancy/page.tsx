"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Baby, Search, UserRound } from "lucide-react";
import {
  searchResidentsForProfiling,
  getBarangaysForFilter,
} from "@/lib/queries/pregnancy-profiling";
import type { ResidentForProfiling } from "@/lib/queries/pregnancy-profiling";
import { RegisterPatientDialog } from "@/components/pregnancy/register-patient-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ResidentRow = ResidentForProfiling & {
  has_profile: boolean;
  last_visit?: string;
};

function calculateAge(birthDate: string | null | undefined): string {
  if (!birthDate) return "—";
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return `${age} yrs`;
}

export default function PregnancyListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [barangay, setBarangay] = useState("all");
  const [barangays, setBarangays] = useState<string[]>([]);
  const [residents, setResidents] = useState<ResidentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const PAGE_SIZE = 15;

  // Prevent SSR/hydration mismatch for Radix Select
  useEffect(() => setMounted(true), []);

  // Load barangay list once
  useEffect(() => {
    getBarangaysForFilter().then(setBarangays);
  }, []);

  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    const result = await searchResidentsForProfiling({
      query,
      barangay: barangay === "all" ? "" : barangay,
      page,
      pageSize: PAGE_SIZE,
    });
    setResidents(result.residents as ResidentRow[]);
    setTotal(result.total);
    setIsLoading(false);
  }, [query, barangay, page]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [query, barangay]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Baby className="size-6 text-pink-600" />
            Pregnancy Profiling
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Search and manage pregnancy profiles for registered residents.
          </p>
        </div>
        <RegisterPatientDialog onCreated={() => fetchResidents()} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by resident name..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {mounted ? (
              <Select value={barangay} onValueChange={setBarangay}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="All Barangays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Barangays</SelectItem>
                  {barangays.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="h-9 w-full sm:w-52 rounded-md border border-input bg-background" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `Showing ${residents.length} of ${total} residents`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Loading residents...
            </div>
          ) : residents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <UserRound className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No residents found.</p>
              {query && (
                <p className="text-xs mt-1">Try a different search term.</p>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {residents.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserRound className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {r.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.barangay} — {r.purok} &nbsp;|&nbsp;{" "}
                        {calculateAge(r.birth_date)} &nbsp;|&nbsp;{" "}
                        {r.sex ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {r.has_profile ? (
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Has Profile
                        </Badge>
                        {r.last_visit && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Last visit:{" "}
                            {format(new Date(r.last_visit), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No Profile
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={r.has_profile ? "outline" : "default"}
                      onClick={() =>
                        router.push(`/dashboard/pregnancy/${r.id}`)
                      }
                    >
                      {r.has_profile ? "View / Edit" : "Create Profile"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
