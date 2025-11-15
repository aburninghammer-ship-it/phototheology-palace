import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface RecentPage {
  path: string;
  title: string;
  timestamp: number;
}

const MAX_RECENT_PAGES = 10;
const STORAGE_KEY = "phototheology_recent_pages";

// Map of routes to friendly titles
const routeTitles: Record<string, string> = {
  "/": "Home",
  "/palace": "The Palace",
  "/bible": "Bible Reader",
  "/my-studies": "My Studies",
  "/games": "Palace Games",
  "/phototheologygpt": "Phototheology GPT",
  "/kidgpt": "Kid GPT",
  "/daniel-revelation-gpt": "Daniel & Revelation GPT",
  "/apologetics-gpt": "Apologetics GPT",
  "/phototheology-course": "Phototheology Course",
  "/daily-challenges": "Daily Challenges",
  "/achievements": "Achievements",
  "/community": "Community",
  "/profile": "Profile",
  "/pricing": "Pricing",
  "/verse-memory-hall": "Verse Memory Hall",
  "/bible-image-library": "Image Library",
  "/quarterly-study": "Amplified Quarterly",
  "/bible-study-leader": "Bible Study Leader",
  "/escape-room": "Escape Rooms",
  "/treasure-hunt": "Treasure Hunt",
  "/live-study": "Live Study",
};

const getPageTitle = (path: string): string => {
  // Check exact match first
  if (routeTitles[path]) return routeTitles[path];
  
  // Check if it's a Bible chapter path
  if (path.startsWith("/bible/")) {
    const parts = path.split("/");
    if (parts.length >= 4) {
      return `${parts[2]} ${parts[3]}`;
    }
    return "Bible Reader";
  }
  
  // Check for My Studies paths with UUID
  if (path.startsWith("/my-studies/") && path.length > 13) {
    return "Study";
  }
  
  // Check for Series paths with UUID
  if (path.startsWith("/series/") && path.includes("/lesson/")) {
    return "Series Lesson";
  }
  if (path.startsWith("/series/") && path.includes("/present")) {
    return "Series Presenter";
  }
  
  // Check for Escape Room and Treasure Hunt dynamic routes
  if (path.startsWith("/escape-room/play/")) {
    return "Escape Room";
  }
  if (path.startsWith("/treasure-hunt/")) {
    return "Treasure Hunt";
  }
  if (path.startsWith("/live-study/") && path.length > 12) {
    return "Live Study";
  }
  
  // Default to formatted path
  const lastSegment = path.split("/").pop() || "";
  // Check if it looks like a UUID (contains multiple hyphens and hexadecimal characters)
  if (lastSegment.match(/^[a-f0-9-]{36}$/i)) {
    return "Unknown Page";
  }
  return lastSegment.replace(/-/g, " ") || "Unknown Page";
};

export const useRecentPages = () => {
  const location = useLocation();
  const [recentPages, setRecentPages] = useState<RecentPage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Skip certain paths
    if (location.pathname === "/auth" || location.pathname === "/404") return;

    const newPage: RecentPage = {
      path: location.pathname,
      title: getPageTitle(location.pathname),
      timestamp: Date.now(),
    };

    setRecentPages((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((p) => p.path !== newPage.path);
      
      // Add new page at the beginning
      const updated = [newPage, ...filtered].slice(0, MAX_RECENT_PAGES);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent pages:", e);
      }
      
      return updated;
    });
  }, [location.pathname]);

  const clearRecentPages = () => {
    setRecentPages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentPages, clearRecentPages };
};
