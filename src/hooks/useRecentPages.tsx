import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUserPreferences } from "@/hooks/useUserPreferences";

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
  "/quarterly-study": "Lesson Study",
  "/escape-room": "Escape Rooms",
  "/treasure-hunt": "Treasure Hunt",
  "/live-study": "Live Study",
  "/dashboard": "Dashboard",
  "/admin": "Admin",
  "/admin/subscriptions": "Subscriptions Admin",
  "/admin/users": "Users Admin",
  "/admin/challenges": "Challenges Admin",
  "/admin/announcements": "Announcements Admin",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/quick-start": "Quick Start Guide",
  "/study-suite": "PhototheologyOS",
  "/bible-prophecy-guide": "Bible Prophecy Guide",
  "/series": "Bible Study Series",
  "/devotional-plans": "Devotional Plans",
  "/reading-plans": "Reading Plans",
  "/church": "My Church",
  "/deck-study": "Deck Study",
  "/jeeves": "Ask Jeeves",
  "/onboarding": "Onboarding",
};

const getPageTitle = (path: string): string => {
  if (routeTitles[path]) return routeTitles[path];
  
  if (path.startsWith("/bible/")) {
    const parts = path.split("/");
    if (parts.length >= 4) return `${parts[2]} ${parts[3]}`;
    return "Bible Reader";
  }
  
  if (path.startsWith("/my-studies/") && path.length > 13) return "Study";
  
  if (path.startsWith("/series/") && path.includes("/lesson/")) return "Series Lesson";
  if (path.startsWith("/series/") && path.includes("/present")) return "Series Presenter";
  if (path.startsWith("/series/") && path.length > 8) return "Bible Study Series";
  
  if (path.startsWith("/escape-room/play/")) return "Escape Room";
  if (path.startsWith("/treasure-hunt/")) return "Treasure Hunt";
  if (path.startsWith("/live-study/") && path.length > 12) return "Live Study";
  
  if (path.startsWith("/admin/")) {
    const segment = path.split("/")[2] || "";
    return `Admin: ${segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")}`;
  }
  
  if (path.startsWith("/devotional-plans/")) return "Devotional Plan";
  if (path.startsWith("/reading-plans/")) return "Reading Plan";
  if (path.startsWith("/church/")) return "Church";
  
  const lastSegment = path.split("/").filter(Boolean).pop() || "";
  if (lastSegment.match(/^[a-f0-9-]{36}$/i)) {
    const parentPath = "/" + path.split("/").filter(Boolean).slice(0, -1).join("/");
    if (routeTitles[parentPath]) return routeTitles[parentPath];
    return "Page";
  }
  
  return lastSegment
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Home";
};

export const useRecentPages = () => {
  const location = useLocation();
  const { updatePreference } = useUserPreferences();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout>>();
  
  const [recentPages, setRecentPages] = useState<RecentPage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (location.pathname === "/auth" || location.pathname === "/404") return;

    const newPage: RecentPage = {
      path: location.pathname,
      title: getPageTitle(location.pathname),
      timestamp: Date.now(),
    };

    setRecentPages((prev) => {
      const filtered = prev.filter((p) => p.path !== newPage.path);
      const updated = [newPage, ...filtered].slice(0, MAX_RECENT_PAGES);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent pages:", e);
      }
      
      // Debounced sync to database (every 30 seconds max)
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        updatePreference("recent_pages", updated);
      }, 30000);
      
      return updated;
    });
  }, [location.pathname]);

  const clearRecentPages = () => {
    setRecentPages([]);
    localStorage.removeItem(STORAGE_KEY);
    updatePreference("recent_pages", []);
  };

  return { recentPages, clearRecentPages };
};
