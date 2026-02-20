-- ============================================================================
-- ANNOUNCEMENTS: OPTIONAL POSTER IMAGE
-- ============================================================================

ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS poster_image_url text;
