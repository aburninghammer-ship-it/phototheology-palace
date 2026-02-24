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
  church_id: string;
  season_number: number;
  title: string;
  status: "draft" | "recruiting" | "active" | "completed";
  week_current: number;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string;
}

export interface Team {
  id: string;
  season_id: string;
  team_name: string;
  team_motto: string | null;
  team_banner_color: string;
  team_avatar_emoji: string;
  ai_enemy_squad: any;
  total_points: number;
  team_level: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "captain" | "warrior";
  total_speaking_turns: number;
  total_rounds_participated: number;
  weapons_contributed: number;
  display_name?: string;
  avatar_url?: string;
}

export interface Battle {
  id: string;
  team_id: string;
  season_id: string;
  week_number: number;
  opponent_id: string;
  topic_id: string;
  difficulty_tier: string;
  status: "pending" | "in_progress" | "completed";
  battle_type: "standard" | "boss";
  total_rounds: number;
  team_score: number;
  ai_score: number;
  participation_balanced: boolean | null;
  jeeves_battle_summary: string | null;
  weapons_used: any;
}

export interface BattleRound {
  id: string;
  battle_id: string;
  member_id: string;
  round_number: number;
  opponent_attack: string;
  member_response: string | null;
  weapon_used: string | null;
  jeeves_coaching: string | null;
  round_score: number;
  speaking_time_seconds: number;
}

export interface LeaderboardEntry {
  team_id: string;
  team_name: string;
  team_avatar_emoji: string;
  team_banner_color: string;
  team_level: string;
  total_points: number;
  rank: number;
}

