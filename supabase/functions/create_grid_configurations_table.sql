CREATE OR REPLACE FUNCTION create_grid_configurations_table()
RETURNS void AS $$
BEGIN
    -- Create grid_configurations table
    CREATE TABLE IF NOT EXISTS public.grid_configurations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- Enable RLS for grid_configurations
    ALTER TABLE public.grid_configurations ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
