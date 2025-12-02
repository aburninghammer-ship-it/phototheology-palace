import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useElevenLabsAudio = () => {
  const [loading, setLoading] = useState(false);

  const getCommentaryAudio = useCallback(async (
    commentary: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<string | null> => {
    try {
      setLoading(true);

      // Check cache first
      const { data: cached } = await supabase
        .from('bible_audio_cache')
        .select('storage_path')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .eq('voice_id', 'daniel')
        .maybeSingle();

      if (cached?.storage_path) {
        console.log('Audio retrieved from cache');
        const { data } = await supabase.storage
          .from('bible-audio')
          .createSignedUrl(cached.storage_path, 3600);
        
        return data?.signedUrl || null;
      }

      // Generate audio if not cached
      console.log('Generating new audio...');
      const { data, error } = await supabase.functions.invoke('generate-elevenlabs-audio', {
        body: { text: commentary, book, chapter, verse }
      });

      if (error) throw error;

      if (data?.storage_path) {
        const { data: urlData } = await supabase.storage
          .from('bible-audio')
          .createSignedUrl(data.storage_path, 3600);
        
        return urlData?.signedUrl || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting commentary audio:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCommentaryAudio, loading };
};
