-- Create YAKAP Applications Table
-- This table stores YAKAP (Kalusugan Para sa Lahat) health insurance applications

CREATE TABLE IF NOT EXISTS public.yakap_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resident_name text NOT NULL,
  barangay text NOT NULL,
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
  CONSTRAINT yakap_applications_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_yakap_applications_barangay ON public.yakap_applications(barangay);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_status ON public.yakap_applications(status);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_applied_at ON public.yakap_applications(applied_at);
CREATE INDEX IF NOT EXISTS idx_yakap_applications_membership_type ON public.yakap_applications(membership_type);

-- Add comment to table
COMMENT ON TABLE public.yakap_applications IS 'YAKAP health insurance applications for residents';
COMMENT ON COLUMN public.yakap_applications.resident_name IS 'Full name of resident applying for YAKAP coverage';
COMMENT ON COLUMN public.yakap_applications.barangay IS 'Barangay where resident is registered';
COMMENT ON COLUMN public.yakap_applications.membership_type IS 'Type of membership: individual, family, senior, or PWD';
COMMENT ON COLUMN public.yakap_applications.status IS 'Application status: pending, approved, returned, or rejected';
