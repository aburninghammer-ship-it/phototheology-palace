import { useCallback, useRef } from "react";
import { fetchChapter } from "@/services/bibleApi";
import { extractScriptureReferencesFromSermon } from "@/lib/extractScriptureReferences";
import { toast } from "sonner";

interface ParsedReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  fullRef: string;
}

// Parse a scripture reference string into its components
function parseScriptureReference(ref: string): ParsedReference | null {
  // Match patterns like "John 3:16", "Genesis 1:1-5", "1 Corinthians 13:4-7"
  const pattern = /^((?:\d\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s*(\d+)(?::(\d+)(?:\s*[-–—]\s*(\d+))?)?$/;
  const match = ref.trim().match(pattern);
  
  if (!match) return null;
  
  const [, book, chapter, verseStart, verseEnd] = match;
  
  return {
    book: book.trim(),
    chapter: parseInt(chapter),
    verseStart: verseStart ? parseInt(verseStart) : 1,
    verseEnd: verseEnd ? parseInt(verseEnd) : undefined,
    fullRef: ref.trim()
  };
}

// Fetch verse text for a parsed reference
async function fetchVerseText(parsed: ParsedReference): Promise<string | null> {
  try {
    const chapterData = await fetchChapter(parsed.book, parsed.chapter);
    
    if (!chapterData?.verses?.length) return null;
    
    const verseEnd = parsed.verseEnd || parsed.verseStart;
    const versesInRange = chapterData.verses.filter(
      v => v.verse >= parsed.verseStart && v.verse <= verseEnd
    );
    
    if (versesInRange.length === 0) return null;
    
    // Format verse text with verse numbers if multiple verses
    if (versesInRange.length > 1) {
      return versesInRange
        .map(v => `[${v.verse}] ${v.text}`)
        .join(" ");
    }
    
    return versesInRange[0].text;
  } catch (error) {
    console.error("Error fetching verse:", error);
    return null;
  }
}

export interface AutoScriptureFetchResult {
  detectAndFetchScripture: (text: string) => Promise<{ 
    scriptureRef: string; 
    verseText: string 
  } | null>;
}

export function useAutoScriptureFetch(): AutoScriptureFetchResult {
  const lastProcessedRef = useRef<string>("");
  
  const detectAndFetchScripture = useCallback(async (text: string): Promise<{ 
    scriptureRef: string; 
    verseText: string 
  } | null> => {
    if (!text || text.length < 3) return null;
    
    // Extract scripture references from the text
    const refs = extractScriptureReferencesFromSermon(text);
    
    if (refs.length === 0) return null;
    
    // Use the first detected reference
    const ref = refs[0];
    
    // Don't re-process the same reference
    if (ref === lastProcessedRef.current) return null;
    lastProcessedRef.current = ref;
    
    // Parse the reference
    const parsed = parseScriptureReference(ref);
    if (!parsed) return null;
    
    // Fetch the verse text
    const verseText = await fetchVerseText(parsed);
    
    if (!verseText) {
      toast.error(`Could not fetch ${ref}`);
      return null;
    }
    
    toast.success(`Auto-populated ${ref}`);
    
    return {
      scriptureRef: ref,
      verseText
    };
  }, []);
  
  return { detectAndFetchScripture };
}
