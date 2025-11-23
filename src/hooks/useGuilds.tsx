import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Guild {
  id: string;
  name: string;
  description: string | null;
  guild_type: 'house' | 'order' | 'squad';
  max_members: number;
  focus_rooms: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  guild_image_url: string | null;
  total_xp: number;
  current_streak: number;
  member_count?: number;
  is_member?: boolean;
  user_role?: 'leader' | 'officer' | 'member';
}

export interface GuildChallenge {
  id: string;
  guild_id: string;
  room_id: string;
  challenge_title: string;
  challenge_description: string | null;
  target_completions: number;
  current_completions: number;
  starts_at: string;
  ends_at: string;
  reward_xp: number;
  created_at: string;
  is_completed: boolean;
}

export const useGuilds = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guilds, isLoading } = useQuery({
    queryKey: ["guilds"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: guildsData, error } = await supabase
        .from("guilds")
        .select(`
          *,
          guild_members(count)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Check user membership for each guild
      const { data: memberships } = await supabase
        .from("guild_members")
        .select("guild_id, role")
        .eq("user_id", user.id);

      const membershipMap = new Map(
        memberships?.map(m => [m.guild_id, m.role]) || []
      );

      return guildsData.map(guild => ({
        ...guild,
        guild_type: guild.guild_type as 'house' | 'order' | 'squad',
        member_count: guild.guild_members[0]?.count || 0,
        is_member: membershipMap.has(guild.id),
        user_role: membershipMap.get(guild.id) as 'leader' | 'officer' | 'member' | undefined,
      }));
    },
  });

  const { data: myGuilds } = useQuery({
    queryKey: ["my-guilds"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("guild_members")
        .select(`
          role,
          guilds(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(m => ({ 
        ...m.guilds, 
        guild_type: m.guilds.guild_type as 'house' | 'order' | 'squad',
        user_role: m.role as 'leader' | 'officer' | 'member'
      }));
    },
  });

  const createGuild = useMutation({
    mutationFn: async (guildData: {
      name: string;
      description: string;
      guild_type: 'house' | 'order' | 'squad';
      max_members?: number;
      focus_rooms?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: guild, error: guildError } = await supabase
        .from("guilds")
        .insert({
          ...guildData,
          created_by: user.id,
        })
        .select()
        .single();

      if (guildError) throw guildError;

      // Automatically join as leader
      const { error: memberError } = await supabase
        .from("guild_members")
        .insert({
          guild_id: guild.id,
          user_id: user.id,
          role: "leader",
        });

      if (memberError) throw memberError;
      return guild;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guilds"] });
      queryClient.invalidateQueries({ queryKey: ["my-guilds"] });
      toast({
        title: "🏰 Guild Created!",
        description: "Your guild is ready for members to join.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create guild",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const joinGuild = useMutation({
    mutationFn: async (guildId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("guild_members")
        .insert({
          guild_id: guildId,
          user_id: user.id,
          role: "member",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guilds"] });
      queryClient.invalidateQueries({ queryKey: ["my-guilds"] });
      toast({
        title: "🎉 Joined Guild!",
        description: "Welcome to your new guild family.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to join guild",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const leaveGuild = useMutation({
    mutationFn: async (guildId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("guild_members")
        .delete()
        .eq("guild_id", guildId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guilds"] });
      queryClient.invalidateQueries({ queryKey: ["my-guilds"] });
      toast({
        title: "Left Guild",
        description: "You have left the guild.",
      });
    },
  });

  return {
    guilds,
    myGuilds,
    isLoading,
    createGuild: createGuild.mutate,
    joinGuild: joinGuild.mutate,
    leaveGuild: leaveGuild.mutate,
    isCreating: createGuild.isPending,
    isJoining: joinGuild.isPending,
  };
};