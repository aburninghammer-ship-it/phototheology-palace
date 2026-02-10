import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { getCurrentLanguage } from "@/i18n";

// Map app language to default Bible translation
const getDefaultBibleTranslation = (): string => {
  const lang = getCurrentLanguage().split('-')[0];
  switch (lang) {
    case 'es': return 'rves';
    case 'fr': return 'lsg';
    case 'de': return 'luther';
    case 'pt': return 'almeida';
    case 'ko': return 'kjv';
    default: return 'kjv';
  }
};

// LocalStorage keys for nav tab preferences (works for all users including guests)
const NAV_TABS_STORAGE_KEY = "pt_nav_tab_order";
const PINNED_TABS_STORAGE_KEY = "pt_pinned_nav_tabs";

// Helper to get nav preferences from localStorage
const getLocalNavPrefs = (): { pinned: string[]; order: string[] } => {
  try {
    const pinned = JSON.parse(localStorage.getItem(PINNED_TABS_STORAGE_KEY) || "[]");
    const order = JSON.parse(localStorage.getItem(NAV_TABS_STORAGE_KEY) || "[]");
    return { pinned, order };
  } catch {
    return { pinned: [], order: [] };
  }
};

// Helper to save nav preferences to localStorage
const saveLocalNavPrefs = (pinned: string[], order: string[]) => {
  try {
    localStorage.setItem(PINNED_TABS_STORAGE_KEY, JSON.stringify(pinned));
    localStorage.setItem(NAV_TABS_STORAGE_KEY, JSON.stringify(order));
  } catch (e) {
    console.warn("Failed to save nav prefs to localStorage:", e);
  }
};

interface UserPreferences {
  bible_font_size: "small" | "medium" | "large";
  bible_translation: string;
  reading_mode: "default" | "focus" | "study";
  theme_preference: "light" | "dark" | "system";
  navigation_style: "simplified" | "full";
  preferred_reading_experience: "audio" | "read-along" | "auto";
  read_along_speed: number; // Words per minute
  study_buddy_theme: "dark" | "light"; // Study Buddy page theme
  suite_mode: "guest_house" | "full_suite"; // Guest House (simplified) or Full Suite
  has_seen_mode_selector: boolean; // Whether user has seen the mode selection modal
  pinned_nav_tabs: string[]; // Array of tab IDs that are pinned (shown first)
  nav_tab_order: string[]; // Custom order of remaining tabs
}

const defaultPreferences: UserPreferences = {
  bible_font_size: "medium",
  bible_translation: getDefaultBibleTranslation(),
  reading_mode: "default",
  theme_preference: "system",
  navigation_style: "full",
  preferred_reading_experience: "audio",
  read_along_speed: 200,
  study_buddy_theme: "dark",
  suite_mode: "full_suite",
  has_seen_mode_selector: false,
  pinned_nav_tabs: [], // No pinned tabs by default
  nav_tab_order: [], // Use default order
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
      // Always load nav prefs from localStorage first (works for guests too)
      const localNavPrefs = getLocalNavPrefs();

      if (!user) {
        // For guests, use localStorage for nav prefs, defaults for everything else
        setPreferences({
          ...defaultPreferences,
          pinned_nav_tabs: localNavPrefs.pinned.length > 0 ? localNavPrefs.pinned : defaultPreferences.pinned_nav_tabs,
          nav_tab_order: localNavPrefs.order.length > 0 ? localNavPrefs.order : defaultPreferences.nav_tab_order,
        });
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
          // For nav tabs: prefer localStorage (most recent), fallback to DB, then defaults
          const pinnedTabs = localNavPrefs.pinned.length > 0
            ? localNavPrefs.pinned
            : ((data as any).pinned_nav_tabs as string[]) ?? defaultPreferences.pinned_nav_tabs;
          const tabOrder = localNavPrefs.order.length > 0
            ? localNavPrefs.order
            : ((data as any).nav_tab_order as string[]) ?? defaultPreferences.nav_tab_order;

          setPreferences({
            bible_font_size: (data.bible_font_size as any) ?? defaultPreferences.bible_font_size,
            bible_translation: data.bible_translation ?? defaultPreferences.bible_translation,
            reading_mode: (data.reading_mode as any) ?? defaultPreferences.reading_mode,
            theme_preference: (data.theme_preference as any) ?? defaultPreferences.theme_preference,
            navigation_style: (data.navigation_style as any) || "full",
            preferred_reading_experience: defaultPreferences.preferred_reading_experience,
            read_along_speed: defaultPreferences.read_along_speed,
            study_buddy_theme: ((data as any).study_buddy_theme as any) ?? defaultPreferences.study_buddy_theme,
            suite_mode: ((data as any).suite_mode as any) ?? defaultPreferences.suite_mode,
            has_seen_mode_selector: ((data as any).has_seen_mode_selector as any) ?? defaultPreferences.has_seen_mode_selector,
            pinned_nav_tabs: pinnedTabs,
            nav_tab_order: tabOrder,
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
    // Always save nav prefs to localStorage (works for everyone, instant)
    saveLocalNavPrefs(next.pinned_nav_tabs, next.nav_tab_order);

    // For logged-in users, also sync to database
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
            study_buddy_theme: next.study_buddy_theme,
            suite_mode: next.suite_mode,
            has_seen_mode_selector: next.has_seen_mode_selector,
            pinned_nav_tabs: next.pinned_nav_tabs,
            nav_tab_order: next.nav_tab_order,
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
