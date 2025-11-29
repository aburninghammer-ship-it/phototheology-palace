-- Create reading_sequences table for storing user's custom Bible reading sequences
CREATE TABLE public.reading_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  room_tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence_items table for individual items within a sequence
CREATE TABLE public.sequence_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.reading_sequences(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL DEFAULT 1, -- Which sequence block (1-5)
  item_order INTEGER NOT NULL DEFAULT 0, -- Order within the sequence block
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  start_verse INTEGER, -- NULL means entire chapter
  end_verse INTEGER,
  voice TEXT DEFAULT 'daniel',
  playback_speed NUMERIC(2,1) DEFAULT 1.0,
  include_jeeves_commentary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_reading_sequences_user_id ON public.reading_sequences(user_id);
CREATE INDEX idx_sequence_items_sequence_id ON public.sequence_items(sequence_id);

-- Enable Row Level Security
ALTER TABLE public.reading_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_items ENABLE ROW LEVEL SECURITY;

-- Policies for reading_sequences
CREATE POLICY "Users can view their own sequences" 
  ON public.reading_sequences 
  FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own sequences" 
  ON public.reading_sequences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sequences" 
  ON public.reading_sequences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sequences" 
  ON public.reading_sequences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for sequence_items
CREATE POLICY "Users can view sequence items they own or are public" 
  ON public.sequence_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_sequences rs 
      WHERE rs.id = sequence_items.sequence_id 
      AND (rs.user_id = auth.uid() OR rs.is_public = true)
    )
  );

CREATE POLICY "Users can create items for their sequences" 
  ON public.sequence_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reading_sequences rs 
      WHERE rs.id = sequence_items.sequence_id 
      AND rs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their sequences" 
  ON public.sequence_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_sequences rs 
      WHERE rs.id = sequence_items.sequence_id 
      AND rs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their sequences" 
  ON public.sequence_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_sequences rs 
      WHERE rs.id = sequence_items.sequence_id 
      AND rs.user_id = auth.uid()
    )
  );

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_reading_sequences_updated_at
  BEFORE UPDATE ON public.reading_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();