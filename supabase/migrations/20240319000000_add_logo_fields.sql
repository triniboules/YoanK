-- Create logo_type enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'logo_type') THEN
        CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');
    END IF;
END $$;

-- Add missing columns to videos table if they don't exist
DO $$ 
BEGIN
    -- Add logo_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'videos' 
                  AND column_name = 'logo_type') THEN
        ALTER TABLE public.videos ADD COLUMN logo_type logo_type;
    END IF;

    -- Add show_logo column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'videos' 
                  AND column_name = 'show_logo') THEN
        ALTER TABLE public.videos ADD COLUMN show_logo BOOLEAN DEFAULT false;
    END IF;

    -- Add position column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'videos' 
                  AND column_name = 'position') THEN
        ALTER TABLE public.videos ADD COLUMN position INTEGER DEFAULT 0;
    END IF;
END $$;
