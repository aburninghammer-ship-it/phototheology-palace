import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { StudyPrefs } from "@/types/preacherMentor";

const STORAGE_KEY = "pt_preacher_mentor_prefs";

const defaultPrefs: StudyPrefs = {
  scholarly_view: false,
  advanced_lens: false,
};

function getLocalPrefs(): StudyPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
  } catch {}
  return defaultPrefs;
}

function saveLocalPrefs(prefs: StudyPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn("Failed to save mentor prefs:", e);
  }
}

export function usePreacherMentorStudyPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<StudyPrefs>(getLocalPrefs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const local = getLocalPrefs();

      if (!user) {
        setPrefs(local);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from("user_study_prefs")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          const merged: StudyPrefs = {
            scholarly_view: data.scholarly_view ?? local.scholarly_view,
            advanced_lens: data.advanced_lens ?? local.advanced_lens,
          };
          setPrefs(merged);
          saveLocalPrefs(merged);
        } else {
          // Create default record
          await (supabase as any).from("user_study_prefs").insert({
            user_id: user.id,
            scholarly_view: defaultPrefs.scholarly_view,
            advanced_lens: defaultPrefs.advanced_lens,
          });
          setPrefs(defaultPrefs);
        }
      } catch (err) {
        console.error("Error loading study prefs:", err);
        setPrefs(local);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    load();
  }, [user]);

  const updatePref = useCallback(
    <K extends keyof StudyPrefs>(key: K, value: StudyPrefs[K]) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        saveLocalPrefs(next);

        // Fire-and-forget DB sync
        if (user) {
          (supabase as any)
            .from("user_study_prefs")
            .upsert(
              {
                user_id: user.id,
                scholarly_view: next.scholarly_view,
                advanced_lens: next.advanced_lens,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" }
            )
            .then(({ error }: any) => {
              if (error) console.error("Error updating study pref:", error);
            });
        }

        return next;
      });
    },
    [user]
  );

  return { prefs, loading, updatePref };
}
