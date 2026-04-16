import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DEFENSE_OPPONENTS, DEFENSE_TOPICS } from "@/data/defenseModeOpponents";
import {
  getTierForWeek,
  getTeamLevel,
  calculateBattlePoints,
  calculateCarryPenalty,
  SCORING,
  AI_ENEMY_SQUADS,
} from "@/data/forgeDefendConfig";

export interface Season {
  id: string;
  church_id: string | null;
  season_number: number | null;
  title: string;
  status: string;
  current_week: number;
  week_count: number;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string;
  army_health: number | null;
  army_morale: number | null;
  total_army_points: number | null;
  doctrines: string[] | null;
  opponents: string[] | null;
  config_mode: string | null;
  is_public: boolean | null;
}

export interface Squad {
  id: string;
  season_id: string;
  name: string;
  motto: string | null;
  banner_emoji: string | null;
  ai_enemy: string | null;
  tier: string | null;
  total_points: number;
  wins: number;
  losses: number;
  war_cry: string | null;
  is_eliminated: boolean | null;
}

export interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  role: string | null;
  is_captain: boolean | null;
  display_name?: string;
  avatar_url?: string;
}

export interface Battle {
  id: string;
  squad_id: string;
  season_id: string;
  week_number: number;
  topic: string | null;
  difficulty: string | null;
  status: string;
  battle_date: string | null;
  points_earned: number;
  full_attendance: boolean | null;
  balanced_participation: boolean | null;
  weapons_used: number;
  result: string | null;
  battle_log: any;
  is_public: boolean | null;
  scheduled_at: string | null;
}

export interface BoardSquad {
  id: string;
  name: string;
  banner_emoji: string | null;
  motto: string | null;
  tier: string | null;
  total_points: number;
  wins: number;
  losses: number;
  season_id: string;
  season_title: string;
  rank: number;
}

export interface PublicBattle {
  id: string;
  squad_id: string;
  squad_name: string;
  squad_emoji: string;
  topic: string | null;
  difficulty: string | null;
  scheduled_at: string;
  status: string;
  result: string | null;
  points_earned: number;
  weapons_used: number;
}

export interface LeaderboardEntry {
  team_id: string;
  team_name: string;
  team_avatar_emoji: string;
  team_banner_color: string;
  team_level: string;
  total_points: number;
  wins: number;
  losses: number;
  rank: number;
}

