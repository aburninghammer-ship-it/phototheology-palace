import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserPreferences {
  bible_font_size: "small" | "medium" | "large";
  bible_translation: string;
  reading_mode: "default" | "focus" | "study";
  theme_preference: "light" | "dark" | "system";
  navigation_style: "simplified" | "full";
}

const defaultPreferences: UserPreferences = {
  bible_font_size: "medium",
  bible_translation: "kjv",
  reading_mode: "default",
  theme_preference: "system",
  navigation_style: "full",
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setPreferences({
          bible_font_size: data.bible_font_size as any,
          bible_translation: data.bible_translation,
          reading_mode: data.reading_mode as any,
          theme_preference: data.theme_preference as any,
          navigation_style: (data.navigation_style as any) || "full",
        });
      } else {
        // Create default preferences
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          ...defaultPreferences,
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!user) return;

    try {
      // First update local state immediately for responsive UI
      setPreferences((prev) => ({ ...prev, [key]: value }));

      // Then update database
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          bible_font_size: key === "bible_font_size" ? value : preferences.bible_font_size,
          bible_translation: key === "bible_translation" ? value : preferences.bible_translation,
          reading_mode: key === "reading_mode" ? value : preferences.reading_mode,
          theme_preference: key === "theme_preference" ? value : preferences.theme_preference,
          navigation_style: key === "navigation_style" ? value : preferences.navigation_style,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        });

      if (error) {
        console.error("Error updating preference:", error);
        // Revert on error
        setPreferences((prev) => ({ ...prev, [key]: preferences[key] }));
        throw error;
      }
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  return { preferences, loading, updatePreference };
};
