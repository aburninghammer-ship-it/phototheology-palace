import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface PPTAutoSaveData {
  activeTab: 'full' | 'verses' | 'study';
  sermonTitle: string;
  sermonContent: string;
  versesInput: string;
  studyTitle: string;
  studyBlocks: any[];
  settings: any;
  generatedDeck: any | null;
  lastSaved: string;
}

const STORAGE_KEY = 'ppt_autosave_data';
const AUTO_SAVE_INTERVAL = 15000; // 15 seconds

export function usePPTAutoSave(
  data: Omit<PPTAutoSaveData, 'lastSaved'>,
  setters: {
    setActiveTab: (tab: 'full' | 'verses' | 'study') => void;
    setSermonTitle: (title: string) => void;
    setSermonContent: (content: string) => void;
    setVersesInput: (verses: string) => void;
    setStudyTitle: (title: string) => void;
    setStudyBlocks: (blocks: any[]) => void;
    setSettings: (settings: any) => void;
    setGeneratedDeck: (deck: any | null) => void;
  }
) {
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasDataRef = useRef(false);

  // Check if there's meaningful data to save
  const hasDataToSave = useCallback(() => {
    return (
      data.sermonTitle.trim().length > 0 ||
      data.sermonContent.trim().length > 0 ||
      data.versesInput.trim().length > 0 ||
      data.studyTitle.trim().length > 0 ||
      data.studyBlocks.length > 0 ||
      data.generatedDeck !== null
    );
  }, [data]);

  // Save data to localStorage
  const saveData = useCallback(() => {
    if (!hasDataToSave()) return;
    
    const savePayload: PPTAutoSaveData = {
      ...data,
      lastSaved: new Date().toISOString(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savePayload));
      setLastSavedTime(new Date());
      hasDataRef.current = true;
    } catch (error) {
      console.error('Failed to auto-save PPT data:', error);
    }
  }, [data, hasDataToSave]);

  // Restore data from localStorage
  const restoreData = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;

      const parsed: PPTAutoSaveData = JSON.parse(saved);
      
      // Check if saved data is not too old (24 hours)
      const savedDate = new Date(parsed.lastSaved);
      const now = new Date();
      const hoursSinceSave = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceSave > 24) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }

      // Check if there's meaningful data
      const hasMeaningfulData = 
        parsed.sermonTitle?.trim() ||
        parsed.sermonContent?.trim() ||
        parsed.versesInput?.trim() ||
        parsed.studyTitle?.trim() ||
        (parsed.studyBlocks && parsed.studyBlocks.length > 0) ||
        parsed.generatedDeck;

      if (!hasMeaningfulData) return false;

      // Restore the data
      if (parsed.activeTab) setters.setActiveTab(parsed.activeTab);
      if (parsed.sermonTitle) setters.setSermonTitle(parsed.sermonTitle);
      if (parsed.sermonContent) setters.setSermonContent(parsed.sermonContent);
      if (parsed.versesInput) setters.setVersesInput(parsed.versesInput);
      if (parsed.studyTitle) setters.setStudyTitle(parsed.studyTitle);
      if (parsed.studyBlocks) setters.setStudyBlocks(parsed.studyBlocks);
      if (parsed.settings) setters.setSettings(parsed.settings);
      if (parsed.generatedDeck) setters.setGeneratedDeck(parsed.generatedDeck);
      
      setLastSavedTime(savedDate);
      hasDataRef.current = true;
      
      return true;
    } catch (error) {
      console.error('Failed to restore PPT data:', error);
      return false;
    }
  }, [setters]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastSavedTime(null);
    hasDataRef.current = false;
  }, []);

  // Set up auto-save interval
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      if (hasDataToSave()) {
        saveData();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [saveData, hasDataToSave]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (hasDataToSave()) {
        saveData();
      }
    };
  }, [saveData, hasDataToSave]);

  // Restore data on mount (only once)
  useEffect(() => {
    if (!hasRestoredData) {
      const restored = restoreData();
      setHasRestoredData(true);
      if (restored) {
        toast.success('Previous work restored', {
          description: 'Your PowerPoint progress was auto-saved',
          duration: 3000,
        });
      }
    }
  }, [restoreData, hasRestoredData]);

  return {
    lastSavedTime,
    saveNow: saveData,
    clearSavedData,
    hasRestoredData,
  };
}
