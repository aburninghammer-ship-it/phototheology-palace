-- Create table to track Teachable student verifications
CREATE TABLE public.teachable_students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    teachable_email TEXT NOT NULL,
    teachable_user_id TEXT,
    course_name TEXT,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.teachable_students ENABLE ROW LEVEL SECURITY;

-- Users can read their own Teachable verification
CREATE POLICY "Users can view their own Teachable verification"
ON public.teachable_students
FOR SELECT
USING (auth.uid() = user_id);

-- Only system (service role) can insert/update - done via edge function
CREATE POLICY "Service role can manage Teachable students"
ON public.teachable_students
FOR ALL
USING (auth.role() = 'service_role');

-- Create function to check if user has Teachable access
CREATE OR REPLACE FUNCTION public.has_teachable_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teachable_students
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;

-- Create index for faster lookups
CREATE INDEX idx_teachable_students_user_id ON public.teachable_students(user_id);
CREATE INDEX idx_teachable_students_email ON public.teachable_students(teachable_email);