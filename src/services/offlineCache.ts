import { Chapter } from "@/types/bible";

const CACHE_KEY_PREFIX = "bible_chapter_";
const CACHE_EXPIRY_DAYS = 30;
const MAX_CACHED_CHAPTERS = 50;

interface CachedChapter {
  chapter: Chapter;
  timestamp: number;
  translation: string;
}

interface CacheMetadata {
  keys: string[];
  lastCleanup: number;
}

const getCacheKey = (book: string, chapter: number, translation: string) => {
  return `${CACHE_KEY_PREFIX}${book}_${chapter}_${translation}`;
};

const getMetadataKey = () => "bible_cache_metadata";

const getMetadata = (): CacheMetadata => {
  try {
    const data = localStorage.getItem(getMetadataKey());
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading cache metadata:", e);
  }
  return { keys: [], lastCleanup: Date.now() };
};

const saveMetadata = (metadata: CacheMetadata) => {
  try {
    localStorage.setItem(getMetadataKey(), JSON.stringify(metadata));
  } catch (e) {
    console.error("Error saving cache metadata:", e);
  }
};

export const cacheChapter = (book: string, chapter: number, translation: string, data: Chapter) => {
  const key = getCacheKey(book, chapter, translation);
  const cached: CachedChapter = {
    chapter: data,
    timestamp: Date.now(),
    translation,
  };

  try {
    localStorage.setItem(key, JSON.stringify(cached));
    
    // Update metadata
    const metadata = getMetadata();
    if (!metadata.keys.includes(key)) {
      metadata.keys.push(key);
    }
    
    // Clean up if too many cached chapters
    if (metadata.keys.length > MAX_CACHED_CHAPTERS) {
      cleanupOldCache(metadata);
    }
    
    saveMetadata(metadata);
  } catch (e) {
    // Handle quota exceeded by cleaning up old cache
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      const metadata = getMetadata();
      cleanupOldCache(metadata);
      // Try again
      try {
        localStorage.setItem(key, JSON.stringify(cached));
      } catch {
        console.error("Unable to cache chapter after cleanup");
      }
    }
  }
};

export const getCachedChapter = (book: string, chapter: number, translation: string): Chapter | null => {
  const key = getCacheKey(book, chapter, translation);
  
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    const cached: CachedChapter = JSON.parse(data);
    
    // Check if cache is expired
    const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - cached.timestamp > expiryMs) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cached.chapter;
  } catch (e) {
    console.error("Error reading cached chapter:", e);
    return null;
  }
};

const cleanupOldCache = (metadata: CacheMetadata) => {
  // Sort by timestamp and remove oldest
  const cacheData: { key: string; timestamp: number }[] = [];
  
  for (const key of metadata.keys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const cached: CachedChapter = JSON.parse(data);
        cacheData.push({ key, timestamp: cached.timestamp });
      }
    } catch {
      // Invalid data, remove it
      localStorage.removeItem(key);
    }
  }
  
  // Sort by timestamp (oldest first)
  cacheData.sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove oldest half
  const toRemove = cacheData.slice(0, Math.floor(cacheData.length / 2));
  for (const item of toRemove) {
    localStorage.removeItem(item.key);
  }
  
  // Update metadata
  metadata.keys = cacheData
    .slice(Math.floor(cacheData.length / 2))
    .map((item) => item.key);
  metadata.lastCleanup = Date.now();
  saveMetadata(metadata);
};

export const getCacheStats = () => {
  const metadata = getMetadata();
  return {
    cachedChapters: metadata.keys.length,
    maxChapters: MAX_CACHED_CHAPTERS,
  };
};

export const clearCache = () => {
  const metadata = getMetadata();
  for (const key of metadata.keys) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(getMetadataKey());
};

export const isOnline = () => navigator.onLine;

// Pre-cache surrounding chapters for better offline experience
export const preCacheSurrounding = async (
  book: string,
  chapter: number,
  translation: string,
  fetchFn: (book: string, chapter: number, translation: string) => Promise<Chapter>
) => {
  // Only pre-cache if online and not already cached
  if (!isOnline()) return;
  
  const toCache = [
    { book, chapter: chapter - 1, translation },
    { book, chapter: chapter + 1, translation },
  ];
  
  for (const item of toCache) {
    if (item.chapter < 1) continue;
    
    const cached = getCachedChapter(item.book, item.chapter, item.translation);
    if (!cached) {
      try {
        const data = await fetchFn(item.book, item.chapter, item.translation);
        cacheChapter(item.book, item.chapter, item.translation, data);
      } catch {
        // Silently fail for pre-caching
      }
    }
  }
};
