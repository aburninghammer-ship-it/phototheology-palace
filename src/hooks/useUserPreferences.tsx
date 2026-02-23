import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { getCurrentLanguage, syncLanguageFromDB } from "@/i18n";
import { registerVolumeSyncCallback, applyVolumeFromDB } from "./useMusicVolumeControl";

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
  read_along_speed: number;
  study_buddy_theme: "dark" | "light";
  suite_mode: "guest_house" | "full_suite";
  has_seen_mode_selector: boolean;
  pinned_nav_tabs: string[];
  nav_tab_order: string[];
  // Cross-device sync fields
  language: string;
  app_font_size: "small" | "medium" | "large" | "x-large";
  music_volume: number;
  onboarding_completed: boolean;
  recent_pages: Array<{ path: string; title: string; timestamp: number }>;
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
  pinned_nav_tabs: [],
  nav_tab_order: [],
  language: "en",
  app_font_size: "medium",
  music_volume: 80,
  onboarding_completed: false,
  recent_pages: [],
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

          const loadedPrefs: UserPreferences = {
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
            // Cross-device sync fields from DB
            language: ((data as any).language as string) ?? localStorage.getItem('pt-language') ?? defaultPreferences.language,
            app_font_size: ((data as any).app_font_size as any) ?? localStorage.getItem('app-font-size') ?? defaultPreferences.app_font_size,
            music_volume: ((data as any).music_volume as number) ?? defaultPreferences.music_volume,
            onboarding_completed: ((data as any).onboarding_completed as boolean) ?? localStorage.getItem('onboarding_completed') === 'true',
            recent_pages: ((data as any).recent_pages as any[]) ?? defaultPreferences.recent_pages,
          };

          setPreferences(loadedPrefs);

          // Apply synced settings to local systems for cross-device sync
          syncLanguageFromDB(loadedPrefs.language);
          if (loadedPrefs.app_font_size) {
            localStorage.setItem('app-font-size', loadedPrefs.app_font_size);
          }
          applyVolumeFromDB(loadedPrefs.music_volume);
          if (loadedPrefs.onboarding_completed) {
            localStorage.setItem('onboarding_completed', 'true');
          }
          if (loadedPrefs.recent_pages && loadedPrefs.recent_pages.length > 0) {
            const localRecent = localStorage.getItem('phototheology_recent_pages');
            if (!localRecent || JSON.parse(localRecent).length === 0) {
              localStorage.setItem('phototheology_recent_pages', JSON.stringify(loadedPrefs.recent_pages));
            }
          }
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
            // Cross-device sync fields
            language: next.language,
            app_font_size: next.app_font_size,
            music_volume: next.music_volume,
            onboarding_completed: next.onboarding_completed,
            recent_pages: next.recent_pages,
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

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      void persistPreferences(next);
      return next;
    });
  }, [user]);

  // Register music volume sync callback
  useEffect(() => {
    registerVolumeSyncCallback((volume: number) => {
      updatePreference("music_volume", volume);
    });
  }, [updatePreference]);

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
