-- Create sermons table for sermon builder
CREATE TABLE public.sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  theme_passage TEXT NOT NULL,
  sermon_style TEXT NOT NULL,
  smooth_stones JSONB DEFAULT '[]'::jsonb,
  bridges JSONB DEFAULT '[]'::jsonb,
  movie_structure JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete')),
  current_step INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flashcard_sets table
CREATE TABLE public.flashcard_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id UUID NOT NULL REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  verse_reference TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Sermons policies
CREATE POLICY "Users can view their own sermons" 
ON public.sermons FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sermons" 
ON public.sermons FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sermons" 
ON public.sermons FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sermons" 
ON public.sermons FOR DELETE USING (auth.uid() = user_id);

-- Flashcard sets policies
CREATE POLICY "Users can view their own sets and public sets" 
ON public.flashcard_sets FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own sets" 
ON public.flashcard_sets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sets" 
ON public.flashcard_sets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sets" 
ON public.flashcard_sets FOR DELETE USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can view flashcards from accessible sets" 
ON public.flashcards FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_sets 
    WHERE id = flashcards.set_id 
    AND (user_id = auth.uid() OR is_public = true)
  )
);

CREATE POLICY "Users can create flashcards in their own sets" 
ON public.flashcards FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.flashcard_sets 
    WHERE id = flashcards.set_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update flashcards in their own sets" 
ON public.flashcards FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_sets 
    WHERE id = flashcards.set_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete flashcards from their own sets" 
ON public.flashcards FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_sets 
    WHERE id = flashcards.set_id AND user_id = auth.uid()
  )
);

-- Triggers for timestamp updates
CREATE TRIGGER update_sermons_updated_at
BEFORE UPDATE ON public.sermons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcard_sets_updated_at
BEFORE UPDATE ON public.flashcard_sets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_sermons_user_id ON public.sermons(user_id);
CREATE INDEX idx_flashcard_sets_user_id ON public.flashcard_sets(user_id);
CREATE INDEX idx_flashcard_sets_public ON public.flashcard_sets(is_public);
CREATE INDEX idx_flashcards_set_id ON public.flashcards(set_id);