"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@/lib/hooks/use-supabase-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VaccinationForm } from "./vaccination-form";
import { MaternalHealthForm } from "./maternal-health-form";
import { SeniorAssistanceForm } from "./senior-assistance-form";
import { MedicalConsultationForm } from "./medical-consultation-form";
import { Search, Loader2, FileText } from "lucide-react";

interface DataEntryPageProps {
  barangay: string;
}

export function DataEntryPage({ barangay }: DataEntryPageProps) {
  const supabase = useSupabaseClient();
  const [residents, setResidents] = useState<any[]>([]);
  const [selectedResident, setSelectedResident] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredResidents, setFilteredResidents] = useState<any[]>([]);

  useEffect(() => {
    loadResidents();
  }, [barangay, supabase]);

  const loadResidents = async () => {
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("residents")
        .select(
          "id, full_name, barangay, purok, birth_date, sex, philhealth_no",
        )
        .eq("barangay", barangay)
        .order("full_name");

      if (error) throw error;
      setResidents(data || []);
      setFilteredResidents(data || []);
    } catch (error) {
      console.error("Error loading residents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = residents.filter(
      (r) =>
        r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.philhealth_no?.includes(searchTerm),
    );
    setFilteredResidents(filtered);
  }, [searchTerm, residents]);

  const selected = residents.find((r) => r.id === selectedResident);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Health Data Entry</h1>
        <p className="text-muted-foreground">
          Record health information for residents
        </p>
      </div>

      {/* Resident Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Resident</CardTitle>
          <CardDescription>
            Search and select a resident to record their health information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or PhilHealth number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={selectedResident}
              onValueChange={setSelectedResident}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a resident..." />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </div>
                ) : filteredResidents.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No residents found
                  </div>
                ) : (
                  filteredResidents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.full_name} ({resident.purok})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {selected && (
              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">Name</p>
                      <p className="text-muted-foreground">
                        {selected.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">PhilHealth No.</p>
                      <p className="text-muted-foreground">
                        {selected.philhealth_no || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">{selected.purok}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Sex</p>
                      <p className="text-muted-foreground">{selected.sex}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Entry Forms */}
      {selected ? (
        <Tabs defaultValue="medical" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="medical" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Medical Form
            </TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="maternal">Maternal Health</TabsTrigger>
            <TabsTrigger value="senior">Senior Assistance</TabsTrigger>
          </TabsList>

          <TabsContent value="medical">
            <MedicalConsultationForm
              barangay={barangay}
              residentId={selected.id}
              residentName={selected.full_name}
              residentData={{
                full_name: selected.full_name,
                birth_date: selected.birth_date,
                sex: selected.sex,
                philhealth_no: selected.philhealth_no,
                purok: selected.purok,
              }}
              onSuccess={loadResidents}
            />
          </TabsContent>

          <TabsContent value="vaccination">
            <VaccinationForm
              residentId={selected.id}
              residentName={selected.full_name}
              onSuccess={loadResidents}
            />
          </TabsContent>

          <TabsContent value="maternal">
            {selected.sex === "Female" ? (
              <MaternalHealthForm
                residentId={selected.id}
                residentName={selected.full_name}
                onSuccess={loadResidents}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Maternal health records are only for female residents
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="senior">
            <SeniorAssistanceForm
              residentId={selected.id}
              residentName={selected.full_name}
              onSuccess={loadResidents}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please select a resident to begin data entry
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
