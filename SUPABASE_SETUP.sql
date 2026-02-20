# Copy-Paste SQL for Supabase Setup

## Instructions
1. Open your Supabase project
2. Go to SQL Editor
3. Create a new query
4. Copy the entire script below
5. Click "Run"

---

## Complete Database Setup Script

```sql
-- ============================================================================
-- BARANGAY HEALTH DASHBOARD - COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- Drop existing tables if needed (WARNING: deletes all data)
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS announcement_notifications CASCADE;
-- DROP TABLE IF EXISTS announcement_targets CASCADE;
-- DROP TABLE IF EXISTS announcements CASCADE;
-- DROP TABLE IF EXISTS yakap_applications CASCADE;
-- DROP TABLE IF EXISTS submissions CASCADE;
-- DROP TABLE IF EXISTS personnel_availability CASCADE;
-- DROP TABLE IF EXISTS facility_schedules CASCADE;
-- DROP TABLE IF EXISTS health_facilities CASCADE;
-- DROP TABLE IF EXISTS residents CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- TABLE 1: USERS (BHW Staff)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'barangay_admin'::text])),
  assigned_barangay text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_users_assigned_barangay ON public.users(assigned_barangay);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ============================================================================
-- TABLE 2: RESIDENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.residents (
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

CREATE INDEX IF NOT EXISTS idx_residents_barangay ON public.residents(barangay);
CREATE INDEX IF NOT EXISTS idx_residents_purok ON public.residents(purok);
CREATE INDEX IF NOT EXISTS idx_residents_full_name ON public.residents(full_name);

-- ============================================================================
-- TABLE 3: HEALTH FACILITIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.health_facilities (
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

CREATE INDEX IF NOT EXISTS idx_health_facilities_barangay ON public.health_facilities(barangay);
CREATE INDEX IF NOT EXISTS idx_health_facilities_name ON public.health_facilities(name);

-- ============================================================================
-- TABLE 4: FACILITY SCHEDULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.facility_schedules (
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

CREATE INDEX IF NOT EXISTS idx_facility_schedules_facility_id ON public.facility_schedules(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_schedules_day_of_week ON public.facility_schedules(day_of_week);

-- ============================================================================
-- TABLE 5: PERSONNEL AVAILABILITY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.personnel_availability (
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

CREATE INDEX IF NOT EXISTS idx_personnel_availability_facility_id ON public.personnel_availability(facility_id);

-- ============================================================================
-- TABLE 6: SUBMISSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.submissions (
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

CREATE INDEX IF NOT EXISTS idx_submissions_resident_id ON public.submissions(resident_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_submissions_reviewed_by ON public.submissions(reviewed_by);

-- ============================================================================
-- TABLE 7: YAKAP APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.yakap_applications (
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

CREATE INDEX IF NOT EXISTS idx_yakap_applications_resident_id ON public.yakap_applications(resident_id);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_status ON public.yakap_applications(status);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_applied_at ON public.yakap_applications(applied_at);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_approved_by ON public.yakap_applications(approved_by);

-- ============================================================================
-- TABLE 8: ACTIVITY LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
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

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON public.activity_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- ============================================================================
-- TABLE 9: ANNOUNCEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  poster_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC);

-- ============================================================================
-- TABLE 10: ANNOUNCEMENT TARGETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcement_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  barangay text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT announcement_targets_unique UNIQUE (announcement_id, barangay)
);

CREATE INDEX IF NOT EXISTS idx_announcement_targets_barangay ON public.announcement_targets(barangay);
CREATE INDEX IF NOT EXISTS idx_announcement_targets_announcement_id ON public.announcement_targets(announcement_id);

-- ============================================================================
-- TABLE 11: ANNOUNCEMENT NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcement_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  barangay text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT announcement_notifications_unique UNIQUE (announcement_id, barangay)
);

CREATE INDEX IF NOT EXISTS idx_announcement_notifications_barangay ON public.announcement_notifications(barangay);
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_read ON public.announcement_notifications(is_read);

-- Timestamp trigger for updated_at fields
CREATE OR REPLACE FUNCTION public.set_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS announcements_set_updated_at ON public.announcements;
CREATE TRIGGER announcements_set_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp_updated_at();

DROP TRIGGER IF EXISTS announcement_notifications_set_updated_at ON public.announcement_notifications;
CREATE TRIGGER announcement_notifications_set_updated_at
BEFORE UPDATE ON public.announcement_notifications
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp_updated_at();

-- ============================================================================
-- SAMPLE DATA INSERTS
-- ============================================================================

-- Insert sample users (BHW staff)
INSERT INTO public.users (username, password_hash, role, assigned_barangay) 
VALUES 
  ('admin', '$2a$10$example_hash_1', 'admin', 'Barangay San Jose'),
  ('bhw_manager', '$2a$10$example_hash_2', 'barangay_admin', 'Barangay San Jose'),
  ('bhw_user1', '$2a$10$example_hash_3', 'user', 'Barangay San Jose'),
  ('bhw_user2', '$2a$10$example_hash_4', 'user', 'Barangay Mabini')
ON CONFLICT (username) DO NOTHING;

-- Insert sample facilities
INSERT INTO public.health_facilities (name, barangay, latitude, longitude, contact_json) 
VALUES 
  ('San Jose Health Center', 'Barangay San Jose', 14.5994, 120.9842, '{"phone": "555-0001", "email": "sjhc@health.gov", "address": "Main St, San Jose"}'),
  ('Mabini Clinic', 'Barangay Mabini', 14.5900, 120.9750, '{"phone": "555-0002", "email": "mabini@health.gov", "address": "Health Way, Mabini"}');

-- Insert sample residents
INSERT INTO public.residents (barangay, purok, full_name, birth_date, sex, contact_number, philhealth_no) 
VALUES 
  ('Barangay San Jose', 'Purok 1', 'Juan Dela Cruz', '1985-05-15', 'Male', '09171234567', NULL),
  ('Barangay San Jose', 'Purok 2', 'Maria Santos', '1990-03-20', 'Female', '09281234567', '12-345678901-2'),
  ('Barangay Mabini', 'Purok 1', 'Pedro Reyes', '1978-08-10', 'Male', '09091234567', NULL);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check table creation
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Count records
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'residents', COUNT(*) FROM residents
UNION ALL
SELECT 'health_facilities', COUNT(*) FROM health_facilities
UNION ALL
SELECT 'facility_schedules', COUNT(*) FROM facility_schedules
UNION ALL
SELECT 'personnel_availability', COUNT(*) FROM personnel_availability
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'yakap_applications', COUNT(*) FROM yakap_applications
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'announcements', COUNT(*) FROM announcements
UNION ALL
SELECT 'announcement_targets', COUNT(*) FROM announcement_targets
UNION ALL
SELECT 'announcement_notifications', COUNT(*) FROM announcement_notifications;

-- Force schema cache refresh for PostgREST (Supabase API)
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
```

---

## ✅ After Running the Script

You should see:
1. All 11 tables created successfully
2. Sample data inserted (4 users, 2 facilities, 3 residents)
3. All indexes created for performance
4. Verification queries show table counts

---

## 🚀 Next Steps

1. Verify all tables appear in Supabase "Tables" view
2. Check sample data in each table
3. Start the application: `npm run dev`
4. Test creating/editing data from the dashboard

---

## 📋 Table Summary

| Table | Records | Purpose |
|-------|---------|---------|
| users | 4 | BHW staff |
| residents | 3 | Resident registry |
| health_facilities | 2 | Health centers |
| facility_schedules | 0 | Service schedules |
| personnel_availability | 0 | Staff availability |
| submissions | 0 | Health concerns |
| yakap_applications | 0 | Insurance apps |
| activity_logs | 0 | Audit trail |
| announcements | 0 | Announcements |
| announcement_targets | 0 | Target barangays |
| announcement_notifications | 0 | Read tracking |

---

**Status:** Ready to paste and run ✓
