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

        // Fetch verses for this chapter from BibleSDK (translation, book, chapter, [start verse, end verse])
        const verses = await getVerses(bookCode, chapter, [1, 999]);
        
        if (!verses || verses.length === 0) {
          console.warn(`No verses found for ${bookCode} chapter ${chapter}`);
          continue;
        }

        // Process verses into batches for insertion
        const versesToInsert = verses.map((verse: any) => {
          // Parse tokens from verse text
          const tokens = verse.text.split(/\s+/).map((word: string, index: number) => ({
            word: word.replace(/[^\w\s'-]/g, ''),
            position: index,
            strongs: verse.strongs?.[index] || null,
          }));

          return {
            book: bookCode,
            chapter: chapter,
            verse_num: verse.verse,
            text_kjv: verse.text,
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
