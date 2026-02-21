"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface BarangayProfileFormData {
  // Part 1 – Member Info
  membershipType: "member" | "dependent" | "";
  philhealthNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  age: string;
  birthdate: string;
  civilStatus: string;
  maidenLastName: string;
  maidenMiddleName: string;
  educationalAttainment: string;
  employmentStatus: string;
  employedIn: string; // "government" | "private"
  occupation: string;
  companyAddress: string;
  religion: string;
  bloodType: string;

  // Part 2 – Family Background
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherBirthdate: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherBirthdate: string;
  spouseLastName: string;
  spouseFirstName: string;
  spouseBirthdate: string;

  // Part 3 – Address & Contact
  currentBarangay: string;
  currentStreet: string;
  currentCity: string;
  currentProvince: string;
  permanentBarangay: string;
  permanentStreet: string;
  permanentCity: string;
  permanentProvince: string;
  email: string;
  mobile: string;
}

const defaultFormData: BarangayProfileFormData = {
  membershipType: "",
  philhealthNo: "",
  lastName: "",
  firstName: "",
  middleName: "",
  suffix: "",
  age: "",
  birthdate: "",
  civilStatus: "",
  maidenLastName: "",
  maidenMiddleName: "",
  educationalAttainment: "",
  employmentStatus: "",
  employedIn: "",
  occupation: "",
  companyAddress: "",
  religion: "",
  bloodType: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherBirthdate: "",
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherBirthdate: "",
  spouseLastName: "",
  spouseFirstName: "",
  spouseBirthdate: "",
  currentBarangay: "",
  currentStreet: "",
  currentCity: "",
  currentProvince: "",
  permanentBarangay: "",
  permanentStreet: "",
  permanentCity: "",
  permanentProvince: "",
  email: "",
  mobile: "",
};

// ─── Helper components ──────────────────────────────────────────────────────

