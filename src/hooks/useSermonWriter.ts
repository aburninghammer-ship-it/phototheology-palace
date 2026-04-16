import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  SermonWriterSession,
  SermonWriterSpark,
  SermonWriterVersion,
  PolishSnapshot,
  SermonOutline,
  OutlineNode,
  OutlineTransition,
  JeevesMode,
  CreateSessionInput,
  SermonSparkFilters,
  SparkStatus,
  ChangeType,
  PolishMode,
  OutlineTemplateType,
} from "@/types/sermonWriter";

// =====================================================
// Outline Templates
// =====================================================
export const OUTLINE_TEMPLATES: Record<OutlineTemplateType, { name: string; description: string; nodes: Omit<OutlineNode, 'sparkIds' | 'order'>[] }> = {
  deductive: {
    name: 'Deductive',
    description: 'Start with main claim, support with evidence',
    nodes: [
      { id: 'intro', type: 'introduction', label: 'Introduction + Main Claim' },
      { id: 'point1', type: 'point', label: 'Supporting Point 1' },
      { id: 'point2', type: 'point', label: 'Supporting Point 2' },
      { id: 'point3', type: 'point', label: 'Supporting Point 3' },
      { id: 'application', type: 'application', label: 'Application' },
      { id: 'conclusion', type: 'conclusion', label: 'Conclusion + Restatement' },
    ],
  },
  inductive: {
    name: 'Inductive',
    description: 'Build evidence to reveal main claim',
    nodes: [
      { id: 'hook', type: 'hook', label: 'Opening Question/Problem' },
      { id: 'explore1', type: 'exploration', label: 'Exploration 1' },
      { id: 'explore2', type: 'exploration', label: 'Exploration 2' },
      { id: 'explore3', type: 'exploration', label: 'Exploration 3' },
      { id: 'revelation', type: 'revelation', label: 'Revelation (Main Claim)' },
      { id: 'response', type: 'response', label: 'Response/Application' },
    ],
  },
  narrative: {
    name: 'Narrative',
    description: 'Story arc structure',
    nodes: [
      { id: 'setting', type: 'setting', label: 'Setting the Scene' },
      { id: 'tension', type: 'tension', label: 'Rising Tension' },
      { id: 'crisis', type: 'crisis', label: 'Crisis Point' },
      { id: 'turning', type: 'turning', label: 'Turning Point' },
      { id: 'resolution', type: 'resolution', label: 'Resolution' },
      { id: 'application', type: 'application', label: 'So What?' },
    ],
  },
  teaching: {
    name: 'Teaching',
    description: 'Educational progression',
    nodes: [
      { id: 'context', type: 'context', label: 'Historical/Biblical Context' },
      { id: 'explain', type: 'explanation', label: 'Explanation of Text' },
      { id: 'implications', type: 'implications', label: 'Theological Implications' },
      { id: 'application', type: 'application', label: 'Practical Application' },
      { id: 'challenge', type: 'challenge', label: 'Call to Action' },
    ],
  },
  devotional: {
    name: 'Devotional',
    description: 'Personal reflection focus',
    nodes: [
      { id: 'text', type: 'text', label: 'Scripture Reading' },
      { id: 'observe', type: 'observation', label: 'What Do We See?' },
      { id: 'reflect', type: 'reflection', label: 'What Does It Mean?' },
      { id: 'personal', type: 'personal', label: 'Personal Connection' },
      { id: 'prayer', type: 'prayer', label: 'Prayer Response' },
    ],
  },
  custom: {
    name: 'Custom',
    description: 'Build your own structure',
    nodes: [],
  },
};

