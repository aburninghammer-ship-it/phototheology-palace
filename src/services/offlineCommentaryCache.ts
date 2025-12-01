// Offline caching service for Bible commentary

const COMMENTARY_CACHE_PREFIX = "bible_commentary_";
const CACHE_EXPIRY_DAYS = 90; // Commentary doesn't change, cache longer

interface CachedCommentary {
  commentary: string;
  timestamp: number;
  depth: string;
}

const getCacheKey = (book: string, chapter: number, depth: string, isChapter: boolean, verse?: number) => {
  const normalizedBook = book.toLowerCase().replace(/\s+/g, '_');
  if (isChapter) {
    return `${COMMENTARY_CACHE_PREFIX}chapter_${normalizedBook}_${chapter}_${depth}`;
  }
  return `${COMMENTARY_CACHE_PREFIX}verse_${normalizedBook}_${chapter}_${verse}_${depth}`;
};

/**
 * Cache chapter commentary for offline use
 */
export const cacheChapterCommentary = (
  book: string,
  chapter: number,
  depth: string,
  commentary: string
): void => {
  const key = getCacheKey(book, chapter, depth, true);
  const cached: CachedCommentary = {
    commentary,
    timestamp: Date.now(),
    depth,
  };

  try {
    localStorage.setItem(key, JSON.stringify(cached));
    console.log(`[Commentary Cache] Stored chapter: ${book} ${chapter} (${depth})`);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      // Clean old commentary cache if quota exceeded
      cleanupOldCommentaryCache();
      try {
        localStorage.setItem(key, JSON.stringify(cached));
      } catch {
        console.error("[Commentary Cache] Unable to cache after cleanup");
      }
    }
  }
};

/**
 * Cache verse commentary for offline use
 */
export const cacheVerseCommentary = (
  book: string,
  chapter: number,
  verse: number,
  depth: string,
  commentary: string
): void => {
  const key = getCacheKey(book, chapter, depth, false, verse);
  const cached: CachedCommentary = {
    commentary,
    timestamp: Date.now(),
    depth,
  };

  try {
    localStorage.setItem(key, JSON.stringify(cached));
    console.log(`[Commentary Cache] Stored verse: ${book} ${chapter}:${verse} (${depth})`);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      cleanupOldCommentaryCache();
      try {
        localStorage.setItem(key, JSON.stringify(cached));
      } catch {
        console.error("[Commentary Cache] Unable to cache after cleanup");
      }
    }
  }
};

/**
 * Get cached chapter commentary
 */
export const getCachedChapterCommentary = (
  book: string,
  chapter: number,
  depth: string
): string | null => {
  const key = getCacheKey(book, chapter, depth, true);

  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const cached: CachedCommentary = JSON.parse(data);

    // Check expiry
    const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - cached.timestamp > expiryMs) {
      localStorage.removeItem(key);
      return null;
    }

    console.log(`[Commentary Cache] HIT chapter: ${book} ${chapter} (${depth})`);
    return cached.commentary;
  } catch (e) {
    console.error("[Commentary Cache] Error reading:", e);
    return null;
  }
};

/**
 * Get cached verse commentary
 */
export const getCachedVerseCommentary = (
  book: string,
  chapter: number,
  verse: number,
  depth: string
): string | null => {
  const key = getCacheKey(book, chapter, depth, false, verse);

  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const cached: CachedCommentary = JSON.parse(data);

    const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - cached.timestamp > expiryMs) {
      localStorage.removeItem(key);
      return null;
    }

    console.log(`[Commentary Cache] HIT verse: ${book} ${chapter}:${verse} (${depth})`);
    return cached.commentary;
  } catch (e) {
    console.error("[Commentary Cache] Error reading:", e);
    return null;
  }
};

/**
 * Clean up old commentary cache entries
 */
const cleanupOldCommentaryCache = (): void => {
  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(COMMENTARY_CACHE_PREFIX)) {
      keys.push(key);
    }
  }

  // Sort by timestamp and remove oldest half
  const cacheData: { key: string; timestamp: number }[] = [];
  
  for (const key of keys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const cached: CachedCommentary = JSON.parse(data);
        cacheData.push({ key, timestamp: cached.timestamp });
      }
    } catch {
      localStorage.removeItem(key);
    }
  }

  cacheData.sort((a, b) => a.timestamp - b.timestamp);
  const toRemove = cacheData.slice(0, Math.floor(cacheData.length / 2));
  
  for (const item of toRemove) {
    localStorage.removeItem(item.key);
  }
  
  console.log(`[Commentary Cache] Cleaned up ${toRemove.length} old entries`);
};

/**
 * Get commentary cache statistics
 */
export const getCommentaryCacheStats = (): { chapters: number; verses: number } => {
  let chapters = 0;
  let verses = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${COMMENTARY_CACHE_PREFIX}chapter_`)) {
      chapters++;
    } else if (key?.startsWith(`${COMMENTARY_CACHE_PREFIX}verse_`)) {
      verses++;
    }
  }

  return { chapters, verses };
};

/**
 * Clear all commentary cache
 */
export const clearCommentaryCache = (): void => {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(COMMENTARY_CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
  
  console.log(`[Commentary Cache] Cleared ${keysToRemove.length} entries`);
};

/**
 * Clean commentary text for TTS - removes symbols that sound awkward when read aloud
 */
export const cleanCommentaryForTTS = (text: string): string => {
  return text
    // Remove markdown symbols
    .replace(/\*\*/g, '')           // Bold markers
    .replace(/\*/g, '')             // Italics/single asterisks
    .replace(/__/g, '')             // Underline
    .replace(/_([^_]+)_/g, '$1')    // Underscore emphasis
    .replace(/#+\s*/g, '')          // Headers
    .replace(/`/g, '')              // Code ticks
    // Remove parenthetical references that break flow
    .replace(/\([^)]*\)/g, '')      // Remove (anything in parentheses)
    .replace(/\[[^\]]*\]/g, '')     // Remove [brackets]
    // Remove special punctuation
    .replace(/—/g, ', ')            // Em dash to comma
    .replace(/–/g, ', ')            // En dash to comma
    .replace(/\.\.\./g, '.')        // Ellipsis to period
    .replace(/…/g, '.')             // Unicode ellipsis
    // Clean up quotes
    .replace(/"/g, '')              // Curly quotes
    .replace(/"/g, '')
    .replace(/'/g, "'")             // Normalize apostrophes
    .replace(/'/g, "'")
    // Remove verse references like (John 3:16) or [Gen 1:1]
    .replace(/\([1-3]?\s?[A-Za-z]+\s?\d+:\d+(-\d+)?\)/gi, '')
    .replace(/\[[1-3]?\s?[A-Za-z]+\s?\d+:\d+(-\d+)?\]/gi, '')
    // Clean up resulting double spaces
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
    .replace(/\.\s*\./g, '.')
    .trim();
};
