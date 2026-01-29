-- ============================================================================
-- COMPLETE SETUP FOR HEALTH INDICATORS SERVICE
-- ============================================================================
-- Run this if you already have the users table
-- ============================================================================

-- 1. CREATE RESIDENTS TABLE (if not exists)
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

-- 2. CREATE HEALTH INDICATORS TABLE
CREATE TABLE IF NOT EXISTS public.health_indicators (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  indicator_type text NOT NULL CHECK (indicator_type = ANY (ARRAY[
    'blood_pressure'::text, 
    'temperature'::text, 
    'weight'::text, 
    'height'::text, 
    'bmi'::text,
    'heart_rate'::text,
    'glucose'::text,
    'cholesterol'::text,
    'oxygen_saturation'::text,
    'respiratory_rate'::text
  ])),
  value numeric NOT NULL,
  unit text NOT NULL,
  status text CHECK (status = ANY (ARRAY['normal'::text, 'warning'::text, 'critical'::text])),
  notes text,
  recorded_by uuid NOT NULL REFERENCES public.users(id),
  recorded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_indicators_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_health_indicators_resident_id ON public.health_indicators(resident_id);
CREATE INDEX IF NOT EXISTS idx_health_indicators_recorded_at ON public.health_indicators(recorded_at);
CREATE INDEX IF NOT EXISTS idx_health_indicators_indicator_type ON public.health_indicators(indicator_type);
CREATE INDEX IF NOT EXISTS idx_health_indicators_status ON public.health_indicators(status);

-- 3. CREATE VITAL SIGNS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.vital_signs_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  systolic integer NOT NULL,
  diastolic integer NOT NULL,
  temperature numeric,
  heart_rate integer,
  respiratory_rate integer,
  oxygen_saturation numeric,
  weight numeric,
  height numeric,
  bmi numeric,
  recorded_by uuid NOT NULL REFERENCES public.users(id),
  recorded_at timestamp with time zone DEFAULT now(),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vital_signs_history_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vital_signs_history_resident_id ON public.vital_signs_history(resident_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_history_recorded_at ON public.vital_signs_history(recorded_at);

-- 4. CREATE HEALTH PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.health_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  barangay text NOT NULL,
  description text,
  target_population text,
  start_date date,
  end_date date,
  status text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'completed'::text])),
  created_by uuid NOT NULL REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_programs_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_health_programs_barangay ON public.health_programs(barangay);
CREATE INDEX IF NOT EXISTS idx_health_programs_status ON public.health_programs(status);

-- 5. CREATE PROGRAM_BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS public.program_beneficiaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.health_programs(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT now(),
  status text CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'dropped'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT program_beneficiaries_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_program_beneficiaries_program_id ON public.program_beneficiaries(program_id);
CREATE INDEX IF NOT EXISTS idx_program_beneficiaries_resident_id ON public.program_beneficiaries(resident_id);

-- 6. CREATE VACCINATION_RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.vaccination_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  dose_number integer,
  vaccine_date date NOT NULL,
  next_dose_date date,
  vaccination_site text,
  administered_by uuid REFERENCES public.users(id),
  batch_number text,
  status text CHECK (status = ANY (ARRAY['completed'::text, 'pending'::text, 'overdue'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vaccination_records_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vaccination_records_resident_id ON public.vaccination_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_vaccine_date ON public.vaccination_records(vaccine_date);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_status ON public.vaccination_records(status);

-- 7. CREATE DISEASE_CASES TABLE
CREATE TABLE IF NOT EXISTS public.disease_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  case_classification text CHECK (case_classification = ANY (ARRAY[
    'confirmed'::text, 
    'probable'::text, 
    'suspected'::text
  ])),
  date_reported date NOT NULL,
  date_onset date,
  outcome text CHECK (outcome = ANY (ARRAY['recovered'::text, 'ongoing'::text, 'fatal'::text])),
  reported_by uuid NOT NULL REFERENCES public.users(id),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT disease_cases_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_disease_cases_resident_id ON public.disease_cases(resident_id);
CREATE INDEX IF NOT EXISTS idx_disease_cases_disease_name ON public.disease_cases(disease_name);
CREATE INDEX IF NOT EXISTS idx_disease_cases_date_reported ON public.disease_cases(date_reported);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

INSERT INTO public.residents (barangay, purok, full_name, birth_date, sex, contact_number, philhealth_no) 
VALUES
('Barangay 1', 'Purok A', 'Maria Santos', '1985-05-15', 'Female', '09123456789', 'PH-2024-001'),
('Barangay 1', 'Purok B', 'Juan Dela Cruz', '1990-08-22', 'Male', '09234567890', 'PH-2024-002'),
('Barangay 2', 'Purok C', 'Rosa Garcia', '1992-12-10', 'Female', '09345678901', 'PH-2024-003')
ON CONFLICT DO NOTHING;
