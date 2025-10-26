-- Create storage bucket for bible images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('bible-images', 'bible-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for bible-images bucket
CREATE POLICY "Public can view bible images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'bible-images');

CREATE POLICY "Authenticated users can upload bible images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bible-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own bible images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'bible-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own bible images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'bible-images' AND auth.uid()::text = (storage.foldername(name))[1]);