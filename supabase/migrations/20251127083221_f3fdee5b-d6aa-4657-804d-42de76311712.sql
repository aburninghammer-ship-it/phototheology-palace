-- Add user_id column to reading_plans for custom user-created plans
ALTER TABLE public.reading_plans 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for faster queries on user's custom plans
CREATE INDEX IF NOT EXISTS idx_reading_plans_user_id ON public.reading_plans(user_id);

-- Update RLS policies to allow users to create their own plans
DROP POLICY IF EXISTS "Users can view all reading plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can create their own plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can update their own plans" ON public.reading_plans;
DROP POLICY IF EXISTS "Users can delete their own plans" ON public.reading_plans;

-- Everyone can view plans (both system plans and public custom plans)
CREATE POLICY "Users can view all reading plans" 
ON public.reading_plans 
FOR SELECT 
USING (user_id IS NULL OR user_id = auth.uid());

-- Users can create their own plans
CREATE POLICY "Users can create their own plans" 
ON public.reading_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
CREATE POLICY "Users can update their own plans" 
ON public.reading_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own plans
CREATE POLICY "Users can delete their own plans" 
ON public.reading_plans 
FOR DELETE 
USING (auth.uid() = user_id);