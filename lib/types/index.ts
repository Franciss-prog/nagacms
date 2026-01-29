/**
 * Core TypeScript types for the Barangay Health Dashboard
 */

export type UserRole = "user" | "admin" | "barangay_admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  assigned_barangay: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User;
  expires_at: number;
}

export interface Resident {
  id: string;
  auth_id?: string;
  barangay: string;
  purok: string;
  full_name: string;
  birth_date?: string;
  sex?: "Male" | "Female" | "Other";
  contact_number?: string;
  philhealth_no?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type SubmissionType =
  | "health_concern"
  | "program_inquiry"
  | "appointment_request"
  | "other";
export type SubmissionStatus = "pending" | "approved" | "returned" | "rejected";

export interface Submission {
  id: string;
  resident_id: string;
  submission_type: SubmissionType;
  program_name?: string;
  description: string;
  remarks?: string;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
  // Populated in queries
  resident?: Resident;
  reviewer?: User;
}

export type MembershipType = "individual" | "family" | "senior" | "pwd";
export type YakakStatus = "pending" | "approved" | "returned" | "rejected";

export interface YakakApplication {
  id: string;
  resident_id: string;
  membership_type: MembershipType;
  philhealth_no?: string;
  status: YakakStatus;
  applied_at: string;
  approved_by?: string;
  approved_at?: string;
  remarks?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
  // Populated in queries
  resident?: Resident;
  approver?: User;
}

export interface HealthFacility {
  id: string;
  name: string;
  barangay: string;
  address: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: string;
  contact_json?: any; // Array of staff contacts or object with phone/email
  general_services?: string;
  specialized_services?: string;
  service_capability?: string;
  yakap_accredited?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FacilitySchedule {
  id: string;
  facility_id: string;
  service_name: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  time_start: string;
  time_end: string;
  created_at: string;
  updated_at: string;
}

export interface PersonnelAvailability {
  id: string;
  facility_id: string;
  personnel_name: string;
  personnel_role: string;
  available_days: number[]; // 0-6
  contact_number?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type:
    | "submission"
    | "yakap_application"
    | "resident"
    | "facility"
    | "user";
  resource_id?: string;
  changes?: Record<string, any>;
  created_at: string;
  // Populated in queries
  user?: User;
}

export interface DashboardStats {
  pending_submissions: number;
  pending_yakap: number;
  approved_yakap: number;
  returned_submissions: number;
  total_residents: number;
  total_applications: number;
}
