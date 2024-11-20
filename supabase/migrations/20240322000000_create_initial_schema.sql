-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create video source type enum
CREATE TYPE video_source_type AS ENUM ('youtube', 'vimeo', 'local');
CREATE TYPE logo_type AS ENUM ('Da', 'Yoann');

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source video_source_type NOT NULL DEFAULT 'youtube',
    source_id VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(255),
    thumbnail VARCHAR(255) NOT NULL,
    show_logo BOOLEAN NOT NULL DEFAULT false,
    logo_type logo_type,
    click_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment click count
CREATE OR REPLACE FUNCTION increment_video_click(video_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE videos 
    SET click_count = click_count + 1 
    WHERE id = video_uuid;
END;
$$ LANGUAGE plpgsql;
