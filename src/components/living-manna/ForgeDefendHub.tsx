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
import { useForgeDefend, type LeaderboardEntry } from "@/hooks/useForgeDefend";
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

type HubView = "overview" | "draft" | "battle" | "battle-setup" | "leaderboard" | "prep";

interface ForgeDefendHubProps {
  churchId: string;
}

export function ForgeDefendHub({ churchId }: ForgeDefendHubProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const {
    loading, activeSeason, myTeam, teamMembers, leaderboard,
    currentBattle, battleRounds, teamBattles,
    createSeason, createSquad, runDraft, startBattle, submitRound, completeBattle,
    activateSeason, advanceWeek, getTeamStats, getParticipationBalance,
    refresh,
  } = useForgeDefend(churchId);

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

  // Battle setup state
  const [battleSetupTopic, setBattleSetupTopic] = useState<string | null>(null);
  const [battleSetupMode, setBattleSetupMode] = useState<"offense" | "defense">("defense");
  const [battleSetupOpponent, setBattleSetupOpponent] = useState<"user" | "jeeves">("user");
  const [battleSetupOpponentId, setBattleSetupOpponentId] = useState<string | null>(null);

  // Load church members for selection
  useEffect(() => {
    if (!churchId || !user?.id) return;
    const loadMembers = async () => {
      const { data } = await (supabase as any)
        .from("church_members")
        .select("user_id")
        .eq("church_id", churchId);
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
  }, [churchId, user?.id]);

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
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // ── CREATE SEASON + SQUAD ───────────────────────────
  const handleCreateSeason = async () => {
    if (!squadName.trim()) {
      squadName || setSquadName("The Remnant");
    }
    setCreateLoading(true);
    try {
      const season = await createSeason(seasonTitle, {
        doctrines: selectedDoctrines.length > 0 ? selectedDoctrines : undefined,
        opponents: selectedOpponents.length > 0 ? selectedOpponents : undefined,
        configMode,
      });
      if (season) {
        const memberIds = [user!.id, ...selectedMembers];
        await createSquad(season.id, squadName || "The Remnant", memberIds, {
          motto: squadMotto || undefined,
          warCry: squadWarCry || undefined,
          emoji: squadEmoji,
        });
      }
    } catch (e) {
      console.error("Season creation error:", e);
    } finally {
      setCreateLoading(false);
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
  if (loading) {
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
                Select Team Members ({selectedMembers.length} selected)
              </Label>
              {churchMembers.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No other church members found. You'll be on a solo squad.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1 bg-black/20 rounded-lg p-2 border border-amber-500/20">
                  {churchMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                        selectedMembers.includes(member.id) ? "bg-amber-500/10" : ""
                      }`}
                    >
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMember(member.id)}
                      />
                      <span className="text-sm">{member.display_name}</span>
                      {selectedMembers.includes(member.id) && (
                        <Check className="h-3 w-3 text-amber-400 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
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
      </div>
    );
  }

  // ── VIEW NAVIGATION ──────────────────────────────────
  const navItems = [
    { id: "overview" as const, label: "Overview", icon: Shield },
    { id: "battle" as const, label: "Battle", icon: Swords },
    { id: "leaderboard" as const, label: "Rankings", icon: Trophy },
    { id: "prep" as const, label: "Prep", icon: BookOpen },
    ...(activeSeason.status === "recruiting" ? [{ id: "draft" as const, label: "Draft", icon: Users }] : []),
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
      <div className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-5"} gap-1.5 p-1 rounded-lg bg-black/20 border border-border/50`}>
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
            <Card className="bg-black/20 border-amber-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-amber-300">You're not on a team yet. Join the draft!</p>
                <Button onClick={() => setView("draft")} className="mt-2" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Go to Draft
                </Button>
              </CardContent>
            </Card>
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

              <Button
                onClick={() => {
                  if (battleSetupTopic && battleSetupOpponentId) {
                    handleStartBattle(battleSetupTopic, battleSetupOpponentId);
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

      {/* ═══ DRAFT VIEW ═══ */}
      {view === "draft" && (
        <div className="space-y-4">
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
        </div>
      )}

      {/* ═══ LEADERBOARD VIEW ═══ */}
      {view === "leaderboard" && (
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <Card key={entry.team_id} className="bg-black/20 border-violet-500/30">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`text-2xl font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                  #{entry.rank}
                </div>
                <span className="text-2xl">{entry.team_avatar_emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{entry.team_name}</h4>
                  <p className="text-xs text-muted-foreground">{entry.team_level}</p>
                </div>
                <div className="text-lg font-bold text-violet-300">{entry.total_points}</div>
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
          <Card className="bg-black/20 border-emerald-500/30">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Weekly Prep
              </h3>
              <p className="text-sm text-muted-foreground">
                This week's topics: {currentTier.label}
              </p>
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
