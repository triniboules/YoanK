CREATE OR REPLACE FUNCTION create_videos_table()
RETURNS void AS $$
BEGIN
    -- Create videos table
    CREATE TABLE IF NOT EXISTS public.videos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        source TEXT NOT NULL DEFAULT 'youtube',
        source_id TEXT NOT NULL,
        thumbnail TEXT,
        show_logo BOOLEAN DEFAULT false,
        logo_type TEXT,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- Enable RLS for videos
    ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
