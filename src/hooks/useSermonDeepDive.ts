import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Sermon {
  id: string;
  source_type: string;
  source_url: string;
  source_id: string;
  title: string;
  speaker: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: "pending" | "fetching_transcript" | "transcript_ready" | "analyzing" | "complete" | "failed";
  submitted_by: string;
  created_at: string;
  error_message: string | null;
}

export interface SermonTranscript {
  id: string;
  sermon_id: string;
  raw_text: string;
  transcript_source: string;
  has_timestamps: boolean;
  word_count: number;
}

export interface SermonSegment {
  id: string;
  sermon_id: string;
  segment_number: number;
  title: string;
  summary: string;
  key_points: string[];
  start_time: number | null;
  end_time: number | null;
  palace_room: string | null;
  doctrinal_alignment: string | null;
}

export interface SermonScripture {
  id: string;
  sermon_id: string;
  reference: string;
  text_preview: string | null;
  context_in_sermon: string | null;
  palace_room: string | null;
}

export interface SermonInsight {
  id: string;
  sermon_id: string;
  insight_type: string;
  content: string;
  palace_room: string | null;
  doctrinal_theme: string | null;
}

export interface SermonGem {
  id: string;
  sermon_id: string;
  user_id: string;
  insight_id: string | null;
  custom_note: string | null;
  created_at: string;
}

export interface SermonDeepDiveData {
  sermon: Sermon;
  transcript: SermonTranscript | null;
  segments: SermonSegment[];
  scriptures: SermonScripture[];
  insights: SermonInsight[];
  gems: SermonGem[];
}

