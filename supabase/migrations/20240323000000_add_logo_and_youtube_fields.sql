-- Create logo type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to videos table
ALTER TABLE public.videos
    ADD COLUMN IF NOT EXISTS youtube_id TEXT,
    ADD COLUMN IF NOT EXISTS show_logo BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS logo_type logo_type DEFAULT NULL;