export function useForgeDefend(churchId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [battleRounds, setBattleRounds] = useState<BattleRound[]>([]);
  const [teamBattles, setTeamBattles] = useState<Battle[]>([]);

  // Load active season and team data
  const loadSeasonData = useCallback(async () => {
    if (!user?.id || !churchId) return;
    setLoading(true);
    try {
      // Get active season
      const { data: seasons } = await (supabase as any)
        .from("forge_defend_seasons")
        .select("*")
        .eq("church_id", churchId)
        .in("status", ["recruiting", "active"])
        .order("created_at", { ascending: false })
        .limit(1);

      const season = seasons?.[0] || null;
      setActiveSeason(season);

      if (!season) { setLoading(false); return; }

      // Get my team membership
      const { data: membership } = await (supabase as any)
        .from("forge_defend_team_members")
        .select("*, forge_defend_teams(*)")
        .eq("user_id", user.id);

      const myMembership = membership?.find(
        (m: any) => m.forge_defend_teams?.season_id === season.id
      );

      if (myMembership?.forge_defend_teams) {
        setMyTeam(myMembership.forge_defend_teams);

        // Load team members with profiles
        const { data: members } = await (supabase as any)
          .from("forge_defend_team_members")
          .select("*")
          .eq("team_id", myMembership.forge_defend_teams.id);

        if (members) {
          // Load display names
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

        // Load team battles
        const { data: battles } = await (supabase as any)
          .from("forge_defend_battles")
          .select("*")
          .eq("team_id", myMembership.forge_defend_teams.id)
          .order("started_at", { ascending: false });

        setTeamBattles(battles || []);
      }

      // Load leaderboard
      const { data: teams } = await (supabase as any)
        .from("forge_defend_teams")
        .select("*")
        .eq("season_id", season.id)
        .order("total_points", { ascending: false });

      if (teams) {
        setLeaderboard(
          teams.map((t: any, i: number) => ({
            team_id: t.id,
            team_name: t.team_name,
            team_avatar_emoji: t.team_avatar_emoji,
            team_banner_color: t.team_banner_color,
            team_level: t.team_level,
            total_points: t.total_points,
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

  // Create a new season
  const createSeason = useCallback(async (title: string) => {
    if (!user?.id || !churchId) return null;
    const { data, error } = await (supabase as any)
      .from("forge_defend_seasons")
      .insert({
        church_id: churchId,
        title,
        status: "recruiting",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) { console.error("Create season error:", error); return null; }
    setActiveSeason(data);
    return data;
  }, [user?.id, churchId]);

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

    // Parse the JSON response from Jeeves
    const content = data?.choices?.[0]?.message?.content || data?.content || "";
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return null;

    try {
      const draftResult = JSON.parse(jsonMatch[1]);

      // Create teams and assign members in DB
      for (const teamData of draftResult.teams) {
        const squadKeys = Object.keys(AI_ENEMY_SQUADS);
        const randomSquad = squadKeys[Math.floor(Math.random() * squadKeys.length)];

        const { data: team } = await (supabase as any)
          .from("forge_defend_teams")
          .insert({
            season_id: seasonId,
            team_name: teamData.teamName,
            team_motto: teamData.teamMotto,
            team_banner_color: teamData.teamColor || "violet-600",
            team_avatar_emoji: teamData.teamEmoji || "⚔️",
            ai_enemy_squad: AI_ENEMY_SQUADS[randomSquad],
          })
          .select()
          .single();

        if (team) {
          for (let i = 0; i < teamData.members.length; i++) {
            const member = teamData.members[i];
            await (supabase as any)
              .from("forge_defend_team_members")
              .insert({
                team_id: team.id,
                user_id: member.userId,
                role: member.role || (i === 0 ? "captain" : "warrior"),
              });

            await (supabase as any)
              .from("forge_defend_draft_picks")
              .insert({
                season_id: seasonId,
                team_id: team.id,
                user_id: member.userId,
                pick_number: i + 1,
                draft_reason: member.draftReason,
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
    const tier = getTierForWeek(activeSeason.week_current);

    const { data: battle, error } = await (supabase as any)
      .from("forge_defend_battles")
      .insert({
        team_id: myTeam.id,
        season_id: activeSeason.id,
        week_number: activeSeason.week_current,
        opponent_id: opponentId,
        topic_id: topicId,
        difficulty_tier: tier.tier,
        status: "in_progress",
        battle_type: isBoss ? "boss" : "standard",
        started_at: new Date().toISOString(),
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
    const roundNumber = battleRounds.length + 1;

    const { data: round, error } = await (supabase as any)
      .from("forge_defend_battle_rounds")
      .insert({
        battle_id: battleId,
        member_id: user.id,
        round_number: roundNumber,
        opponent_attack: opponentAttack,
        member_response: memberResponse,
        weapon_used: weaponId || null,
        speaking_time_seconds: speakingTimeSeconds,
      })
      .select()
      .single();

    if (error) { console.error("Submit round error:", error); return null; }
    setBattleRounds((prev) => [...prev, round]);

    // Update member stats
    await (supabase as any)
      .from("forge_defend_team_members")
      .update({
        total_speaking_turns: (teamMembers.find((m) => m.user_id === user.id)?.total_speaking_turns || 0) + 1,
        total_rounds_participated: (teamMembers.find((m) => m.user_id === user.id)?.total_rounds_participated || 0) + 1,
      })
      .eq("team_id", myTeam?.id)
      .eq("user_id", user.id);

    return round;
  }, [user?.id, battleRounds, teamMembers, myTeam?.id]);

  // Complete a battle with coaching evaluation
  const completeBattle = useCallback(async (battleId: string) => {
    if (!myTeam || !currentBattle) return null;

    // Get all rounds for this battle
    const { data: rounds } = await (supabase as any)
      .from("forge_defend_battle_rounds")
      .select("*")
      .eq("battle_id", battleId)
      .order("round_number");

    if (!rounds || rounds.length === 0) return null;

    // Calculate participation stats
    const speakingTimes = teamMembers.map((m) => {
      const memberRounds = rounds.filter((r: any) => r.member_id === m.user_id);
      return {
        memberId: m.user_id,
        name: m.display_name || "Warrior",
        seconds: memberRounds.reduce((sum: number, r: any) => sum + (r.speaking_time_seconds || 0), 0),
      };
    });

    const totalTime = speakingTimes.reduce((sum, m) => sum + m.seconds, 0);
    const participationStats = speakingTimes.map((m) => ({
      ...m,
      speakingPct: totalTime > 0 ? Math.round((m.seconds / totalTime) * 100) : 0,
    }));

    // Get team coach evaluation from Jeeves
    const teamResponses = rounds.map((r: any) => {
      const member = teamMembers.find((m) => m.user_id === r.member_id);
      return {
        memberName: member?.display_name || "Warrior",
        response: r.member_response,
        opponentAttack: r.opponent_attack,
      };
    });

    const weaponsUsed = rounds
      .filter((r: any) => r.weapon_used)
      .map((r: any) => ({ id: r.weapon_used, name: "Forged Weapon" }));

    const { data: coachData } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "forge-defend-team-coach",
        teamName: myTeam.team_name,
        teamResponses,
        participationStats,
        weaponsUsed,
        battleType: currentBattle.battle_type,
      },
    });

    const coachContent = coachData?.choices?.[0]?.message?.content || coachData?.content || "";
    const jsonMatch = coachContent.match(/```json\s*([\s\S]*?)```/);
    let evaluation: any = null;

    if (jsonMatch) {
      try { evaluation = JSON.parse(jsonMatch[1]); } catch (e) { console.error("Parse coach result:", e); }
    }

    // Calculate carry penalty
    const carry = calculateCarryPenalty(speakingTimes);
    const won = evaluation?.pointsAwarded?.battleWon ?? (evaluation?.overallScore >= 6);
    const roundScores = evaluation?.pointsAwarded?.roundScores || rounds.map(() => 5);
    const balanced = carry.carrierIds.length === 0 && carry.absentIds.length === 0;

    const totalPoints = calculateBattlePoints(
      roundScores,
      won,
      weaponsUsed.length,
      balanced,
      currentBattle.battle_type === "boss"
    ) + carry.penalty;

    // Update battle record
    await (supabase as any)
      .from("forge_defend_battles")
      .update({
        status: "completed",
        total_rounds: rounds.length,
        team_score: Math.max(0, totalPoints),
        participation_balanced: balanced,
        jeeves_battle_summary: evaluation?.battleSummary || coachContent.substring(0, 500),
        weapons_used: weaponsUsed,
        completed_at: new Date().toISOString(),
      })
      .eq("id", battleId);

    // Update team total points
    const newTotal = (myTeam.total_points || 0) + Math.max(0, totalPoints);
    const newLevel = getTeamLevel(newTotal);

    await (supabase as any)
      .from("forge_defend_teams")
      .update({
        total_points: newTotal,
        team_level: newLevel.id,
      })
      .eq("id", myTeam.id);

    setCurrentBattle(null);
    await loadSeasonData();

    return {
      evaluation,
      points: totalPoints,
      carry,
      balanced,
      won,
    };
  }, [myTeam, currentBattle, teamMembers, loadSeasonData]);

  // Activate season (move from recruiting to active)
  const activateSeason = useCallback(async (seasonId: string) => {
    await (supabase as any)
      .from("forge_defend_seasons")
      .update({
        status: "active",
        week_current: 1,
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", seasonId);

    await loadSeasonData();
  }, [loadSeasonData]);

  // Advance week
  const advanceWeek = useCallback(async () => {
    if (!activeSeason) return;
    const nextWeek = activeSeason.week_current + 1;
    const newStatus = nextWeek > 6 ? "completed" : "active";

    await (supabase as any)
      .from("forge_defend_seasons")
      .update({ week_current: nextWeek, status: newStatus })
      .eq("id", activeSeason.id);

    await loadSeasonData();
  }, [activeSeason, loadSeasonData]);

  // Get team battle stats
  const getTeamStats = useCallback(() => {
    const completed = teamBattles.filter((b) => b.status === "completed");
    const won = completed.filter((b) => b.team_score > 0);
    const totalWeaponsUsed = completed.reduce(
      (sum, b) => sum + (Array.isArray(b.weapons_used) ? b.weapons_used.length : 0),
      0
    );

    return {
      battlesCompleted: completed.length,
      battlesWon: won.length,
      totalPoints: myTeam?.total_points || 0,
      weaponsUsed: totalWeaponsUsed,
      level: getTeamLevel(myTeam?.total_points || 0),
    };
  }, [teamBattles, myTeam]);

  // Get participation balance for current battle
  const getParticipationBalance = useCallback(() => {
    if (battleRounds.length === 0) return [];
    const totalTime = battleRounds.reduce((sum, r) => sum + (r.speaking_time_seconds || 0), 0);
    return teamMembers.map((m) => {
      const memberRounds = battleRounds.filter((r) => r.member_id === m.user_id);
      const memberTime = memberRounds.reduce((sum, r) => sum + (r.speaking_time_seconds || 0), 0);
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

  return {
    loading,
    activeSeason,
    myTeam,
    teamMembers,
    leaderboard,
    currentBattle,
    battleRounds,
    teamBattles,
    createSeason,
    runDraft,
    startBattle,
    submitRound,
    completeBattle,
    activateSeason,
    advanceWeek,
    getTeamStats,
    getParticipationBalance,
    refresh: loadSeasonData,
  };
}
