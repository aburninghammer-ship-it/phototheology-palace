import React, { useRef, useEffect, useState, ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";

interface CachedRoute {
  path: string;
  element: ReactNode;
  key: number;
}

interface KeepAliveRoutesProps {
  children: ReactNode;
  /** Maximum number of routes to keep cached */
  maxCached?: number;
  /** Paths to exclude from caching (auth paths only) */
  excludePaths?: string[];
}

/**
 * KeepAliveRoutes caches rendered pages to preserve their state across navigation.
 * Previously visited pages remain mounted (but hidden), preserving scroll, form data, etc.
 */
export const KeepAliveRoutes: React.FC<KeepAliveRoutesProps> = ({
  children,
  maxCached = 25,
  // Only exclude auth-related paths - everything else should be cached
  excludePaths = ["/auth", "/auth/callback"]
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [cache, setCache] = useState<CachedRoute[]>([]);
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const keyCounter = useRef(0);
  const isNavigating = useRef(false);
  const lastPath = useRef<string>("");

  // Check if path should be excluded from caching
  const shouldExclude = useMemo(() => {
    return excludePaths.some(path =>
      currentPath === path ||
      currentPath.startsWith(path + "/")
    );
  }, [currentPath, excludePaths]);

  // Save scroll position on scroll (throttled)
  useEffect(() => {
    let ticking = false;
    
    const saveScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollPositions.current.set(currentPath, window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => window.removeEventListener("scroll", saveScroll);
  }, [currentPath]);

  // Save scroll position before navigating away
  useEffect(() => {
    if (lastPath.current && lastPath.current !== currentPath) {
      // Save scroll for the page we're leaving
      scrollPositions.current.set(lastPath.current, window.scrollY);
      isNavigating.current = true;
    }
    lastPath.current = currentPath;
  }, [currentPath]);

  // Update cache when location changes
  useEffect(() => {
    if (shouldExclude) return;

    setCache(prev => {
      const existingIndex = prev.findIndex(c => c.path === currentPath);

      if (existingIndex >= 0) {
        // Already cached, move to front (MRU) without recreating element
        const updated = [...prev];
        const [item] = updated.splice(existingIndex, 1);
        return [item, ...updated];
      }

      // New route, add to cache with unique key
      keyCounter.current += 1;
      const newEntry: CachedRoute = {
        path: currentPath,
        element: children,
        key: keyCounter.current,
      };
      
      const newCache = [newEntry, ...prev];
      
      // Clean up scroll positions for evicted routes
      if (newCache.length > maxCached) {
        const evicted = newCache.slice(maxCached);
        evicted.forEach(route => {
          scrollPositions.current.delete(route.path);
        });
      }
      
      return newCache.slice(0, maxCached);
    });
  }, [currentPath, children, maxCached, shouldExclude]);

  // Restore scroll position when returning to a cached route
  useEffect(() => {
    if (!isNavigating.current) return;
    
    const savedScroll = scrollPositions.current.get(currentPath);
    
    // Use multiple RAF to ensure DOM is fully ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (savedScroll !== undefined && savedScroll > 0) {
          window.scrollTo({ top: savedScroll, behavior: "instant" });
        } else {
          // New page - scroll to top
          window.scrollTo({ top: 0, behavior: "instant" });
        }
        isNavigating.current = false;
      });
    });
  }, [currentPath]);

  // For excluded paths, just render children directly without caching
  if (shouldExclude) {
    return <>{children}</>;
  }

  // Render all cached routes, showing only the current one
  return (
    <>
      {cache.map(({ path, element, key }) => {
        const isActive = path === currentPath;
        return (
          <div
            key={key}
            style={{
              display: isActive ? "contents" : "none",
            }}
            aria-hidden={!isActive}
            data-keep-alive-path={path}
          >
            {element}
          </div>
        );
      })}
      {/* Render current route if not in cache yet (first visit) */}
      {!cache.some(c => c.path === currentPath) && children}
    </>
  );
};

export default KeepAliveRoutes;
