import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { usePageState } from "@/contexts/PageStateContext";

/**
 * Hook to automatically preserve scroll position and custom state for a page
 * 
 * Usage:
 * const { setCustomState, getCustomState } = usePreservePage();
 * 
 * // Save custom state
 * setCustomState('activeTab', 'settings');
 * 
 * // Get custom state
 * const activeTab = getCustomState<string>('activeTab');
 */
export const usePreservePage = () => {
  const location = useLocation();
  const { 
    saveScrollPosition, 
    restoreScrollPosition, 
    setCustomState: setContextCustomState,
    getCustomState: getContextCustomState 
  } = usePageState();
  const hasRestoredRef = useRef(false);
  const currentPath = location.pathname;

  // Restore scroll position when component mounts
  useEffect(() => {
    if (!hasRestoredRef.current) {
      // Small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        restoreScrollPosition(currentPath);
        hasRestoredRef.current = true;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentPath, restoreScrollPosition]);

  // Save scroll position before unmounting
  useEffect(() => {
    const path = currentPath;
    return () => {
      saveScrollPosition(path);
    };
  }, [currentPath, saveScrollPosition]);

  // Wrapper for setting custom state for current page
  const setCustomState = useCallback((key: string, value: any) => {
    setContextCustomState(currentPath, key, value);
  }, [currentPath, setContextCustomState]);

  // Wrapper for getting custom state for current page
  const getCustomState = useCallback(<T,>(key: string): T | undefined => {
    return getContextCustomState<T>(currentPath, key);
  }, [currentPath, getContextCustomState]);

  return {
    setCustomState,
    getCustomState,
  };
};
