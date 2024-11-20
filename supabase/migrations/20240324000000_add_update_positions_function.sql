-- Create a new type for the input parameters
DO $$ BEGIN
    CREATE TYPE video_position_update AS (
        video_id uuid,
        new_position integer
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the function to update video positions
CREATE OR REPLACE FUNCTION update_video_positions(video_positions video_position_update[])
RETURNS void AS $$
BEGIN
    -- Update all positions in a single transaction
    FOR i IN 1..array_length(video_positions, 1) LOOP
        UPDATE videos
        SET position = (video_positions[i]).new_position
        WHERE id = (video_positions[i]).video_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
