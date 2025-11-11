import { useState, useEffect, useCallback } from "react";
import { offlineStorage, OfflineVerse } from "@/services/offlineStorage";
import { useToast } from "@/hooks/use-toast";

export const useOfflineBible = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedBooks, setCachedBooks] = useState<string[]>([]);
  const [isCaching, setIsCaching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "You're now offline. Cached content is available.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached books on mount
    loadCachedBooks();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedBooks = async () => {
    try {
      const books = await offlineStorage.getCachedBooks();
      setCachedBooks(books);
    } catch (error) {
      console.error('Error loading cached books:', error);
    }
  };

  const cacheVerse = useCallback(async (verse: OfflineVerse) => {
    try {
      await offlineStorage.saveVerse(verse);
    } catch (error) {
      console.error('Error caching verse:', error);
    }
  }, []);

  const cacheChapter = useCallback(async (
    book: string,
    chapter: number,
    verses: Array<{ verse: number; text: string }>,
    translation: string = 'KJV'
  ) => {
    setIsCaching(true);
    try {
      const offlineVerses: OfflineVerse[] = verses.map(v => ({
        book,
        chapter,
        verse: v.verse,
        text: v.text,
        translation,
        timestamp: Date.now(),
      }));

      await offlineStorage.saveVerses(offlineVerses);
      await loadCachedBooks();

      toast({
        title: "Chapter Cached",
        description: `${book} ${chapter} is now available offline.`,
      });
    } catch (error) {
      console.error('Error caching chapter:', error);
      toast({
        title: "Caching Failed",
        description: "Failed to cache chapter for offline use.",
        variant: "destructive",
      });
    } finally {
      setIsCaching(false);
    }
  }, [toast]);

  const getCachedVerse = useCallback(async (
    book: string,
    chapter: number,
    verse: number,
    translation: string = 'KJV'
  ): Promise<OfflineVerse | null> => {
    try {
      return await offlineStorage.getVerse(book, chapter, verse, translation);
    } catch (error) {
      console.error('Error getting cached verse:', error);
      return null;
    }
  }, []);

  const getCachedChapter = useCallback(async (
    book: string,
    chapter: number,
    translation: string = 'KJV'
  ): Promise<OfflineVerse[]> => {
    try {
      return await offlineStorage.getChapter(book, chapter, translation);
    } catch (error) {
      console.error('Error getting cached chapter:', error);
      return [];
    }
  }, []);

  const isChapterCached = useCallback(async (
    book: string,
    chapter: number,
    translation: string = 'KJV'
  ): Promise<boolean> => {
    try {
      const verses = await getCachedChapter(book, chapter, translation);
      return verses.length > 0;
    } catch {
      return false;
    }
  }, [getCachedChapter]);

  return {
    isOnline,
    cachedBooks,
    isCaching,
    cacheVerse,
    cacheChapter,
    getCachedVerse,
    getCachedChapter,
    isChapterCached,
  };
};
