-- =============================================================
-- Pregnancy Profiling Records Table + RLS Policies
-- =============================================================

CREATE TABLE IF NOT EXISTS public.pregnancy_profiling_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  resident_id uuid NOT NULL
    REFERENCES public.residents(id) ON DELETE CASCADE,

  -- Core tracking
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  is_inquirer boolean NOT NULL DEFAULT false,
  inquiry_details text,

  -- 1) Pregnancy History
  gravida integer CHECK (gravida >= 0),
  para integer CHECK (para >= 0),
  term integer CHECK (term >= 0),
  pre_term integer CHECK (pre_term >= 0),
  abortion integer CHECK (abortion >= 0),
  living integer CHECK (living >= 0),
  type_of_delivery text,

  -- 2) Pertinent Physical Examination Findings
  blood_pressure text,
  heart_rate integer CHECK (heart_rate > 0),
  respiratory_rate integer CHECK (respiratory_rate > 0),
  height numeric(6,2) CHECK (height > 0),
  weight numeric(6,2) CHECK (weight > 0),
  bmi numeric(6,2) CHECK (bmi > 0),
  temperature numeric(4,1) CHECK (temperature > 0),
  visual_acuity_left text,
  visual_acuity_right text,

  -- 3) Pediatric Client (0–24 months)
  length numeric(6,2) CHECK (length > 0),
  waist_circumference numeric(6,2) CHECK (waist_circumference > 0),
  middle_upper_arm_circumference numeric(6,2) CHECK (middle_upper_arm_circumference > 0),
  head_circumference numeric(6,2) CHECK (head_circumference > 0),
  hip numeric(6,2) CHECK (hip > 0),
  skinfold_thickness numeric(6,2) CHECK (skinfold_thickness > 0),
  limbs text,

  -- 4) Pediatric Client (0–60 months)
  blood_type text CHECK (blood_type IN ('A+','B+','AB+','O+','A-','B-','AB-','O-')),
  z_score_cm numeric(6,2),

  -- 5) General Survey (jsonb per body system)
  -- Shape: { "heent": {"findings":[], "others":""}, ... }
  general_survey jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- 6) NCD High Risk Assessment
  eats_processed_fast_foods text CHECK (eats_processed_fast_foods IN ('yes','no')),
  vegetables_3_servings_daily text CHECK (vegetables_3_servings_daily IN ('yes','no')),
  fruits_2_3_servings_daily text CHECK (fruits_2_3_servings_daily IN ('yes','no')),
  moderate_activity_2_5hrs_weekly text CHECK (moderate_activity_2_5hrs_weekly IN ('yes','no')),
  diagnosed_diabetes text CHECK (diagnosed_diabetes IN ('yes','no','do_not_know')),
  diabetes_management text CHECK (diabetes_management IN ('with_medication','without_medication')),
  diabetes_symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,

  angina_or_heart_attack text CHECK (angina_or_heart_attack IN ('yes','no')),
  chest_pain_pressure text CHECK (chest_pain_pressure IN ('yes','no')),
  chest_left_arm_pain text CHECK (chest_left_arm_pain IN ('yes','no')),
  chest_pain_with_walking_uphill_hurry text CHECK (chest_pain_with_walking_uphill_hurry IN ('yes','no')),
  chest_pain_slows_down_walking text CHECK (chest_pain_slows_down_walking IN ('yes','no')),
  chest_pain_relieved_by_rest_or_tablet text CHECK (chest_pain_relieved_by_rest_or_tablet IN ('yes','no')),
  chest_pain_gone_under_10mins text CHECK (chest_pain_gone_under_10mins IN ('yes','no')),
  chest_pain_severe_30mins_or_more text CHECK (chest_pain_severe_30mins_or_more IN ('yes','no')),
  stroke_or_tia text CHECK (stroke_or_tia IN ('yes','no')),
  difficulty_talking_or_one_side_weakness text CHECK (difficulty_talking_or_one_side_weakness IN ('yes','no')),
  risk_level text CHECK (risk_level IN ('lt_10','10_to_lt_20','20_to_lt_30','30_to_lt_40','gte_40')),

  -- 7) Lab Results
  raised_blood_glucose text CHECK (raised_blood_glucose IN ('yes','no')),
  raised_blood_glucose_date date,
  raised_blood_glucose_result text,

  raised_blood_lipids text CHECK (raised_blood_lipids IN ('yes','no')),
  raised_blood_lipids_date date,
  raised_blood_lipids_result text,

  urine_ketones_positive text CHECK (urine_ketones_positive IN ('yes','no')),
  urine_ketones_date date,
  urine_ketones_result text,

  urine_protein_positive text CHECK (urine_protein_positive IN ('yes','no')),
  urine_protein_date date,
  urine_protein_result text,

  notes text,

  recorded_by uuid REFERENCES public.users(id),
  updated_by uuid REFERENCES public.users(id),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT pregnancy_profiling_records_resident_unique UNIQUE (resident_id)
);

CREATE INDEX IF NOT EXISTS idx_ppr_resident_id ON public.pregnancy_profiling_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_ppr_visit_date ON public.pregnancy_profiling_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_ppr_is_inquirer ON public.pregnancy_profiling_records(is_inquirer);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.set_ppr_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_ppr_updated_at ON public.pregnancy_profiling_records;
CREATE TRIGGER trg_set_ppr_updated_at
BEFORE UPDATE ON public.pregnancy_profiling_records
FOR EACH ROW EXECUTE FUNCTION public.set_ppr_updated_at();

-- =============================================================
-- RLS Policies
-- =============================================================

ALTER TABLE public.pregnancy_profiling_records ENABLE ROW LEVEL SECURITY;

-- LGU staff can view all records in their assigned barangay
CREATE POLICY "staff_select_pregnancy_records"
  ON public.pregnancy_profiling_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1)
        AND u.role IN ('staff', 'admin', 'barangay_admin')
    )
  );

-- LGU staff can insert new records
CREATE POLICY "staff_insert_pregnancy_records"
  ON public.pregnancy_profiling_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1)
        AND u.role IN ('staff', 'admin', 'barangay_admin')
    )
  );

-- LGU staff can update records they created or that belong to their barangay
CREATE POLICY "staff_update_pregnancy_records"
  ON public.pregnancy_profiling_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1)
        AND u.role IN ('staff', 'admin', 'barangay_admin')
    )
  );

-- Only admins can delete records
CREATE POLICY "admin_delete_pregnancy_records"
  ON public.pregnancy_profiling_records
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT id FROM public.users WHERE auth_id = auth.uid() LIMIT 1)
        AND u.role IN ('admin')
    )
  );
