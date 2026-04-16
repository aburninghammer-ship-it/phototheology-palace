-- Add MRR (monthly recurring revenue) column to track payment status
ALTER TABLE public.teachable_students 
ADD COLUMN mrr numeric DEFAULT 0;

-- Add index for efficient filtering by payment status
CREATE INDEX idx_teachable_students_mrr ON public.teachable_students(mrr);

-- Add comment for clarity
COMMENT ON COLUMN public.teachable_students.mrr IS 'Monthly recurring revenue in USD from Teachable';