-- Create the grid_videos junction table
CREATE TABLE IF NOT EXISTS public.grid_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    grid_id UUID REFERENCES public.grid_configurations(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(grid_id, video_id)
);

-- Create trigger for updated_at
CREATE TRIGGER on_grid_videos_updated
    BEFORE UPDATE ON public.grid_videos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.grid_videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for grid_videos table
CREATE POLICY "Enable read access for all users"
    ON public.grid_videos FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.grid_videos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id"
    ON public.grid_videos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON public.grid_videos FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.grid_videos TO anon, authenticated;

-- Update database setup check function
CREATE OR REPLACE FUNCTION public.check_database_setup()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    videos_rls BOOLEAN;
    grid_config_rls BOOLEAN;
    grid_videos_rls BOOLEAN;
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

    SELECT 
        relrowsecurity INTO grid_videos_rls 
    FROM pg_class 
    WHERE relname = 'grid_videos' 
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
        'grid_videos_table_exists', EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'grid_videos'
        ),
        'rls_enabled_videos', COALESCE(videos_rls, false),
        'rls_enabled_grid_configurations', COALESCE(grid_config_rls, false),
        'rls_enabled_grid_videos', COALESCE(grid_videos_rls, false),
        'videos_count', (SELECT COUNT(*) FROM public.videos),
        'grid_configurations_count', (SELECT COUNT(*) FROM public.grid_configurations),
        'grid_videos_count', (SELECT COUNT(*) FROM public.grid_videos),
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