export function useForgeDefend(churchId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [myTeam, setMyTeam] = useState<Squad | null>(null);
  const [teamMembers, setTeamMembers] = useState<SquadMember[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [battleRounds, setBattleRounds] = useState<any[]>([]);
  const [teamBattles, setTeamBattles] = useState<Battle[]>([]);
  const [allSquads, setAllSquads] = useState<BoardSquad[]>([]);
  const [publicBattles, setPublicBattles] = useState<PublicBattle[]>([]);
  const [allSeasons, setAllSeasons] = useState<Season[]>([]);

  const loadSeasonData = useCallback(async () => {
    if (!user?.id || !churchId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Get active season
      const { data: seasons } = await (supabase as any)
        .from("defense_seasons")
        .select("*")
        .eq("church_id", churchId)
        .in("status", ["recruiting", "active"])
        .order("created_at", { ascending: false })
        .limit(1);

      const season = seasons?.[0] || null;
      setActiveSeason(season);

      if (!season) { setLoading(false); return; }

      // Get my squad membership
      const { data: membership } = await (supabase as any)
        .from("defense_squad_members")
        .select("*, defense_squads(*)")
        .eq("user_id", user.id);

      const myMembership = membership?.find(
        (m: any) => m.defense_squads?.season_id === season.id
      );

      if (myMembership?.defense_squads) {
        setMyTeam(myMembership.defense_squads);

        // Load squad members with profiles
        const { data: members } = await (supabase as any)
          .from("defense_squad_members")
          .select("*")
          .eq("squad_id", myMembership.defense_squads.id);

        if (members) {
          const userIds = members.map((m: any) => m.user_id);
          const { data: profiles } = await (supabase as any)
            .from("profiles")
            .select("id, display_name, avatar_url")
            .in("id", userIds);

          const enriched = members.map((m: any) => {
            const profile = profiles?.find((p: any) => p.id === m.user_id);
            return {
              ...m,
              display_name: profile?.display_name || "Warrior",
              avatar_url: profile?.avatar_url,
            };
          });
          setTeamMembers(enriched);
        }

        // Load squad battles
        const { data: battles } = await (supabase as any)
          .from("defense_battles")
          .select("*")
          .eq("squad_id", myMembership.defense_squads.id)
          .order("created_at", { ascending: false });

        setTeamBattles(battles || []);
      }

      // Load leaderboard
      const { data: squads } = await (supabase as any)
        .from("defense_squads")
        .select("*")
        .eq("season_id", season.id)
        .order("total_points", { ascending: false });

      if (squads) {
        setLeaderboard(
          squads.map((t: any, i: number) => ({
            team_id: t.id,
            team_name: t.name,
            team_avatar_emoji: t.banner_emoji || "⚔️",
            team_banner_color: "violet-600",
            team_level: t.tier || "bronze",
            total_points: t.total_points || 0,
            wins: t.wins || 0,
            losses: t.losses || 0,
            rank: i + 1,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load Forge & Defend data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, churchId]);

  useEffect(() => {
    loadSeasonData();
  }, [loadSeasonData]);

  // Load season board — all squads across seasons, public battles, all seasons
  const loadSeasonBoard = useCallback(async () => {
    if (!churchId) return;
    try {
      // Get all seasons for this church
      const { data: seasons } = await (supabase as any)
        .from("defense_seasons")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      const seasonsList: Season[] = seasons || [];
      setAllSeasons(seasonsList);

      if (seasonsList.length === 0) {
        setAllSquads([]);
        setPublicBattles([]);
        return;
      }

      const seasonIds = seasonsList.map((s) => s.id);
      const seasonMap = new Map(seasonsList.map((s) => [s.id, s.title]));

      // Get all squads across all seasons
      const { data: squads } = await (supabase as any)
        .from("defense_squads")
        .select("*")
        .in("season_id", seasonIds)
        .order("total_points", { ascending: false });

      if (squads) {
        setAllSquads(
          squads.map((s: any, i: number) => ({
            id: s.id,
            name: s.name,
            banner_emoji: s.banner_emoji,
            motto: s.motto,
            tier: s.tier || "bronze",
            total_points: s.total_points || 0,
            wins: s.wins || 0,
            losses: s.losses || 0,
            season_id: s.season_id,
            season_title: seasonMap.get(s.season_id) || "Unknown Season",
            rank: i + 1,
          }))
        );
      }

      // Get upcoming public battles
      const { data: battles } = await (supabase as any)
        .from("defense_battles")
        .select("*, defense_squads(name, banner_emoji)")
        .in("season_id", seasonIds)
        .eq("is_public", true)
        .in("status", ["pending", "in_progress"])
        .order("scheduled_at", { ascending: true });

      if (battles) {
        setPublicBattles(
          battles.map((b: any) => ({
            id: b.id,
            squad_id: b.squad_id,
            squad_name: b.defense_squads?.name || "Unknown",
            squad_emoji: b.defense_squads?.banner_emoji || "⚔️",
            topic: b.topic,
            difficulty: b.difficulty,
            scheduled_at: b.scheduled_at,
            status: b.status,
            result: b.result,
            points_earned: b.points_earned || 0,
            weapons_used: b.weapons_used || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load season board:", err);
    }
  }, [churchId]);

  // Toggle battle public/spectator visibility
  const toggleBattlePublic = useCallback(async (
    battleId: string,
    isPublic: boolean,
    scheduledAt?: string
  ) => {
    const update: any = { is_public: isPublic };
    if (scheduledAt) update.scheduled_at = scheduledAt;
    await (supabase as any)
      .from("defense_battles")
      .update(update)
      .eq("id", battleId);
  }, []);

  // Create a new season
  const createSeason = useCallback(async (
    title: string,
    options?: {
      doctrines?: string[];
      opponents?: string[];
      configMode?: string;
      isPublic?: boolean;
    }
  ) => {
    if (!user?.id || !churchId) return null;
    const { data, error } = await (supabase as any)
      .from("defense_seasons")
      .insert({
        church_id: churchId,
        title,
        status: "recruiting",
        created_by: user.id,
        current_week: 1,
        week_count: 6,
        doctrines: options?.doctrines || null,
        opponents: options?.opponents || null,
        config_mode: options?.configMode || "manual",
        is_public: options?.isPublic ?? false,
      })
      .select()
      .single();

    if (error) { console.error("Create season error:", error); return null; }
    setActiveSeason(data);
    return data;
  }, [user?.id, churchId]);

  // Create a squad for the season
  const createSquad = useCallback(async (
    seasonId: string,
    squadName: string,
    memberUserIds: string[],
    options?: { motto?: string; warCry?: string; emoji?: string }
  ) => {
    if (!user?.id) return null;

    const { data: squad, error } = await (supabase as any)
      .from("defense_squads")
      .insert({
        season_id: seasonId,
        name: squadName,
        motto: options?.motto || null,
        war_cry: options?.warCry || null,
        banner_emoji: options?.emoji || "⚔️",
        total_points: 0,
        wins: 0,
        losses: 0,
      })
      .select()
      .single();

    if (error) { console.error("Create squad error:", error); return null; }

    // Get organizer profile
    const { data: organizerProfile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const organizerName = organizerProfile?.display_name || "Squad Organizer";

    // Send invitations to all members (except creator who auto-joins)
    for (let i = 0; i < memberUserIds.length; i++) {
      const memberId = memberUserIds[i];
      const isCaptain = i === 0;

      if (memberId === user.id) {
        // Creator auto-joins as captain
        await (supabase as any)
          .from("defense_squad_members")
          .insert({
            squad_id: squad.id,
            user_id: user.id,
            role: "captain",
            is_captain: true,
          });
      } else {
        // Send invitation notification to other members
        await (supabase as any)
          .from("user_notifications")
          .insert({
            sender_id: user.id,
            recipient_id: memberId,
            notification_type: "squad_invitation",
            title: `You've been drafted to ${squadName}!`,
            message: `${organizerName} has invited you to join the Forge & Defend squad "${squadName}". ${options?.motto || ""}`,
            page_url: `/living-manna?view=forge-defend`,
            page_title: "Forge & Defend",
            data: {
              squad_id: squad.id,
              squad_name: squadName,
              season_id: seasonId,
              role: isCaptain ? "captain" : "warrior",
              is_captain: isCaptain,
              organizer_name: organizerName,
            },
          });
      }
    }

    // Also add the creator as participant
    await (supabase as any)
      .from("defense_season_participants")
      .upsert({
        season_id: seasonId,
        user_id: user.id,
        squad_id: squad.id,
      }, { onConflict: "season_id,user_id" })
      .select();

    await loadSeasonData();
    return squad;
  }, [user?.id, loadSeasonData]);

  // Run AI draft
  const runDraft = useCallback(async (
    seasonId: string,
    participants: { userId: string; displayName: string; strengths: string }[],
    teamSize: number
  ) => {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "forge-defend-draft",
        participants,
        teamSize,
      },
    });

    if (error) { console.error("Draft error:", error); return null; }

    const content = data?.choices?.[0]?.message?.content || data?.content || "";
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return null;

    try {
      const draftResult = JSON.parse(jsonMatch[1]);

      for (const teamData of draftResult.teams) {
        const { data: squad } = await (supabase as any)
          .from("defense_squads")
          .insert({
            season_id: seasonId,
            name: teamData.teamName,
            motto: teamData.teamMotto,
            banner_emoji: teamData.teamEmoji || "⚔️",
            total_points: 0,
            wins: 0,
            losses: 0,
          })
          .select()
          .single();

        if (squad) {
          for (let i = 0; i < teamData.members.length; i++) {
            const member = teamData.members[i];
            await (supabase as any)
              .from("defense_squad_members")
              .insert({
                squad_id: squad.id,
                user_id: member.userId,
                role: member.role || (i === 0 ? "captain" : "warrior"),
                is_captain: i === 0,
              });
          }
        }
      }

      await loadSeasonData();
      return draftResult;
    } catch (e) {
      console.error("Parse draft result error:", e);
      return null;
    }
  }, [loadSeasonData]);

  // Start a battle
  const startBattle = useCallback(async (
    topicId: string,
    opponentId: string,
    isBoss: boolean = false
  ) => {
    if (!myTeam || !activeSeason) return null;

    const { data: battle, error } = await (supabase as any)
      .from("defense_battles")
      .insert({
        squad_id: myTeam.id,
        season_id: activeSeason.id,
        week_number: activeSeason.current_week,
        topic: topicId,
        difficulty: getTierForWeek(activeSeason.current_week).tier,
        status: "in_progress",
        battle_date: new Date().toISOString(),
        points_earned: 0,
        weapons_used: 0,
      })
      .select()
      .single();

    if (error) { console.error("Start battle error:", error); return null; }
    setCurrentBattle(battle);
    setBattleRounds([]);
    return battle;
  }, [myTeam, activeSeason]);

  // Submit a round response
  const submitRound = useCallback(async (
    battleId: string,
    opponentAttack: string,
    memberResponse: string,
    weaponId?: string,
    speakingTimeSeconds: number = 60
  ) => {
    if (!user?.id) return null;
    // Store round in battle_log
    const newRound = {
      member_id: user.id,
      round_number: battleRounds.length + 1,
      opponent_attack: opponentAttack,
      member_response: memberResponse,
      weapon_used: weaponId || null,
      speaking_time_seconds: speakingTimeSeconds,
    };
    setBattleRounds((prev) => [...prev, newRound]);
    return newRound;
  }, [user?.id, battleRounds]);

  // Complete a battle
  const completeBattle = useCallback(async (battleId: string) => {
    if (!myTeam || !currentBattle) return null;

    const won = battleRounds.length >= 3;
    const points = won ? 100 : 50;

    await (supabase as any)
      .from("defense_battles")
      .update({
        status: "completed",
        points_earned: points,
        result: won ? "win" : "loss",
        battle_log: { rounds: battleRounds },
      })
      .eq("id", battleId);

    // Update squad points
    const newTotal = (myTeam.total_points || 0) + points;
    await (supabase as any)
      .from("defense_squads")
      .update({
        total_points: newTotal,
        wins: won ? (myTeam.wins || 0) + 1 : myTeam.wins,
        losses: !won ? (myTeam.losses || 0) + 1 : myTeam.losses,
      })
      .eq("id", myTeam.id);

    setCurrentBattle(null);
    await loadSeasonData();

    return { evaluation: { battleSummary: `Battle complete! ${won ? "Victory" : "Defeat"}. +${points} points.` }, points, won };
  }, [myTeam, currentBattle, battleRounds, loadSeasonData]);

  // Activate season
  const activateSeason = useCallback(async (seasonId: string) => {
    await (supabase as any)
      .from("defense_seasons")
      .update({
        status: "active",
        current_week: 1,
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", seasonId);

    await loadSeasonData();
  }, [loadSeasonData]);

  // Advance week
  const advanceWeek = useCallback(async () => {
    if (!activeSeason) return;
    const nextWeek = activeSeason.current_week + 1;
    const newStatus = nextWeek > 6 ? "completed" : "active";

    await (supabase as any)
      .from("defense_seasons")
      .update({ current_week: nextWeek, status: newStatus })
      .eq("id", activeSeason.id);

    await loadSeasonData();
  }, [activeSeason, loadSeasonData]);

  // Get team battle stats
  const getTeamStats = useCallback(() => {
    const completed = teamBattles.filter((b) => b.status === "completed");
    const won = completed.filter((b) => b.result === "win");
    const totalWeaponsUsed = completed.reduce((sum, b) => sum + (b.weapons_used || 0), 0);

    return {
      battlesCompleted: completed.length,
      battlesWon: won.length,
      totalPoints: myTeam?.total_points || 0,
      weaponsUsed: totalWeaponsUsed,
      level: getTeamLevel(myTeam?.total_points || 0),
    };
  }, [teamBattles, myTeam]);

  // Get participation balance
  const getParticipationBalance = useCallback(() => {
    if (battleRounds.length === 0) return [];
    const totalTime = battleRounds.reduce((sum: number, r: any) => sum + (r.speaking_time_seconds || 0), 0);
    return teamMembers.map((m) => {
      const memberRounds = battleRounds.filter((r: any) => r.member_id === m.user_id);
      const memberTime = memberRounds.reduce((sum: number, r: any) => sum + (r.speaking_time_seconds || 0), 0);
      return {
        memberId: m.user_id,
        name: m.display_name || "Warrior",
        pct: totalTime > 0 ? Math.round((memberTime / totalTime) * 100) : 0,
        status: totalTime > 0 && (memberTime / totalTime) > 0.6
          ? "carrying" as const
          : totalTime > 0 && (memberTime / totalTime) < 0.15
          ? "silent" as const
          : "balanced" as const,
      };
    });
  }, [battleRounds, teamMembers]);

  // Accept squad invitation
  const acceptSquadInvitation = useCallback(async (notificationId: string, squadId: string, role: string, isCaptain: boolean) => {
    if (!user?.id) return false;

    try {
      // Add member to squad
      await (supabase as any)
        .from("defense_squad_members")
        .insert({
          squad_id: squadId,
          user_id: user.id,
          role: role || "warrior",
          is_captain: isCaptain || false,
        });

      // Mark notification as read
      await (supabase as any)
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      await loadSeasonData();
      return true;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      return false;
    }
  }, [user?.id, loadSeasonData]);

  // Decline squad invitation
  const declineSquadInvitation = useCallback(async (notificationId: string) => {
    try {
      // Mark notification as read
      await (supabase as any)
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      return true;
    } catch (error) {
      console.error("Error declining invitation:", error);
      return false;
    }
  }, []);

  return {
    loading,
    activeSeason,
    myTeam,
    teamMembers,
    leaderboard,
    currentBattle,
    battleRounds,
    teamBattles,
    allSquads,
    publicBattles,
    allSeasons,
    createSeason,
    createSquad,
    runDraft,
    startBattle,
    submitRound,
    completeBattle,
    activateSeason,
    advanceWeek,
    getTeamStats,
    getParticipationBalance,
    acceptSquadInvitation,
    declineSquadInvitation,
    loadSeasonBoard,
    toggleBattlePublic,
    refresh: loadSeasonData,
  };
}
