-- Add columns for the new Simmer Engine V1 architecture
ALTER TABLE public.sermon_simmer_sessions
ADD COLUMN IF NOT EXISTS simmer_mode TEXT DEFAULT 'classic',
ADD COLUMN IF NOT EXISTS pass_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_lane TEXT,
ADD COLUMN IF NOT EXISTS lane_schedule JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS artifacts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS parking_artifacts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS artifact_hashes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pass_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_summary TEXT,
ADD COLUMN IF NOT EXISTS simmer_duration TEXT DEFAULT '1h',
ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS locked_thesis BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS human_approved_artifacts TEXT[] DEFAULT '{}';

-- Create index for faster artifact hash lookups
CREATE INDEX IF NOT EXISTS idx_simmer_artifact_hashes 
ON public.sermon_simmer_sessions USING GIN(artifact_hashes);

COMMENT ON COLUMN public.sermon_simmer_sessions.simmer_mode IS 'classic = 6-day mode, engine = new multi-pass lane system';
COMMENT ON COLUMN public.sermon_simmer_sessions.pass_count IS 'Current pass number in engine mode';
COMMENT ON COLUMN public.sermon_simmer_sessions.current_lane IS 'BUILD, SHARPEN, STRESS, or DISTILL';
COMMENT ON COLUMN public.sermon_simmer_sessions.lane_schedule IS 'Predetermined lane sequence for the simmer duration';
COMMENT ON COLUMN public.sermon_simmer_sessions.artifacts IS 'Indexed artifact store with type, summary, content, linked_sections';
COMMENT ON COLUMN public.sermon_simmer_sessions.parking_artifacts IS 'Ideas that belong in other lanes, stored for later';
COMMENT ON COLUMN public.sermon_simmer_sessions.artifact_hashes IS 'Content hashes for deduplication';
COMMENT ON COLUMN public.sermon_simmer_sessions.pass_history IS 'Log of each pass with lane, diagnosis, artifacts produced';
COMMENT ON COLUMN public.sermon_simmer_sessions.validation_errors IS 'Errors from validator pass';
COMMENT ON COLUMN public.sermon_simmer_sessions.project_summary IS 'Compressed rolling summary for context window management';
COMMENT ON COLUMN public.sermon_simmer_sessions.is_paused IS 'Human intervention: pause the simmer';
COMMENT ON COLUMN public.sermon_simmer_sessions.locked_thesis IS 'Human intervention: thesis is locked, no changes allowed';