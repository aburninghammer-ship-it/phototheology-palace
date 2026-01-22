-- Surveys and Polls System
-- Church-wide and small group surveys with multiple question types

-- Surveys/Polls table
CREATE TABLE IF NOT EXISTS public.church_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Survey details
  title TEXT NOT NULL,
  description TEXT,
  survey_type TEXT NOT NULL DEFAULT 'poll' CHECK (survey_type IN ('poll', 'survey', 'feedback', 'rsvp')),
  
  -- Targeting
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN (
    'all',           -- All church members
    'leaders',       -- Leaders only
    'small_group',   -- Specific small group
    'ministry'       -- Specific ministry
  )),
  small_group_id UUID REFERENCES public.small_groups(id) ON DELETE CASCADE,
  
  -- Settings
  is_anonymous BOOLEAN DEFAULT false,
  allow_multiple_responses BOOLEAN DEFAULT false,
  show_results_to_all BOOLEAN DEFAULT true,
  
  -- Timing
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Survey questions table
CREATE TABLE IF NOT EXISTS public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.church_surveys(id) ON DELETE CASCADE,
  
  -- Question details
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice',   -- Select one option
    'checkbox',          -- Select multiple options
    'rating',            -- 1-5 or 1-10 scale
    'text',              -- Short text response
    'long_text',         -- Long text response
    'yes_no',            -- Yes/No/Maybe
    'scale'              -- Custom scale (e.g., 1-10)
  )),
  
  -- Options for multiple choice/checkbox (JSON array)
  options JSONB DEFAULT '[]'::jsonb,
  
  -- Settings
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- For rating/scale questions
  min_value INTEGER DEFAULT 1,
  max_value INTEGER DEFAULT 5,
  min_label TEXT,  -- e.g., "Strongly Disagree"
  max_label TEXT,  -- e.g., "Strongly Agree"
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Survey responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.church_surveys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for anonymous
  
  -- Tracking
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(survey_id, user_id) -- One response per user (unless allow_multiple)
);

-- Individual answers table
CREATE TABLE IF NOT EXISTS public.survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
  
  -- Answer data (flexible storage)
  answer_text TEXT,                    -- For text responses
  answer_option TEXT,                  -- For single choice
  answer_options TEXT[],               -- For multiple choice
  answer_number INTEGER,               -- For ratings/scales
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(response_id, question_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_church_surveys_church_id ON public.church_surveys(church_id);
CREATE INDEX IF NOT EXISTS idx_church_surveys_status ON public.church_surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON public.survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON public.survey_responses(user_id);

-- Enable RLS
ALTER TABLE public.church_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;

-- Policies for surveys
CREATE POLICY "Members can view active surveys"
  ON public.church_surveys FOR SELECT
  USING (
    status = 'active' AND (
      target_audience = 'all' OR
      (target_audience = 'leaders' AND EXISTS (
        SELECT 1 FROM public.church_members
        WHERE church_id = church_surveys.church_id
          AND user_id = auth.uid()
          AND role IN ('admin', 'leader', 'pastor')
      )) OR
      (target_audience = 'small_group' AND EXISTS (
        SELECT 1 FROM public.small_group_members
        WHERE group_id = church_surveys.small_group_id AND user_id = auth.uid()
      ))
    ) AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_surveys.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage surveys"
  ON public.church_surveys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_surveys.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

-- Policies for questions
CREATE POLICY "Members can view questions for visible surveys"
  ON public.survey_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_surveys
      WHERE id = survey_questions.survey_id
    )
  );

CREATE POLICY "Leaders can manage questions"
  ON public.survey_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_surveys s
      JOIN public.church_members cm ON cm.church_id = s.church_id
      WHERE s.id = survey_questions.survey_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader', 'pastor')
    )
  );

-- Policies for responses
CREATE POLICY "Users can submit responses"
  ON public.survey_responses FOR INSERT
  WITH CHECK (
    (user_id = auth.uid() OR user_id IS NULL) AND
    EXISTS (
      SELECT 1 FROM public.church_surveys
      WHERE id = survey_id AND status = 'active'
    )
  );

CREATE POLICY "Users can view their own responses"
  ON public.survey_responses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Leaders can view all responses"
  ON public.survey_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_surveys s
      JOIN public.church_members cm ON cm.church_id = s.church_id
      WHERE s.id = survey_responses.survey_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader', 'pastor')
    )
  );

-- Policies for answers
CREATE POLICY "Users can submit answers"
  ON public.survey_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.survey_responses
      WHERE id = response_id AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

CREATE POLICY "Users can view their own answers"
  ON public.survey_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.survey_responses
      WHERE id = survey_answers.response_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can view all answers"
  ON public.survey_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.survey_responses r
      JOIN public.church_surveys s ON s.id = r.survey_id
      JOIN public.church_members cm ON cm.church_id = s.church_id
      WHERE r.id = survey_answers.response_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader', 'pastor')
    )
  );

-- Function to get survey results summary
CREATE OR REPLACE FUNCTION get_survey_results(p_survey_id UUID)
RETURNS TABLE (
  question_id UUID,
  question_text TEXT,
  question_type TEXT,
  total_responses BIGINT,
  results JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id AS question_id,
    q.question_text,
    q.question_type,
    COUNT(DISTINCT a.response_id) AS total_responses,
    CASE 
      WHEN q.question_type IN ('multiple_choice', 'yes_no') THEN
        jsonb_agg(DISTINCT jsonb_build_object('option', a.answer_option, 'count', (
          SELECT COUNT(*) FROM public.survey_answers 
          WHERE question_id = q.id AND answer_option = a.answer_option
        )))
      WHEN q.question_type = 'checkbox' THEN
        jsonb_build_object('options', (
          SELECT jsonb_agg(DISTINCT unnest) FROM (
            SELECT unnest(answer_options) FROM public.survey_answers WHERE question_id = q.id
          ) sub
        ))
      WHEN q.question_type IN ('rating', 'scale') THEN
        jsonb_build_object(
          'average', (SELECT AVG(answer_number) FROM public.survey_answers WHERE question_id = q.id),
          'distribution', (
            SELECT jsonb_object_agg(answer_number::text, cnt) FROM (
              SELECT answer_number, COUNT(*) as cnt 
              FROM public.survey_answers 
              WHERE question_id = q.id 
              GROUP BY answer_number
            ) sub
          )
        )
      ELSE
        jsonb_build_object('text_responses', (
          SELECT jsonb_agg(answer_text) FROM public.survey_answers 
          WHERE question_id = q.id AND answer_text IS NOT NULL
        ))
    END AS results
  FROM public.survey_questions q
  LEFT JOIN public.survey_answers a ON a.question_id = q.id
  WHERE q.survey_id = p_survey_id
  GROUP BY q.id, q.question_text, q.question_type
  ORDER BY q.display_order;
END;
$$;
