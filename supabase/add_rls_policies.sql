-- Enable RLS on videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated and anonymous users to view videos
CREATE POLICY "Allow public view of videos"
ON public.videos
FOR SELECT
USING (true);

-- Allow all authenticated and anonymous users to insert videos
CREATE POLICY "Allow public insert of videos"
ON public.videos
FOR INSERT
WITH CHECK (true);

-- Allow all authenticated and anonymous users to update videos
CREATE POLICY "Allow public update of videos"
ON public.videos
FOR UPDATE
USING (true);

-- Allow all authenticated and anonymous users to delete videos
CREATE POLICY "Allow public delete of videos"
ON public.videos
FOR DELETE
USING (true);

-- Grant necessary permissions
GRANT ALL ON public.videos TO anon;
GRANT ALL ON public.videos TO authenticated;
