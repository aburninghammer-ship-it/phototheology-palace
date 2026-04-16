import React, { useRef, useEffect, useState, ReactElement } from "react";
import { useLocation } from "react-router-dom";

interface CachedPage {
  path: string;
  element: ReactElement;
  scrollPosition: number;
}

interface KeepAliveProps {
  children: ReactElement;
  /** Maximum number of pages to keep in cache */
  maxCached?: number;
  /** Paths that should NOT be cached (e.g., auth pages) */
  excludePaths?: string[];
}

/**
 * KeepAlive component that caches visited pages to preserve their state.
 * When navigating away and back, the page state (form inputs, scroll position, etc.)
 * is preserved because the component is never unmounted - just hidden.
 */
export const KeepAlive: React.FC<KeepAliveProps> = ({
  children,
  maxCached = 10,
  excludePaths = ["/auth", "/auth/callback"]
}) => {
  const location = useLocation();
  const [cachedPages, setCachedPages] = useState<CachedPage[]>([]);
  const currentPath = location.pathname;
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Check if current path should be excluded from caching
  const shouldExclude = excludePaths.some(path =>
    currentPath === path || currentPath.startsWith(path + "/")
  );

  // Save scroll position before hiding a page
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current.set(currentPath, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPath]);

  // Update cache when path changes
  useEffect(() => {
    if (shouldExclude) return;

    setCachedPages(prev => {
      // Check if this path is already cached
      const existingIndex = prev.findIndex(p => p.path === currentPath);

      if (existingIndex >= 0) {
        // Path exists, move it to front (most recently used)
        const existing = prev[existingIndex];
        const newCache = [...prev];
        newCache.splice(existingIndex, 1);
        return [{ ...existing, element: children }, ...newCache];
      }

      // New path, add to cache
      const newCache = [
        {
          path: currentPath,
          element: children,
          scrollPosition: 0
        },
        ...prev
      ];

      // Trim cache if too large
      if (newCache.length > maxCached) {
        return newCache.slice(0, maxCached);
      }

      return newCache;
    });
  }, [currentPath, children, maxCached, shouldExclude]);

  // Restore scroll position when returning to a cached page
  useEffect(() => {
    const savedPosition = scrollPositions.current.get(currentPath);
    if (savedPosition !== undefined) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    }
  }, [currentPath]);

  // If excluded, just render children directly
  if (shouldExclude) {
    return children;
  }

  return (
    <>
      {cachedPages.map(({ path, element }) => (
        <div
          key={path}
          style={{
            display: path === currentPath ? "block" : "none",
            // Ensure hidden pages don't affect layout
            position: path === currentPath ? "relative" : "absolute",
            visibility: path === currentPath ? "visible" : "hidden",
            // Move hidden pages out of viewport to prevent any interaction
            left: path === currentPath ? "auto" : "-9999px",
            width: "100%",
          }}
        >
          {element}
        </div>
      ))}
    </>
  );
};

export default KeepAlive;
