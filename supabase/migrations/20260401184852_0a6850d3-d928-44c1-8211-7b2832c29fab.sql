-- Training Courses table
CREATE TABLE public.training_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  voice TEXT NOT NULL DEFAULT 'nova',
  lesson_count INTEGER NOT NULL DEFAULT 0,
  icon TEXT DEFAULT 'book-open',
  sort_order INTEGER NOT NULL DEFAULT 0,
  pdf_storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view training courses"
ON public.training_courses FOR SELECT
TO authenticated
USING (true);

-- Training Lessons table
CREATE TABLE public.training_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.training_courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  transcript TEXT NOT NULL DEFAULT '',
  audio_storage_path TEXT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, lesson_number)
);

ALTER TABLE public.training_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view training lessons"
ON public.training_lessons FOR SELECT
TO authenticated
USING (true);

-- Timestamps trigger
CREATE TRIGGER update_training_courses_updated_at
  BEFORE UPDATE ON public.training_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_lessons_updated_at
  BEFORE UPDATE ON public.training_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('training-audio', 'training-audio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('training-pdfs', 'training-pdfs', true);

-- Public read for audio and PDFs
CREATE POLICY "Public read training audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'training-audio');

CREATE POLICY "Public read training pdfs"
ON storage.objects FOR SELECT
USING (bucket_id = 'training-pdfs');

-- Service role upload for training audio
CREATE POLICY "Service role upload training audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'training-audio');

CREATE POLICY "Service role upload training pdfs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'training-pdfs');