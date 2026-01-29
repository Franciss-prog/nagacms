-- ============================================================================
-- RESIDENTS TABLE - Required for all services
-- ============================================================================
-- Create this table FIRST before running health indicators queries
-- ============================================================================

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
-- INSERT SAMPLE DATA (optional)
-- ============================================================================

INSERT INTO public.residents (barangay, purok, full_name, birth_date, sex, contact_number, philhealth_no) VALUES
('Barangay 1', 'Purok A', 'Maria Santos', '1985-05-15', 'Female', '09123456789', 'PH-2024-001'),
('Barangay 1', 'Purok B', 'Juan Dela Cruz', '1990-08-22', 'Male', '09234567890', 'PH-2024-002'),
('Barangay 2', 'Purok C', 'Rosa Garcia', '1992-12-10', 'Female', '09345678901', 'PH-2024-003');
