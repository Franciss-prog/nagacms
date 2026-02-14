-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR HEALTH WORKERS
-- ============================================================================
-- This file documents the RLS policies needed to restrict health workers
-- to their assigned barangay and protect sensitive health data
--
-- Copy and run these policies in your Supabase SQL editor
-- ============================================================================

-- ============================================================================
-- USERS TABLE RLS
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Health workers can only view their own user record
CREATE POLICY "health_workers_view_self"
  ON public.users FOR SELECT
  USING (
    auth.uid()::text = id AND 
    user_role = 'workers'
  );

-- Staff can view all users (for management)
CREATE POLICY "staff_view_all_users"
  ON public.users FOR SELECT
  USING (
    auth.uid()::text = (
      SELECT id FROM public.users WHERE username = current_user AND user_role = 'staff'
    )
  );

-- ============================================================================
-- RESIDENTS TABLE RLS
-- ============================================================================

-- Enable RLS on residents table
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- Health workers can only view residents in their assigned barangay
CREATE POLICY "health_workers_view_barangay_residents"
  ON public.residents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text 
      AND user_role = 'workers'
      AND assigned_barangay = residents.barangay
    )
  );

-- Health workers can insert residents in their assigned barangay
CREATE POLICY "health_workers_insert_barangay_residents"
  ON public.residents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text 
      AND user_role = 'workers'
      AND assigned_barangay = barangay
    )
  );

-- Health workers can update residents in their assigned barangay
CREATE POLICY "health_workers_update_barangay_residents"
  ON public.residents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()::text 
      AND user_role = 'workers'
      AND assigned_barangay = residents.barangay
    )
  );

-- ============================================================================
-- VACCINATION_RECORDS TABLE RLS
-- ============================================================================

-- Enable RLS on vaccination_records table
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- Health workers can view vaccination records for residents in their barangay
CREATE POLICY "health_workers_view_vaccination_records"
  ON public.vaccination_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = vaccination_records.resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- Health workers can insert vaccination records for residents in their barangay
CREATE POLICY "health_workers_insert_vaccination_records"
  ON public.vaccination_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- Health workers can only update records they created
CREATE POLICY "health_workers_update_vaccination_records"
  ON public.vaccination_records FOR UPDATE
  USING (
    administered_by = auth.uid()::text
    AND EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- ============================================================================
-- HEALTH_INDICATORS TABLE RLS
-- ============================================================================

-- Enable RLS on health_indicators table
ALTER TABLE public.health_indicators ENABLE ROW LEVEL SECURITY;

-- Health workers can view health indicators for residents in their barangay
CREATE POLICY "health_workers_view_health_indicators"
  ON public.health_indicators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = health_indicators.resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- Health workers can insert health indicators for residents in their barangay
CREATE POLICY "health_workers_insert_health_indicators"
  ON public.health_indicators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- ============================================================================
-- HEALTH PROGRAMS TABLE RLS
-- ============================================================================

-- Enable RLS on health_programs table
ALTER TABLE public.health_programs ENABLE ROW LEVEL SECURITY;

-- Health workers can view programs in their assigned barangay
CREATE POLICY "health_workers_view_health_programs"
  ON public.health_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = health_programs.barangay
    )
  );

-- ============================================================================
-- PROGRAM_BENEFICIARIES TABLE RLS
-- ============================================================================

-- Enable RLS on program_beneficiaries table
ALTER TABLE public.program_beneficiaries ENABLE ROW LEVEL SECURITY;

-- Health workers can view beneficiaries of programs in their barangay
CREATE POLICY "health_workers_view_program_beneficiaries"
  ON public.program_beneficiaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.health_programs hp
      JOIN public.users u ON 1=1
      WHERE hp.id = program_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = hp.barangay
    )
  );

-- Health workers can insert beneficiaries into programs in their barangay
CREATE POLICY "health_workers_insert_program_beneficiaries"
  ON public.program_beneficiaries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.health_programs hp
      JOIN public.users u ON 1=1
      WHERE hp.id = program_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = hp.barangay
    )
  );

-- ============================================================================
-- DISEASE_CASES TABLE RLS
-- ============================================================================

-- Enable RLS on disease_cases table
ALTER TABLE public.disease_cases ENABLE ROW LEVEL SECURITY;

-- Health workers can view disease cases for residents in their barangay
CREATE POLICY "health_workers_view_disease_cases"
  ON public.disease_cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- Health workers can report disease cases for residents in their barangay
CREATE POLICY "health_workers_insert_disease_cases"
  ON public.disease_cases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- ============================================================================
-- VITAL_SIGNS_HISTORY TABLE RLS
-- ============================================================================

-- Enable RLS on vital_signs_history table
ALTER TABLE public.vital_signs_history ENABLE ROW LEVEL SECURITY;

-- Health workers can view vital signs for residents in their barangay
CREATE POLICY "health_workers_view_vital_signs"
  ON public.vital_signs_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- Health workers can record vital signs for residents in their barangay
CREATE POLICY "health_workers_insert_vital_signs"
  ON public.vital_signs_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.residents r
      JOIN public.users u ON 1=1
      WHERE r.id = resident_id
      AND u.id = auth.uid()::text
      AND u.user_role = 'workers'
      AND u.assigned_barangay = r.barangay
    )
  );

-- ============================================================================
-- HELPER FUNCTION: Get current user's assigned barangay
-- ============================================================================

CREATE OR REPLACE FUNCTION get_current_user_barangay() 
RETURNS text AS $$
  SELECT assigned_barangay 
  FROM public.users 
  WHERE id = auth.uid()::text
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_current_user_barangay() TO authenticated;

-- ============================================================================
-- STORAGE (FILE UPLOADS) RLS
-- ============================================================================

-- Create bucket for health worker uploads (if not exists)
-- This should be done via Supabase dashboard or API

-- Enable RLS on storage
CREATE POLICY "health_workers_upload_files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'health-worker-uploads'
    AND (auth.uid()::text || '/') = (storage.foldername(name))[1]
  );

CREATE POLICY "health_workers_view_own_files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'health-worker-uploads'
    AND (auth.uid()::text || '/') = (storage.foldername(name))[1]
  );

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Update user IDs: Replace auth.uid()::text with proper Supabase auth setup
-- 2. Test policies thoroughly before deploying to production
-- 3. Consider adding audit logging for all data modifications
-- 4. Monitor performance impact of RLS policies on queries
-- 5. Regularly review and update policies as requirements evolve
