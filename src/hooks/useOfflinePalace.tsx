import { useState, useEffect, useCallback } from "react";
import { offlineStorage, OfflinePalaceContent } from "@/services/offlineStorage";
import { useToast } from "@/hooks/use-toast";

export const useOfflinePalace = () => {
  const [cachedContent, setCachedContent] = useState<OfflinePalaceContent[]>([]);
  const [isCaching, setIsCaching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCachedContent();
  }, []);

  const loadCachedContent = async () => {
    try {
      const content = await offlineStorage.getAllPalaceContent();
      setCachedContent(content);
    } catch (error) {
      console.error('Error loading cached palace content:', error);
    }
  };

  const cacheContent = useCallback(async (
    id: string,
    type: 'floor' | 'room' | 'course',
    content: any
  ) => {
    setIsCaching(true);
    try {
      await offlineStorage.savePalaceContent({
        id,
        type,
        content,
        timestamp: Date.now(),
      });

      await loadCachedContent();

      toast({
        title: "Content Cached",
        description: `${type} content is now available offline.`,
      });
    } catch (error) {
      console.error('Error caching palace content:', error);
      toast({
        title: "Caching Failed",
        description: "Failed to cache content for offline use.",
        variant: "destructive",
      });
    } finally {
      setIsCaching(false);
    }
  }, [toast]);

  const getCachedContent = useCallback(async (
    id: string
  ): Promise<OfflinePalaceContent | null> => {
    try {
      return await offlineStorage.getPalaceContent(id);
    } catch (error) {
      console.error('Error getting cached content:', error);
      return null;
    }
  }, []);

  const isContentCached = useCallback((id: string): boolean => {
    return cachedContent.some(c => c.id === id);
  }, [cachedContent]);

  const getCachedByType = useCallback((
    type: 'floor' | 'room' | 'course'
  ): OfflinePalaceContent[] => {
    return cachedContent.filter(c => c.type === type);
  }, [cachedContent]);

  return {
    cachedContent,
    isCaching,
    cacheContent,
    getCachedContent,
    isContentCached,
    getCachedByType,
  };
};
