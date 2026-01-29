# Barangay Health Dashboard - Supabase Integration Guide

## Database Schema & Interactive Services

This document provides all the SQL queries needed to set up the database and explains how each service is connected to Supabase.

---

## 1. TABLE CREATION QUERIES

### 1.1 Users Table (BHW Staff)

```sql
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'barangay_admin'::text])),
  assigned_barangay text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_users_assigned_barangay ON public.users(assigned_barangay);
CREATE INDEX idx_users_role ON public.users(role);
```

**Used by:** Staff Management Service  
**Operations:** List, Create, Update, Delete staff users with role-based access

---

### 1.2 Residents Table

```sql
CREATE TABLE public.residents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  barangay text NOT NULL,
  purok text NOT NULL,
  full_name text NOT NULL,
  birth_date date,
  sex text CHECK (sex = ANY (ARRAY['Male'::text, 'Female'::text, 'Other'::text])),
  contact_number text,
  philhealth_no text,
  created_by uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT residents_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_residents_barangay ON public.residents(barangay);
CREATE INDEX idx_residents_purok ON public.residents(purok);
CREATE INDEX idx_residents_full_name ON public.residents(full_name);
```

**Used by:**

- YAKAP Applications Service
- Submissions Service
- Resident registration

**Operations:** Lookup residents for applications, view resident information, list residents by barangay

---

### 1.3 Health Facilities Table

```sql
CREATE TABLE public.health_facilities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  barangay text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  operating_hours jsonb DEFAULT '{"end": "17:00", "start": "08:00"}'::jsonb,
  contact_json jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_facilities_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_health_facilities_barangay ON public.health_facilities(barangay);
CREATE INDEX idx_health_facilities_name ON public.health_facilities(name);
```

**Used by:** Facilities Service  
**Operations:** List facilities, view facility details, manage facility information

**Contact JSON Structure:**

```json
{
  "phone": "555-0001",
  "email": "facility@health.gov",
  "address": "Main St, Barangay"
}
```

---

### 1.4 Facility Schedules Table

```sql
CREATE TABLE public.facility_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  service_name text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_start time without time zone,
  time_end time without time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT facility_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT facility_schedules_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.health_facilities(id) ON DELETE CASCADE
);

CREATE INDEX idx_facility_schedules_facility_id ON public.facility_schedules(facility_id);
CREATE INDEX idx_facility_schedules_day_of_week ON public.facility_schedules(day_of_week);
```

**Used by:** Facilities Service → Service Schedules  
**Operations:** Manage service schedules per facility and day of week

**Day of Week:** 0 = Sunday, 1 = Monday, ..., 6 = Saturday

---

### 1.5 Personnel Availability Table

```sql
CREATE TABLE public.personnel_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  personnel_name text NOT NULL,
  personnel_role text NOT NULL,
  available_days jsonb NOT NULL,
  contact_number text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT personnel_availability_pkey PRIMARY KEY (id),
  CONSTRAINT personnel_availability_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.health_facilities(id) ON DELETE CASCADE
);

CREATE INDEX idx_personnel_availability_facility_id ON public.personnel_availability(facility_id);
```

**Used by:** Facilities Service → Personnel Management  
**Operations:** Track BHW staff availability and shifts

**Available Days Format:** `[0, 1, 2, 3, 4]` (Sunday through Thursday, for example)

---

### 1.6 Submissions Table

```sql
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL,
  submission_type text NOT NULL CHECK (submission_type = ANY (ARRAY['health_concern'::text, 'program_inquiry'::text, 'appointment_request'::text, 'other'::text])),
  program_name text,
  description text NOT NULL,
  remarks text,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'returned'::text, 'rejected'::text])),
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at timestamp with time zone,
  document_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.residents(id) ON DELETE CASCADE
);

CREATE INDEX idx_submissions_resident_id ON public.submissions(resident_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at);
CREATE INDEX idx_submissions_reviewed_by ON public.submissions(reviewed_by);
```

