-- Drop the increment_video_click function since we won't need it
DROP FUNCTION IF EXISTS increment_video_click(UUID);

-- Remove click_count column from videos table
ALTER TABLE videos DROP COLUMN IF EXISTS click_count;
