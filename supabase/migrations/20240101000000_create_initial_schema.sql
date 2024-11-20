-- Wrap the entire setup in a transaction
BEGIN;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing objects with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.grid_configurations CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Create the updated_at trigger function first (used by both tables)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create base tables with proper constraints
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    source_id TEXT NOT NULL,
    thumbnail TEXT,
    position INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.grid_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    config JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create triggers for updated_at
CREATE TRIGGER on_videos_updated
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_grid_configurations_updated
    BEFORE UPDATE ON public.grid_configurations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grid_configurations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.videos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.videos;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.videos;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.videos;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.grid_configurations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.grid_configurations;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.grid_configurations;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.grid_configurations;

-- Create RLS policies for videos table
CREATE POLICY "Enable read access for all users"
    ON public.videos FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.videos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id"
    ON public.videos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.videos FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for grid_configurations table
CREATE POLICY "Enable read access for all users"
    ON public.grid_configurations FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.grid_configurations FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id"
    ON public.grid_configurations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.grid_configurations FOR DELETE
    USING (auth.uid() = user_id);

-- Enhanced database setup check function
CREATE OR REPLACE FUNCTION public.check_database_setup()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    videos_rls BOOLEAN;
    grid_config_rls BOOLEAN;
BEGIN
    -- Check if tables exist and get their RLS status
    SELECT 
        relrowsecurity INTO videos_rls 
    FROM pg_class 
    WHERE relname = 'videos' 
    AND relnamespace = 'public'::regnamespace;

    SELECT 
        relrowsecurity INTO grid_config_rls 
    FROM pg_class 
    WHERE relname = 'grid_configurations' 
    AND relnamespace = 'public'::regnamespace;

    result := jsonb_build_object(
        'videos_table_exists', EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'videos'
        ),
        'grid_configurations_table_exists', EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'grid_configurations'
        ),
        'rls_enabled_videos', COALESCE(videos_rls, false),
        'rls_enabled_grid_configurations', COALESCE(grid_config_rls, false),
        'videos_count', (SELECT COUNT(*) FROM public.videos),
        'grid_configurations_count', (SELECT COUNT(*) FROM public.grid_configurations),
        'database_version', version(),
        'last_check_time', timezone('utc', now())
    );

    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'error', SQLERRM,
        'error_detail', SQLSTATE,
        'last_check_time', timezone('utc', now())
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_database_setup() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_database_setup() TO anon;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample data (only if tables are empty)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.grid_configurations LIMIT 1) THEN
        INSERT INTO public.grid_configurations (name, description) VALUES
            ('Default Grid', 'Default video grid configuration'),
            ('Wedding Grid', 'Wedding video collection');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.videos LIMIT 1) THEN
        INSERT INTO public.videos (name, description, source, source_id, position) VALUES
            ('Sample Video 1', 'Description for video 1', 'youtube', 'dQw4w9WgXcQ', 0),
            ('Sample Video 2', 'Description for video 2', 'youtube', 'dQw4w9WgXcQ', 1);
    END IF;
END $$;

COMMIT;
