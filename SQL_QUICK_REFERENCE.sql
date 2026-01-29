-- ============================================================================
-- QUICK REFERENCE: Most Common SQL Queries for Barangay Health Dashboard
-- ============================================================================
-- Copy and paste these queries directly into Supabase SQL Editor

-- ============================================================================
-- 1. SETUP QUERIES
-- ============================================================================

-- Create all tables (RUN IN ORDER)
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

-- Create indexes for better performance
CREATE INDEX idx_users_assigned_barangay ON public.users(assigned_barangay);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_residents_barangay ON public.residents(barangay);
CREATE INDEX idx_residents_purok ON public.residents(purok);
CREATE INDEX idx_residents_full_name ON public.residents(full_name);
CREATE INDEX idx_health_facilities_barangay ON public.health_facilities(barangay);
CREATE INDEX idx_health_facilities_name ON public.health_facilities(name);
CREATE INDEX idx_facility_schedules_facility_id ON public.facility_schedules(facility_id);
CREATE INDEX idx_facility_schedules_day_of_week ON public.facility_schedules(day_of_week);
CREATE INDEX idx_personnel_availability_facility_id ON public.personnel_availability(facility_id);
CREATE INDEX idx_submissions_resident_id ON public.submissions(resident_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at);
CREATE INDEX idx_submissions_reviewed_by ON public.submissions(reviewed_by);
CREATE INDEX idx_yakap_applications_resident_id ON public.yakap_applications(resident_id);
CREATE INDEX idx_yakap_applications_status ON public.yakap_applications(status);
CREATE INDEX idx_yakap_applications_applied_at ON public.yakap_applications(applied_at);
CREATE INDEX idx_yakap_applications_approved_by ON public.yakap_applications(approved_by);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_resource_type ON public.activity_logs(resource_type);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- ============================================================================
-- 2. STAFF MANAGEMENT QUERIES
-- ============================================================================

-- Get all staff
SELECT * FROM users ORDER BY username ASC;

-- Get staff for a specific barangay
SELECT * FROM users WHERE assigned_barangay = 'Barangay San Jose' ORDER BY username ASC;

-- Get staff by role
SELECT * FROM users WHERE role = 'barangay_admin' ORDER BY username ASC;

-- Count staff by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- ============================================================================
-- 3. RESIDENTS QUERIES
-- ============================================================================

-- Get all residents in a barangay
SELECT * FROM residents WHERE barangay = 'Barangay San Jose' ORDER BY full_name ASC;

-- Search residents by name
SELECT * FROM residents WHERE full_name ILIKE '%Juan%' ORDER BY full_name ASC;

-- Get residents by purok
SELECT * FROM residents WHERE barangay = 'Barangay San Jose' AND purok = 'Purok 1' ORDER BY full_name ASC;

-- Get seniors (age 60+)
SELECT * FROM residents 
WHERE EXTRACT(YEAR FROM age(birth_date)) >= 60
ORDER BY full_name ASC;

-- Get PWD residents (those with PWD in submissions)
SELECT DISTINCT r.* FROM residents r
JOIN yakap_applications ya ON r.id = ya.resident_id
WHERE ya.membership_type = 'pwd'
ORDER BY r.full_name ASC;

-- ============================================================================
-- 4. FACILITIES QUERIES
-- ============================================================================

-- Get all facilities
SELECT * FROM health_facilities ORDER BY barangay, name ASC;

-- Get facilities in a specific barangay
SELECT * FROM health_facilities WHERE barangay = 'Barangay San Jose' ORDER BY name ASC;

-- Get facility details with schedules
SELECT 
  f.id, f.name, f.barangay, f.latitude, f.longitude,
  json_agg(json_build_object(
    'id', s.id, 'service_name', s.service_name, 'day_of_week', s.day_of_week,
    'time_start', s.time_start, 'time_end', s.time_end
  )) as schedules
FROM health_facilities f
LEFT JOIN facility_schedules s ON f.id = s.facility_id
WHERE f.id = 'facility-uuid-here'
GROUP BY f.id, f.name, f.barangay, f.latitude, f.longitude;

-- Get personnel for a facility
SELECT * FROM personnel_availability WHERE facility_id = 'facility-uuid-here' ORDER BY personnel_name ASC;

-- ============================================================================
-- 5. SUBMISSIONS QUERIES
-- ============================================================================

-- Get all pending submissions
SELECT s.id, s.submission_type, r.full_name, s.description, s.submitted_at
FROM submissions s
JOIN residents r ON s.resident_id = r.id
WHERE s.status = 'pending'
ORDER BY s.submitted_at DESC;

-- Get submissions by status
SELECT COUNT(*), status FROM submissions GROUP BY status;

