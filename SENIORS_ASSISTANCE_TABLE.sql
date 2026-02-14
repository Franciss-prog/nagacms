-- Senior Assistance Table Creation and Initial Data
-- This table tracks health check-ups and assistance programs for senior citizens

-- Create seniors_assistance table
CREATE TABLE IF NOT EXISTS public.seniors_assistance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  recorded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  
  -- Vital Signs
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  blood_glucose DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  
  -- Health Assessment
  health_concerns TEXT,
  medications TEXT,
  mobility_status VARCHAR(50), -- 'independent', 'assisted', 'dependent'
  cognitive_status VARCHAR(50), -- 'sharp', 'mild_impairment', 'moderate_impairment', 'severe_impairment'
  
  -- Assistance Details
  assistance_type VARCHAR(255), -- 'Financial Assistance', 'Medical Support', 'Home Care', 'Counseling', 'Social Support', 'Food Assistance', 'Other'
  referral_needed BOOLEAN DEFAULT FALSE,
  referral_to TEXT,
  
  -- Additional Info
  notes TEXT,
  next_visit_date DATE,
  photo_url TEXT,
  synced BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_seniors_assistance_resident_id ON public.seniors_assistance(resident_id);
CREATE INDEX IF NOT EXISTS idx_seniors_assistance_visit_date ON public.seniors_assistance(visit_date);
CREATE INDEX IF NOT EXISTS idx_seniors_assistance_recorded_by ON public.seniors_assistance(recorded_by);
CREATE INDEX IF NOT EXISTS idx_seniors_assistance_mobility_status ON public.seniors_assistance(mobility_status);
CREATE INDEX IF NOT EXISTS idx_seniors_assistance_synced ON public.seniors_assistance(synced);

-- Add RLS (Row Level Security) policies if table is new
ALTER TABLE public.seniors_assistance ENABLE ROW LEVEL SECURITY;

-- Policy: Health workers can view and insert seniors_assistance records for their assigned barangay
CREATE POLICY "seniors_assistance_health_workers_read" ON public.seniors_assistance
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text
        AND user_role = 'workers'
        AND assigned_barangay = (
          SELECT barangay FROM public.residents WHERE id = seniors_assistance.resident_id
        )
    )
  );

CREATE POLICY "seniors_assistance_health_workers_insert" ON public.seniors_assistance
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text
        AND user_role = 'workers'
        AND assigned_barangay = (
          SELECT barangay FROM public.residents WHERE id = seniors_assistance.resident_id
        )
    )
  );

CREATE POLICY "seniors_assistance_health_workers_update" ON public.seniors_assistance
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text
        AND user_role = 'workers'
        AND assigned_barangay = (
          SELECT barangay FROM public.residents WHERE id = seniors_assistance.resident_id
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text
        AND user_role = 'workers'
        AND assigned_barangay = (
          SELECT barangay FROM public.residents WHERE id = seniors_assistance.resident_id
        )
    )
  );

-- Policy: Staff (LGU) can view all seniors assistance records
CREATE POLICY "seniors_assistance_staff_read" ON public.seniors_assistance
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text
        AND user_role = 'staff'
    )
  );

-- Policy: Seniors can view their own records
CREATE POLICY "seniors_assistance_own_records" ON public.seniors_assistance
  FOR SELECT
  USING (
    resident_id = auth.uid()::uuid
  );

-- Create a function to update seniors_assistance on touch
CREATE OR REPLACE FUNCTION update_seniors_assistance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS seniors_assistance_updated_at_trigger ON public.seniors_assistance;
CREATE TRIGGER seniors_assistance_updated_at_trigger
  BEFORE UPDATE ON public.seniors_assistance
  FOR EACH ROW
  EXECUTE FUNCTION update_seniors_assistance_updated_at();

-- Sample queries for health workers to use
-- Get all senior assistance records for a specific resident
-- SELECT * FROM seniors_assistance WHERE resident_id = '...' ORDER BY visit_date DESC;

-- Get seniors in need of immediate attention (with complex conditions)
-- SELECT 
--   r.full_name, 
--   sa.blood_pressure_systolic, 
--   sa.blood_pressure_diastolic,
--   sa.mobility_status,
--   sa.cognitive_status,
--   sa.referral_needed,
--   sa.visit_date
-- FROM seniors_assistance sa
-- JOIN residents r ON sa.resident_id = r.id
-- WHERE (
--   sa.blood_pressure_systolic > 160 
--   OR sa.blood_pressure_diastolic > 100
--   OR sa.cognitive_status IN ('moderate_impairment', 'severe_impairment')
--   OR sa.mobility_status = 'dependent'
--   OR sa.referral_needed = TRUE
-- )
-- AND sa.visit_date >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY sa.blood_pressure_systolic DESC, sa.visit_date DESC;

-- Get seniors with upcoming visits due
-- SELECT 
--   r.full_name,
--   r.phone_number,
--   sa.last_visit_date,
--   sa.next_visit_date,
--   (sa.next_visit_date - CURRENT_DATE) as days_until_visit
-- FROM seniors_assistance sa
-- JOIN residents r ON sa.resident_id = r.id
-- WHERE sa.next_visit_date IS NOT NULL
--   AND sa.next_visit_date <= CURRENT_DATE + INTERVAL '7 days'
--   AND sa.next_visit_date >= CURRENT_DATE
-- ORDER BY sa.next_visit_date ASC;
