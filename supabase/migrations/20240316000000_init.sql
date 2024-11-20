-- Create enums
CREATE TYPE video_source_type AS ENUM ('youtube', 'vimeo', 'local');
CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');

-- Create tables
CREATE TABLE IF NOT EXISTS grid_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    source video_source_type NOT NULL,
    source_id TEXT NOT NULL,
    thumbnail TEXT,
    show_logo BOOLEAN DEFAULT false,
    logo_type logo_type,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grid_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_id UUID REFERENCES grid_configurations(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grid_id, position)
);

-- Create function to initialize database
CREATE OR REPLACE FUNCTION initialize_database()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create tables if they don't exist (they should already exist from above)
    -- This is just a safety check
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'grid_configurations') THEN
        CREATE TABLE grid_configurations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'videos') THEN
        CREATE TABLE videos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            source video_source_type NOT NULL,
            source_id TEXT NOT NULL,
            thumbnail TEXT,
            show_logo BOOLEAN DEFAULT false,
            logo_type logo_type,
            click_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'grid_videos') THEN
        CREATE TABLE grid_videos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            grid_id UUID REFERENCES grid_configurations(id) ON DELETE CASCADE,
            video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
            position INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(grid_id, position)
        );
    END IF;
END;
$$;
