-- Create table to track PDF email deliveries
CREATE TABLE public.pdf_email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  product_key TEXT NOT NULL,
  checkout_session_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for quick lookups
CREATE INDEX idx_pdf_email_logs_email ON public.pdf_email_logs(email);
CREATE INDEX idx_pdf_email_logs_checkout_session ON public.pdf_email_logs(checkout_session_id);
CREATE INDEX idx_pdf_email_logs_product_key ON public.pdf_email_logs(product_key);

-- Enable RLS
ALTER TABLE public.pdf_email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write
CREATE POLICY "Admins can manage pdf_email_logs"
  ON public.pdf_email_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow service role full access
CREATE POLICY "Service role full access to pdf_email_logs"
  ON public.pdf_email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);