**Used by:** Submissions Service  
**Operations:**

- Create: Residents submit health concerns, program inquiries, appointment requests
- Review: BHW staff approve, return, or reject submissions
- Track: Status workflow and review history

**Submission Types:**

- `health_concern` - Health problems or issues
- `program_inquiry` - Questions about health programs
- `appointment_request` - Request for facility appointments
- `other` - Miscellaneous submissions

---

### 1.7 YAKAP Applications Table

```sql
CREATE TABLE public.yakap_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL,
  membership_type text NOT NULL CHECK (membership_type = ANY (ARRAY['individual'::text, 'family'::text, 'senior'::text, 'pwd'::text])),
  philhealth_no text,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'returned'::text, 'rejected'::text])),
  applied_at timestamp with time zone DEFAULT now(),
  approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at timestamp with time zone,
  remarks text,
  document_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT yakap_applications_pkey PRIMARY KEY (id),
  CONSTRAINT yakap_applications_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.residents(id) ON DELETE CASCADE
);

CREATE INDEX idx_yakap_applications_resident_id ON public.yakap_applications(resident_id);
CREATE INDEX idx_yakap_applications_status ON public.yakap_applications(status);
CREATE INDEX idx_yakap_applications_applied_at ON public.yakap_applications(applied_at);
CREATE INDEX idx_yakap_applications_approved_by ON public.yakap_applications(approved_by);
```

**Used by:** YAKAP Applications Service  
**Operations:**

- Create: Barangay staff submits YAKAP applications for residents
- Review: BHW approves or returns applications for correction
- Track: Application status and approval history
- Report: Generate coverage reports

**Membership Types:**

- `individual` - Single person
- `family` - Family coverage
- `senior` - Senior citizen (60+ years)
- `pwd` - Person with disability

---

### 1.8 Activity Logs Table

```sql
CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type = ANY (ARRAY['submission'::text, 'yakap_application'::text, 'resident'::text, 'facility'::text, 'user'::text])),
  resource_id uuid,
  changes jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_resource_type ON public.activity_logs(resource_type);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
```

**Used by:** Audit & Reporting  
**Operations:** Track all changes, approvals, and actions for compliance

---

## 2. INTERACTIVE SERVICES OVERVIEW

### 2.1 Staff Management Service

**File:** `/app/dashboard/staff/page.tsx`

**Database Operations:**

- Query: `getStaffUsers()` - Fetch all staff from `users` table
- Create: `createStaffUserAction()` - Add new BHW staff
- Update: `updateStaffUserAction()` - Modify staff info
- Delete: `deleteStaffUserAction()` - Remove staff

**Connected Table:** `users`

---

### 2.2 Facilities Service

**File:** `/app/dashboard/facilities/page.tsx`

**Database Operations:**

- Query: `getFacilities()` - List health facilities
- Query: `getFacilityById()` - Get facility with schedules & personnel
- Query: `getFacilitySchedules()` - Get service schedules
- Query: `getFacilityPersonnel()` - Get available personnel
- Create: `createFacilityAction()` - Add new facility
- Create: `createFacilityScheduleAction()` - Add service schedule
- Create: `createPersonnelAction()` - Add personnel record
- Update: `updateFacilityAction()` - Update facility info
- Delete: `deleteFacilityAction()` - Remove facility
- Delete: `deleteFacilityScheduleAction()` - Remove schedule
- Delete: `deletePersonnelAction()` - Remove personnel

**Connected Tables:**

- `health_facilities`
- `facility_schedules`
- `personnel_availability`

---

### 2.3 Submissions Service

**File:** `/app/dashboard/submissions/page.tsx`

**Database Operations:**

- Query: `getSubmissions()` - List submissions by status
- Create: `createSubmissionAction()` - Resident submits new request
- Review: `approveSubmissionAction()` - BHW approves submission
- Review: `returnSubmissionAction()` - BHW returns for correction

