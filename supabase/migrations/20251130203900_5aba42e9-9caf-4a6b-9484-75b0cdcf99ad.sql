-- Add "looking for partner" toggle to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS looking_for_partner BOOLEAN DEFAULT false;

-- Add index for efficient querying of users looking for partners
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for_partner 
ON public.profiles(looking_for_partner) 
WHERE looking_for_partner = true;