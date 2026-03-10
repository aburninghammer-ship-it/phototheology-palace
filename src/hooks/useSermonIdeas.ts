import { useState, useEffect, useCallback } from "react";

export interface SermonIdea {
  id: string;
  title: string;
  scripture: string;
  keyPoints: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "phototheology_sermon_ideas";

export const useSermonIdeas = () => {
  const [ideas, setIdeas] = useState<SermonIdea[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setIdeas(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load sermon ideas from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveToStorage = (updated: SermonIdea[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save sermon ideas to localStorage:", e);
    }
  };

  const addIdea = useCallback((idea: Omit<SermonIdea, "id" | "created_at" | "updated_at">) => {
    const newIdea: SermonIdea = {
      ...idea,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setIdeas(prev => {
      const updated = [newIdea, ...prev];
      saveToStorage(updated);
      return updated;
    });

    return newIdea;
  }, []);

  const updateIdea = useCallback((id: string, fields: Partial<Omit<SermonIdea, "id" | "created_at" | "updated_at">>) => {
    setIdeas(prev => {
      const updated = prev.map(idea =>
        idea.id === id
          ? { ...idea, ...fields, updated_at: new Date().toISOString() }
          : idea
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas(prev => {
      const updated = prev.filter(idea => idea.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return {
    ideas,
    addIdea,
    updateIdea,
    deleteIdea,
    isOnline,
  };
};
