import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { usePath } from "./usePath";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivityResponse {
  activityId: string;
  responseText: string;
  updatedAt: string;
}

export function usePathActivityResponses() {
  const { user } = useAuth();
  const { activePath } = usePath();
  const [responses, setResponses] = useState<Record<string, ActivityResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // Load responses from database
  useEffect(() => {
    loadResponses();
  }, [user, activePath]);

  const loadResponses = async () => {
    if (!user || !activePath) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('path_activity_responses' as any)
        .select('activity_id, response_text, updated_at')
        .eq('user_id', user.id)
        .eq('path_type', activePath.path_type);

      if (error) throw error;

      const responseMap: Record<string, ActivityResponse> = {};
      (data || []).forEach((r: any) => {
        responseMap[r.activity_id] = {
          activityId: r.activity_id,
          responseText: r.response_text,
          updatedAt: r.updated_at,
        };
      });
      setResponses(responseMap);
    } catch (error) {
      console.error('Error loading activity responses:', error);
    }
    setIsLoading(false);
  };

  const saveResponse = useCallback(async (activityId: string, responseText: string) => {
    if (!user || !activePath) {
      toast.error("Please log in to save your response");
      return false;
    }

    setIsSaving(activityId);

    try {
      const { error } = await supabase
        .from('path_activity_responses' as any)
        .upsert({
          user_id: user.id,
          activity_id: activityId,
          path_type: activePath.path_type,
          response_text: responseText,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,activity_id' });

      if (error) throw error;

      setResponses(prev => ({
        ...prev,
        [activityId]: {
          activityId,
          responseText,
          updatedAt: new Date().toISOString(),
        }
      }));

      toast.success("Response saved!");
      return true;
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error("Failed to save response");
      return false;
    } finally {
      setIsSaving(null);
    }
  }, [user, activePath]);

  const getResponse = useCallback((activityId: string): string => {
    return responses[activityId]?.responseText || '';
  }, [responses]);

  const hasResponse = useCallback((activityId: string): boolean => {
    return !!responses[activityId]?.responseText;
  }, [responses]);

  return {
    responses,
    isLoading,
    isSaving,
    saveResponse,
    getResponse,
    hasResponse,
    refreshResponses: loadResponses,
  };
}
