"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BarangayProfile } from "./barangay-profiles-list";

interface ViewProfileDialogProps {
  profile: BarangayProfile | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-slate-900 dark:text-slate-100">
        {value || <span className="italic text-slate-400">Not provided</span>}
      </span>
    </div>
  );
}

const CIVIL_STATUS_LABELS: Record<string, string> = {
  single: "Single",
  married: "Married",
  widowed: "Widowed",
  separated: "Separated",
  annulled: "Annulled",
};

const EDU_LABELS: Record<string, string> = {
  no_formal: "No Formal Education",
  elementary: "Elementary",
  high_school: "High School",
  senior_high: "Senior High School",
  vocational: "Vocational / Technical",
  college: "College",
  post_grad: "Post Graduate",
};

const EMP_LABELS: Record<string, string> = {
  employed: "Employed",
  self_employed: "Self-Employed",
  unemployed: "Unemployed",
  student: "Student",
  retired: "Retired",
};

export function ViewProfileDialog({
  profile,
  open,
  onClose,
}: ViewProfileDialogProps) {
  if (!profile) return null;

  const fullName = [profile.lastName, profile.firstName, profile.middleName]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{fullName}</span>
            {profile.membershipType && (
              <Badge
                variant={
                  profile.membershipType === "member" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {profile.membershipType}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>

          {/* Personal */}
          <TabsContent value="personal" className="mt-4 space-y-1">
            <DetailRow label="PhilHealth No." value={profile.philhealthNo} />
            <DetailRow
              label="Civil Status"
              value={CIVIL_STATUS_LABELS[profile.civilStatus]}
            />
            <DetailRow label="Age" value={profile.age} />
            <DetailRow label="Birthdate" value={profile.birthdate} />
            {profile.civilStatus === "married" && (
              <>
                <DetailRow
                  label="Maiden Last Name"
                  value={profile.maidenLastName}
                />
                <DetailRow
                  label="Maiden Middle Name"
                  value={profile.maidenMiddleName}
                />
              </>
            )}
            <DetailRow label="Suffix" value={profile.suffix !== "none" ? profile.suffix : undefined} />
            <DetailRow
              label="Educational Attainment"
              value={EDU_LABELS[profile.educationalAttainment]}
            />
            <DetailRow
              label="Employment Status"
              value={EMP_LABELS[profile.employmentStatus]}
            />
            {profile.employedIn && (
              <DetailRow
                label="Employed In"
                value={
                  profile.employedIn === "government" ? "Government" : "Private"
                }
              />
            )}
            <DetailRow label="Occupation" value={profile.occupation} />
            <DetailRow label="Company Address" value={profile.companyAddress} />
            <DetailRow label="Religion" value={profile.religion} />
            <DetailRow label="Blood Type" value={profile.bloodType} />
          </TabsContent>

          {/* Family */}
          <TabsContent value="family" className="mt-4 space-y-1">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Mother
            </p>
            <DetailRow label="Last Name" value={profile.motherLastName} />
            <DetailRow label="First Name" value={profile.motherFirstName} />
            <DetailRow label="Middle Name" value={profile.motherMiddleName} />
            <DetailRow label="Birthdate" value={profile.motherBirthdate} />

            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-4 mb-2">
              Father
            </p>
            <DetailRow label="Last Name" value={profile.fatherLastName} />
            <DetailRow label="First Name" value={profile.fatherFirstName} />
            <DetailRow label="Middle Name" value={profile.fatherMiddleName} />
            <DetailRow label="Birthdate" value={profile.fatherBirthdate} />

            {profile.civilStatus === "married" && (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-4 mb-2">
                  Spouse
                </p>
                <DetailRow label="Last Name" value={profile.spouseLastName} />
                <DetailRow label="First Name" value={profile.spouseFirstName} />
                <DetailRow label="Birthdate" value={profile.spouseBirthdate} />
              </>
            )}
          </TabsContent>

          {/* Address */}
          <TabsContent value="address" className="mt-4 space-y-1">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Current Address
            </p>
            <DetailRow label="Barangay" value={profile.currentBarangay} />
            <DetailRow label="House No. / Street" value={profile.currentStreet} />
            <DetailRow label="City / Municipality" value={profile.currentCity} />
            <DetailRow label="Province" value={profile.currentProvince} />

            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-4 mb-2">
              Permanent Address
            </p>
            <DetailRow label="Barangay" value={profile.permanentBarangay} />
            <DetailRow label="House No. / Street" value={profile.permanentStreet} />
            <DetailRow label="City / Municipality" value={profile.permanentCity} />
            <DetailRow label="Province" value={profile.permanentProvince} />

            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mt-4 mb-2">
              Contact
            </p>
            <DetailRow label="Email" value={profile.email} />
            <DetailRow label="Mobile" value={profile.mobile} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
