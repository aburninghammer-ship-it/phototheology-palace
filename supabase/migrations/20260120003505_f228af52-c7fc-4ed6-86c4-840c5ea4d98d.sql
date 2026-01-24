-- Add is_master_class column to distinguish paying Master Class students from free signups
ALTER TABLE public.teachable_students 
ADD COLUMN IF NOT EXISTS is_master_class boolean DEFAULT false;

-- Update enrollment_status to include 'free' for non-enrolled users
-- First, mark all current records as 'free' if they have no MRR
UPDATE public.teachable_students 
SET is_master_class = false, 
    enrollment_status = 'free'
WHERE mrr = 0 OR mrr IS NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_teachable_students_is_master_class 
ON public.teachable_students(is_master_class);

CREATE INDEX IF NOT EXISTS idx_teachable_students_enrollment_status 
ON public.teachable_students(enrollment_status);