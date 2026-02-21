-- Medication Inventory and Dispensing Module
-- Centralized CHO-managed inventory with barangay allocation, audit logs, and alerts support

CREATE TABLE IF NOT EXISTS public.medication_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name text NOT NULL,
  category text NOT NULL,
  batch_number text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 0),
  expiration_date date NOT NULL,
  low_stock_threshold integer NOT NULL DEFAULT 20 CHECK (low_stock_threshold >= 0),
  created_by uuid NULL,
  updated_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medication_inventory_name
  ON public.medication_inventory (medicine_name);

CREATE INDEX IF NOT EXISTS idx_medication_inventory_expiration
  ON public.medication_inventory (expiration_date);

CREATE TABLE IF NOT EXISTS public.medication_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES public.medication_inventory(id) ON DELETE CASCADE,
  barangay text NOT NULL,
  allocated_quantity integer NOT NULL DEFAULT 0 CHECK (allocated_quantity >= 0),
  updated_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT medication_allocations_unique UNIQUE (medication_id, barangay)
);

CREATE INDEX IF NOT EXISTS idx_medication_allocations_barangay
  ON public.medication_allocations (barangay);

CREATE TABLE IF NOT EXISTS public.medication_distribution_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES public.medication_inventory(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('allocate', 'dispense', 'restock', 'redistribute', 'adjust')),
  quantity integer NOT NULL CHECK (quantity > 0),
  barangay text NULL,
  from_barangay text NULL,
  to_barangay text NULL,
  notes text NULL,
  action_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medication_distribution_created_at
  ON public.medication_distribution_history (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_medication_distribution_barangay
  ON public.medication_distribution_history (barangay, from_barangay, to_barangay);

CREATE TABLE IF NOT EXISTS public.medication_inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NULL REFERENCES public.medication_inventory(id) ON DELETE SET NULL,
  action text NOT NULL,
  actor_id uuid NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medication_logs_created_at
  ON public.medication_inventory_logs (created_at DESC);

-- Keep timestamps updated
CREATE OR REPLACE FUNCTION public.set_medication_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_medication_inventory_updated_at ON public.medication_inventory;
CREATE TRIGGER trg_medication_inventory_updated_at
BEFORE UPDATE ON public.medication_inventory
FOR EACH ROW EXECUTE FUNCTION public.set_medication_updated_at();

DROP TRIGGER IF EXISTS trg_medication_allocations_updated_at ON public.medication_allocations;
CREATE TRIGGER trg_medication_allocations_updated_at
BEFORE UPDATE ON public.medication_allocations
FOR EACH ROW EXECUTE FUNCTION public.set_medication_updated_at();

-- Optional realtime integration
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.medication_inventory;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.medication_allocations;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.medication_distribution_history;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END
$$;
