"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase-client";
import { getSession } from "@/lib/auth";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  AlertCircle,
  Download,
  Phone,
  MapPin,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function ResidentsPage() {
  const [session, setSession] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [purokFilter, setPurokFilter] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [puroks, setPuroks] = useState<string[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const sess = await getSession();
        setSession(sess);

        if (!supabase || !sess) return;

        // Fetch all residents in barangay
        const { data: residentsData } = await supabase
          .from("residents")
          .select(
            "id, full_name, barangay, purok, birth_date, sex, phone, address",
          )
          .eq("barangay", sess.user.assigned_barangay)
          .order("full_name");

        setResidents(residentsData || []);

        // Extract unique puroks
        const uniquePuroks = [
          ...new Set((residentsData || []).map((r: any) => r.purok)),
        ].filter(Boolean);
        setPuroks(uniquePuroks as string[]);

        // Initial filter
        applyFilters(residentsData || [], "", null, null);
      } catch (err) {
        console.error("Error loading residents:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const applyFilters = (
    data: any[],
    search: string,
    purok: string | null,
    ageGroup: string | null,
  ) => {
    let filtered = data;

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.full_name.toLowerCase().includes(term) ||
          (r.phone && r.phone.includes(term)) ||
          (r.address && r.address.toLowerCase().includes(term)),
      );
    }

    // Purok filter
    if (purok) {
      filtered = filtered.filter((r) => r.purok === purok);
    }

    // Age group filter
    if (ageGroup) {
      filtered = filtered.filter((r) => {
        const age = calculateAge(r.birth_date);
        switch (ageGroup) {
          case "0-18":
            return age <= 18;
          case "19-64":
            return age >= 19 && age <= 64;
          case "65+":
            return age >= 65;
          default:
            return true;
        }
      });
    }

    setFilteredResidents(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(residents, value, purokFilter, ageFilter);
  };

  const handlePurokChange = (value: string) => {
    const purok = value === "all" ? null : value;
    setPurokFilter(purok);
    applyFilters(residents, searchTerm, purok, ageFilter);
  };

  const handleAgeChange = (value: string) => {
    const age = value === "all" ? null : value;
    setAgeFilter(age);
    applyFilters(residents, searchTerm, purokFilter, age);
  };

  if (loading || !session) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading residents...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Residents Directory
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {residents.length} total residents in{" "}
              {session.user.assigned_barangay}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filter Residents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or address..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm placeholder-slate-500 focus:border-emerald-600 focus:outline-none dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
            </div>

            {/* Purok Filter */}
            <Select
              value={purokFilter || "all"}
              onValueChange={handlePurokChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Purok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Puroks</SelectItem>
                {puroks.map((purok) => (
                  <SelectItem key={purok} value={purok}>
                    {purok}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Age Group Filter */}
            <Select value={ageFilter || "all"} onValueChange={handleAgeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-18">Children (0-18)</SelectItem>
                <SelectItem value="19-64">Adults (19-64)</SelectItem>
                <SelectItem value="65+">Seniors (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Showing {filteredResidents.length} of {residents.length} residents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No residents found matching your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Purok</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => {
                    const age = calculateAge(resident.birth_date);
                    let ageGroup = "Adult";
                    if (age <= 18) ageGroup = "Child";
                    else if (age >= 65) ageGroup = "Senior";

                    return (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">
                          {resident.full_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {resident.sex === "M" ? "Male" : "Female"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{age} years</p>
                            <p className="text-xs text-slate-500">{ageGroup}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {resident.purok}
                        </TableCell>
                        <TableCell className="text-sm">
                          {resident.phone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {resident.phone}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {resident.address ? (
                            <div className="flex items-start gap-1">
                              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-2">
                                {resident.address}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
