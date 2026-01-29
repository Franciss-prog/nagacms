-- ============================================================================
-- BARANGAY HEALTH DASHBOARD - SUPABASE SCHEMA
-- ============================================================================
-- This file contains all SQL queries needed to set up the database tables
-- for the Barangay Health Dashboard system.
-- ============================================================================

-- 1. USERS TABLE (for BHW staff)
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

-- ============================================================================
-- 2. RESIDENTS TABLE
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

-- ============================================================================
-- 3. HEALTH FACILITIES TABLE
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

-- ============================================================================
-- 4. FACILITY SCHEDULES TABLE
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

-- ============================================================================
-- 5. PERSONNEL AVAILABILITY TABLE
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

-- ============================================================================
-- 6. SUBMISSIONS TABLE (Health concerns, program inquiries, etc.)
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

-- ============================================================================
-- 7. YAKAP APPLICATIONS TABLE
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

-- ============================================================================
-- 8. ACTIVITY LOGS TABLE
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

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample users (BHW staff)
INSERT INTO public.users (username, password_hash, role, assigned_barangay) VALUES
('admin', '$2a$10$example_hash', 'admin', 'Barangay San Jose'),
('bhw_user1', '$2a$10$example_hash', 'barangay_admin', 'Barangay San Jose'),
('bhw_user2', '$2a$10$example_hash', 'user', 'Barangay Mabini');

-- Insert sample facilities
INSERT INTO public.health_facilities (name, barangay, latitude, longitude, contact_json) VALUES
('San Jose Health Center', 'Barangay San Jose', 14.5994, 120.9842, '{"phone": "555-0001", "email": "sjhc@health.gov", "address": "Main St, San Jose"}'),
('Mabini Clinic', 'Barangay Mabini', 14.5900, 120.9750, '{"phone": "555-0002", "email": "mabini@health.gov", "address": "Health Way, Mabini"}');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
