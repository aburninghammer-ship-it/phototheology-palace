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

        // Fetch tokenized verses for this chapter from BibleSDK
        const tokenizedData = await getVerses(bookCode, chapter, [1, 999]);
        
        if (!tokenizedData || tokenizedData.length === 0) {
          console.warn(`No verses found for ${bookCode} chapter ${chapter}`);
          continue;
        }

        // Group tokens by verse number
        const verseGroups = new Map<number, any[]>();
        tokenizedData.forEach((token: any) => {
          if (!verseGroups.has(token.verse)) {
            verseGroups.set(token.verse, []);
          }
          verseGroups.get(token.verse)!.push(token);
        });

        // Process each verse
        const versesToInsert = Array.from(verseGroups.entries()).map(([verseNum, tokens]) => {
          // Build full verse text from tokens
          const verseText = tokens
            .map(t => t.text)
            .join('')
            .replace(/\s+/g, ' ')
            .trim();

          // Build token array with Strong's data
          const tokenArray = tokens
            .filter(t => t.strongs_number) // Only include tokens with Strong's numbers
            .map((t, idx) => ({
              position: idx,
              word: t.text.trim(),
              strongs: t.strongs_number ? `${t.strongs_type}${t.strongs_number}` : null,
              definition: t.definition || null,
              original_word: t.hebrew_word || t.greek_word || null,
            }));

          return {
            book: bookCode,
            chapter: chapter,
            verse_num: verseNum,
            text_kjv: verseText,
            tokens: tokenArray,
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
