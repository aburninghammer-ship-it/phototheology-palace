import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Get or create session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("pt_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("pt_session_id", sessionId);
  }
  return sessionId;
};

export function SessionTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentDepth = Math.round((window.scrollY / scrollHeight) * 100);
        if (currentDepth > maxScrollDepth.current) {
          maxScrollDepth.current = currentDepth;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const trackPageExit = async () => {
      // Don't track if same path
      if (lastTrackedPath.current === location.pathname) return;
      
      // Save previous page metrics
      if (lastTrackedPath.current) {
        const sessionDuration = Date.now() - pageStartTime.current;
        
        try {
          // Update the previous page view with duration and scroll depth
          await supabase.from("page_views").insert({
            user_id: user?.id || null,
            page_path: lastTrackedPath.current,
            page_title: document.title,
            session_duration_ms: sessionDuration,
            scroll_depth: maxScrollDepth.current,
            session_id: getSessionId(),
            user_agent: navigator.userAgent,
          });
        } catch (error) {
          console.debug("Session tracking error:", error);
        }
      }

      // Reset for new page
      pageStartTime.current = Date.now();
      maxScrollDepth.current = 0;
      lastTrackedPath.current = location.pathname;
    };

    trackPageExit();

    // Track on page unload
    const handleUnload = () => {
      const sessionDuration = Date.now() - pageStartTime.current;
      
      // Use sendBeacon for reliable tracking on page exit
      const data = JSON.stringify({
        user_id: user?.id || null,
        page_path: location.pathname,
        session_duration_ms: sessionDuration,
        scroll_depth: maxScrollDepth.current,
        session_id: getSessionId(),
      });

      navigator.sendBeacon?.(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-session`,
        data
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [location.pathname, user]);

  return null;
}
