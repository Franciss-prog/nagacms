-- ============================================================================
-- ANNOUNCEMENTS SCHEMA HOTFIX
-- Fixes: Could not find the table 'public.announcements' in the schema cache
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  poster_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcement_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  barangay text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT announcement_targets_unique UNIQUE (announcement_id, barangay)
);

CREATE TABLE IF NOT EXISTS public.announcement_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  barangay text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT announcement_notifications_unique UNIQUE (announcement_id, barangay)
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcement_targets_barangay ON public.announcement_targets(barangay);
CREATE INDEX IF NOT EXISTS idx_announcement_targets_announcement_id ON public.announcement_targets(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_barangay ON public.announcement_notifications(barangay);
CREATE INDEX IF NOT EXISTS idx_announcement_notifications_read ON public.announcement_notifications(is_read);

CREATE OR REPLACE FUNCTION public.set_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS announcements_set_updated_at ON public.announcements;
CREATE TRIGGER announcements_set_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp_updated_at();

DROP TRIGGER IF EXISTS announcement_notifications_set_updated_at ON public.announcement_notifications;
CREATE TRIGGER announcement_notifications_set_updated_at
BEFORE UPDATE ON public.announcement_notifications
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp_updated_at();

-- Ensure poster column exists if table was created earlier without it
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS poster_image_url text;

-- Force PostgREST/Supabase API schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Quick verification
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('announcements', 'announcement_targets', 'announcement_notifications')
ORDER BY table_name;
