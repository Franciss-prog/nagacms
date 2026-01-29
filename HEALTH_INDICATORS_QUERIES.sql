-- ============================================================================
-- HEALTH INDICATORS SERVICE - ADDITIONAL TABLES & QUERIES
-- ============================================================================
-- Add this to your database to support the Health-Indicators service
-- ============================================================================

-- 1. HEALTH INDICATORS TABLE (Main health metrics tracking)
CREATE TABLE public.health_indicators (
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
  unit text NOT NULL, -- e.g., "mmHg", "°C", "kg", "cm", "bpm", "mg/dL", "%"
  status text CHECK (status = ANY (ARRAY['normal'::text, 'warning'::text, 'critical'::text])),
  notes text,
  recorded_by uuid NOT NULL REFERENCES public.users(id),
  recorded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_indicators_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_health_indicators_resident_id ON public.health_indicators(resident_id);
CREATE INDEX idx_health_indicators_recorded_at ON public.health_indicators(recorded_at);
CREATE INDEX idx_health_indicators_indicator_type ON public.health_indicators(indicator_type);
CREATE INDEX idx_health_indicators_status ON public.health_indicators(status);

-- ============================================================================
-- 2. VITAL SIGNS HISTORY TABLE (Track vital signs over time)
CREATE TABLE public.vital_signs_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  systolic integer NOT NULL, -- Blood pressure systolic
  diastolic integer NOT NULL, -- Blood pressure diastolic
  temperature numeric, -- Body temperature in Celsius
  heart_rate integer, -- Beats per minute
  respiratory_rate integer, -- Breaths per minute
  oxygen_saturation numeric, -- SpO2 percentage
  weight numeric, -- in kg
  height numeric, -- in cm
  bmi numeric, -- Calculated BMI
  recorded_by uuid NOT NULL REFERENCES public.users(id),
  recorded_at timestamp with time zone DEFAULT now(),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vital_signs_history_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_vital_signs_history_resident_id ON public.vital_signs_history(resident_id);
CREATE INDEX idx_vital_signs_history_recorded_at ON public.vital_signs_history(recorded_at);

-- ============================================================================
-- 3. HEALTH PROGRAMS TABLE (Track health programs and beneficiaries)
CREATE TABLE public.health_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  barangay text NOT NULL,
  description text,
  target_population text, -- e.g., "pregnant women", "children", "elderly"
  start_date date,
  end_date date,
  status text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'completed'::text])),
  created_by uuid NOT NULL REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT health_programs_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_health_programs_barangay ON public.health_programs(barangay);
CREATE INDEX idx_health_programs_status ON public.health_programs(status);

