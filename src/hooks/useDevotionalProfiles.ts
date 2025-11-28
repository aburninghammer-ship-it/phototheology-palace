import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DevotionalProfile {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  age_group: string | null;
  avatar_emoji: string;
  struggles: string[];
  current_situation: string | null;
  spiritual_goals: string[];
  preferred_tone: string;
  preferred_rooms: string[];
  preferred_themes: string[];
  active_plan_id: string | null;
  linked_user_id: string | null;
  invite_token: string | null;
  invite_sent_at: string | null;
  invite_accepted_at: string | null;
  is_active: boolean;
  last_devotional_sent_at: string | null;
  total_devotionals_sent: number;
  created_at: string;
  updated_at: string;
  // CADE fields
  primary_issue: string | null;
  issue_description: string | null;
  issue_severity: string | null;
  pastoral_notes: unknown[] | null;
  warning_flags: string[] | null;
}

export interface ProfileNote {
  id: string;
  profile_id: string;
  user_id: string;
  note_type: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileHistory {
  id: string;
  profile_id: string;
  day_id: string | null;
  shared_via: string;
  shared_at: string;
  personal_message: string | null;
  viewed_at: string | null;
  completed_at: string | null;
  ai_suggested_message: string | null;
  used_ai_suggestion: boolean;
}

export interface ProfileInsight {
  id: string;
  profile_id: string;
  insight_period_start: string;
  insight_period_end: string;
  emotional_patterns: unknown[];
  spiritual_themes: unknown[];
  recurring_scriptures: string[];
  areas_improving: string[];
  areas_needing_prayer: string[];
  suggested_next_plan: string | null;
  suggested_next_theme: string | null;
  suggested_message: string | null;
  weekly_summary: string | null;
  created_at: string;
}

export function useDevotionalProfiles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all profiles for current user
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["devotional-profiles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DevotionalProfile[];
    },
    enabled: !!user?.id,
  });

  // Create a new profile
  const createProfile = useMutation({
    mutationFn: async (profileData: {
      name: string;
      relationship: string;
      age_group?: string;
      avatar_emoji?: string;
      struggles?: string[];
      current_situation?: string;
      spiritual_goals?: string[];
      preferred_tone?: string;
      preferred_rooms?: string[];
      preferred_themes?: string[];
      // CADE fields
      primary_issue?: string;
      issue_description?: string;
      issue_severity?: string;
    }) => {
      // Generate invite token
      const { data: tokenData } = await supabase.rpc("generate_profile_invite_token");
      
      const { data, error } = await supabase
        .from("devotional_profiles")
        .insert({
          user_id: user?.id,
          ...profileData,
          invite_token: tokenData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as DevotionalProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-profiles"] });
      toast({
        title: "Profile Created",
        description: "Devotional profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update a profile
  const updateProfile = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Omit<DevotionalProfile, 'pastoral_notes'>> & { 
      id: string;
      pastoral_notes?: unknown[];
    }) => {
      const { data, error } = await supabase
        .from("devotional_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as DevotionalProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-profiles"] });
    },
  });

  // Delete a profile
  const deleteProfile = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from("devotional_profiles")
        .delete()
        .eq("id", profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-profiles"] });
      toast({
        title: "Profile Deleted",
        description: "The devotional profile has been removed.",
      });
    },
  });

  return {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    isCreating: createProfile.isPending,
  };
}

export function useDevotionalProfile(profileId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch single profile with related data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["devotional-profile", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) throw error;
      return data as DevotionalProfile;
    },
    enabled: !!profileId,
  });

  // Fetch notes for the profile
  const { data: notes } = useQuery({
    queryKey: ["devotional-profile-notes", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_profile_notes")
        .select("*")
        .eq("profile_id", profileId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProfileNote[];
    },
    enabled: !!profileId,
  });

  // Fetch history for the profile
  const { data: history } = useQuery({
    queryKey: ["devotional-profile-history", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_profile_history")
        .select("*")
        .eq("profile_id", profileId)
        .order("shared_at", { ascending: false });

      if (error) throw error;
      return data as ProfileHistory[];
    },
    enabled: !!profileId,
  });

  // Fetch latest insights
  const { data: insights } = useQuery({
    queryKey: ["devotional-profile-insights", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_profile_insights")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] as ProfileInsight | undefined;
    },
    enabled: !!profileId,
  });

  // Add a note
  const addNote = useMutation({
    mutationFn: async (noteData: {
      note_type: string;
      content: string;
      is_pinned?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("devotional_profile_notes")
        .insert({
          profile_id: profileId,
          user_id: user?.id,
          ...noteData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ProfileNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-profile-notes", profileId] });
      toast({
        title: "Note Added",
        description: "Your note has been saved.",
      });
    },
  });

  // Record share history
  const recordShare = useMutation({
    mutationFn: async (shareData: {
      day_id?: string;
      shared_via: string;
      personal_message?: string;
      ai_suggested_message?: string;
      used_ai_suggestion?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("devotional_profile_history")
        .insert({
          profile_id: profileId,
          ...shareData,
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile stats
      await supabase
        .from("devotional_profiles")
        .update({
          last_devotional_sent_at: new Date().toISOString(),
          total_devotionals_sent: (profile?.total_devotionals_sent || 0) + 1,
        })
        .eq("id", profileId);

      return data as ProfileHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-profile-history", profileId] });
      queryClient.invalidateQueries({ queryKey: ["devotional-profile", profileId] });
    },
  });

  return {
    profile,
    notes,
    history,
    insights,
    profileLoading,
    addNote,
    recordShare,
  };
}
