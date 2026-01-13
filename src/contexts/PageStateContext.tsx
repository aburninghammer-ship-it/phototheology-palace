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

// Hook to preserve tab state across navigation
export const usePreserveTabState = (defaultTab: string): [string, (tab: string) => void] => {
  const location = useLocation();
  const { setCustomState, getCustomState } = usePageState();

  // Get stored tab or use default
  const storedTab = getCustomState<string>(location.pathname, "activeTab");
  const [activeTab, setActiveTabInternal] = useState(storedTab || defaultTab);

  // Restore tab on mount
  useEffect(() => {
    const stored = getCustomState<string>(location.pathname, "activeTab");
    if (stored) {
      setActiveTabInternal(stored);
    }
  }, [location.pathname, getCustomState]);

  // Save tab when it changes
  const setActiveTab = useCallback((tab: string) => {
    setActiveTabInternal(tab);
    setCustomState(location.pathname, "activeTab", tab);
  }, [location.pathname, setCustomState]);

  return [activeTab, setActiveTab];
};

// Hook to preserve form/input state across navigation
export const usePreserveFormState = <T extends Record<string, any>>(defaultState: T): [T, (updates: Partial<T>) => void, (key: keyof T, value: any) => void] => {
  const location = useLocation();
  const { setCustomState, getCustomState } = usePageState();

  // Get stored form state or use default
  const storedState = getCustomState<T>(location.pathname, "formState");
  const [formState, setFormStateInternal] = useState<T>(storedState || defaultState);

  // Restore form state on mount
  useEffect(() => {
    const stored = getCustomState<T>(location.pathname, "formState");
    if (stored) {
      setFormStateInternal(stored);
    }
  }, [location.pathname, getCustomState]);

  // Update entire form state
  const updateFormState = useCallback((updates: Partial<T>) => {
    setFormStateInternal(prev => {
      const newState = { ...prev, ...updates };
      setCustomState(location.pathname, "formState", newState);
      return newState;
    });
  }, [location.pathname, setCustomState]);

  // Update single field
  const setFormField = useCallback((key: keyof T, value: any) => {
    setFormStateInternal(prev => {
      const newState = { ...prev, [key]: value };
      setCustomState(location.pathname, "formState", newState);
      return newState;
    });
  }, [location.pathname, setCustomState]);

  return [formState, updateFormState, setFormField];
};

// Combined hook for pages with both scroll and tabs
export const usePreservePage = (defaultTab?: string) => {
  usePreservePageState();
  const tabState = defaultTab ? usePreserveTabState(defaultTab) : undefined;
  return { activeTab: tabState?.[0], setActiveTab: tabState?.[1] };
};

// Hook for persisting any state value - works like useState but persists to localStorage
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const location = useLocation();
  const { setCustomState, getCustomState } = usePageState();
  const storageKey = `${location.pathname}:${key}`;

  // Initialize from stored value or default
  const [value, setValueInternal] = useState<T>(() => {
    const stored = getCustomState<T>(storageKey, key);
    return stored !== undefined ? stored : defaultValue;
  });

  // Restore on mount (in case context loaded after initial render)
  useEffect(() => {
    const stored = getCustomState<T>(storageKey, key);
    if (stored !== undefined) {
      setValueInternal(stored);
    }
  }, [storageKey, key, getCustomState]);

  // Wrapper that saves to context on every change
  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback((action) => {
    setValueInternal(prev => {
      const newValue = typeof action === 'function'
        ? (action as (prev: T) => T)(prev)
        : action;
      setCustomState(storageKey, key, newValue);
      return newValue;
    });
  }, [storageKey, key, setCustomState]);

  return [value, setValue];
}

const STORAGE_KEY = "pt_page_states";

// Serialize Map to JSON-compatible format
const serializePageStates = (states: Map<string, PageState>): string => {
  const obj: Record<string, PageState> = {};
  states.forEach((value, key) => {
    obj[key] = value;
  });
  return JSON.stringify(obj);
};

// Deserialize JSON to Map
const deserializePageStates = (json: string): Map<string, PageState> => {
  try {
    const obj = JSON.parse(json) as Record<string, PageState>;
    return new Map(Object.entries(obj));
  } catch {
    return new Map();
  }
};

// Load initial state from localStorage
const loadInitialState = (): Map<string, PageState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return deserializePageStates(stored);
    }
  } catch (e) {
    console.warn("Failed to load page states from localStorage:", e);
  }
  return new Map();
};

export const PageStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageStates, setPageStates] = useState<Map<string, PageState>>(() => loadInitialState());
  const location = useLocation();
  const previousPathRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save to localStorage
  const saveToStorage = useCallback((states: Map<string, PageState>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, serializePageStates(states));
      } catch (e) {
        console.warn("Failed to save page states to localStorage:", e);
      }
    }, 300); // Debounce 300ms
  }, []);

  // Save to localStorage whenever pageStates changes
  useEffect(() => {
    saveToStorage(pageStates);
  }, [pageStates, saveToStorage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
