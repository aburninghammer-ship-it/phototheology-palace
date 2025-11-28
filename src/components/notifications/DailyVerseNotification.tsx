import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Sample daily verses with PT insights
const DAILY_VERSES = [
  {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only begotten Son...",
    insight: "CR: Christ is the center - God's love flows through sacrifice"
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
    insight: "BL: Sanctuary insight - Christ as our High Priest guides us"
  },
  {
    reference: "Romans 8:28",
    text: "And we know that all things work together for good...",
    insight: "PRm: Pattern of providence - God orchestrates all circumstances"
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
    insight: "CR: Christ-centered strength - power flows from connection"
  },
  {
    reference: "Isaiah 40:31",
    text: "But they that wait upon the LORD shall renew their strength...",
    insight: "ST: Eagle symbol - divine renewal through patient trust"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the thoughts that I think toward you...",
    insight: "@Cy: Cyrusic cycle - restoration always follows exile"
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all thine heart...",
    insight: "FRt: Fruit test - trust produces guidance and direction"
  }
];

export const DailyVerseNotification = () => {
  const { user } = useAuth();
  const lastNotificationDate = useRef<string | null>(null);
  const preferencesRef = useRef<{ daily_verse: boolean | null } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch preferences
    const fetchPreferences = async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("daily_verse")
        .eq("user_id", user.id)
        .maybeSingle();
      
      preferencesRef.current = data;
    };

    fetchPreferences();
  }, [user]);

  useEffect(() => {
    if (!user || !("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const checkAndSendNotification = () => {
      if (!preferencesRef.current?.daily_verse) return;

      const now = new Date();
      const today = now.toDateString();
      
      // Don't send if already sent today
      if (lastNotificationDate.current === today) return;

      // Check if it's morning (8 AM) within 5-minute window
      if (now.getHours() === 8 && now.getMinutes() < 5) {
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
        const verse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];

        new Notification(`📖 ${verse.reference}`, {
          body: `${verse.text}\n\n${verse.insight}`,
          icon: "/favicon.ico",
          tag: "daily-verse"
        });

        lastNotificationDate.current = today;
      }
    };

    // Check every minute
    const interval = setInterval(checkAndSendNotification, 60000);
    checkAndSendNotification(); // Check immediately

    return () => clearInterval(interval);
  }, [user]);

  return null; // Background component
};
