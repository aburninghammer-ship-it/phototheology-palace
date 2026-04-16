import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GeneratedPathStep {
  title: string;
  verse_anchor: string;
  observe: string;
  connect: string;
  discover: string;
}

export interface GeneratedStudyPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  theme_type: string;
  theme_keyword: string;
  category: string;
  steps: GeneratedPathStep[];
  estimated_sessions: number;
  generation_date: string;
  view_count: number;
  created_at: string;
}

export const useGeneratedStudyPaths = (daysBack: number = 60) => {
  const [paths, setPaths] = useState<GeneratedStudyPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaths = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      const { data, error: fetchError } = await (supabase as any)
        .from("generated_study_paths")
        .select("*")
        .eq("is_active", true)
        .gte("generation_date", cutoffDate.toISOString().split("T")[0])
        .order("generation_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Parse steps from JSONB
      const parsed = (data || []).map((p: any) => ({
        ...p,
        steps: Array.isArray(p.steps) ? p.steps : [],
      }));

      setPaths(parsed as GeneratedStudyPath[]);
    } catch (err: any) {
      console.error("Error loading generated study paths:", err);
      setError(err.message || "Failed to load paths");
      setPaths([]);
    } finally {
      setLoading(false);
    }
  }, [daysBack]);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  const getTodaysPaths = (): GeneratedStudyPath[] => {
    const today = new Date().toISOString().split("T")[0];
    return paths.filter((p) => p.generation_date === today);
  };

  const getPathsByType = (type: string): GeneratedStudyPath[] => {
    if (type === "all") return paths;
    return paths.filter((p) => p.theme_type === type);
  };

  return {
    paths,
    loading,
    error,
    refresh: loadPaths,
    getTodaysPaths,
    getPathsByType,
  };
};
