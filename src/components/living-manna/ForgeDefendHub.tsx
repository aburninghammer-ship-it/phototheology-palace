import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeBatchUsers } from "@/utils/userActivityAnalyzer";
import {
  Trophy, Shield, Swords, Users, Crown, Target, Loader2,
  ChevronRight, ArrowLeft, Zap, Flame, BookOpen, Warehouse,
  FlaskConical, Star, Clock, BarChart3, Send, AlertTriangle, Bot,
  Plus, Check, X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForgeDefend, type LeaderboardEntry, type BoardSquad, type PublicBattle } from "@/hooks/useForgeDefend";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFENSE_OPPONENTS,
  DEFENSE_TOPICS,
  type DefenseOpponent,
} from "@/data/defenseModeOpponents";
import {
  DIFFICULTY_TIERS,
  TEAM_LEVELS,
  SCORING,
  AI_ENEMY_SQUADS,
  getTierForWeek,
  getTeamLevel,
} from "@/data/forgeDefendConfig";

type HubView = "overview" | "draft" | "battle" | "battle-setup" | "leaderboard" | "prep" | "team" | "drill" | "debrief" | "new-season" | "season-board";

interface ForgeDefendHubProps {
  churchId: string;
}

export function ForgeDefendHub({ churchId }: ForgeDefendHubProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [resolvedChurchId, setResolvedChurchId] = useState(churchId);
  const [createError, setCreateError] = useState<string | null>(null);
  const {
    loading, activeSeason, myTeam, teamMembers, leaderboard,
    currentBattle, battleRounds, teamBattles,
    allSquads, publicBattles, allSeasons,
    createSeason, createSquad, runDraft, startBattle, submitRound, completeBattle,
    activateSeason, advanceWeek, getTeamStats, getParticipationBalance,
    loadSeasonBoard, toggleBattlePublic,
    refresh,
  } = useForgeDefend(resolvedChurchId);

  const [view, setView] = useState<HubView>("overview");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
  const [battleMessages, setBattleMessages] = useState<{ role: string; content: string; speaker?: string }[]>([]);
  const [battleInput, setBattleInput] = useState("");
  const [battleLoading, setBattleLoading] = useState(false);
  const [currentSpeakerIdx, setCurrentSpeakerIdx] = useState(0);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [teamWeapons, setTeamWeapons] = useState<any[]>([]);
  const battleScrollRef = useRef<HTMLDivElement>(null);

  // Season setup state
  const [seasonTitle, setSeasonTitle] = useState("Season 1: The Furnace");
  const [squadName, setSquadName] = useState("");
  const [squadMotto, setSquadMotto] = useState("");
  const [squadWarCry, setSquadWarCry] = useState("");
  const [squadEmoji, setSquadEmoji] = useState("⚔️");
  const [selectedDoctrines, setSelectedDoctrines] = useState<string[]>([]);
  const [selectedOpponents, setSelectedOpponents] = useState<string[]>([]);
  const [battleMode, setBattleMode] = useState<"defense" | "offense">("defense");
  const [configMode, setConfigMode] = useState<"manual" | "jeeves">("manual");
  const [churchMembers, setChurchMembers] = useState<{ id: string; display_name: string }[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteResults, setInviteResults] = useState<{ id: string; display_name: string }[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<{ id: string; display_name: string }[]>([]);

  // Battle setup state
  const [battleSetupTopic, setBattleSetupTopic] = useState<string | null>(null);
  const [battleSetupMode, setBattleSetupMode] = useState<"offense" | "defense">("defense");
  const [battleSetupOpponent, setBattleSetupOpponent] = useState<"user" | "jeeves">("user");
  const [battleSetupOpponentId, setBattleSetupOpponentId] = useState<string | null>(null);
  const [battleSetupPublic, setBattleSetupPublic] = useState(false);
  const [battleSetupSchedule, setBattleSetupSchedule] = useState("");

  // Season public toggle state
  const [seasonIsPublic, setSeasonIsPublic] = useState(false);

  // Team analytics state
  const [teamAnalytics, setTeamAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Drill state
  const [drillActive, setDrillActive] = useState(false);
  const [drillMessages, setDrillMessages] = useState<{ role: string; content: string }[]>([]);

  const [churchIdLoading, setChurchIdLoading] = useState(!churchId);

  useEffect(() => {
    if (churchId) {
      setResolvedChurchId(churchId);
      setChurchIdLoading(false);
    }
  }, [churchId]);

  useEffect(() => {
    if (resolvedChurchId || !user?.id) {
      if (resolvedChurchId) setChurchIdLoading(false);
      return;
    }
    setChurchIdLoading(true);
    const resolveChurchMembership = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("church_members")
          .select("church_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data?.church_id) {
          setResolvedChurchId(data.church_id);
        }
      } catch (e) {
        console.error("Church resolution error:", e);
      } finally {
        setChurchIdLoading(false);
      }
    };
    resolveChurchMembership();
  }, [resolvedChurchId, user?.id]);

  // Load church members for selection
  useEffect(() => {
    if (!resolvedChurchId || !user?.id) return;
    const loadMembers = async () => {
      const { data } = await (supabase as any)
        .from("church_members")
        .select("user_id")
        .eq("church_id", resolvedChurchId);
      if (!data) return;
      const userIds = data.map((m: any) => m.user_id).filter((id: string) => id !== user.id);
      if (userIds.length === 0) { setChurchMembers([]); return; }
      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      setChurchMembers((profiles || []).map((p: any) => ({ id: p.id, display_name: p.display_name || "Member" })));
    };
    loadMembers();
  }, [resolvedChurchId, user?.id]);

  // Auto-detect view based on season status
  useEffect(() => {
    if (!activeSeason) return;
    if (activeSeason.status === "recruiting" && !myTeam) setView("draft");
    else if (currentBattle) setView("battle");
  }, [activeSeason, myTeam, currentBattle]);

  // Load team weapons
  useEffect(() => {
    if (!teamMembers.length) return;
    const loadWeapons = async () => {
      const userIds = teamMembers.map((m) => m.user_id);
      const { data } = await (supabase as any)
        .from("defense_arsenal")
        .select("*")
        .in("user_id", userIds);
      setTeamWeapons(data || []);
    };
    loadWeapons();
  }, [teamMembers]);

  // Auto-scroll battle
  useEffect(() => {
    battleScrollRef.current?.scrollTo({ top: battleScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [battleMessages]);

  const stats = getTeamStats();
  const participationBalance = getParticipationBalance();
  const currentTier = activeSeason ? getTierForWeek(activeSeason.current_week || 1) : DIFFICULTY_TIERS[0];
  const teamLevel = getTeamLevel(myTeam?.total_points || 0);

  // ── TOGGLE HELPERS ──────────────────────────────────
  const toggleDoctrine = (id: string) => {
    setSelectedDoctrines((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };
  const toggleOpponent = (id: string) => {
    setSelectedOpponents((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };
  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers((prev) => prev.filter((m) => m !== id));
    } else if (selectedMembers.length < 3) {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  // Search for users to invite by username or display name
  const searchUsers = async (query: string) => {
    setInviteSearch(query);
    if (query.trim().length < 2) { setInviteResults([]); return; }
    setInviteLoading(true);
    try {
      const sanitized = query.trim().replace(/^@/, '').replace(/[%_]/g, '');
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .or(`display_name.ilike.%${sanitized}%,username.ilike.%${sanitized}%`)
        .neq("id", user?.id || "")
        .limit(10);
      if (error) {
        console.error("[ForgeDefend] Search error:", error);
        setInviteResults([]);
        return;
      }
      const alreadySelected = [...selectedMembers, ...invitedMembers.map(m => m.id)];
      setInviteResults(
        (data || [])
          .filter((p: any) => !alreadySelected.includes(p.id))
          .map((p: any) => ({ id: p.id, display_name: p.display_name || p.username || "User" }))
      );
    } catch (err) { console.error("[ForgeDefend] Search exception:", err); setInviteResults([]); }
    finally { setInviteLoading(false); }
  };

  const addInvitedMember = (member: { id: string; display_name: string }) => {
    if (selectedMembers.length >= 3) return;
    setInvitedMembers((prev) => [...prev, member]);
    setSelectedMembers((prev) => [...prev, member.id]);
    setInviteSearch("");
    setInviteResults([]);
  };

  const removeInvitedMember = (id: string) => {
    setInvitedMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedMembers((prev) => prev.filter((m) => m !== id));
  };

  // ── CREATE TEAM (when season exists but user has no team) ──
  const handleCreateTeam = async () => {
    if (!activeSeason) return;
    if (!squadName.trim()) {
      setSquadName("The Remnant");
    }
    setCreateError(null);
    setCreateLoading(true);
    try {
      const memberIds = [user!.id, ...selectedMembers];
      const squad = await createSquad(activeSeason.id, squadName || "The Remnant", memberIds, {
        motto: squadMotto || undefined,
        warCry: squadWarCry || undefined,
        emoji: squadEmoji,
      });
      if (!squad) {
        setCreateError("Squad creation failed. Please try again.");
        return;
      }
      await refresh();
      setView("overview");
    } catch (e) {
      console.error("Team creation error:", e);
      setCreateError("Unexpected error creating squad.");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── CREATE SEASON + SQUAD ───────────────────────────
  const handleCreateSeason = async () => {
    if (!resolvedChurchId) {
      setCreateError("No church context detected. Please join a church first or access from your church dashboard.");
      return;
    }
    if (!user?.id) {
      setCreateError("Please sign in to launch a season.");
      return;
    }
    if (!squadName.trim()) {
      squadName || setSquadName("The Remnant");
    }
    setCreateError(null);
    setCreateLoading(true);
    try {
      const season = await createSeason(seasonTitle, {
        doctrines: selectedDoctrines.length > 0 ? selectedDoctrines : undefined,
        opponents: selectedOpponents.length > 0 ? selectedOpponents : undefined,
        configMode,
        isPublic: seasonIsPublic,
      });
      if (!season) {
        setCreateError("Season launch failed. Check console for details and try again.");
        return;
      }
      const memberIds = [user.id, ...selectedMembers];
      const squad = await createSquad(season.id, squadName || "The Remnant", memberIds, {
        motto: squadMotto || undefined,
        warCry: squadWarCry || undefined,
        emoji: squadEmoji,
      });
      if (!squad) {
        setCreateError("Season created but squad setup failed. Please try again.");
        return;
      }
      await refresh();
      setView("overview");
    } catch (e) {
      console.error("Season creation error:", e);
      setCreateError("Unexpected error while launching season.");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── LOAD TEAM ANALYTICS ─────────────────────────────
  const loadTeamAnalytics = async () => {
    if (!myTeam || teamMembers.length === 0) return;

    setLoadingAnalytics(true);
    try {
      const userIds = teamMembers.map((m) => m.user_id);
      const analyses = await analyzeBatchUsers(userIds);

      // Calculate team strengths and weaknesses
      const teamTopicStrengths: Record<string, number> = {};
      const topicKeys = Object.keys(analyses[0]?.topicStrengths || {});

      topicKeys.forEach((topic) => {
        const avg = analyses.reduce((sum, a) => sum + (a.topicStrengths[topic as keyof typeof a.topicStrengths] || 0), 0) / analyses.length;
        teamTopicStrengths[topic] = Math.round(avg);
      });

      // Find top 3 strengths and bottom 3 weaknesses
      const sortedTopics = Object.entries(teamTopicStrengths).sort(([, a], [, b]) => b - a);
      const topStrengths = sortedTopics.slice(0, 3);
      const bottomWeaknesses = sortedTopics.slice(-3).reverse();

      setTeamAnalytics({
        members: analyses,
        teamTopicStrengths,
        topStrengths,
        bottomWeaknesses,
        avgOverallScore: Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length),
        avgBibleStudyHours: analyses.reduce((sum, a) => sum + a.activityMetrics.bibleStudyHours, 0) / analyses.length,
        avgQuizScore: analyses.reduce((sum, a) => sum + a.activityMetrics.quizScoreAvg, 0) / analyses.length,
      });
    } catch (error) {
      console.error("Error loading team analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // ── RUN DRAFT ────────────────────────────────────────
  const handleRunDraft = async () => {
    if (!activeSeason) return;
    setDraftLoading(true);

    try {
      // Analyze user activity to determine real strengths
      const userIds = teamMembers.length > 0
        ? teamMembers.map((m) => m.user_id)
        : [user?.id || ""];

      const userAnalyses = await analyzeBatchUsers(userIds);

      const participants = userAnalyses.map((analysis) => ({
        userId: analysis.userId,
        displayName: analysis.displayName,
        strengths: analysis.strengthDescription,
        skillLevel: analysis.skillLevel,
        topicStrengths: analysis.topicStrengths,
        metrics: analysis.activityMetrics,
      }));

      const result = await runDraft(activeSeason.id, participants, 3);
      setDraftResult(result);
    } catch (error) {
      console.error("Draft error:", error);
    } finally {
      setDraftLoading(false);
    }
  };

  // ── START BATTLE ─────────────────────────────────────
  const handleStartBattle = async (topicId: string, opponentId: string, isBoss: boolean = false) => {
    const battle = await startBattle(topicId, opponentId, isBoss);
    if (battle) {
      setBattleMessages([]);
      setCurrentSpeakerIdx(0);
      setView("battle");
      await getOpponentAttack(battle, null, false);
    }
  };

  const getOpponentAttack = async (battle: any, prevResponse: string | null, isFollowUp: boolean) => {
    setBattleLoading(true);
    const opponent = DEFENSE_OPPONENTS.find((o) => o.id === battle.topic);
    const currentSpeaker = teamMembers[currentSpeakerIdx]?.display_name || "Warrior";

    const body: any = {
      mode: "forge-defend-team-sparring",
      teamName: myTeam?.name || "Team",
      teamMembers: teamMembers.map((m) => ({ displayName: m.display_name, name: m.display_name })),
      currentSpeaker,
      roundRotation: battleRounds.length + 1,
      weaponsAvailable: teamWeapons.slice(0, 5).map((w: any) => ({ name: w.name, topic: w.topic })),
      opponentWorldview: opponent?.worldview || "",
      opponentStyle: opponent?.argumentStyle || "",
      defenseTopicName: battle.topic,
      difficulty: currentTier.tier,
      phase: isFollowUp ? "follow-up" : "initial",
      conversationHistory: isFollowUp ? battleMessages.map((m) => `${m.speaker}: ${m.content}`).join("\n\n") : undefined,
      discipleResponse: prevResponse || undefined,
    };

    try {
      const { data } = await supabase.functions.invoke("jeeves", { body });
      const content = data?.choices?.[0]?.message?.content || data?.content || "The opponent prepares their attack...";
      setBattleMessages((prev) => [...prev, {
        role: "opponent",
        content,
        speaker: opponent?.name || "Opponent",
      }]);
    } catch (e) {
      console.error("Opponent attack error:", e);
    } finally {
      setBattleLoading(false);
    }
  };

  // ── SUBMIT BATTLE RESPONSE ───────────────────────────
  const handleBattleSubmit = async () => {
    if (!battleInput.trim() || !currentBattle) return;
    const response = battleInput.trim();
    setBattleInput("");

    const speaker = teamMembers[currentSpeakerIdx];
    setBattleMessages((prev) => [...prev, {
      role: "disciple",
      content: response,
      speaker: speaker?.display_name || "You",
    }]);

    const lastOpponentMsg = battleMessages.filter((m) => m.role === "opponent").pop();
    await submitRound(
      currentBattle.id,
      lastOpponentMsg?.content || "",
      response,
      selectedWeaponId || undefined,
      60
    );
    setSelectedWeaponId(null);

    const nextIdx = (currentSpeakerIdx + 1) % Math.max(1, teamMembers.length);
    setCurrentSpeakerIdx(nextIdx);

    const totalRounds = battleRounds.length + 1;
    const maxRounds = Math.max(1, teamMembers.length) * 3;

    if (totalRounds >= maxRounds) {
      setBattleLoading(true);
      const result = await completeBattle(currentBattle.id);
      setBattleMessages((prev) => [...prev, {
        role: "system",
        content: result?.evaluation?.battleSummary || `Battle complete! Points earned: ${result?.points || 0}`,
        speaker: "Jeeves",
      }]);
      setBattleLoading(false);
    } else {
      await getOpponentAttack(currentBattle, response, true);
    }
  };

  // ── LOADING STATE ────────────────────────────────────
  if (loading || churchIdLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  // ── NO ACTIVE SEASON — FULL SETUP FORM ──────────────
  if (!activeSeason) {
    return (
      <div className="space-y-6 py-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <Trophy className="h-12 w-12 text-violet-400 mx-auto" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Forge & Defend
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            6-week team-based apologetics challenge. Configure your season, draft your squad, and battle AI opponents.
          </p>
        </div>

        {/* Season Title */}
        <Card className="bg-black/20 border-violet-500/30">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-violet-300 font-semibold flex items-center gap-2">
                <Flame className="h-4 w-4" /> Season Title
              </Label>
              <Input
                value={seasonTitle}
                onChange={(e) => setSeasonTitle(e.target.value)}
                placeholder="Season 1: The Furnace"
                className="bg-black/30 border-violet-500/30"
              />
            </div>

            {/* Config Mode */}
            <div className="space-y-2">
              <Label className="text-violet-300 font-semibold">Configuration Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={configMode === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConfigMode("manual")}
                  className={configMode === "manual" ? "bg-violet-600" : "border-violet-500/30"}
                >
                  <Target className="h-3.5 w-3.5 mr-1.5" /> Manual Setup
                </Button>
                <Button
                  variant={configMode === "jeeves" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConfigMode("jeeves")}
                  className={configMode === "jeeves" ? "bg-violet-600" : "border-violet-500/30"}
                >
                  <Bot className="h-3.5 w-3.5 mr-1.5" /> Jeeves Mode
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {configMode === "jeeves"
                  ? "Jeeves will automatically configure doctrines, opponents, and weekly topics."
                  : "Choose your own doctrines, opponents, and battle mode."}
              </p>
            </div>

            {/* Make Season Public */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-3">
              <Checkbox
                id="initial-season-public"
                checked={seasonIsPublic}
                onCheckedChange={(v) => setSeasonIsPublic(!!v)}
              />
              <Label htmlFor="initial-season-public" className="text-sm text-violet-300 cursor-pointer">
                Make season public on the Board
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Public seasons appear on the church-wide Season Board so other teams can see progress and rankings.
            </p>
          </CardContent>
        </Card>

        {/* Squad Configuration */}
        <Card className="bg-black/20 border-amber-500/30">
          <CardContent className="p-4 space-y-4">
            <Label className="text-amber-300 font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" /> Squad Configuration
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Squad Name</Label>
                <Input
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="e.g., The Remnant Warriors"
                  className="bg-black/30 border-amber-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Squad Emoji</Label>
                <div className="grid grid-cols-6 gap-1.5 p-2 bg-black/30 border border-amber-500/30 rounded-md">
                  {["⚔️", "🛡️", "👑", "🔥", "⚡", "🦁", "🗡️", "🏆", "💎", "🌟", "⭐", "🎯", "📖", "✝️", "🕊️", "💪", "🦅", "🔱"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSquadEmoji(emoji)}
                      className={`text-2xl p-2 rounded transition-all hover:scale-110 ${
                        squadEmoji === emoji
                          ? "bg-amber-500/40 ring-2 ring-amber-500 scale-110"
                          : "bg-black/20 hover:bg-amber-500/20"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">War Cry (optional)</Label>
              <Input
                value={squadWarCry}
                onChange={(e) => setSquadWarCry(e.target.value)}
                placeholder='e.g., "Truth is our sword, Christ is our shield!"'
                className="bg-black/30 border-amber-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Motto (optional)</Label>
              <Input
                value={squadMotto}
                onChange={(e) => setSquadMotto(e.target.value)}
                placeholder="e.g., Standing firm in the faith"
                className="bg-black/30 border-amber-500/30"
              />
            </div>

            {/* Member Selection */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Select Team Members ({selectedMembers.length}/3 selected)
              </Label>

              {/* Invited members display */}
              {invitedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {invitedMembers.map((m) => (
                    <Badge key={m.id} variant="secondary" className="gap-1 pr-1">
                      {m.display_name}
                      <button onClick={() => removeInvitedMember(m.id)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Church members list */}
              {churchMembers.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                  {churchMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                        selectedMembers.includes(member.id) ? "bg-amber-500/10" : ""
                      } ${selectedMembers.length >= 3 && !selectedMembers.includes(member.id) ? "opacity-40 pointer-events-none" : ""}`}
                    >
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMember(member.id)}
                        disabled={selectedMembers.length >= 3 && !selectedMembers.includes(member.id)}
                      />
                      <span className="text-sm">{member.display_name}</span>
                      {selectedMembers.includes(member.id) && (
                        <Check className="h-3 w-3 text-amber-400 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* Invite by search */}
              {selectedMembers.length < 3 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Plus className="h-3 w-3" /> Invite by username or name
                  </Label>
                  <Input
                    value={inviteSearch}
                    onChange={(e) => searchUsers(e.target.value)}
                    placeholder="Search for a user to invite…"
                    className="bg-black/30 border-amber-500/30"
                  />
                  {inviteLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Searching…
                    </div>
                  )}
                  {inviteResults.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                      {inviteResults.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => addInvitedMember(r)}
                          className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <Users className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-sm">{r.display_name}</span>
                          <Plus className="h-3 w-3 ml-auto text-amber-400" />
                        </button>
                      ))}
                    </div>
                  )}
                  {inviteSearch.length >= 2 && !inviteLoading && inviteResults.length === 0 && (
                    <p className="text-xs text-muted-foreground italic px-2">No users found.</p>
                  )}
                </div>
              )}

              {selectedMembers.length === 0 && churchMembers.length === 0 && invitedMembers.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Search above to invite teammates, or start as a solo squad.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Battle Mode & Doctrines (manual only) */}
        {configMode === "manual" && (
          <>
            {/* Battle Mode */}
            <Card className="bg-black/20 border-red-500/30">
              <CardContent className="p-4 space-y-3">
                <Label className="text-red-300 font-semibold flex items-center gap-2">
                  <Swords className="h-4 w-4" /> Battle Mode
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={battleMode === "defense" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBattleMode("defense")}
                    className={battleMode === "defense" ? "bg-blue-600" : "border-blue-500/30"}
                  >
                    <Shield className="h-3.5 w-3.5 mr-1.5" /> Defense
                  </Button>
                  <Button
                    variant={battleMode === "offense" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBattleMode("offense")}
                    className={battleMode === "offense" ? "bg-red-600" : "border-red-500/30"}
                  >
                    <Swords className="h-3.5 w-3.5 mr-1.5" /> Offense
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {battleMode === "defense"
                    ? "Defend biblical truth against opposing arguments."
                    : "Attack false doctrines like the Secret Rapture or Sunday sacredness."}
                </p>
              </CardContent>
            </Card>

            {/* Doctrine Selection */}
            <Card className="bg-black/20 border-emerald-500/30">
              <CardContent className="p-4 space-y-3">
                <Label className="text-emerald-300 font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Select Doctrines ({selectedDoctrines.length})
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFENSE_TOPICS.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant={selectedDoctrines.includes(topic.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all text-xs ${
                        selectedDoctrines.includes(topic.id)
                          ? "bg-emerald-600 hover:bg-emerald-500"
                          : "border-emerald-500/30 hover:border-emerald-500/60"
                      }`}
                      onClick={() => toggleDoctrine(topic.id)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opponent Selection */}
            <Card className="bg-black/20 border-orange-500/30">
              <CardContent className="p-4 space-y-3">
                <Label className="text-orange-300 font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" /> Select Opponents ({selectedOpponents.length})
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFENSE_OPPONENTS.map((opp) => (
                    <Badge
                      key={opp.id}
                      variant={selectedOpponents.includes(opp.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all text-xs ${
                        selectedOpponents.includes(opp.id)
                          ? "bg-orange-600 hover:bg-orange-500"
                          : "border-orange-500/30 hover:border-orange-500/60"
                      }`}
                      onClick={() => toggleOpponent(opp.id)}
                    >
                      {opp.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Launch Button */}
        <Button
          onClick={handleCreateSeason}
          disabled={createLoading}
          className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
        >
          {createLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Flame className="h-5 w-5 mr-2" />
          )}
          Launch New Season
        </Button>

        {createError && (
          <p className="text-xs text-destructive text-center">{createError}</p>
        )}

        {!resolvedChurchId && !createError && (
          <p className="text-xs text-destructive text-center">
            No church found for your account. Please join a church first, or access this page from your church dashboard.
          </p>
        )}
      </div>
    );
  }

  // ── VIEW NAVIGATION ──────────────────────────────────
  const navItems = [
    { id: "overview" as const, label: "Overview", icon: Shield },
    { id: "team" as const, label: "Team", icon: Users },
    { id: "battle" as const, label: "Battle", icon: Swords },
    { id: "leaderboard" as const, label: "Rankings", icon: Trophy },
    { id: "prep" as const, label: "Prep", icon: BookOpen },
    ...(activeSeason.status === "recruiting" || !myTeam
      ? [{ id: "draft" as const, label: !myTeam ? "Create Team" : "Draft", icon: !myTeam ? Plus : Users }]
      : []),
    { id: "season-board" as const, label: "Board", icon: BarChart3 },
    { id: "new-season" as const, label: "New Season", icon: Flame },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          {activeSeason.title}
        </h2>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline" className="border-violet-500/50 text-violet-300">
            Week {activeSeason.current_week}/6
          </Badge>
          <Badge variant="outline" className="border-fuchsia-500/50 text-fuchsia-300">
            {currentTier.label}
          </Badge>
          <Badge variant="outline">
            {teamLevel.emoji} {teamLevel.label}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-6"} gap-1.5 p-1 rounded-lg bg-black/20 border border-border/50`}>
        {navItems.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setView(nav.id)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              view === nav.id
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <nav.icon className="h-3.5 w-3.5 shrink-0" />
            <span className={isMobile ? "text-[10px]" : ""}>{nav.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW VIEW ═══ */}
      {view === "overview" && (
        <div className="space-y-4">
          {myTeam ? (
            <Card className="bg-black/20 border-violet-500/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{myTeam.banner_emoji || "⚔️"}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{myTeam.name}</h3>
                    {myTeam.motto && (
                      <p className="text-xs text-muted-foreground italic">"{myTeam.motto}"</p>
                    )}
                    {myTeam.war_cry && (
                      <p className="text-xs text-amber-300 mt-0.5">🗣️ {myTeam.war_cry}</p>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold text-violet-300">{myTeam.total_points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {teamMembers.map((m) => (
                    <Badge key={m.id} variant="outline" className="border-violet-500/30">
                      {m.is_captain ? <Crown className="h-3 w-3 mr-1 text-yellow-400" /> : null}
                      {m.display_name}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-lg font-bold text-green-400">{stats.battlesWon}</div>
                    <div className="text-[10px] text-muted-foreground">Wins</div>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-lg font-bold text-blue-400">{stats.battlesCompleted}</div>
                    <div className="text-[10px] text-muted-foreground">Battles</div>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-lg font-bold text-amber-400">{stats.weaponsUsed}</div>
                    <div className="text-[10px] text-muted-foreground">Weapons</div>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="text-lg font-bold text-violet-400">{teamLevel.emoji}</div>
                    <div className="text-[10px] text-muted-foreground">{teamLevel.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* ── INLINE TEAM CREATION FORM ── */
            <div className="space-y-4">
              <Card className="bg-black/20 border-amber-500/30">
                <CardContent className="p-4 text-center space-y-2">
                  <Users className="h-10 w-10 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Create Your Squad
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Build your team and join the battle!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-amber-500/30">
                <CardContent className="p-4 space-y-4">
                  <Label className="text-amber-300 font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Squad Details
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Squad Name</Label>
                      <Input
                        value={squadName}
                        onChange={(e) => setSquadName(e.target.value)}
                        placeholder="e.g., The Remnant Warriors"
                        className="bg-black/30 border-amber-500/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Squad Emoji</Label>
                      <div className="grid grid-cols-6 gap-1.5 p-2 bg-black/30 border border-amber-500/30 rounded-md">
                        {["⚔️", "🛡️", "👑", "🔥", "⚡", "🦁", "🗡️", "🏆", "💎", "🌟", "⭐", "🎯", "📖", "✝️", "🕊️", "💪", "🦅", "🔱"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSquadEmoji(emoji)}
                            className={`text-2xl p-2 rounded transition-all hover:scale-110 ${
                              squadEmoji === emoji
                                ? "bg-amber-500/40 ring-2 ring-amber-500 scale-110"
                                : "bg-black/20 hover:bg-amber-500/20"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">War Cry (optional)</Label>
                    <Input
                      value={squadWarCry}
                      onChange={(e) => setSquadWarCry(e.target.value)}
                      placeholder='e.g., "Truth is our sword, Christ is our shield!"'
                      className="bg-black/30 border-amber-500/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Motto (optional)</Label>
                    <Input
                      value={squadMotto}
                      onChange={(e) => setSquadMotto(e.target.value)}
                      placeholder="e.g., Standing firm in the faith"
                      className="bg-black/30 border-amber-500/30"
                    />
                  </div>
                  {/* Member Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Invite Team Members ({selectedMembers.length}/3 selected)
                    </Label>
                    {invitedMembers.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {invitedMembers.map((m) => (
                          <Badge key={m.id} variant="secondary" className="gap-1 pr-1">
                            {m.display_name}
                            <button onClick={() => removeInvitedMember(m.id)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {churchMembers.length > 0 && (
                      <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                        {churchMembers.map((member) => (
                          <label
                            key={member.id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                              selectedMembers.includes(member.id) ? "bg-amber-500/10" : ""
                            } ${selectedMembers.length >= 3 && !selectedMembers.includes(member.id) ? "opacity-40 pointer-events-none" : ""}`}
                          >
                            <Checkbox
                              checked={selectedMembers.includes(member.id)}
                              onCheckedChange={() => toggleMember(member.id)}
                              disabled={selectedMembers.length >= 3 && !selectedMembers.includes(member.id)}
                            />
                            <span className="text-sm">{member.display_name}</span>
                            {selectedMembers.includes(member.id) && (
                              <Check className="h-3 w-3 text-amber-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedMembers.length < 3 && (
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Plus className="h-3 w-3" /> Invite by username or name
                        </Label>
                        <Input
                          value={inviteSearch}
                          onChange={(e) => searchUsers(e.target.value)}
                          placeholder="Search for a user to invite…"
                          className="bg-black/30 border-amber-500/30"
                        />
                        {inviteLoading && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                            <Loader2 className="h-3 w-3 animate-spin" /> Searching…
                          </div>
                        )}
                        {inviteResults.length > 0 && (
                          <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                            {inviteResults.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => addInvitedMember(r)}
                                className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors w-full text-left"
                              >
                                <Users className="h-3.5 w-3.5 text-amber-400" />
                                <span className="text-sm">{r.display_name}</span>
                                <Plus className="h-3 w-3 ml-auto text-amber-400" />
                              </button>
                            ))}
                          </div>
                        )}
                        {inviteSearch.length >= 2 && !inviteLoading && inviteResults.length === 0 && (
                          <p className="text-xs text-muted-foreground italic px-2">No users found.</p>
                        )}
                      </div>
                    )}
                    {selectedMembers.length === 0 && churchMembers.length === 0 && invitedMembers.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        Search above to invite teammates, or start as a solo squad.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={handleCreateTeam}
                disabled={createLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
              >
                {createLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Shield className="h-5 w-5 mr-2" />
                )}
                Create Squad
              </Button>
              {createError && (
                <p className="text-xs text-destructive text-center">{createError}</p>
              )}
            </div>
          )}

          {/* This Week Panel */}
          <Card className="bg-black/20 border-fuchsia-500/30">
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-fuchsia-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                This Week: {currentTier.label}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentTier.topics.map((topicId) => {
                  const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                  return topic ? (
                    <Badge key={topicId} variant="outline" className="border-fuchsia-500/30 text-xs">
                      {topic.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              {myTeam && activeSeason.status === "active" && (
                <Button
                  onClick={() => setView("battle-setup")}
                  className="w-full mt-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                >
                  <Swords className="h-4 w-4 mr-2" />
                  Enter Battle
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Season Roadmap - Mystery Veil for Future Weeks */}
          <Card className="bg-black/20 border-violet-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-violet-300 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Season Journey
              </h4>
              <div className="space-y-2">
                {DIFFICULTY_TIERS.map((tier, tierIdx) => {
                  const isCurrent = tier.weeks.includes(activeSeason?.current_week || 1);
                  const isPast = (activeSeason?.current_week || 1) > Math.max(...tier.weeks);
                  const isFuture = (activeSeason?.current_week || 1) < Math.min(...tier.weeks);

                  return (
                    <div
                      key={tier.tier}
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrent
                          ? "bg-fuchsia-500/10 border-fuchsia-500/50"
                          : isPast
                          ? "bg-green-500/5 border-green-500/20 opacity-60"
                          : "bg-black/40 border-purple-500/20 relative overflow-hidden"
                      }`}
                    >
                      {/* Mystery Veil Overlay for Future Weeks */}
                      {isFuture && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/90 to-violet-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🔮</div>
                            <div className="text-sm font-semibold text-purple-300">Week {tier.weeks[0]}-{tier.weeks[1]}</div>
                            <div className="text-xs text-purple-400/70">Shrouded in Mystery</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isCurrent
                                ? "border-fuchsia-500/50 text-fuchsia-300"
                                : isPast
                                ? "border-green-500/50 text-green-400"
                                : "border-purple-500/50 text-purple-400"
                            }`}
                          >
                            Week {tier.weeks[0]}-{tier.weeks[1]}
                          </Badge>
                          <span className="text-sm font-medium text-white">
                            {isFuture ? "???" : tier.label}
                          </span>
                        </div>
                        {isCurrent && (
                          <Badge className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50">
                            Current
                          </Badge>
                        )}
                        {isPast && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>

                      {!isFuture && (
                        <div className="flex flex-wrap gap-1">
                          {tier.topics.slice(0, 4).map((topicId) => {
                            const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                            return topic ? (
                              <Badge
                                key={topicId}
                                variant="outline"
                                className="border-white/10 text-[10px] opacity-70"
                              >
                                {topic.name}
                              </Badge>
                            ) : null;
                          })}
                          {tier.topics.length > 4 && (
                            <Badge variant="outline" className="border-white/10 text-[10px] opacity-50">
                              +{tier.topics.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ TEAM ANALYTICS VIEW ═══ */}
      {view === "team" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {!myTeam ? (
            <Card className="bg-black/20 border-amber-500/30">
              <CardContent className="p-4 text-center space-y-2">
                <Users className="h-8 w-8 text-amber-400 mx-auto" />
                <p className="text-amber-300 font-semibold">You're not on a team yet!</p>
                <p className="text-xs text-muted-foreground">Create your squad to join the season.</p>
                <Button onClick={() => setView("overview")} className="mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Team Overview */}
              <Card className="bg-black/20 border-violet-500/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-violet-300 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Analytics
                    </h3>
                    <Button
                      size="sm"
                      onClick={loadTeamAnalytics}
                      disabled={loadingAnalytics}
                      variant="outline"
                    >
                      {loadingAnalytics ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                      Analyze
                    </Button>
                  </div>
                  {!teamAnalytics ? (
                    <p className="text-sm text-muted-foreground">Click Analyze to view team strengths and weaknesses</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-violet-500/10 rounded border border-violet-500/30">
                          <div className="text-2xl font-bold text-violet-300">{teamAnalytics.avgOverallScore}</div>
                          <div className="text-[10px] text-muted-foreground">Team Score</div>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded border border-blue-500/30">
                          <div className="text-2xl font-bold text-blue-300">{teamAnalytics.avgBibleStudyHours.toFixed(1)}h</div>
                          <div className="text-[10px] text-muted-foreground">Avg Study</div>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded border border-green-500/30">
                          <div className="text-2xl font-bold text-green-300">{teamAnalytics.avgQuizScore.toFixed(0)}%</div>
                          <div className="text-[10px] text-muted-foreground">Quiz Avg</div>
                        </div>
                      </div>

                      {/* Team Strengths */}
                      <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                        <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-1.5">
                          <Star className="h-3 w-3" /> Team Strengths
                        </h4>
                        <div className="space-y-1.5">
                          {teamAnalytics.topStrengths.map(([topic, score]: [string, number]) => (
                            <div key={topic} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground capitalize">{topic.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-black/30 rounded-full h-1.5">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${score}%` }} />
                                </div>
                                <span className="text-green-400 font-medium w-8 text-right">{score}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team Weaknesses */}
                      <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                        <h4 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3" /> Areas to Improve
                        </h4>
                        <div className="space-y-1.5">
                          {teamAnalytics.bottomWeaknesses.map(([topic, score]: [string, number]) => (
                            <div key={topic} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground capitalize">{topic.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-black/30 rounded-full h-1.5">
                                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${score}%` }} />
                                </div>
                                <span className="text-red-400 font-medium w-8 text-right">{score}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-300 mt-2">💡 Focus drill sessions on these topics</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Member Profiles */}
              <Card className="bg-black/20 border-blue-500/30">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Squad Members ({teamMembers.length})
                  </h4>
                  <div className="space-y-2">
                    {teamAnalytics?.members.map((member: any) => (
                      <div key={member.userId} className="p-3 bg-black/30 rounded-lg border border-blue-500/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                              {member.displayName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-white">{member.displayName}</div>
                              <div className="text-xs text-muted-foreground">{member.strengthDescription}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.overallScore} pts
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                          <div className="text-center p-1.5 bg-black/30 rounded">
                            <div className="text-blue-300 font-medium">{member.activityMetrics.bibleStudyHours.toFixed(1)}h</div>
                            <div className="text-muted-foreground">Study</div>
                          </div>
                          <div className="text-center p-1.5 bg-black/30 rounded">
                            <div className="text-green-300 font-medium">{member.activityMetrics.quizScoreAvg}%</div>
                            <div className="text-muted-foreground">Quiz</div>
                          </div>
                          <div className="text-center p-1.5 bg-black/30 rounded">
                            <div className="text-amber-300 font-medium">{member.activityMetrics.defenseWinRate}%</div>
                            <div className="text-muted-foreground">Win Rate</div>
                          </div>
                        </div>
                      </div>
                    )) || teamMembers.map((member) => (
                      <div key={member.id} className="p-3 bg-black/30 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-2">
                          {member.is_captain && <Crown className="h-3 w-3 text-yellow-400" />}
                          <span className="text-sm text-white">{member.display_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Drill Recommendations */}
              {teamAnalytics && (
                <Card className="bg-black/20 border-purple-500/30">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-semibold text-purple-300 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Recommended Training Drills
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Based on team analysis, focus on these practice areas:
                    </p>
                    <div className="space-y-2">
                      {teamAnalytics.bottomWeaknesses.map(([topic]: [string, number]) => (
                        <Button
                          key={topic}
                          onClick={() => {
                            setView("drill");
                            // TODO: Start drill with this topic
                          }}
                          variant="outline"
                          className="w-full justify-between text-xs h-auto py-3"
                        >
                          <div className="text-left">
                            <div className="font-medium capitalize">{topic.replace(/([A-Z])/g, ' $1')} Drill</div>
                            <div className="text-muted-foreground text-[10px]">10-15 min • Jeeves coaches</div>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ BATTLE SETUP ═══ */}
      {view === "battle-setup" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <Card className="bg-black/20 border-red-500/30">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-bold text-red-300 flex items-center gap-2">
                <Swords className="h-5 w-5" /> Battle Configuration
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Select Topic</Label>
                <div className="flex flex-wrap gap-1.5">
                  {currentTier.topics.map((topicId) => {
                    const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                    return topic ? (
                      <Badge
                        key={topicId}
                        variant={battleSetupTopic === topicId ? "default" : "outline"}
                        className={`cursor-pointer ${
                          battleSetupTopic === topicId ? "bg-red-600" : "border-red-500/30"
                        }`}
                        onClick={() => setBattleSetupTopic(topicId)}
                      >
                        {topic.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Select Opponent</Label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFENSE_OPPONENTS.slice(0, 8).map((opp) => (
                    <Badge
                      key={opp.id}
                      variant={battleSetupOpponentId === opp.id ? "default" : "outline"}
                      className={`cursor-pointer ${
                        battleSetupOpponentId === opp.id ? "bg-orange-600" : "border-orange-500/30"
                      }`}
                      onClick={() => setBattleSetupOpponentId(opp.id)}
                    >
                      {opp.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Open to Spectators */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="battle-public"
                    checked={battleSetupPublic}
                    onCheckedChange={(v) => setBattleSetupPublic(!!v)}
                  />
                  <Label htmlFor="battle-public" className="text-sm text-muted-foreground cursor-pointer">
                    Open to spectators
                  </Label>
                </div>
                {battleSetupPublic && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Scheduled Time</Label>
                    <Input
                      type="datetime-local"
                      value={battleSetupSchedule}
                      onChange={(e) => setBattleSetupSchedule(e.target.value)}
                      className="bg-black/30 border-red-500/30"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={async () => {
                  if (battleSetupTopic && battleSetupOpponentId) {
                    const battle = await startBattle(battleSetupTopic, battleSetupOpponentId);
                    if (battle && battleSetupPublic) {
                      await toggleBattlePublic(
                        battle.id,
                        true,
                        battleSetupSchedule ? new Date(battleSetupSchedule).toISOString() : undefined
                      );
                    }
                    if (battle) {
                      setBattleMessages([]);
                      setCurrentSpeakerIdx(0);
                      setView("battle");
                      await getOpponentAttack(battle, null, false);
                    }
                  }
                }}
                disabled={!battleSetupTopic || !battleSetupOpponentId}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600"
              >
                <Swords className="h-4 w-4 mr-2" /> Start Battle
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ BATTLE VIEW ═══ */}
      {view === "battle" && currentBattle && (
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={() => { setView("overview"); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <div
            ref={battleScrollRef}
            className="h-[400px] overflow-y-auto space-y-3 bg-black/20 rounded-lg p-3 border border-red-500/30"
          >
            {battleMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] ${
                  msg.role === "disciple"
                    ? "ml-auto bg-violet-900/40 border border-violet-500/30 text-violet-100"
                    : msg.role === "system"
                    ? "mx-auto bg-amber-900/30 border border-amber-500/30 text-amber-100 text-center"
                    : "bg-amber-900/30 border border-amber-500/30 text-amber-100"
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-70">{msg.speaker}</div>
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {battleLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Opponent is responding...
              </div>
            )}
          </div>

          {/* Weapon select */}
          {teamWeapons.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {teamWeapons.slice(0, 5).map((w: any) => (
                <Badge
                  key={w.id}
                  variant={selectedWeaponId === w.id ? "default" : "outline"}
                  className={`cursor-pointer shrink-0 ${
                    selectedWeaponId === w.id ? "bg-emerald-600" : "border-emerald-500/30"
                  }`}
                  onClick={() => setSelectedWeaponId(selectedWeaponId === w.id ? null : w.id)}
                >
                  ⚔️ {w.name || w.topic}
                </Badge>
              ))}
            </div>
          )}

          {/* Current speaker */}
          {teamMembers.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Current speaker: <span className="text-violet-300 font-semibold">
                {teamMembers[currentSpeakerIdx]?.display_name || "You"}
              </span>
            </p>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={battleInput}
              onChange={(e) => setBattleInput(e.target.value)}
              placeholder="Type your defense..."
              className="bg-black/30 border-violet-500/30 min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleBattleSubmit();
                }
              }}
            />
            <Button
              onClick={handleBattleSubmit}
              disabled={!battleInput.trim() || battleLoading}
              className="bg-violet-600 hover:bg-violet-500 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ═══ DRILL VIEW ═══ */}
      {view === "drill" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setView("team")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Team
          </Button>

          <Card className="bg-black/20 border-purple-500/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Practice Drill — Jeeves Coaching
                </h3>
                <Badge className="bg-purple-500/20 text-purple-300">10-15 min</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sharpen your skills with guided practice. Jeeves will coach you through focused exercises on your weak topics.
              </p>
            </CardContent>
          </Card>

          {!drillActive ? (
            <Card className="bg-black/20 border-emerald-500/30">
              <CardContent className="p-4 space-y-3 text-center">
                <Bot className="h-12 w-12 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-emerald-300">Ready to Train?</h4>
                <p className="text-xs text-muted-foreground">
                  Jeeves will guide you through mini-debates focusing on your team's weakest topics.
                  This is a safe space to practice, make mistakes, and improve.
                </p>
                <Button
                  onClick={() => {
                    setDrillActive(true);
                    setDrillMessages([
                      {
                        role: "coach",
                        content: "Welcome to drill practice! I'm Coach Jeeves, and I'm here to help you sharpen your defense skills. We'll do a quick 10-15 minute drill focusing on one of your weak topics. Let's start with the Sabbath. I'll pose a common objection, and you respond. Ready? Here's the challenge: **'The Sabbath was only for the Jews. Christians worship on Sunday to honor the resurrection.'** How do you respond?",
                      },
                    ]);
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Drill Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="h-[350px] overflow-y-auto space-y-3 bg-black/20 rounded-lg p-3 border border-purple-500/30">
                {drillMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      msg.role === "coach"
                        ? "bg-emerald-900/30 border border-emerald-500/30 text-emerald-100"
                        : "ml-auto bg-violet-900/40 border border-violet-500/30 text-violet-100 max-w-[85%]"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-70">
                      {msg.role === "coach" ? "🤖 Coach Jeeves" : "You"}
                    </div>
                    <div className="text-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Your response to the drill..."
                  className="bg-black/30 border-purple-500/30 min-h-[60px]"
                />
                <Button className="bg-purple-600 hover:bg-purple-500 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrillActive(false)}
                className="w-full"
              >
                End Drill Session
              </Button>
            </>
          )}
        </div>
      )}

      {/* ═══ POST-BATTLE DEBRIEF VIEW ═══ */}
      {view === "debrief" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <Card className="bg-black/20 border-emerald-500/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-300">Post-Battle Analysis</h3>
                  <p className="text-xs text-muted-foreground">Coach Jeeves' Team Debrief</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-blue-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                <Star className="h-4 w-4" />
                What You Did Well
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-green-400">✓ Strong Scripture Usage:</strong> You backed up your arguments with solid biblical evidence. Genesis 2:1-3 and Exodus 20:8-11 were cited effectively.
                </p>
                <p>
                  <strong className="text-green-400">✓ Team Coordination:</strong> Great job tag-teaming responses. Each member contributed roughly equally — excellent participation balance.
                </p>
                <p>
                  <strong className="text-green-400">✓ Stayed Calm Under Pressure:</strong> When the opponent pressed hard on Colossians 2:16, you didn't panic. You regrouped and gave a measured response.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-amber-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Areas for Improvement
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-orange-400">⚠ Context Matters:</strong> When quoting Isaiah 58:13-14, make sure to read the surrounding context. The opponent caught you using a verse out of context. Always give the full picture.
                </p>
                <p>
                  <strong className="text-orange-400">⚠ Anticipate Counter-Arguments:</strong> You were caught off-guard by the "nailed to the cross" argument. Study common objections beforehand so you're never surprised.
                </p>
                <p>
                  <strong className="text-orange-400">⚠ Use Your Weapons:</strong> You forged 3 study weapons but only used 1. Don't forget your arsenal! Those weapons exist to give you an edge.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-purple-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Focus for Next Battle
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-purple-300">1. Deep-dive Hebrews 4:</strong> The Sabbath rest argument is powerful but you need to master the whole chapter, not just verse 9.
                </p>
                <p>
                  <strong className="text-purple-300">2. Study the "Mark of the Beast" connection:</strong> Next week includes Prophecy. Tie the Sabbath to Revelation 14 early and often.
                </p>
                <p>
                  <strong className="text-purple-300">3. Practice drills on Law & Gospel:</strong> This is still a weak spot. Run 2-3 drill sessions before Thursday's battle.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-green-500/30">
            <CardContent className="p-4 text-center space-y-2">
              <Trophy className="h-10 w-10 text-green-400 mx-auto" />
              <h4 className="font-semibold text-green-300">Overall: Solid Performance!</h4>
              <p className="text-sm text-muted-foreground">
                You held your ground against a tough opponent. A few adjustments and you'll be unstoppable.
                Keep studying, keep drilling, and trust the process.
              </p>
              <Badge className="bg-green-500/20 text-green-300 text-lg px-4 py-2">
                Battle Score: 82/100
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ DRAFT VIEW ═══ */}
      {view === "draft" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {!myTeam ? (
            <Card className="bg-black/20 border-amber-500/30">
              <CardContent className="p-4 text-center space-y-3">
                <Users className="h-10 w-10 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Create Your Squad
                </h3>
                <p className="text-sm text-muted-foreground">
                  Head to the Overview tab to set up your squad and join the battle.
                </p>
                <Button onClick={() => setView("overview")} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500">
                  <Shield className="h-4 w-4 mr-2" />
                  Go to Squad Setup
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-black/20 border-violet-500/30">
                <CardContent className="p-4 space-y-3 text-center">
                  <Users className="h-10 w-10 text-violet-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Squad Draft</h3>
                  <p className="text-sm text-muted-foreground">
                    Let Jeeves analyze your team and suggest optimal squad compositions.
                  </p>
                  <Button
                    onClick={handleRunDraft}
                    disabled={draftLoading}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
                  >
                    {draftLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                    Run AI Draft
                  </Button>
                </CardContent>
              </Card>

              {draftResult && (
                <Card className="bg-black/20 border-amber-500/30">
                  <CardContent className="p-4">
                    <ReactMarkdown>
                      {typeof draftResult === "string" ? draftResult : JSON.stringify(draftResult, null, 2)}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ NEW SEASON VIEW ═══ */}
      {view === "new-season" && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <div className="text-center space-y-2">
            <Flame className="h-12 w-12 text-violet-400 mx-auto" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Launch New Season
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Start a fresh 6-week apologetics challenge. This will create a new season alongside the current one.
            </p>
          </div>

          {/* Season Title */}
          <Card className="bg-black/20 border-violet-500/30">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-violet-300 font-semibold flex items-center gap-2">
                  <Flame className="h-4 w-4" /> Season Title
                </Label>
                <Input
                  value={seasonTitle}
                  onChange={(e) => setSeasonTitle(e.target.value)}
                  placeholder="Season 2: Refiner's Fire"
                  className="bg-black/30 border-violet-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-violet-300 font-semibold">Configuration Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={configMode === "manual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfigMode("manual")}
                    className={configMode === "manual" ? "bg-violet-600" : "border-violet-500/30"}
                  >
                    <Target className="h-3.5 w-3.5 mr-1.5" /> Manual Setup
                  </Button>
                  <Button
                    variant={configMode === "jeeves" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfigMode("jeeves")}
                    className={configMode === "jeeves" ? "bg-violet-600" : "border-violet-500/30"}
                  >
                    <Bot className="h-3.5 w-3.5 mr-1.5" /> Jeeves Mode
                  </Button>
                </div>
              </div>

              {/* Make Season Public */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                <Checkbox
                  id="new-season-public"
                  checked={seasonIsPublic}
                  onCheckedChange={(v) => setSeasonIsPublic(!!v)}
                />
                <Label htmlFor="new-season-public" className="text-sm text-violet-300 cursor-pointer">
                  Make season public on the Board
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Public seasons appear on the church-wide Season Board so other teams can see progress and rankings.
              </p>
            </CardContent>
          </Card>

          {/* Squad Configuration */}
          <Card className="bg-black/20 border-amber-500/30">
            <CardContent className="p-4 space-y-4">
              <Label className="text-amber-300 font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" /> Squad Configuration
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Squad Name</Label>
                  <Input
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g., The Remnant Warriors"
                    className="bg-black/30 border-amber-500/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Squad Emoji</Label>
                  <div className="grid grid-cols-6 gap-1.5 p-2 bg-black/30 border border-amber-500/30 rounded-md">
                    {["⚔️", "🛡️", "👑", "🔥", "⚡", "🦁", "🗡️", "🏆", "💎", "🌟", "⭐", "🎯", "📖", "✝️", "🕊️", "💪", "🦅", "🔱"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSquadEmoji(emoji)}
                        className={`text-2xl p-2 rounded transition-all hover:scale-110 ${
                          squadEmoji === emoji
                            ? "bg-amber-500/40 ring-2 ring-amber-500 scale-110"
                            : "bg-black/20 hover:bg-amber-500/20"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">War Cry (optional)</Label>
                <Input
                  value={squadWarCry}
                  onChange={(e) => setSquadWarCry(e.target.value)}
                  placeholder='e.g., "Truth is our sword, Christ is our shield!"'
                  className="bg-black/30 border-amber-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Motto (optional)</Label>
                <Input
                  value={squadMotto}
                  onChange={(e) => setSquadMotto(e.target.value)}
                  placeholder="e.g., Standing firm in the faith"
                  className="bg-black/30 border-amber-500/30"
                />
              </div>
              {/* Member Selection */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Select Team Members ({selectedMembers.length}/3 selected)
                </Label>
                {churchMembers.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                    {churchMembers.map((member) => (
                      <label
                        key={member.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                          selectedMembers.includes(member.id) ? "bg-amber-500/10" : ""
                        } ${selectedMembers.length >= 3 && !selectedMembers.includes(member.id) ? "opacity-40 pointer-events-none" : ""}`}
                      >
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMember(member.id)}
                          disabled={selectedMembers.length >= 3 && !selectedMembers.includes(member.id)}
                        />
                        <span className="text-sm">{member.display_name}</span>
                        {selectedMembers.includes(member.id) && (
                          <Check className="h-3 w-3 text-amber-400 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                )}
                {selectedMembers.length < 3 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Plus className="h-3 w-3" /> Invite by username or name
                    </Label>
                    <Input
                      value={inviteSearch}
                      onChange={(e) => searchUsers(e.target.value)}
                      placeholder="Search for a user to invite…"
                      className="bg-black/30 border-amber-500/30"
                    />
                    {inviteResults.length > 0 && (
                      <div className="max-h-32 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                        {inviteResults.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => addInvitedMember(r)}
                            className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors w-full text-left"
                          >
                            <Users className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-sm">{r.display_name}</span>
                            <Plus className="h-3 w-3 ml-auto text-amber-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {selectedMembers.length === 0 && churchMembers.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    Search above to invite teammates, or start as a solo squad.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Launch Button */}
          <Button
            onClick={handleCreateSeason}
            disabled={createLoading}
            className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
          >
            {createLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Flame className="h-5 w-5 mr-2" />
            )}
            Launch New Season
          </Button>

          {createError && (
            <p className="text-xs text-destructive text-center">{createError}</p>
          )}
        </div>
      )}

      {/* ═══ SEASON BOARD VIEW ═══ */}
      {view === "season-board" && (
        <SeasonBoardView
          allSquads={allSquads}
          allSeasons={allSeasons}
          publicBattles={publicBattles}
          loadSeasonBoard={loadSeasonBoard}
        />
      )}

      {/* ═══ LEADERBOARD VIEW ═══ */}
      {view === "leaderboard" && (
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <Card key={entry.team_id} className={`bg-black/20 ${i === 0 ? "border-yellow-500/40" : i === 1 ? "border-gray-400/30" : i === 2 ? "border-amber-600/30" : "border-violet-500/30"}`}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`text-2xl font-bold w-10 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                  #{entry.rank}
                </div>
                <span className="text-2xl">{entry.team_avatar_emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{entry.team_name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] border-violet-500/30">{entry.team_level}</Badge>
                    <span className="text-[10px] text-muted-foreground">{entry.wins}W / {entry.losses}L</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-violet-300">{entry.total_points}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {leaderboard.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No teams yet. Start drafting!</p>
          )}
        </div>
      )}

      {/* ═══ PREP VIEW ═══ */}
      {view === "prep" && (
        <div className="space-y-4">
          {/* Weekly Overview */}
          <Card className="bg-black/20 border-emerald-500/30">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Week {activeSeason?.current_week || 1} Prep Guide
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-emerald-300">{currentTier.label}</strong> — Strategic preparation for the battles ahead
              </p>
            </CardContent>
          </Card>

          {/* AI Opponents Intelligence */}
          <Card className="bg-black/20 border-red-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-red-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Know Your Enemy — AI Critics You'll Face
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                These opponents are active this week. Study their tactics and prepare your defense.
              </p>
              <div className="space-y-2">
                {DEFENSE_OPPONENTS.slice(0, 5).map((opponent) => (
                  <div key={opponent.id} className="p-3 bg-black/40 rounded-lg border border-red-500/20">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">{opponent.emoji}</span>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm text-white">{opponent.name}</h5>
                        <p className="text-xs text-muted-foreground">{opponent.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="text-xs">
                        <span className="text-orange-400 font-medium">Arguments you'll face:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                          {opponent.attackTargets.slice(0, 3).map((target, idx) => (
                            <li key={idx}>{target}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-xs">
                        <span className="text-blue-400 font-medium">Their style:</span>
                        <p className="text-muted-foreground mt-0.5">{opponent.argumentStyle.split('.')[0]}.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* This Week's Topics */}
          <Card className="bg-black/20 border-emerald-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-emerald-300 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                This Week's Doctrines to Master
              </h4>
              <div className="space-y-2">
                {currentTier.topics.map((topicId) => {
                  const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                  return topic ? (
                    <div key={topicId} className="p-3 bg-black/30 rounded-lg border border-emerald-500/20">
                      <h4 className="font-semibold text-sm text-emerald-300">{topic.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bible Study Recommendations */}
          <Card className="bg-black/20 border-blue-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Essential Bible Study — Where to Dig Deep
              </h4>
              <div className="space-y-3">
                {currentTier.tier === "foundational" && (
                  <>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">Sabbath Defense</h5>
                      <p className="text-xs text-muted-foreground mb-2">Study these key chapters:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Genesis 2:1-3</Badge>
                        <Badge variant="outline" className="text-xs">Exodus 20:8-11</Badge>
                        <Badge variant="outline" className="text-xs">Isaiah 58:13-14</Badge>
                        <Badge variant="outline" className="text-xs">Mark 2:27-28</Badge>
                        <Badge variant="outline" className="text-xs">Hebrews 4:1-11</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Creation week, Manna in wilderness, Jesus healing on Sabbath</p>
                    </div>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">State of the Dead</h5>
                      <p className="text-xs text-muted-foreground mb-2">Master these texts:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Ecclesiastes 9:5-6</Badge>
                        <Badge variant="outline" className="text-xs">Psalm 146:4</Badge>
                        <Badge variant="outline" className="text-xs">John 11:11-14</Badge>
                        <Badge variant="outline" className="text-xs">1 Thess 4:13-18</Badge>
                        <Badge variant="outline" className="text-xs">1 Cor 15:51-55</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Lazarus, Rich man and Lazarus parable, Samuel and the witch</p>
                    </div>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">Law & Gospel</h5>
                      <p className="text-xs text-muted-foreground mb-2">Know these passages:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Romans 3:31</Badge>
                        <Badge variant="outline" className="text-xs">Matthew 5:17-19</Badge>
                        <Badge variant="outline" className="text-xs">James 2:10-12</Badge>
                        <Badge variant="outline" className="text-xs">1 John 2:3-6</Badge>
                        <Badge variant="outline" className="text-xs">Revelation 14:12</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Rich young ruler, Woman at the well, Paul's conversion</p>
                    </div>
                  </>
                )}
                {currentTier.tier === "advanced" && (
                  <>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">Sanctuary & 1844</h5>
                      <p className="text-xs text-muted-foreground mb-2">Deep study required:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Daniel 8:14</Badge>
                        <Badge variant="outline" className="text-xs">Leviticus 16</Badge>
                        <Badge variant="outline" className="text-xs">Hebrews 8-10</Badge>
                        <Badge variant="outline" className="text-xs">Revelation 11:19</Badge>
                        <Badge variant="outline" className="text-xs">Ezekiel 4:6</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Day of Atonement, Temple cleansing, High Priest garments</p>
                    </div>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">Trinity Defense</h5>
                      <p className="text-xs text-muted-foreground mb-2">Critical passages:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Matthew 28:19</Badge>
                        <Badge variant="outline" className="text-xs">2 Cor 13:14</Badge>
                        <Badge variant="outline" className="text-xs">John 1:1-3</Badge>
                        <Badge variant="outline" className="text-xs">John 14-16</Badge>
                        <Badge variant="outline" className="text-xs">Acts 5:3-4</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Jesus' baptism, Great Commission, Ananias and Sapphira</p>
                    </div>
                  </>
                )}
                {currentTier.tier === "elite" && (
                  <>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <h5 className="text-xs font-semibold text-blue-300 mb-1">Remnant Church</h5>
                      <p className="text-xs text-muted-foreground mb-2">Master these prophecies:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Revelation 12:17</Badge>
                        <Badge variant="outline" className="text-xs">Revelation 14:6-12</Badge>
                        <Badge variant="outline" className="text-xs">Joel 2:28-32</Badge>
                        <Badge variant="outline" className="text-xs">Malachi 4:5-6</Badge>
                        <Badge variant="outline" className="text-xs">Matthew 24:14</Badge>
                      </div>
                      <p className="text-xs text-amber-300 mt-2">📖 Stories: Elijah, 144,000, Three Angels' Messages</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* App Training Recommendations */}
          <Card className="bg-black/20 border-purple-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-purple-300 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommended Training in PhototheologyOS
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <h5 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> Study Bible
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Read chapters with <strong>CATO</strong> commentary for deeper understanding.
                    Focus on the passages listed above. Use the <strong>Analyze</strong> tab to get AI insights.
                  </p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <h5 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    🎮 Bible Scrabble
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Play <strong>Topic Mode</strong> selecting this week's doctrines. Build vocabulary and verse knowledge.
                    Multiplayer mode sharpens competitive skills.
                  </p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <h5 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    <Flame className="h-3 w-3" /> Defense Mode (Solo Practice)
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Practice <strong>Scout Mode</strong> against the opponents listed above on <strong>Beginner</strong> difficulty.
                    Build confidence before the real battle.
                  </p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <h5 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    📚 Living Manna Space
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Read EGW writings on this week's topics. Use the <strong>Spirit of Prophecy</strong> tab for
                    Desire of Ages, Great Controversy, and Patriarchs & Prophets insights.
                  </p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <h5 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                    🎧 Audio Bible (Epic Mode)
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Listen to chapters with <strong>Epic commentary</strong> for narrative immersion.
                    Perfect for commute or workout prep sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Advice */}
          <Card className="bg-black/20 border-amber-500/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Battle Strategy & Team Prep Tips
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-amber-300">1. Divide & Conquer:</strong> Assign each team member 1-2 topics to become experts in.
                  Don't try to master everything — specialize and support each other.
                </p>
                <p>
                  <strong className="text-amber-300">2. Know Your Opponent:</strong> Study the worldview and argument style of each AI critic.
                  Anticipate their objections before they make them.
                </p>
                <p>
                  <strong className="text-amber-300">3. Scripture Saturation:</strong> The best defense is deep Bible knowledge.
                  Memorize 3-5 key verses per topic. Context is everything.
                </p>
                <p>
                  <strong className="text-amber-300">4. Practice Under Pressure:</strong> Use Defense Mode solo practice on Advanced difficulty.
                  Get comfortable being uncomfortable.
                </p>
                <p>
                  <strong className="text-amber-300">5. Team Coordination:</strong> Meet as a squad before battles. Discuss strategy.
                  Who handles which arguments? Who's your anchor for tough questions?
                </p>
                <p>
                  <strong className="text-amber-300">6. Use Weapons Wisely:</strong> Forge study weapons this week.
                  Save your strongest weapons for the hardest battles (Goliath, boss fights).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Weapons */}
          {teamWeapons.length > 0 && (
            <Card className="bg-black/20 border-amber-500/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-amber-300">Team Arsenal ({teamWeapons.length} weapons)</h4>
                {teamWeapons.slice(0, 10).map((w: any) => (
                  <div key={w.id} className="p-2 bg-black/30 rounded text-xs">
                    <span className="font-semibold text-amber-200">{w.name || w.topic}</span>
                    {w.rating && <span className="text-muted-foreground ml-2">⭐ {w.rating}/10</span>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ── SEASON BOARD VIEW COMPONENT ─────────────────────
function SeasonBoardView({
  allSquads,
  allSeasons,
  publicBattles,
  loadSeasonBoard,
}: {
  allSquads: BoardSquad[];
  allSeasons: import("@/hooks/useForgeDefend").Season[];
  publicBattles: PublicBattle[];
  loadSeasonBoard: () => Promise<void>;
}) {
  const [boardLoading, setBoardLoading] = useState(false);

  useEffect(() => {
    setBoardLoading(true);
    loadSeasonBoard().finally(() => setBoardLoading(false));
  }, [loadSeasonBoard]);

  if (boardLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  const activeSeasons = allSeasons.filter((s) => s.status === "active" || s.status === "recruiting");

  return (
    <div className="space-y-6">
      {/* Global Leaderboard */}
      <Card className="bg-black/20 border-violet-500/30">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-violet-300 flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Global Leaderboard
          </h3>
          {allSquads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No squads yet.</p>
          ) : (
            <div className="space-y-1.5">
              {allSquads.map((squad) => (
                <div
                  key={squad.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-black/30 border border-white/5"
                >
                  <span className="text-lg font-bold text-violet-400 w-8 text-center">
                    {squad.rank <= 3 ? ["", "1st", "2nd", "3rd"][squad.rank] : `#${squad.rank}`}
                  </span>
                  <span className="text-xl">{squad.banner_emoji || "⚔️"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{squad.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{squad.season_title}</div>
                  </div>
                  <Badge variant="outline" className="border-violet-500/30 text-[10px]">
                    {squad.tier || "bronze"}
                  </Badge>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-violet-300">{squad.total_points}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {squad.wins}W / {squad.losses}L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Seasons */}
      <Card className="bg-black/20 border-amber-500/30">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
            <Flame className="h-5 w-5" /> Active Seasons
          </h3>
          {activeSeasons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No active seasons.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeSeasons.map((season) => {
                const seasonSquads = allSquads.filter((s) => s.season_id === season.id);
                return (
                  <div
                    key={season.id}
                    className="p-3 rounded-lg bg-black/30 border border-amber-500/20 space-y-1.5"
                  >
                    <div className="font-semibold text-sm text-white">{season.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-amber-500/30 text-[10px]">
                        Week {season.current_week}/{season.week_count}
                      </Badge>
                      <span>{seasonSquads.length} squad{seasonSquads.length !== 1 ? "s" : ""}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {season.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Public Debates */}
      <Card className="bg-black/20 border-emerald-500/30">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            <Clock className="h-5 w-5" /> Upcoming Public Debates
          </h3>
          {publicBattles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming public debates. Teams can open their battles to spectators from the battle setup screen.
            </p>
          ) : (
            <div className="space-y-2">
              {publicBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-emerald-500/20"
                >
                  <span className="text-xl">{battle.squad_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white">{battle.squad_name}</div>
                    <div className="text-xs text-muted-foreground">
                      Topic: {battle.topic || "TBD"} &middot; {battle.difficulty || "standard"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-emerald-300">
                      {battle.scheduled_at
                        ? new Date(battle.scheduled_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Time TBD"}
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30">
                      {battle.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