-- ============================================================================
-- 4. PROGRAM_BENEFICIARIES TABLE (Link residents to health programs)
CREATE TABLE public.program_beneficiaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.health_programs(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  enrollment_date date DEFAULT now(),
  status text CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'dropped'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT program_beneficiaries_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_program_beneficiaries_program_id ON public.program_beneficiaries(program_id);
CREATE INDEX idx_program_beneficiaries_resident_id ON public.program_beneficiaries(resident_id);

-- ============================================================================
-- 5. VACCINATION_RECORDS TABLE (Immunization tracking)
CREATE TABLE public.vaccination_records (
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

CREATE INDEX idx_vaccination_records_resident_id ON public.vaccination_records(resident_id);
CREATE INDEX idx_vaccination_records_vaccine_date ON public.vaccination_records(vaccine_date);
CREATE INDEX idx_vaccination_records_status ON public.vaccination_records(status);

-- ============================================================================
-- 6. DISEASE_CASES TABLE (Disease surveillance and tracking)
CREATE TABLE public.disease_cases (
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

CREATE INDEX idx_disease_cases_resident_id ON public.disease_cases(resident_id);
CREATE INDEX idx_disease_cases_disease_name ON public.disease_cases(disease_name);
CREATE INDEX idx_disease_cases_date_reported ON public.disease_cases(date_reported);

-- ============================================================================
-- QUICK REFERENCE QUERIES FOR HEALTH INDICATORS SERVICE
-- ============================================================================
-- NOTE: These are template queries. Replace placeholder values before running:
--   - Replace 'resident-uuid-here' with actual resident UUID from residents table
--   - Replace 'barangay-name' with actual barangay name
-- ============================================================================

-- Example: Get latest health indicators for a resident
-- First, get resident ID: SELECT id, full_name FROM residents LIMIT 5;
-- Then use the UUID in the query below:
/*
SELECT 
  resident_id,
  indicator_type,
  value,
  unit,
  status,
  recorded_at
FROM health_indicators
WHERE resident_id = (SELECT id FROM residents WHERE full_name = 'Maria Santos' LIMIT 1)
ORDER BY recorded_at DESC
LIMIT 10;
*/

-- Example: Get vital signs history for a resident (last 30 days)
/*
SELECT 
  recorded_at,
  systolic,
  diastolic,
  temperature,
  heart_rate,
  oxygen_saturation,
  weight,
  bmi,
  notes
FROM vital_signs_history
WHERE resident_id = (SELECT id FROM residents WHERE full_name = 'Maria Santos' LIMIT 1)
  AND recorded_at >= NOW() - INTERVAL '30 days'
ORDER BY recorded_at DESC;
*/

-- Example: Get critical health indicators by barangay
/*
SELECT 
  r.full_name,
  r.contact_number,
  hi.indicator_type,
  hi.value,
  hi.unit,
  hi.status,
  hi.recorded_at,
  hi.notes
FROM health_indicators hi
JOIN residents r ON hi.resident_id = r.id
WHERE r.barangay = 'Barangay 1'
  AND hi.status IN ('warning', 'critical')
  AND hi.recorded_at >= NOW() - INTERVAL '7 days'
ORDER BY hi.recorded_at DESC;
*/

-- Example: Get health program statistics
/*
SELECT 
  hp.program_name,
  COUNT(pb.id) as total_beneficiaries,
  SUM(CASE WHEN pb.status = 'active' THEN 1 ELSE 0 END) as active_count,
  SUM(CASE WHEN pb.status = 'completed' THEN 1 ELSE 0 END) as completed_count
FROM health_programs hp
LEFT JOIN program_beneficiaries pb ON hp.id = pb.program_id
WHERE hp.barangay = 'Barangay 1'
GROUP BY hp.id, hp.program_name;
*/

-- Example: Get vaccination coverage statistics
/*
SELECT 
  vaccine_name,
  COUNT(DISTINCT resident_id) as total_vaccinated,
  COUNT(DISTINCT CASE WHEN status = 'completed' THEN resident_id END) as completed,
  COUNT(DISTINCT CASE WHEN status = 'overdue' THEN resident_id END) as overdue
FROM vaccination_records
WHERE EXTRACT(YEAR FROM vaccine_date) = EXTRACT(YEAR FROM NOW())
GROUP BY vaccine_name;
*/

-- Example: Get disease surveillance report
/*
SELECT 
  disease_name,
  case_classification,
  COUNT(*) as case_count,
  COUNT(DISTINCT CASE WHEN outcome = 'recovered' THEN resident_id END) as recovered,
  COUNT(DISTINCT CASE WHEN outcome = 'ongoing' THEN resident_id END) as ongoing,
  COUNT(DISTINCT CASE WHEN outcome = 'fatal' THEN resident_id END) as deaths
FROM disease_cases
WHERE EXTRACT(YEAR FROM date_reported) = EXTRACT(YEAR FROM NOW())
GROUP BY disease_name, case_classification;
*/

-- Example: Get residents with pending vaccinations
/*
SELECT 
  r.id,
  r.full_name,
  r.contact_number,
  vr.vaccine_name,
  vr.next_dose_date
FROM vaccination_records vr
JOIN residents r ON vr.resident_id = r.id
WHERE vr.status = 'pending'
  AND vr.next_dose_date <= NOW()::date
ORDER BY vr.next_dose_date ASC;
*/
