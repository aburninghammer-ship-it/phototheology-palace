import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SimmerGem {
  id: string;
  text: string;
  verse?: string;
  symbol?: string;
  sanctuaryArticle?: string;
  propheticPattern?: string;
  ptCodes?: string[];
  status: "raw" | "polished" | "locked";
}

export interface SimmerOutlineSection {
  section: string;
  coreVerse?: string;
  tension?: string;
  content?: string;
  notes?: string;
}

export interface SimmerStructure {
  opening: { gemId: string; gemText: string; transition?: string }[];
  build: { gemId: string; gemText: string; transition?: string }[];
  turn: { gemId: string; gemText: string; transition?: string }[];
  climax: { gemId: string; gemText: string; transition?: string }[];
  resolution: { gemId: string; gemText: string; transition?: string }[];
}

export interface SimmerChristConnection {
  movement: string;
  tensionChristEmbodies: string;
  resolutionWithoutDissolution: string;
  specificChristReference: string;
}

export interface SimmerSession {
  id: string;
  user_id: string;
  title?: string;
  theme: string;
  theme_passage?: string;
  target_style: string;
  target_density: string;
  target_purpose: string;
  current_day: number;
  day_1_completed_at?: string;
  day_2_completed_at?: string;
  day_3_completed_at?: string;
  day_4_completed_at?: string;
  day_5_completed_at?: string;
  day_6_completed_at?: string;
  core_claim?: string;
  provisional_outline?: SimmerOutlineSection[];
  pressure_verses?: string[];
  gems?: SimmerGem[];
  structure?: SimmerStructure;
  emotional_arc?: string;
  visual_metaphors?: string[];
  redundant_gems?: string[];
  weak_transitions?: string[];
  christ_connections?: SimmerChristConnection[];
  rewritten_weak_connections?: any[];
  slide_headlines?: string[];
  slide_images?: Record<string, string>;
  callout_quotes?: string[];
  white_space_guidance?: string;
  final_outline?: any[];
  final_quote_list?: string[];
  final_slide_headers?: string[];
  closing_movement?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useSimmerSession(sessionId?: string) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch session
  const { data: session, isLoading, refetch } = useQuery({
    queryKey: ["simmer-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const { data, error } = await supabase
        .from("sermon_simmer_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      if (error) throw error;
      return data as unknown as SimmerSession;
    },
    enabled: !!sessionId,
  });

  // Fetch all user sessions
  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ["simmer-sessions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("sermon_simmer_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as unknown as SimmerSession[];
    },
  });

  // Create new session
  const createSession = useMutation({
    mutationFn: async (params: {
      theme: string;
      themePassage?: string;
      targetStyle?: string;
      targetDensity?: string;
      targetPurpose?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("sermon_simmer_sessions")
        .insert({
          user_id: user.id,
          theme: params.theme,
          theme_passage: params.themePassage,
          target_style: params.targetStyle || "balanced",
          target_density: params.targetDensity || "teaching",
          target_purpose: params.targetPurpose || "evangelistic",
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as SimmerSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simmer-sessions"] });
      toast.success("Simmer session started!");
    },
    onError: (error) => {
      toast.error("Failed to create session: " + error.message);
    },
  });

  // Process a day
  const processDay = useCallback(async (day: number) => {
    if (!session) {
      toast.error("No session loaded");
      return null;
    }

    setIsProcessing(true);
    try {
      // Build existing data context
      const existingData: any = {};
      if (session.core_claim) existingData.coreClaim = session.core_claim;
      if (session.provisional_outline) existingData.outline = session.provisional_outline;
      if (session.gems) existingData.gems = session.gems;
      if (session.structure) existingData.structure = session.structure;
      if (session.christ_connections) existingData.christConnections = session.christ_connections;
      if (session.pressure_verses) existingData.pressureVerses = session.pressure_verses;

      const { data, error } = await supabase.functions.invoke("sermon-simmer", {
        body: {
          sessionId: session.id,
          day,
          theme: session.theme,
          themePassage: session.theme_passage,
          targetStyle: session.target_style,
          targetDensity: session.target_density,
          targetPurpose: session.target_purpose,
          existingData,
        },
      });

      if (error) throw error;
      
      await refetch();
      toast.success(`Day ${day} complete! 🔥`);
      return data.result;
    } catch (error: any) {
      console.error("Process day error:", error);
      toast.error("Failed to process day: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session, refetch]);

  // Update session settings
  const updateSettings = useMutation({
    mutationFn: async (params: {
      targetStyle?: string;
      targetDensity?: string;
      targetPurpose?: string;
      title?: string;
    }) => {
      if (!sessionId) throw new Error("No session ID");
      
      const { error } = await supabase
        .from("sermon_simmer_sessions")
        .update(params)
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simmer-session", sessionId] });
      toast.success("Settings updated");
    },
  });

  // Lock a gem
  const lockGem = useCallback(async (gemId: string) => {
    if (!session?.gems) return;
    
    const updatedGems = session.gems.map(g => 
      g.id === gemId ? { ...g, status: "locked" as const } : g
    );
    
    const { error } = await supabase
      .from("sermon_simmer_sessions")
      .update({ gems: updatedGems as unknown as any })
      .eq("id", session.id);

    if (error) {
      toast.error("Failed to lock gem");
      return;
    }
    
    await refetch();
    toast.success("Gem locked 🔒");
  }, [session, refetch]);

  // Delete session
  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sermon_simmer_sessions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simmer-sessions"] });
      toast.success("Session deleted");
    },
  });

  return {
    session,
    sessions,
    isLoading,
    loadingSessions,
    isProcessing,
    createSession,
    processDay,
    updateSettings,
    lockGem,
    deleteSession,
    refetch,
  };
}
