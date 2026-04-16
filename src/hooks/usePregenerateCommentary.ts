import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SequenceVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const usePregenerateCommentary = (verses: SequenceVerse[]) => {
  useEffect(() => {
    if (!verses || verses.length === 0) return;

    const pregenerate = async () => {
      console.log('Starting background commentary pre-generation for', verses.length, 'verses');
      
      try {
        // Fire and forget - this runs in background
        supabase.functions.invoke('pregenerate-commentary', {
          body: {
            verses: verses.map(v => ({
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              text: v.text,
            })),
            depth: 'intermediate',
          }
        }).then(({ data, error }) => {
          if (error) {
            console.error('Background pre-generation error:', error);
          } else {
            console.log('Background pre-generation completed:', data);
          }
        });
      } catch (error) {
        console.error('Failed to start pre-generation:', error);
      }
    };

    // Start pre-generation after a short delay to not block UI
    // Reduced from 1000ms to 200ms for faster mobile experience
    const timer = setTimeout(pregenerate, 200);
    return () => clearTimeout(timer);
  }, [verses]);
};
