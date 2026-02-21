// Plain utility — no "use server" — safe to import anywhere

import type { BarangayProfileFormData } from "@/components/barangay-profiling/barangay-profile-form";
import type { BarangayProfile } from "@/components/barangay-profiling/barangay-profiles-list";

// ─── DB row → UI model ────────────────────────────────────────────────────────

export function rowToProfile(row: Record<string, unknown>): BarangayProfile {
  const str = (v: unknown) => (v == null ? "" : String(v));
  return {
    id: str(row.id),
    createdAt: str(row.created_at),
    membershipType: (row.membership_type as "member" | "dependent") || "",
    philhealthNo: str(row.philhealth_no),
    lastName: str(row.last_name),
    firstName: str(row.first_name),
    middleName: str(row.middle_name),
    suffix: str(row.suffix),
    age: str(row.age),
    birthdate: str(row.birthdate),
    civilStatus: str(row.civil_status),
    maidenLastName: str(row.maiden_last_name),
    maidenMiddleName: str(row.maiden_middle_name),
    educationalAttainment: str(row.educational_attainment),
    employmentStatus: str(row.employment_status),
    employedIn: str(row.employed_in),
    occupation: str(row.occupation),
    companyAddress: str(row.company_address),
    religion: str(row.religion),
    bloodType: str(row.blood_type),
    motherLastName: str(row.mother_last_name),
    motherFirstName: str(row.mother_first_name),
    motherMiddleName: str(row.mother_middle_name),
    motherBirthdate: str(row.mother_birthdate),
    fatherLastName: str(row.father_last_name),
    fatherFirstName: str(row.father_first_name),
    fatherMiddleName: str(row.father_middle_name),
    fatherBirthdate: str(row.father_birthdate),
    spouseLastName: str(row.spouse_last_name),
    spouseFirstName: str(row.spouse_first_name),
    spouseBirthdate: str(row.spouse_birthdate),
    currentBarangay: str(row.current_barangay),
    currentStreet: str(row.current_street),
    currentCity: str(row.current_city),
    currentProvince: str(row.current_province),
    permanentBarangay: str(row.permanent_barangay),
    permanentStreet: str(row.permanent_street),
    permanentCity: str(row.permanent_city),
    permanentProvince: str(row.permanent_province),
    email: str(row.email),
    mobile: str(row.mobile),
  };
}

// ─── UI model → DB row ────────────────────────────────────────────────────────

export function formDataToRow(
  data: BarangayProfileFormData,
  userId?: string,
): Record<string, unknown> {
  const nullable = (v: string) => (v.trim() === "" ? null : v.trim());
  const nullableNum = (v: string) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  };

  return {
    membership_type: data.membershipType || null,
    philhealth_no: nullable(data.philhealthNo),
    last_name: data.lastName.trim(),
    first_name: data.firstName.trim(),
    middle_name: nullable(data.middleName),
    suffix: nullable(data.suffix) === "none" ? null : nullable(data.suffix),
    age: nullableNum(data.age),
    birthdate: nullable(data.birthdate),
    civil_status: nullable(data.civilStatus),
    maiden_last_name: nullable(data.maidenLastName),
    maiden_middle_name: nullable(data.maidenMiddleName),
    educational_attainment: nullable(data.educationalAttainment),
    employment_status: nullable(data.employmentStatus),
    employed_in: nullable(data.employedIn),
    occupation: nullable(data.occupation),
    company_address: nullable(data.companyAddress),
    religion: nullable(data.religion),
    blood_type: nullable(data.bloodType),
    mother_last_name: nullable(data.motherLastName),
    mother_first_name: nullable(data.motherFirstName),
    mother_middle_name: nullable(data.motherMiddleName),
    mother_birthdate: nullable(data.motherBirthdate),
    father_last_name: nullable(data.fatherLastName),
    father_first_name: nullable(data.fatherFirstName),
    father_middle_name: nullable(data.fatherMiddleName),
    father_birthdate: nullable(data.fatherBirthdate),
    spouse_last_name: nullable(data.spouseLastName),
    spouse_first_name: nullable(data.spouseFirstName),
    spouse_birthdate: nullable(data.spouseBirthdate),
    current_barangay: nullable(data.currentBarangay),
    current_street: nullable(data.currentStreet),
    current_city: nullable(data.currentCity),
    current_province: nullable(data.currentProvince),
    permanent_barangay: nullable(data.permanentBarangay),
    permanent_street: nullable(data.permanentStreet),
    permanent_city: nullable(data.permanentCity),
    permanent_province: nullable(data.permanentProvince),
    email: nullable(data.email),
    mobile: nullable(data.mobile),
    ...(userId ? { created_by: userId } : {}),
    updated_at: new Date().toISOString(),
  };
}
