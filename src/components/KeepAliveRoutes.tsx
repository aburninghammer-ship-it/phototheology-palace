import React, { useRef, useEffect, useState, ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";

interface CachedRoute {
  path: string;
  element: ReactNode;
}

interface KeepAliveRoutesProps {
  children: ReactNode;
  /** Maximum number of routes to keep cached */
  maxCached?: number;
  /** Paths to exclude from caching */
  excludePaths?: string[];
}

/**
 * KeepAliveRoutes wraps Routes and caches rendered pages.
 * Previously visited pages remain mounted (but hidden), preserving their state.
 */
export const KeepAliveRoutes: React.FC<KeepAliveRoutesProps> = ({
  children,
  maxCached = 15,
  excludePaths = ["/auth", "/", "/gatehouse", "/pricing", "/landing"]
}) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const [cache, setCache] = useState<CachedRoute[]>([]);
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const isInitialMount = useRef(true);

  // Check if path should be excluded
  const shouldExclude = useMemo(() => {
    return excludePaths.some(path =>
      location.pathname === path ||
      location.pathname.startsWith("/auth")
    );
  }, [location.pathname, excludePaths]);

  // Save scroll position on scroll
  useEffect(() => {
    const saveScroll = () => {
      scrollPositions.current.set(currentPath, window.scrollY);
    };

    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => window.removeEventListener("scroll", saveScroll);
  }, [currentPath]);

  // Update cache when location changes
  useEffect(() => {
    if (shouldExclude) return;

    setCache(prev => {
      const existingIndex = prev.findIndex(c => c.path === currentPath);

      if (existingIndex >= 0) {
        // Already cached, update and move to front
        const updated = [...prev];
        updated[existingIndex] = { path: currentPath, element: children };
        // Move to front (MRU)
        const [item] = updated.splice(existingIndex, 1);
        return [item, ...updated];
      }

      // New route, add to cache
      const newCache = [{ path: currentPath, element: children }, ...prev];
      return newCache.slice(0, maxCached);
    });
  }, [currentPath, children, maxCached, shouldExclude]);

  // Restore scroll position when returning to a cached route
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const savedScroll = scrollPositions.current.get(currentPath);
    if (savedScroll !== undefined && savedScroll > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedScroll, behavior: "instant" });
        });
      });
    }
  }, [currentPath]);

  // For excluded paths, just render children directly
  if (shouldExclude) {
    return <>{children}</>;
  }

  // Render all cached routes, showing only the current one
  return (
    <>
      {cache.map(({ path, element }) => {
        const isActive = path === currentPath;
        return (
          <div
            key={path}
            className={isActive ? "" : "hidden"}
            style={{
              display: isActive ? "contents" : "none",
            }}
            aria-hidden={!isActive}
          >
            {element}
          </div>
        );
      })}
      {/* Render current route if not in cache yet */}
      {!cache.some(c => c.path === currentPath) && children}
    </>
  );
};

export default KeepAliveRoutes;
