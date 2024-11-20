CREATE OR REPLACE FUNCTION setup_rls_policies()
RETURNS void AS $$
BEGIN
    -- Create policies for videos
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.videos;
    CREATE POLICY "Enable read access for all users" ON public.videos
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Enable insert for all users" ON public.videos;
    CREATE POLICY "Enable insert for all users" ON public.videos
        FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Enable update for all users" ON public.videos;
    CREATE POLICY "Enable update for all users" ON public.videos
        FOR UPDATE USING (true);

    DROP POLICY IF EXISTS "Enable delete for all users" ON public.videos;
    CREATE POLICY "Enable delete for all users" ON public.videos
        FOR DELETE USING (true);

    -- Create policies for grid_configurations
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.grid_configurations;
    CREATE POLICY "Enable read access for all users" ON public.grid_configurations
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Enable insert for all users" ON public.grid_configurations;
    CREATE POLICY "Enable insert for all users" ON public.grid_configurations
        FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Enable update for all users" ON public.grid_configurations;
    CREATE POLICY "Enable update for all users" ON public.grid_configurations
        FOR UPDATE USING (true);

    DROP POLICY IF EXISTS "Enable delete for all users" ON public.grid_configurations;
    CREATE POLICY "Enable delete for all users" ON public.grid_configurations
        FOR DELETE USING (true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