function FieldGroup({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Part 1 ─────────────────────────────────────────────────────────────────

function Part1({
  data,
  onChange,
}: {
  data: BarangayProfileFormData;
  onChange: (field: keyof BarangayProfileFormData, value: string) => void;
}) {
  const isMarried = data.civilStatus === "married";
  const isEmployed = data.employmentStatus === "employed";
  const isDependent = data.membershipType === "dependent";

  return (
    <div className="space-y-6">
      {/* Membership & PhilHealth */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Membership Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup label="Type of Membership" required>
            <Select
              value={data.membershipType}
              onValueChange={(v) => onChange("membershipType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="dependent">Dependent</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {!isDependent && (
            <FieldGroup label="PhilHealth No.">
              <Input
                placeholder="XX-XXXXXXXXX-X"
                value={data.philhealthNo}
                onChange={(e) => onChange("philhealthNo", e.target.value)}
              />
            </FieldGroup>
          )}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FieldGroup label="Last Name" required>
            <Input
              placeholder="Enter last name"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="First Name" required>
            <Input
              placeholder="Enter first name"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Middle Name">
            <Input
              placeholder="Enter middle name"
              value={data.middleName}
              onChange={(e) => onChange("middleName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Suffix">
            <Select
              value={data.suffix}
              onValueChange={(v) => onChange("suffix", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select suffix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Jr.">Jr.</SelectItem>
                <SelectItem value="Sr.">Sr.</SelectItem>
                <SelectItem value="II">II</SelectItem>
                <SelectItem value="III">III</SelectItem>
                <SelectItem value="IV">IV</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
          <FieldGroup label="Age" required>
            <Input
              type="number"
              min={0}
              max={150}
              placeholder="Age"
              value={data.age}
              onChange={(e) => onChange("age", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Birthdate" required>
            <Input
              type="date"
              value={data.birthdate}
              onChange={(e) => onChange("birthdate", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Civil Status" required>
            <Select
              value={data.civilStatus}
              onValueChange={(v) => onChange("civilStatus", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="annulled">Annulled</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {isMarried && (
            <>
              <FieldGroup label="Maiden Last Name">
                <Input
                  placeholder="Enter maiden last name"
                  value={data.maidenLastName}
                  onChange={(e) => onChange("maidenLastName", e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Maiden Middle Name">
                <Input
                  placeholder="Enter maiden middle name"
                  value={data.maidenMiddleName}
                  onChange={(e) =>
                    onChange("maidenMiddleName", e.target.value)
                  }
                />
              </FieldGroup>
            </>
          )}
        </CardContent>
      </Card>

      {/* Background */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Background & Employment
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FieldGroup label="Educational Attainment">
            <Select
              value={data.educationalAttainment}
              onValueChange={(v) => onChange("educationalAttainment", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select attainment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_formal">No Formal Education</SelectItem>
                <SelectItem value="elementary">Elementary</SelectItem>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="senior_high">Senior High School</SelectItem>
                <SelectItem value="vocational">Vocational / Technical</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="post_grad">Post Graduate</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
          <FieldGroup label="Employment Status">
            <Select
              value={data.employmentStatus}
              onValueChange={(v) => onChange("employmentStatus", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self_employed">Self-Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {isEmployed && (
            <FieldGroup label="Employed In">
              <Select
                value={data.employedIn}
                onValueChange={(v) => onChange("employedIn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Government or private" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          )}

          <FieldGroup label="Occupation">
            <Input
              placeholder="Enter occupation"
              value={data.occupation}
              onChange={(e) => onChange("occupation", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Company Address" className="md:col-span-2">
            <Input
              placeholder="Enter company address"
              value={data.companyAddress}
              onChange={(e) => onChange("companyAddress", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Religion">
            <Input
              placeholder="Enter religion"
              value={data.religion}
              onChange={(e) => onChange("religion", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Blood Type">
            <Select
              value={data.bloodType}
              onValueChange={(v) => onChange("bloodType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Part 2 ─────────────────────────────────────────────────────────────────

function Part2({
  data,
  onChange,
}: {
  data: BarangayProfileFormData;
  onChange: (field: keyof BarangayProfileFormData, value: string) => void;
}) {
  const isMarried = data.civilStatus === "married";

  return (
    <div className="space-y-6">
      {/* Mother */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Mother&apos;s Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldGroup label="Last Name">
            <Input
              placeholder="Mother's last name"
              value={data.motherLastName}
              onChange={(e) => onChange("motherLastName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="First Name">
            <Input
              placeholder="Mother's first name"
              value={data.motherFirstName}
              onChange={(e) => onChange("motherFirstName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Middle Name">
            <Input
              placeholder="Mother's middle name"
              value={data.motherMiddleName}
              onChange={(e) => onChange("motherMiddleName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Birthdate">
            <Input
              type="date"
              value={data.motherBirthdate}
              onChange={(e) => onChange("motherBirthdate", e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Father */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Father&apos;s Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldGroup label="Last Name">
            <Input
              placeholder="Father's last name"
              value={data.fatherLastName}
              onChange={(e) => onChange("fatherLastName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="First Name">
            <Input
              placeholder="Father's first name"
              value={data.fatherFirstName}
              onChange={(e) => onChange("fatherFirstName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Middle Name">
            <Input
              placeholder="Father's middle name"
              value={data.fatherMiddleName}
              onChange={(e) => onChange("fatherMiddleName", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Birthdate">
            <Input
              type="date"
              value={data.fatherBirthdate}
              onChange={(e) => onChange("fatherBirthdate", e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Spouse (if married) */}
      {isMarried && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-700 dark:text-blue-400">
              Spouse&apos;s Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FieldGroup label="Last Name">
              <Input
                placeholder="Spouse's last name"
                value={data.spouseLastName}
                onChange={(e) => onChange("spouseLastName", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="First Name">
              <Input
                placeholder="Spouse's first name"
                value={data.spouseFirstName}
                onChange={(e) => onChange("spouseFirstName", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Birthdate">
              <Input
                type="date"
                value={data.spouseBirthdate}
                onChange={(e) => onChange("spouseBirthdate", e.target.value)}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      {!isMarried && (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">
          Spouse information is only required for married members. Set civil
          status to &quot;Married&quot; in Part 1 to fill this section.
        </p>
      )}
    </div>
  );
}

// ─── Part 3 ─────────────────────────────────────────────────────────────────

function Part3({
  data,
  onChange,
}: {
  data: BarangayProfileFormData;
  onChange: (field: keyof BarangayProfileFormData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Current Address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Current Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup label="Barangay" required>
            <Input
              placeholder="Enter barangay"
              value={data.currentBarangay}
              onChange={(e) => onChange("currentBarangay", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="House No. / Street Name" required>
            <Input
              placeholder="e.g. 123 Rizal St."
              value={data.currentStreet}
              onChange={(e) => onChange("currentStreet", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="City / Municipality" required>
            <Input
              placeholder="Enter city or municipality"
              value={data.currentCity}
              onChange={(e) => onChange("currentCity", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Province" required>
            <Input
              placeholder="Enter province"
              value={data.currentProvince}
              onChange={(e) => onChange("currentProvince", e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Permanent Address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Permanent Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onChange("permanentBarangay", data.currentBarangay);
                onChange("permanentStreet", data.currentStreet);
                onChange("permanentCity", data.currentCity);
                onChange("permanentProvince", data.currentProvince);
              }}
            >
              Same as Current Address
            </Button>
          </div>
          <FieldGroup label="Barangay">
            <Input
              placeholder="Enter barangay"
              value={data.permanentBarangay}
              onChange={(e) => onChange("permanentBarangay", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="House No. / Street Name">
            <Input
              placeholder="e.g. 123 Rizal St."
              value={data.permanentStreet}
              onChange={(e) => onChange("permanentStreet", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="City / Municipality">
            <Input
              placeholder="Enter city or municipality"
              value={data.permanentCity}
              onChange={(e) => onChange("permanentCity", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Province">
            <Input
              placeholder="Enter province"
              value={data.permanentProvince}
              onChange={(e) => onChange("permanentProvince", e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-700 dark:text-blue-400">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup label="Email Address">
            <Input
              type="email"
              placeholder="example@email.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Mobile Number" required>
            <Input
              type="tel"
              placeholder="09XXXXXXXXX"
              value={data.mobile}
              onChange={(e) => onChange("mobile", e.target.value)}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Form Component ─────────────────────────────────────────────────────

const PARTS = ["part-1", "part-2", "part-3"] as const;
type Part = (typeof PARTS)[number];

const PART_LABELS: Record<Part, string> = {
  "part-1": "Personal Info",
  "part-2": "Family Background",
  "part-3": "Address & Contact",
};

interface BarangayProfileFormProps {
  initialData?: Partial<BarangayProfileFormData>;
  onSubmit: (data: BarangayProfileFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export function BarangayProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
}: BarangayProfileFormProps) {
  const [data, setData] = useState<BarangayProfileFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [activePart, setActivePart] = useState<Part>("part-1");

  const handleChange = (
    field: keyof BarangayProfileFormData,
    value: string
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const currentIndex = PARTS.indexOf(activePart);

  const goNext = () => {
    if (currentIndex < PARTS.length - 1) {
      setActivePart(PARTS[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActivePart(PARTS[currentIndex - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Step Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PARTS.map((part, idx) => (
          <button
            key={part}
            type="button"
            onClick={() => setActivePart(part)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
              activePart === part
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                activePart === part
                  ? "bg-white text-blue-600"
                  : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              )}
            >
              {idx + 1}
            </span>
            {PART_LABELS[part]}
          </button>
        ))}
      </div>

      {/* Form Parts */}
      {activePart === "part-1" && (
        <Part1 data={data} onChange={handleChange} />
      )}
      {activePart === "part-2" && (
        <Part2 data={data} onChange={handleChange} />
      )}
      {activePart === "part-3" && (
        <Part3 data={data} onChange={handleChange} />
      )}

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          {currentIndex > 0 && (
            <Button type="button" variant="outline" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentIndex < PARTS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-1" />
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Update Profile"
                  : "Save Profile"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
