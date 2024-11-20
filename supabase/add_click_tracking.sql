-- Add click tracking columns
ALTER TABLE IF EXISTS public.videos 
  ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicks JSONB DEFAULT '[]'::jsonb;