// =====================================================
// Hook
// =====================================================
export function useSermonWriter(sessionId?: string) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // =====================================================
  // Fetch Session
  // =====================================================
  const {
    data: session,
    isLoading: loadingSession,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ["sermon-writer-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const { data, error } = await supabase
        .from("sermon_writer_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      if (error) throw error;
      return {
        ...data,
        outline_data: data.outline_data as unknown as SermonOutline,
      } as SermonWriterSession;
    },
    enabled: !!sessionId,
  });

  // =====================================================
  // Fetch All User Sessions
  // =====================================================
  const {
    data: sessions,
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["sermon-writer-sessions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("sermon_writer_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(session => ({
        ...session,
        outline_data: session.outline_data as unknown as SermonOutline,
      })) as SermonWriterSession[];
    },
  });

  // =====================================================
  // Fetch Sparks for Session
  // =====================================================
  const {
    data: sparks,
    isLoading: loadingSparks,
    refetch: refetchSparks,
  } = useQuery({
    queryKey: ["sermon-writer-sparks", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("sermon_writer_sparks")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(spark => ({
        ...spark,
        claim_ladder: spark.claim_ladder as unknown as import("@/types/sermonWriter").ClaimLadder | undefined,
        evidence: spark.evidence as unknown as import("@/types/sermonWriter").EvidenceList | undefined,
        counterpoints: spark.counterpoints as unknown as import("@/types/sermonWriter").CounterpointList | undefined,
        pt_mapping: spark.pt_mapping as unknown as import("@/types/sermonWriter").PTMapping | undefined,
      })) as SermonWriterSpark[];
    },
    enabled: !!sessionId,
    // Prevent showing stale sparks from other sessions
    staleTime: 0,
    gcTime: 0, // Don't cache - always fresh data per session
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // =====================================================
  // Fetch Versions for Session
  // =====================================================
  const {
    data: versions,
    isLoading: loadingVersions,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ["sermon-writer-versions", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("sermon_writer_versions")
        .select("*")
        .eq("session_id", sessionId)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return (data || []).map(version => ({
        ...version,
        outline_snapshot: version.outline_snapshot as unknown as SermonOutline,
        sparks_snapshot: version.sparks_snapshot as unknown as SermonWriterSpark[],
      })) as SermonWriterVersion[];
    },
    enabled: !!sessionId,
  });

  // =====================================================
  // Fetch Polish Snapshots
  // =====================================================
  const {
    data: polishSnapshots,
    isLoading: loadingPolish,
    refetch: refetchPolish,
  } = useQuery({
    queryKey: ["sermon-writer-polish", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from("sermon_writer_polish_snapshots")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(snapshot => ({
        ...snapshot,
        outline_before: snapshot.outline_before as unknown as SermonOutline,
        outline_after: snapshot.outline_after as unknown as SermonOutline | undefined,
        validation: snapshot.validation as unknown as import("@/types/sermonWriter").PolishValidation,
      })) as PolishSnapshot[];
    },
    enabled: !!sessionId,
  });

  // =====================================================
  // Create Session
  // =====================================================
  const createSession = useMutation({
    mutationFn: async (input: CreateSessionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const template = input.outline_template || 'deductive';
      const templateConfig = OUTLINE_TEMPLATES[template];
      const initialOutline: SermonOutline = {
        nodes: templateConfig.nodes.map((node, index) => ({
          ...node,
          sparkIds: [],
          order: index,
        })),
        transitions: [],
      };

      const { data, error } = await supabase
        .from("sermon_writer_sessions")
        .insert({
          user_id: user.id,
          theme: input.theme,
          theme_passage: input.theme_passage,
          title: input.title,
          outline_template: template,
          outline_data: initialOutline as unknown as import("@/integrations/supabase/types").Json,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        outline_data: data.outline_data as unknown as SermonOutline,
      } as SermonWriterSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sessions"] });
      toast.success("Sermon session created!");
    },
    onError: (error) => {
      toast.error("Failed to create session: " + error.message);
    },
  });

  // =====================================================
  // Update Session
  // =====================================================
  const updateSession = useMutation({
    mutationFn: async (updates: Partial<SermonWriterSession>) => {
      if (!sessionId) throw new Error("No session ID");

      // Convert outline_data to Json type if present
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (updates.outline_data) {
        dbUpdates.outline_data = updates.outline_data as unknown as import("@/integrations/supabase/types").Json;
      }

      const { error } = await supabase
        .from("sermon_writer_sessions")
        .update(dbUpdates)
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
    },
    onError: (error) => {
      toast.error("Failed to update session: " + error.message);
    },
  });

  // =====================================================
  // Delete Session
  // =====================================================
  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sermon_writer_sessions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sessions"] });
      toast.success("Session deleted");
    },
  });

  // =====================================================
  // Update Outline
  // =====================================================
  const updateOutline = useCallback(async (outline: SermonOutline) => {
    if (!sessionId) return;

    const { error } = await supabase
      .from("sermon_writer_sessions")
      .update({ outline_data: outline as unknown as import("@/integrations/supabase/types").Json })
      .eq("id", sessionId);

    if (error) {
      toast.error("Failed to update outline");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
  }, [sessionId, queryClient]);

  // =====================================================
  // Update Content
  // =====================================================
  const updateContent = useCallback(async (content: string) => {
    if (!sessionId) return;

    const { error } = await supabase
      .from("sermon_writer_sessions")
      .update({ content })
      .eq("id", sessionId);

    if (error) {
      toast.error("Failed to save content");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
  }, [sessionId, queryClient]);

  // =====================================================
  // Set Jeeves Mode
  // =====================================================
  const setJeevesMode = useCallback(async (mode: JeevesMode) => {
    if (!sessionId) return;

    const { error } = await supabase
      .from("sermon_writer_sessions")
      .update({ last_jeeves_mode: mode })
      .eq("id", sessionId);

    if (error) {
      console.error("Failed to save Jeeves mode:", error);
    }

    queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
  }, [sessionId, queryClient]);

  // =====================================================
  // Create Spark
  // =====================================================
  const createSpark = useMutation({
    mutationFn: async (spark: Omit<SermonWriterSpark, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Convert complex types to Json
      const dbSpark = {
        ...spark,
        user_id: user.id,
        claim_ladder: spark.claim_ladder as unknown as import("@/integrations/supabase/types").Json,
        evidence: spark.evidence as unknown as import("@/integrations/supabase/types").Json,
        counterpoints: spark.counterpoints as unknown as import("@/integrations/supabase/types").Json,
        pt_mapping: spark.pt_mapping as unknown as import("@/integrations/supabase/types").Json,
      };

      const { data, error } = await supabase
        .from("sermon_writer_sparks")
        .insert(dbSpark)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        claim_ladder: data.claim_ladder as unknown as import("@/types/sermonWriter").ClaimLadder | undefined,
        evidence: data.evidence as unknown as import("@/types/sermonWriter").EvidenceList | undefined,
        counterpoints: data.counterpoints as unknown as import("@/types/sermonWriter").CounterpointList | undefined,
        pt_mapping: data.pt_mapping as unknown as import("@/types/sermonWriter").PTMapping | undefined,
      } as SermonWriterSpark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sparks", sessionId] });
    },
    onError: (error) => {
      toast.error("Failed to create spark: " + error.message);
    },
  });

  // =====================================================
  // Update Spark
  // =====================================================
  const updateSpark = useMutation({
    mutationFn: async ({ sparkId, updates }: { sparkId: string; updates: Partial<SermonWriterSpark> }) => {
      // Convert complex types to Json
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (updates.claim_ladder) {
        dbUpdates.claim_ladder = updates.claim_ladder as unknown as import("@/integrations/supabase/types").Json;
      }
      if (updates.evidence) {
        dbUpdates.evidence = updates.evidence as unknown as import("@/integrations/supabase/types").Json;
      }
      if (updates.counterpoints) {
        dbUpdates.counterpoints = updates.counterpoints as unknown as import("@/integrations/supabase/types").Json;
      }
      if (updates.pt_mapping) {
        dbUpdates.pt_mapping = updates.pt_mapping as unknown as import("@/integrations/supabase/types").Json;
      }

      const { error } = await supabase
        .from("sermon_writer_sparks")
        .update(dbUpdates)
        .eq("id", sparkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sparks", sessionId] });
    },
  });

  // =====================================================
  // Update Spark Status
  // =====================================================
  const updateSparkStatus = useCallback(async (sparkId: string, status: SparkStatus) => {
    const updates: Partial<SermonWriterSpark> = { status };
    if (status === 'inserted') {
      updates.inserted_at = new Date().toISOString();
    } else if (status === 'favorite') {
      updates.saved_at = new Date().toISOString();
    } else if (status === 'archived') {
      updates.dismissed_at = new Date().toISOString();
    }

    await updateSpark.mutateAsync({ sparkId, updates });
  }, [updateSpark]);

  // =====================================================
  // Map Spark to Outline Node
  // =====================================================
  const mapSparkToNode = useCallback(async (sparkId: string, nodeId: string | null) => {
    await updateSpark.mutateAsync({
      sparkId,
      updates: { outline_node_id: nodeId || undefined },
    });

    // Also update the outline_data to include the spark in the node's sparkIds
    if (session?.outline_data && nodeId) {
      const updatedNodes = session.outline_data.nodes.map(node => {
        if (node.id === nodeId) {
          const sparkIds = node.sparkIds.includes(sparkId)
            ? node.sparkIds
            : [...node.sparkIds, sparkId];
          return { ...node, sparkIds };
        }
        // Remove from other nodes
        return {
          ...node,
          sparkIds: node.sparkIds.filter(id => id !== sparkId),
        };
      });

      await updateOutline({ ...session.outline_data, nodes: updatedNodes });
    }
  }, [updateSpark, session, updateOutline]);

  // =====================================================
  // Delete Spark
  // =====================================================
  const deleteSpark = useMutation({
    mutationFn: async (sparkId: string) => {
      const { error } = await supabase
        .from("sermon_writer_sparks")
        .delete()
        .eq("id", sparkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sparks", sessionId] });
    },
  });

  // =====================================================
  // Create Version
  // =====================================================
  const createVersion = useMutation({
    mutationFn: async ({
      changeType,
      changeDescription,
      changedBy = 'user',
    }: {
      changeType: ChangeType;
      changeDescription?: string;
      changedBy?: 'user' | 'jeeves' | 'polish' | 'auto';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !session) throw new Error("Not authenticated or no session");

      // Get next version number
      const currentMaxVersion = versions?.length
        ? Math.max(...versions.map(v => v.version_number))
        : 0;

      const { data, error } = await supabase
        .from("sermon_writer_versions")
        .insert({
          session_id: session.id,
          user_id: user.id,
          version_number: currentMaxVersion + 1,
          outline_snapshot: session.outline_data as unknown as import("@/integrations/supabase/types").Json,
          sparks_snapshot: (sparks || []) as unknown as import("@/integrations/supabase/types").Json,
          content_snapshot: session.content,
          change_type: changeType,
          change_description: changeDescription,
          changed_by: changedBy,
        })
        .select()
        .single();

      if (error) throw error;

      // Update session's current_version_id
      await supabase
        .from("sermon_writer_sessions")
        .update({ current_version_id: data.id })
        .eq("id", session.id);

      return {
        ...data,
        outline_snapshot: data.outline_snapshot as unknown as SermonOutline,
        sparks_snapshot: data.sparks_snapshot as unknown as SermonWriterSpark[],
      } as SermonWriterVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-versions", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
    },
  });

  // =====================================================
  // Rollback to Version
  // =====================================================
  const rollbackToVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions?.find(v => v.id === versionId);
      if (!version || !sessionId) throw new Error("Version not found");

      // Update session with version snapshot
      const { error } = await supabase
        .from("sermon_writer_sessions")
        .update({
          outline_data: version.outline_snapshot as unknown as import("@/integrations/supabase/types").Json,
          content: version.content_snapshot,
          current_version_id: versionId,
        })
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-sparks", sessionId] });
      toast.success("Rolled back to previous version");
    },
    onError: (error) => {
      toast.error("Failed to rollback: " + error.message);
    },
  });

  // =====================================================
  // Invoke Jeeves
  // =====================================================
  const invokeJeeves = useCallback(async (
    mode: JeevesMode,
    userMessage: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
  ) => {
    if (!session) {
      toast.error("No session loaded");
      return null;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sermon-writer-jeeves", {
        body: {
          mode,
          sessionId: session.id,
          theme: session.theme,
          themePassage: session.theme_passage,
          existingSparks: sparks,
          currentOutline: session.outline_data,
          currentContent: session.content,
          userMessage,
          conversationHistory,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error("Jeeves encountered an error: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session, sparks]);

  // =====================================================
  // Apply Polish
  // =====================================================
  const applyPolish = useCallback(async (
    polishMode: PolishMode,
    targetContent?: string
  ) => {
    if (!session) {
      toast.error("No session loaded");
      return null;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sermon-writer-polish", {
        body: {
          sessionId: session.id,
          polishMode,
          contentToPolish: targetContent || session.content,
          outlineContext: session.outline_data,
        },
      });

      if (error) throw error;

      await refetchPolish();
      return data;
    } catch (error: any) {
      console.error("Polish error:", error);
      toast.error("Polish operation failed: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session, refetchPolish]);

  // =====================================================
  // Rollback Polish
  // =====================================================
  const rollbackPolish = useMutation({
    mutationFn: async (snapshotId: string) => {
      const snapshot = polishSnapshots?.find(s => s.id === snapshotId);
      if (!snapshot || !sessionId) throw new Error("Snapshot not found");

      // Restore content and outline from snapshot
      const { error: sessionError } = await supabase
        .from("sermon_writer_sessions")
        .update({
          content: snapshot.content_before,
          outline_data: snapshot.outline_before as unknown as import("@/integrations/supabase/types").Json,
        })
        .eq("id", sessionId);

      if (sessionError) throw sessionError;

      // Mark snapshot as rolled back
      const { error: snapshotError } = await supabase
        .from("sermon_writer_polish_snapshots")
        .update({
          status: 'rolled_back',
          rolled_back_at: new Date().toISOString(),
        })
        .eq("id", snapshotId);

      if (snapshotError) throw snapshotError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["sermon-writer-polish", sessionId] });
      toast.success("Polish rolled back");
    },
  });

  // =====================================================
  // Filtered Sparks
  // =====================================================
  const getFilteredSparks = useCallback((filters: SermonSparkFilters) => {
    if (!sparks) return [];

    return sparks.filter(spark => {
      // Kind filter
      if (filters.kinds?.length && !filters.kinds.includes(spark.kind)) {
        return false;
      }

      // Type filter
      if (filters.types?.length && !filters.types.includes(spark.spark_type)) {
        return false;
      }

      // Source filter
      if (filters.sources?.length && !filters.sources.includes(spark.source)) {
        return false;
      }

      // Confidence range
      if (filters.confidenceRange) {
        if (spark.confidence < filters.confidenceRange[0] ||
            spark.confidence > filters.confidenceRange[1]) {
          return false;
        }
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!spark.title.toLowerCase().includes(query) &&
            !spark.summary.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Preset filters
      if (filters.preset === 'high_confidence' && spark.confidence < 0.7) {
        return false;
      }
      if (filters.preset === 'needs_evidence') {
        const evidenceCount = spark.evidence?.items?.length || 0;
        if (evidenceCount >= 3) return false;
      }
      if (filters.preset === 'unresolved') {
        const hasCounterpoints = (spark.counterpoints?.points?.length || 0) > 0;
        if (!hasCounterpoints) return false;
      }
      if (filters.preset === 'favorites' && spark.status !== 'favorite') {
        return false;
      }

      // Show/hide inserted
      if (filters.showInserted === false && spark.status === 'inserted') {
        return false;
      }

      // Outline node filter
      if (filters.outlineNodeId && spark.outline_node_id !== filters.outlineNodeId) {
        return false;
      }

      return true;
    });
  }, [sparks]);

  // =====================================================
  // Return
  // =====================================================
  return {
    // Session data
    session,
    sessions,
    sparks,
    versions,
    polishSnapshots,

    // Loading states
    loadingSession,
    loadingSessions,
    loadingSparks,
    loadingVersions,
    loadingPolish,
    isProcessing,

    // Session operations
    createSession,
    updateSession,
    deleteSession,
    updateOutline,
    updateContent,
    setJeevesMode,

    // Spark operations
    createSpark,
    updateSpark,
    updateSparkStatus,
    mapSparkToNode,
    deleteSpark,
    getFilteredSparks,

    // Version operations
    createVersion,
    rollbackToVersion,

    // AI operations
    invokeJeeves,
    applyPolish,
    rollbackPolish,

    // Refetch functions
    refetchSession,
    refetchSessions,
    refetchSparks,
    refetchVersions,
    refetchPolish,

    // Templates
    outlineTemplates: OUTLINE_TEMPLATES,
  };
}
