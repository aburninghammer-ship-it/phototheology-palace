-- Add CADE fields to devotional_profiles
ALTER TABLE public.devotional_profiles
ADD COLUMN IF NOT EXISTS primary_issue text,
ADD COLUMN IF NOT EXISTS issue_description text,
ADD COLUMN IF NOT EXISTS issue_severity text DEFAULT 'moderate',
ADD COLUMN IF NOT EXISTS pastoral_notes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS warning_flags text[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.devotional_profiles.primary_issue IS 'Primary life struggle/issue this person is facing';
COMMENT ON COLUMN public.devotional_profiles.issue_description IS 'Detailed freeform description of what they are going through';
COMMENT ON COLUMN public.devotional_profiles.issue_severity IS 'Severity level: mild, moderate, severe, crisis';
COMMENT ON COLUMN public.devotional_profiles.pastoral_notes IS 'AI-generated pastoral observations and insights';
COMMENT ON COLUMN public.devotional_profiles.warning_flags IS 'Early warning signs detected by the Pastoral Sensing Engine';