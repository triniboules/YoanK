-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE video_source_type AS ENUM ('youtube', 'vimeo', 'local');
CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Note: In production, use proper password hashing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    source video_source_type DEFAULT 'youtube',
    source_id TEXT NOT NULL,
    youtube_id TEXT, -- For backward compatibility
    thumbnail TEXT NOT NULL,
    show_logo BOOLEAN DEFAULT false,
    logo_type logo_type,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_logo_config CHECK (
        (show_logo = false AND logo_type IS NULL) OR
        (show_logo = true AND logo_type IS NOT NULL)
    )
);

-- Create grid_configurations table
CREATE TABLE IF NOT EXISTS public.grid_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create grid_videos table (junction table with position)
CREATE TABLE IF NOT EXISTS public.grid_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grid_id UUID REFERENCES grid_configurations(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (grid_id, position),
    UNIQUE (grid_id, video_id)
);

-- Create video_clicks table for analytics
CREATE TABLE IF NOT EXISTS public.video_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Can be 'anonymous' or actual user ID
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grid_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grid_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public videos are viewable by everyone" ON public.videos
    FOR SELECT USING (true);

CREATE POLICY "Public grids are viewable by everyone" ON public.grid_configurations
    FOR SELECT USING (true);

CREATE POLICY "Public grid videos are viewable by everyone" ON public.grid_videos
    FOR SELECT USING (true);

-- Functions for managing videos
CREATE OR REPLACE FUNCTION public.increment_video_click(
    video_uuid UUID,
    user_identifier TEXT
) RETURNS void AS $$
BEGIN
    -- Record the click
    INSERT INTO public.video_clicks (video_id, user_id)
    VALUES (video_uuid, user_identifier);

    -- Update the click count
    UPDATE public.videos
    SET 
        click_count = click_count + 1,
        updated_at = NOW()
    WHERE id = video_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder videos in a grid
CREATE OR REPLACE FUNCTION public.reorder_grid_videos(
    p_grid_id UUID,
    p_video_orders JSON
) RETURNS void AS $$
DECLARE
    video_record RECORD;
BEGIN
    FOR video_record IN 
        SELECT * FROM json_each(p_video_orders)
    LOOP
        UPDATE public.grid_videos
        SET position = (video_record.value::jsonb->>'position')::integer
        WHERE grid_id = p_grid_id 
        AND video_id = (video_record.value::jsonb->>'video_id')::uuid;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grid_configurations_updated_at
    BEFORE UPDATE ON public.grid_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_click_count ON public.videos(click_count DESC);
CREATE INDEX IF NOT EXISTS idx_grid_videos_position ON public.grid_videos(grid_id, position);
CREATE INDEX IF NOT EXISTS idx_video_clicks_video_id ON public.video_clicks(video_id);
CREATE INDEX IF NOT EXISTS idx_video_clicks_user_id ON public.video_clicks(user_id);

-- Initial data
INSERT INTO public.users (username, password)
VALUES ('Triniboules', 'your-secure-password-here')
ON CONFLICT (username) DO NOTHING;
