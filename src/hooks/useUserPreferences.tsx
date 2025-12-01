import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserPreferences {
  bible_font_size: "small" | "medium" | "large";
  bible_translation: string;
  reading_mode: "default" | "focus" | "study";
  theme_preference: "light" | "dark" | "system";
  navigation_style: "simplified" | "full";
  preferred_reading_experience: "audio" | "read-along" | "auto";
  read_along_speed: number; // Words per minute
}

const defaultPreferences: UserPreferences = {
  bible_font_size: "medium",
  bible_translation: "kjv",
  reading_mode: "default",
  theme_preference: "system",
  navigation_style: "full",
  preferred_reading_experience: "audio",
  read_along_speed: 200,
};

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  loading: boolean;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | undefined>(
  undefined
);

export const UserPreferencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(
    defaultPreferences
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setPreferences(defaultPreferences);
        setLoading(false);
        return;
      }

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
            bible_font_size: (data.bible_font_size as any) ?? defaultPreferences.bible_font_size,
            bible_translation: data.bible_translation ?? defaultPreferences.bible_translation,
            reading_mode: (data.reading_mode as any) ?? defaultPreferences.reading_mode,
            theme_preference: (data.theme_preference as any) ?? defaultPreferences.theme_preference,
            navigation_style: (data.navigation_style as any) || "full",
            preferred_reading_experience: defaultPreferences.preferred_reading_experience,
            read_along_speed: defaultPreferences.read_along_speed,
          });
        } else {
          // Create default preferences in the backend and use local defaults
          await supabase.from("user_preferences").insert({
            user_id: user.id,
            bible_font_size: defaultPreferences.bible_font_size,
            bible_translation: defaultPreferences.bible_translation,
            reading_mode: defaultPreferences.reading_mode,
            theme_preference: defaultPreferences.theme_preference,
            navigation_style: defaultPreferences.navigation_style,
          });
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
        setPreferences(defaultPreferences);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadPreferences();
  }, [user]);

  const persistPreferences = async (next: UserPreferences) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert(
          {
            user_id: user.id,
            bible_font_size: next.bible_font_size,
            bible_translation: next.bible_translation,
            reading_mode: next.reading_mode,
            theme_preference: next.theme_preference,
            navigation_style: next.navigation_style,
            preferred_reading_experience: next.preferred_reading_experience,
            read_along_speed: next.read_along_speed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) {
        console.error("Error updating preference:", error);
      }
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      // Fire-and-forget persistence; state updates immediately for responsive UI
      void persistPreferences(next);
      return next;
    });
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, loading, updatePreference }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
};
