"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  UserPlus,
  Loader2,
} from "lucide-react";
import type { BarangayProfileFormData } from "./barangay-profile-form";

export interface BarangayProfile extends BarangayProfileFormData {
  id: string;
  createdAt: string;
}

interface BarangayProfilesListProps {
  profiles: BarangayProfile[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (profile: BarangayProfile) => void;
  onView: (profile: BarangayProfile) => void;
  onDelete: (id: string) => void;
}

const CIVIL_STATUS_LABELS: Record<string, string> = {
  single: "Single",
  married: "Married",
  widowed: "Widowed",
  separated: "Separated",
  annulled: "Annulled",
};

export function BarangayProfilesList({
  profiles,
  isLoading = false,
  onAdd,
  onEdit,
  onView,
  onDelete,
}: BarangayProfilesListProps) {
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    const fullName =
      `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase();
    const q = search.toLowerCase();
    return (
      fullName.includes(q) ||
      p.philhealthNo.toLowerCase().includes(q) ||
      p.currentBarangay.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by name, PhilHealth No., or barangay…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={onAdd} className="shrink-0">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">PhilHealth No.</TableHead>
              <TableHead className="hidden sm:table-cell">Membership</TableHead>
              <TableHead className="hidden lg:table-cell">Civil Status</TableHead>
              <TableHead className="hidden lg:table-cell">Barangay</TableHead>
              <TableHead className="hidden md:table-cell">Mobile</TableHead>
              <TableHead className="w-15">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading profiles…</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-slate-500 dark:text-slate-400"
                >
                  {search
                    ? "No profiles match your search."
                    : "No profiles added yet. Click \"Add Profile\" to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  onClick={() => onView(profile)}
                >
                  <TableCell className="font-medium">
                    <span className="block">
                      {[profile.lastName, profile.firstName, profile.middleName]
                        .filter(Boolean)
                        .join(", ")}
                      {profile.suffix && profile.suffix !== "none"
                        ? ` ${profile.suffix}`
                        : ""}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                      {profile.currentBarangay}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600 dark:text-slate-300">
                    {profile.philhealthNo || (
                      <span className="italic text-slate-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        profile.membershipType === "member"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {profile.membershipType || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-300">
                    {CIVIL_STATUS_LABELS[profile.civilStatus] || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-300">
                    {profile.currentBarangay || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600 dark:text-slate-300">
                    {profile.mobile || "—"}
                  </TableCell>
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(profile)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(profile)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => onDelete(profile.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
          Showing {filtered.length} of {profiles.length} profile
          {profiles.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
