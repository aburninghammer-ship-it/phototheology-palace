import { useState, useEffect } from "react";

interface BibleState {
  selectedVerses: number[];
  showStrongs: boolean;
  showPrinciples: boolean;
  showChainRef: boolean;
  showCommentary: boolean;
  showAI: boolean;
  showPreacherMentor: boolean;
}

const STORAGE_KEY = "phototheology_bible_state";

export const useBibleState = (bookId: string, chapter: string) => {
  const stateKey = `${STORAGE_KEY}_${bookId}_${chapter}`;
  
  const [selectedVerses, setSelectedVerses] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.selectedVerses || [];
      }
    } catch {}
    return [];
  });

  const [showStrongs, setShowStrongs] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showStrongs || false;
      }
    } catch {}
    return false;
  });

  const [showPrinciples, setShowPrinciples] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showPrinciples || false;
      }
    } catch {}
    return false;
  });

  const [showChainRef, setShowChainRef] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showChainRef || false;
      }
    } catch {}
    return false;
  });

  const [showCommentary, setShowCommentary] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showCommentary || false;
      }
    } catch {}
    return false;
  });

  const [showAI, setShowAI] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showAI || false;
      }
    } catch {}
    return false;
  });

  const [showPreacherMentor, setShowPreacherMentor] = useState(() => {
    try {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.showPreacherMentor || false;
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    const state: BibleState = {
      selectedVerses,
      showStrongs,
      showPrinciples,
      showChainRef,
      showCommentary,
      showAI,
      showPreacherMentor,
    };
    
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist Bible state:", e);
    }
  }, [selectedVerses, showStrongs, showPrinciples, showChainRef, showCommentary, showAI, showPreacherMentor, stateKey]);

  return {
    selectedVerses,
    setSelectedVerses,
    showStrongs,
    setShowStrongs,
    showPrinciples,
    setShowPrinciples,
    showChainRef,
    setShowChainRef,
    showCommentary,
    setShowCommentary,
    showAI,
    setShowAI,
    showPreacherMentor,
    setShowPreacherMentor,
  };
};
