-- Create products storage bucket for PDF delivery
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', false)
ON CONFLICT (id) DO NOTHING;

-- Allow the service role to access files (edge function uses service role)
CREATE POLICY "Service role can access product files"
ON storage.objects
FOR ALL
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');