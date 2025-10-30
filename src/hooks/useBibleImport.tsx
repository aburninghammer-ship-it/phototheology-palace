import { useState } from 'react';
import { getVerses } from 'biblesdk';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportProgress {
  book: string;
  chapter: number;
  totalChapters: number;
  versesImported: number;
}

interface BibleSDKPhrase {
  book: string;
  text: string;
  usfm: string[];
  position: number;
  verse: number | null;
  verse_position: number | null;
  chapter: number;
  strongs_number: number | null;
  strongs_type: string | null;
  transliteration: string | null;
  definition: string | null;
  hebrew_word: string | null;
  greek_word: string | null;
}

interface BibleSDKResponse {
  phrases: BibleSDKPhrase[];
  prev: any;
}

export const useBibleImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const { toast } = useToast();

  const importBook = async (bookCode: string, bookName: string, totalChapters: number) => {
    setIsImporting(true);
    let totalVersesImported = 0;

    try {
      for (let chapter = 1; chapter <= totalChapters; chapter++) {
        setProgress({
          book: bookName,
          chapter,
          totalChapters,
          versesImported: totalVersesImported,
        });

        // Fetch verses for this chapter from BibleSDK
        const response = await getVerses(bookCode, chapter, [1, 999]) as unknown as BibleSDKResponse;
        
        if (!response || !response.phrases || response.phrases.length === 0) {
          console.warn(`No verses found for ${bookCode} chapter ${chapter}`);
          continue;
        }

        // Group phrases by verse number (filter out metadata with null verse)
        const verseGroups = new Map<number, BibleSDKPhrase[]>();
        response.phrases.forEach((phrase) => {
          if (phrase.verse !== null) {
            if (!verseGroups.has(phrase.verse)) {
              verseGroups.set(phrase.verse, []);
            }
            verseGroups.get(phrase.verse)!.push(phrase);
          }
        });

        // Process each verse
        const versesToInsert = Array.from(verseGroups.entries()).map(([verseNum, phrases]) => {
          // Build full verse text from phrases
          const verseText = phrases
            .map(p => p.text)
            .join('')
            .trim();

          // Build token array with Strong's data (only phrases with strongs_number)
          const tokens = phrases
            .filter(p => p.strongs_number !== null)
            .map((p, idx) => ({
              position: idx,
              word: p.text.trim(),
              strongs: p.strongs_number ? `${p.strongs_type}${p.strongs_number}` : null,
              definition: p.definition || null,
              hebrew_word: p.hebrew_word || null,
              greek_word: p.greek_word || null,
            }));

          return {
            book: bookCode,
            chapter: chapter,
            verse_num: verseNum,
            text_kjv: verseText,
            tokens: tokens,
          };
        });

        // Insert verses in batches of 50
        const batchSize = 50;
        for (let i = 0; i < versesToInsert.length; i += batchSize) {
          const batch = versesToInsert.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from('bible_verses_tokenized')
            .upsert(batch, {
              onConflict: 'book,chapter,verse_num',
            });

          if (error) {
            console.error('Error inserting batch:', error);
            throw error;
          }

          totalVersesImported += batch.length;
          setProgress({
            book: bookName,
            chapter,
            totalChapters,
            versesImported: totalVersesImported,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Import Complete",
        description: `Successfully imported ${totalVersesImported} verses from ${bookName}`,
      });

      return { success: true, versesImported: totalVersesImported };
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred during import",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsImporting(false);
      setProgress(null);
    }
  };

  return {
    importBook,
    isImporting,
    progress,
  };
};
