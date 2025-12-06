import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageState {
  scrollPosition: number;
  formData?: Record<string, any>;
  customState?: Record<string, any>;
}

interface PageStateContextType {
  getPageState: (path: string) => PageState | undefined;
  setPageState: (path: string, state: Partial<PageState>) => void;
  saveScrollPosition: (path: string) => void;
  restoreScrollPosition: (path: string) => void;
  setCustomState: (path: string, key: string, value: any) => void;
  getCustomState: <T>(path: string, key: string) => T | undefined;
}

const PageStateContext = createContext<PageStateContextType | null>(null);

export const usePageState = () => {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within PageStateProvider");
  }
  return context;
};

// Hook to auto-save and restore scroll position for current page
export const usePreservePageState = () => {
  const location = useLocation();
  const { saveScrollPosition, restoreScrollPosition } = usePageState();
  const hasRestoredRef = useRef(false);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (!hasRestoredRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        restoreScrollPosition(location.pathname);
        hasRestoredRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, restoreScrollPosition]);

  // Save scroll position before unmounting
  useEffect(() => {
    return () => {
      saveScrollPosition(location.pathname);
    };
  }, [location.pathname, saveScrollPosition]);
};

export const PageStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageStates, setPageStates] = useState<Map<string, PageState>>(new Map());
  const location = useLocation();
  const previousPathRef = useRef<string>("");

  // Save scroll position when navigating away
  useEffect(() => {
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      const scrollY = window.scrollY;
      setPageStates(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(previousPathRef.current) || { scrollPosition: 0 };
        newMap.set(previousPathRef.current, { ...existing, scrollPosition: scrollY });
        return newMap;
      });
    }
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  const getPageState = useCallback((path: string) => {
    return pageStates.get(path);
  }, [pageStates]);

  const setPageState = useCallback((path: string, state: Partial<PageState>) => {
    setPageStates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(path) || { scrollPosition: 0 };
      newMap.set(path, { ...existing, ...state });
      return newMap;
    });
  }, []);

  const saveScrollPosition = useCallback((path: string) => {
    const scrollY = window.scrollY;
    setPageStates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(path) || { scrollPosition: 0 };
      newMap.set(path, { ...existing, scrollPosition: scrollY });
      return newMap;
    });
  }, []);

  const restoreScrollPosition = useCallback((path: string) => {
    const state = pageStates.get(path);
    if (state && state.scrollPosition > 0) {
      window.scrollTo({ top: state.scrollPosition, behavior: "instant" });
    }
  }, [pageStates]);

  const setCustomState = useCallback((path: string, key: string, value: any) => {
    setPageStates(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(path) || { scrollPosition: 0 };
      const customState = existing.customState || {};
      newMap.set(path, { 
        ...existing, 
        customState: { ...customState, [key]: value } 
      });
      return newMap;
    });
  }, []);

  const getCustomState = useCallback(<T,>(path: string, key: string): T | undefined => {
    const state = pageStates.get(path);
    return state?.customState?.[key] as T | undefined;
  }, [pageStates]);

  return (
    <PageStateContext.Provider value={{
      getPageState,
      setPageState,
      saveScrollPosition,
      restoreScrollPosition,
      setCustomState,
      getCustomState,
    }}>
      {children}
    </PageStateContext.Provider>
  );
};
