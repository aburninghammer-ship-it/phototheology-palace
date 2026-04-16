import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { supabase } from "@/integrations/supabase/client";
import { getTabIdsFromGoals } from "@/data/goalCategories";

const MAX_PINNED = 6;

export function useGoalsSurvey() {
  const { user } = useAuth();
  const { updatePreference } = useUserPreferences();
  const [saving, setSaving] = useState(false);

  const saveGoals = useCallback(
    async (selectedGoalIds: string[]) => {
      if (!user) return;
      setSaving(true);

      try {
        const orderedTabs = getTabIdsFromGoals(selectedGoalIds);
        const pinnedTabs = orderedTabs.slice(0, MAX_PINNED);

        // Update nav preferences
        updatePreference("pinned_nav_tabs", pinnedTabs);
        updatePreference("nav_tab_order", orderedTabs);

        // Save goal IDs to profiles.preferred_features and mark survey completed
        await supabase
          .from("profiles")
          .update({
            preferred_features: selectedGoalIds,
            goals_survey_completed: true,
          } as any)
          .eq("id", user.id);
      } finally {
        setSaving(false);
      }
    },
    [user, updatePreference]
  );

  const skipSurvey = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ goals_survey_completed: true } as any)
      .eq("id", user.id);
  }, [user]);

  const loadSavedGoals = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    const { data } = await supabase
      .from("profiles")
      .select("preferred_features")
      .eq("id", user.id)
      .single();
    return (data?.preferred_features as string[]) ?? [];
  }, [user]);

  return { saveGoals, skipSurvey, loadSavedGoals, saving };
}
