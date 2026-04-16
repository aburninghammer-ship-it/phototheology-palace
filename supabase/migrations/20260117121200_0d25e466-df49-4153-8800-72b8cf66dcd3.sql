-- Create table for saved PowerPoints
CREATE TABLE public.saved_powerpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'sermon', -- 'sermon', 'verses', 'study'
  sermon_id UUID, -- Optional reference to sermon
  settings JSONB,
  slide_data JSONB,
  theme_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_powerpoints ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own powerpoints" 
ON public.saved_powerpoints 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own powerpoints" 
ON public.saved_powerpoints 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own powerpoints" 
ON public.saved_powerpoints 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own powerpoints" 
ON public.saved_powerpoints 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_powerpoints_updated_at
BEFORE UPDATE ON public.saved_powerpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();