**Connected Tables:**

- `submissions`
- `residents` (lookup)
- `users` (reviewer info)

---

### 2.4 YAKAP Applications Service

**File:** `/app/dashboard/yakap/page.tsx`

**Database Operations:**

- Query: `getYakakApplications()` - List applications
- Query: `getResidents()` - Find residents for application form
- Create: `createYakakAction()` - Submit YAKAP application
- Review: `approveYakakAction()` - BHW approves application
- Review: `returnYakakAction()` - BHW returns for correction

**Connected Tables:**

- `yakap_applications`
- `residents` (lookup)
- `users` (approver info)

---

## 3. QUERY EXAMPLES

### Get all facilities in a barangay

```sql
SELECT * FROM health_facilities
WHERE barangay = 'Barangay San Jose'
ORDER BY name ASC;
```

### Get service schedules for a facility

```sql
SELECT * FROM facility_schedules
WHERE facility_id = 'uuid-here'
ORDER BY day_of_week ASC;
```

### Get pending submissions for review

```sql
SELECT s.*, r.full_name as resident_name
FROM submissions s
JOIN residents r ON s.resident_id = r.id
WHERE s.status = 'pending'
ORDER BY s.submitted_at DESC;
```

### Get YAKAP application statistics

```sql
SELECT
  status,
  COUNT(*) as count
FROM yakap_applications
GROUP BY status;
```

### Get activity log for audit trail

```sql
SELECT a.*, u.username
FROM activity_logs a
JOIN users u ON a.user_id = u.id
WHERE a.resource_type = 'yakap_application'
ORDER BY a.created_at DESC
LIMIT 50;
```

### Get personnel availability for a facility

```sql
SELECT * FROM personnel_availability
WHERE facility_id = 'uuid-here';
```

---

## 4. SETUP INSTRUCTIONS

1. **Create Database Tables:**
   - Copy all SQL from this document into Supabase SQL Editor
   - Execute in order (tables must be created before indexes)

2. **Enable Row Level Security (Optional but Recommended):**

   ```sql
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.yakap_applications ENABLE ROW LEVEL SECURITY;
   ```

3. **Insert Sample Data:**
   - See `SUPABASE_SCHEMA.sql` for sample data inserts

4. **Verify Connection:**
   - Check that all services load without errors
   - Verify data is fetching correctly from dashboard

---

## 5. API ENDPOINTS SUMMARY

All services use **Server Actions** (not REST endpoints) for security:

| Service         | Action                                             | Location                      |
| --------------- | -------------------------------------------------- | ----------------------------- |
| **Staff**       | Create, Update, Delete                             | `/lib/actions/users.ts`       |
| **Facilities**  | Create, Update, Delete Facility/Schedule/Personnel | `/lib/actions/facilities.ts`  |
| **Submissions** | Create, Approve, Return                            | `/lib/actions/submissions.ts` |
| **YAKAP**       | Create, Approve, Return                            | `/lib/actions/yakap.ts`       |
| **Residents**   | Query only (lookup)                                | `/lib/queries/residents.ts`   |

---

## 6. DATA RELATIONSHIPS

```
users
  ├── staff management
  ├── created_by → residents
  ├── reviewed_by → submissions
  └── approved_by → yakap_applications

residents
  ├── resident_id → submissions
  └── resident_id → yakap_applications

health_facilities
  ├── facility_id → facility_schedules
  └── facility_id → personnel_availability

activity_logs
  └── user_id → users
```

---

## 7. SECURITY NOTES

- All create/update/delete operations require authentication
- Admin-only operations are enforced server-side
- All changes are logged in `activity_logs` table
- Use UUID primary keys for all tables
- Foreign key constraints prevent orphaned records
- Timestamps automatically tracked

---

**Last Updated:** January 2026  
**Status:** Production Ready
