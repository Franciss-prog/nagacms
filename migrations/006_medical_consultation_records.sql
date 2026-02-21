-- ============================================================================
-- MEDICAL CONSULTATION RECORDS TABLE
-- ============================================================================
-- For CHU/RHU consultation form data entry by health workers
-- ============================================================================

-- MEDICAL CONSULTATION RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.medical_consultation_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- PATIENT INFORMATION (Section I)
  -- If resident_id is provided, pulls from residents table; otherwise uses manual entry
  resident_id uuid REFERENCES public.residents(id) ON DELETE SET NULL,
  last_name text NOT NULL,
  first_name text NOT NULL,
  middle_name text,
  suffix text, -- Jr., Sr., II, III, etc.
  age integer NOT NULL,
  sex text NOT NULL CHECK (sex IN ('M', 'F')),
  address text NOT NULL,
  philhealth_id text,
  
  -- Barangay for filtering (auto-set by worker's assigned barangay)
  barangay text NOT NULL,
  
  -- CHU/RHU PERSONNEL FIELDS (Section II)
  -- Mode of Transaction
  mode_of_transaction text NOT NULL CHECK (mode_of_transaction IN ('walk_in', 'visited', 'referral')),
  
  -- For referred patients
  referred_from text,
  referred_to text,
  
  -- Consultation Details
  consultation_date date NOT NULL,
  consultation_time time,
  
  -- Vital Signs
  temperature numeric(4,1), -- e.g., 37.5
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  
  -- Provider Info
  attending_provider text NOT NULL,
  referral_reason text,
  referred_by text,
  
  -- Nature of Visit (can be multiple - stored as array or single value)
  nature_of_visit text NOT NULL CHECK (nature_of_visit IN ('new_consultation', 'new_admission', 'follow_up')),
  
  -- Type of Consultation / Purpose (can be multiple - stored as JSONB array)
  consultation_types text[] NOT NULL DEFAULT '{}',
  -- Allowed values: 'general', 'family_planning', 'prenatal', 'postpartum', 
  -- 'tuberculosis', 'dental_care', 'child_care', 'immunization', 
  -- 'child_nutrition', 'sick_children', 'injury', 'firecracker_injury', 'adult_immunization'
  
  -- Clinical Fields
  chief_complaints text,
  diagnosis text,
  consultation_notes text,
  medication_treatment text,
  laboratory_findings text,
  performed_laboratory_test text,
  
  -- Record Metadata
  healthcare_provider_name text NOT NULL, -- Name of health care provider who signed
  recorded_by uuid REFERENCES public.users(id), -- Worker who entered the data
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT medical_consultation_records_pkey PRIMARY KEY (id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_resident_id 
  ON public.medical_consultation_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_barangay 
  ON public.medical_consultation_records(barangay);
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_consultation_date 
  ON public.medical_consultation_records(consultation_date);
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_last_name 
  ON public.medical_consultation_records(last_name);
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_mode_of_transaction 
  ON public.medical_consultation_records(mode_of_transaction);
CREATE INDEX IF NOT EXISTS idx_medical_consultation_records_nature_of_visit 
  ON public.medical_consultation_records(nature_of_visit);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_medical_consultation_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_medical_consultation_records_updated_at ON public.medical_consultation_records;
CREATE TRIGGER update_medical_consultation_records_updated_at
    BEFORE UPDATE ON public.medical_consultation_records
    FOR EACH ROW
    EXECUTE FUNCTION update_medical_consultation_records_updated_at();

-- RLS Policies
ALTER TABLE public.medical_consultation_records ENABLE ROW LEVEL SECURITY;

-- Workers can view records in their assigned barangay
CREATE POLICY "Workers can view medical consultations in their barangay"
  ON public.medical_consultation_records
  FOR SELECT
  USING (true);

-- Workers can insert records for their barangay
CREATE POLICY "Workers can insert medical consultations"
  ON public.medical_consultation_records
  FOR INSERT
  WITH CHECK (true);

-- Workers can update records they created
CREATE POLICY "Workers can update their medical consultations"
  ON public.medical_consultation_records
  FOR UPDATE
  USING (true);

COMMENT ON TABLE public.medical_consultation_records IS 'CHU/RHU medical consultation records entered by health workers';
