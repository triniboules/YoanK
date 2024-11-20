-- First create the enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'logo_type') THEN
    CREATE TYPE logo_type AS ENUM ('none', 'logo', 'Da');
  END IF;
END $$;

-- Then add the columns if they don't exist
ALTER TABLE IF EXISTS public.videos 
  ADD COLUMN IF NOT EXISTS logo_type logo_type DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS show_logo BOOLEAN DEFAULT false;