export function useSermonDeepDive() {
  const { user } = useAuth();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<SermonDeepDiveData | null>(null);

  // Load user's sermons
  const loadSermons = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase
        .from("lm_sermons" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      setSermons((data || []) as Sermon[]);
    } catch (error) {
      console.error("Error loading sermons:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  // Submit a new YouTube sermon
  const submitYouTubeSermon = async (youtubeUrl: string): Promise<{ success: boolean; sermon?: Sermon; message?: string }> => {
    if (!user) {
      toast.error("Please sign in to submit sermons");
      return { success: false, message: "Not authenticated" };
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-sermon", {
        body: {
          action: "submit_youtube",
          youtubeUrl,
        },
      });

      if (error) throw error;

      if (data.success) {
        if (data.isExisting) {
          toast.info(`"${data.sermon.title}" has already been submitted`);
        } else if (data.hasTranscript) {
          toast.success(`"${data.sermon.title}" submitted with transcript!`);
        } else {
          toast.warning(`"${data.sermon.title}" submitted but no transcript found. You can paste one manually.`);
        }
        await loadSermons();
        return { success: true, sermon: data.sermon, message: data.message };
      } else {
        throw new Error(data.error || "Failed to submit sermon");
      }
    } catch (error: any) {
      console.error("Error submitting sermon:", error);
      toast.error(error.message || "Failed to submit sermon");
      return { success: false, message: error.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Paste transcript manually
  const pasteTranscript = async (sermonId: string, transcript: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.functions.invoke("process-sermon", {
        body: {
          action: "paste_transcript",
          sermonId,
          transcript,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Transcript saved successfully!");
        await loadSermons();
        return true;
      } else {
        throw new Error(data.error || "Failed to save transcript");
      }
    } catch (error: any) {
      console.error("Error pasting transcript:", error);
      toast.error(error.message || "Failed to save transcript");
      return false;
    }
  };

  // Analyze sermon with AI
  const analyzeSermon = async (sermonId: string): Promise<boolean> => {
    if (!user) return false;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-sermon", {
        body: {
          action: "analyze",
          sermonId,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Sermon analysis complete!");
        await loadSermons();
        return true;
      } else {
        throw new Error(data.error || "Failed to analyze sermon");
      }
    } catch (error: any) {
      console.error("Error analyzing sermon:", error);
      toast.error(error.message || "Failed to analyze sermon");
      return false;
    } finally {
      setAnalyzing(false);
    }
  };

  // Load full sermon deep dive data
  const loadSermonDeepDive = async (sermonId: string): Promise<SermonDeepDiveData | null> => {
    try {
      // Load sermon
      const { data: sermon, error: sermonError } = await (supabase
        .from("lm_sermons" as any)
        .select("*")
        .eq("id", sermonId)
        .single() as any);

      if (sermonError) throw sermonError;

      // Load transcript
      const { data: transcript } = await (supabase
        .from("lm_sermon_transcripts" as any)
        .select("*")
        .eq("sermon_id", sermonId)
        .single() as any);

      // Load segments
      const { data: segments } = await (supabase
        .from("lm_sermon_segments" as any)
        .select("*")
        .eq("sermon_id", sermonId)
        .order("segment_number") as any);

      // Load scriptures
      const { data: scriptures } = await (supabase
        .from("lm_sermon_scriptures" as any)
        .select("*")
        .eq("sermon_id", sermonId) as any);

      // Load insights
      const { data: insights } = await (supabase
        .from("lm_sermon_insights" as any)
        .select("*")
        .eq("sermon_id", sermonId) as any);

      // Load user's gems
      const { data: gems } = await (supabase
        .from("lm_sermon_gems" as any)
        .select("*")
        .eq("sermon_id", sermonId)
        .eq("user_id", user?.id) as any);

      const deepDiveData: SermonDeepDiveData = {
        sermon: sermon as Sermon,
        transcript: transcript as SermonTranscript | null,
        segments: (segments || []) as SermonSegment[],
        scriptures: (scriptures || []) as SermonScripture[],
        insights: (insights || []) as SermonInsight[],
        gems: (gems || []) as SermonGem[],
      };

      setSelectedSermon(deepDiveData);
      return deepDiveData;
    } catch (error) {
      console.error("Error loading sermon deep dive:", error);
      toast.error("Failed to load sermon details");
      return null;
    }
  };

  // Save a gem
  const saveGem = async (
    sermonId: string,
    insightId: string | null,
    customNote: string | null
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Determine gem type and content based on what's being saved
      let gemType = "personal_note";
      let title = "Personal Note";
      let content = customNote || "";

      // If saving an insight, get its details
      if (insightId) {
        const { data: insight } = await (supabase
          .from("lm_sermon_insights" as any)
          .select("insight_type, title, content")
          .eq("id", insightId)
          .single() as any);

        if (insight) {
          gemType = insight.insight_type?.includes("question") ? "study_question" : "insight";
          title = insight.title || insight.content?.substring(0, 50) || "Saved Insight";
          content = insight.content || "";
        }
      }

      const { error } = await (supabase
        .from("lm_sermon_gems" as any)
        .insert({
          sermon_id: sermonId,
          user_id: user.id,
          insight_id: insightId,
          gem_type: gemType,
          title: title,
          content: content,
          user_notes: customNote,
        }) as any);

      if (error) throw error;

      toast.success("Gem saved to your vault!");

      // Reload the sermon data to update gems
      if (selectedSermon?.sermon.id === sermonId) {
        await loadSermonDeepDive(sermonId);
      }

      return true;
    } catch (error: any) {
      console.error("Error saving gem:", error);
      toast.error("Failed to save gem");
      return false;
    }
  };

  // Remove a gem
  const removeGem = async (gemId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await (supabase
        .from("lm_sermon_gems" as any)
        .delete()
        .eq("id", gemId)
        .eq("user_id", user.id) as any);

      if (error) throw error;

      toast.success("Gem removed");

      // Update local state
      if (selectedSermon) {
        setSelectedSermon({
          ...selectedSermon,
          gems: selectedSermon.gems.filter(g => g.id !== gemId),
        });
      }

      return true;
    } catch (error: any) {
      console.error("Error removing gem:", error);
      toast.error("Failed to remove gem");
      return false;
    }
  };

  // Get user's gems across all sermons
  const loadUserGems = async (): Promise<SermonGem[]> => {
    if (!user) return [];

    try {
      const { data, error } = await (supabase
        .from("lm_sermon_gems" as any)
        .select(`
          *,
          lm_sermons!inner(title, speaker),
          lm_sermon_insights(content, insight_type)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      return (data || []) as SermonGem[];
    } catch (error) {
      console.error("Error loading gems:", error);
      return [];
    }
  };

  return {
    sermons,
    loading,
    submitting,
    analyzing,
    selectedSermon,
    submitYouTubeSermon,
    pasteTranscript,
    analyzeSermon,
    loadSermonDeepDive,
    saveGem,
    removeGem,
    loadUserGems,
    refreshSermons: loadSermons,
    clearSelectedSermon: () => setSelectedSermon(null),
  };
}