-- Get submissions for a resident
SELECT * FROM submissions WHERE resident_id = 'resident-uuid-here' ORDER BY submitted_at DESC;

-- Get submissions by type
SELECT submission_type, COUNT(*) FROM submissions GROUP BY submission_type;

-- Get reviewed submissions with reviewer info
SELECT s.id, s.submission_type, r.full_name as resident, u.username as reviewed_by, s.reviewed_at, s.status
FROM submissions s
JOIN residents r ON s.resident_id = r.id
LEFT JOIN users u ON s.reviewed_by = u.id
WHERE s.reviewed_by IS NOT NULL
ORDER BY s.reviewed_at DESC;

-- ============================================================================
-- 6. YAKAP APPLICATIONS QUERIES
-- ============================================================================

-- Get all pending YAKAP applications
SELECT ya.id, r.full_name, ya.membership_type, ya.philhealth_no, ya.applied_at
FROM yakap_applications ya
JOIN residents r ON ya.resident_id = r.id
WHERE ya.status = 'pending'
ORDER BY ya.applied_at DESC;

-- Get YAKAP status summary
SELECT status, COUNT(*) as count FROM yakap_applications GROUP BY status;

-- Get YAKAP by membership type
SELECT membership_type, COUNT(*) FROM yakap_applications GROUP BY membership_type;

-- Get approved YAKAP with approver info
SELECT ya.id, r.full_name, ya.membership_type, u.username as approved_by, ya.approved_at
FROM yakap_applications ya
JOIN residents r ON ya.resident_id = r.id
LEFT JOIN users u ON ya.approved_by = u.id
WHERE ya.status = 'approved'
ORDER BY ya.approved_at DESC;

-- Get YAKAP applications for a resident
SELECT * FROM yakap_applications WHERE resident_id = 'resident-uuid-here' ORDER BY applied_at DESC;

-- ============================================================================
-- 7. ACTIVITY LOG QUERIES
-- ============================================================================

-- Get recent activity
SELECT a.*, u.username FROM activity_logs a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 50;

-- Get activity by resource type
SELECT a.*, u.username FROM activity_logs a
JOIN users u ON a.user_id = u.id
WHERE a.resource_type = 'yakap_application'
ORDER BY a.created_at DESC;

-- Get activity for a specific user
SELECT * FROM activity_logs WHERE user_id = 'user-uuid-here' ORDER BY created_at DESC;

-- Get approvals/reviews by a user
SELECT * FROM activity_logs 
WHERE user_id = 'user-uuid-here' 
AND action IN ('approved', 'returned')
ORDER BY created_at DESC;

-- ============================================================================
-- 8. ANALYTICS & REPORTING QUERIES
-- ============================================================================

-- Dashboard statistics
SELECT 
  (SELECT COUNT(*) FROM submissions WHERE status = 'pending') as pending_submissions,
  (SELECT COUNT(*) FROM yakap_applications WHERE status = 'pending') as pending_yakap,
  (SELECT COUNT(*) FROM yakap_applications WHERE status = 'approved') as approved_yakap,
  (SELECT COUNT(*) FROM residents) as total_residents;

-- Monthly submissions trend
SELECT 
  DATE_TRUNC('month', submitted_at) as month,
  submission_type,
  COUNT(*) as count
FROM submissions
GROUP BY DATE_TRUNC('month', submitted_at), submission_type
ORDER BY month DESC;

-- YAKAP coverage by barangay
SELECT 
  r.barangay,
  COUNT(DISTINCT r.id) as total_residents,
  COUNT(CASE WHEN ya.status = 'approved' THEN 1 END) as yakap_approved,
  ROUND(100.0 * COUNT(CASE WHEN ya.status = 'approved' THEN 1 END) / COUNT(DISTINCT r.id), 2) as coverage_percent
FROM residents r
LEFT JOIN yakap_applications ya ON r.id = ya.resident_id
GROUP BY r.barangay
ORDER BY coverage_percent DESC;

-- Staff activity report
SELECT 
  u.username, 
  u.role,
  COUNT(*) as actions_count,
  MAX(a.created_at) as last_activity
FROM activity_logs a
JOIN users u ON a.user_id = u.id
GROUP BY u.id, u.username, u.role
ORDER BY actions_count DESC;

-- ============================================================================
-- 9. DATA CLEANUP QUERIES (Use with caution!)
-- ============================================================================

-- Delete all test submissions
-- DELETE FROM submissions WHERE id IN (
--   SELECT id FROM submissions WHERE description ILIKE '%test%' LIMIT 5
-- );

-- Delete old activity logs (older than 6 months)
-- DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '6 months';

-- ============================================================================
-- END OF QUERIES
-- ============================================================================
