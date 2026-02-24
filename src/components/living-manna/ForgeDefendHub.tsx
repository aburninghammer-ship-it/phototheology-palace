import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Shield, Swords, Users, Crown, Target, Loader2,
  ChevronRight, ArrowLeft, Zap, Flame, BookOpen, Warehouse,
  FlaskConical, Star, Clock, BarChart3, Send, AlertTriangle, Bot,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
    createSeason, runDraft, startBattle, submitRound, completeBattle,
    activateSeason, advanceWeek, getTeamStats, getParticipationBalance,
    refresh,
  } = useForgeDefend(churchId);

  const [view, setView] = useState<HubView>("overview");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
  const [seasonTitle, setSeasonTitle] = useState("Season 1: The Furnace");
  const [battleMessages, setBattleMessages] = useState<{ role: string; content: string; speaker?: string }[]>([]);
  const [battleInput, setBattleInput] = useState("");
  const [battleLoading, setBattleLoading] = useState(false);
  const [currentSpeakerIdx, setCurrentSpeakerIdx] = useState(0);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [teamWeapons, setTeamWeapons] = useState<any[]>([]);
  const battleScrollRef = useRef<HTMLDivElement>(null);

  // Battle setup state
  const [battleSetupTopic, setBattleSetupTopic] = useState<string | null>(null);
  const [battleSetupMode, setBattleSetupMode] = useState<"offense" | "defense">("defense");
  const [battleSetupOpponent, setBattleSetupOpponent] = useState<"user" | "jeeves">("user");
  const [battleSetupOpponentId, setBattleSetupOpponentId] = useState<string | null>(null);

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
  const currentTier = activeSeason ? getTierForWeek(activeSeason.week_current || 1) : DIFFICULTY_TIERS[0];
  const teamLevel = getTeamLevel(myTeam?.total_points || 0);

  // ── CREATE SEASON ────────────────────────────────────
  const handleCreateSeason = async () => {
    await createSeason(seasonTitle);
  };

  // ── RUN DRAFT ────────────────────────────────────────
  const handleRunDraft = async () => {
    if (!activeSeason) return;
    setDraftLoading(true);
    // For demo, use team members or mock participants
    const participants = teamMembers.length > 0
      ? teamMembers.map((m) => ({
          userId: m.user_id,
          displayName: m.display_name || "Warrior",
          strengths: "General apologetics",
        }))
      : [{ userId: user?.id || "", displayName: "You", strengths: "General apologetics" }];

    const result = await runDraft(activeSeason.id, participants, 3);
    setDraftResult(result);
    setDraftLoading(false);
  };

  // ── START BATTLE ─────────────────────────────────────
  const handleStartBattle = async (topicId: string, opponentId: string, isBoss: boolean = false) => {
    const battle = await startBattle(topicId, opponentId, isBoss);
    if (battle) {
      setBattleMessages([]);
      setCurrentSpeakerIdx(0);
      setView("battle");
      // Get initial opponent attack
      await getOpponentAttack(battle, null, false);
    }
  };

  const getOpponentAttack = async (battle: any, prevResponse: string | null, isFollowUp: boolean) => {
    setBattleLoading(true);
    const opponent = DEFENSE_OPPONENTS.find((o) => o.id === battle.opponent_id);
    const topic = DEFENSE_TOPICS.find((t) => t.id === battle.topic_id);
    const currentSpeaker = teamMembers[currentSpeakerIdx]?.display_name || "Warrior";

    const mode = battle.battle_type === "boss" ? "forge-defend-boss-battle" : "forge-defend-team-sparring";
    const conversationHistory = battleMessages.map((m) => `${m.speaker || m.role}: ${m.content}`).join("\n\n");

    const body: any = {
      mode,
      teamName: myTeam?.team_name || "Team",
      teamMembers: teamMembers.map((m) => ({ displayName: m.display_name, name: m.display_name })),
      currentSpeaker,
      roundRotation: battleRounds.length + 1,
      weaponsAvailable: teamWeapons.slice(0, 5).map((w: any) => ({ name: w.name, topic: w.topic })),
      opponentWorldview: opponent?.worldview || "",
      opponentStyle: opponent?.argumentStyle || "",
      defenseTopicName: topic?.name || battle.topic_id,
      difficulty: currentTier.tier === "elite" ? "advanced" : currentTier.tier === "advanced" ? "intermediate" : "beginner",
      phase: isFollowUp ? "follow-up" : "initial",
      conversationHistory: isFollowUp ? conversationHistory : undefined,
      discipleResponse: prevResponse || undefined,
    };

    if (mode === "forge-defend-boss-battle") {
      const enemySquad = myTeam?.ai_enemy_squad?.opponents || ["atheist", "evangelical", "former-sda"];
      body.enemySquad = enemySquad.map((id: string) => DEFENSE_OPPONENTS.find((o) => o.id === id) || { id, name: id });
      body.roundNumber = battleRounds.length + 1;
    }

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

    // Submit round to DB
    const lastOpponentMsg = battleMessages.filter((m) => m.role === "opponent").pop();
    await submitRound(
      currentBattle.id,
      lastOpponentMsg?.content || "",
      response,
      selectedWeaponId || undefined,
      60
    );
    setSelectedWeaponId(null);

    // Rotate speaker
    const nextIdx = (currentSpeakerIdx + 1) % teamMembers.length;
    setCurrentSpeakerIdx(nextIdx);

    // Check if battle should end (e.g., after 3 rounds per member)
    const totalRounds = battleRounds.length + 1;
    const maxRounds = teamMembers.length * 3;

    if (totalRounds >= maxRounds) {
      // Complete battle
      setBattleLoading(true);
      const result = await completeBattle(currentBattle.id);
      setBattleMessages((prev) => [...prev, {
        role: "system",
        content: result?.evaluation?.battleSummary
          || `Battle complete! Points earned: ${result?.points || 0}`,
        speaker: "Jeeves",
      }]);
      setBattleLoading(false);
    } else {
      // Get next opponent attack
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

  // ── NO ACTIVE SEASON ─────────────────────────────────
  if (!activeSeason) {
    return (
      <div className="space-y-6 text-center py-10">
        <div className="space-y-2">
          <Trophy className="h-12 w-12 text-violet-400 mx-auto" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Forge & Defend
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            6-week team-based apologetics challenge. Draft your squad, battle AI opponents together, and climb the leaderboard.
          </p>
        </div>
        <Card className="bg-black/20 border-violet-500/30 max-w-sm mx-auto">
          <CardContent className="p-4 space-y-3">
            <Input
              value={seasonTitle}
              onChange={(e) => setSeasonTitle(e.target.value)}
              placeholder="Season title..."
              className="bg-black/30 border-violet-500/30"
            />
            <Button
              onClick={handleCreateSeason}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
            >
              <Flame className="h-4 w-4 mr-2" />
              Launch New Season
            </Button>
          </CardContent>
        </Card>
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
            Week {activeSeason.week_current}/6
          </Badge>
          <Badge variant="outline" className="border-fuchsia-500/50 text-fuchsia-300">
            {currentTier.label}
          </Badge>
          <Badge variant="outline" className={`border-${teamLevel.color}/50`}>
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
          {/* Team Card */}
          {myTeam ? (
            <Card className="bg-black/20 border-violet-500/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{myTeam.team_avatar_emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{myTeam.team_name}</h3>
                    {myTeam.team_motto && (
                      <p className="text-xs text-muted-foreground italic">"{myTeam.team_motto}"</p>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold text-violet-300">{myTeam.total_points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="flex gap-2 flex-wrap">
                  {teamMembers.map((m) => (
                    <Badge key={m.id} variant="outline" className="border-violet-500/30">
                      {m.role === "captain" ? <Crown className="h-3 w-3 mr-1 text-yellow-400" /> : null}
                      {m.display_name}
                    </Badge>
                  ))}
                </div>

                {/* Quick Stats */}
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

          {/* Enemy Squad Preview */}
          {myTeam?.ai_enemy_squad && (
            <Card className="bg-black/20 border-red-500/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-red-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Your Enemy Squad: {myTeam.ai_enemy_squad.name || "Unknown"}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {(myTeam.ai_enemy_squad.opponents || []).map((oppId: string) => {
                    const opp = DEFENSE_OPPONENTS.find((o) => o.id === oppId);
                    return opp ? (
                      <Badge key={oppId} className="bg-red-900/50 text-red-200 border-red-500/30">
                        {opp.emoji} {opp.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
                <p className="text-xs text-muted-foreground">{myTeam.ai_enemy_squad.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ DRAFT VIEW ═══ */}
      {view === "draft" && (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-amber-300">Sanctuary Draft Ceremony</h3>
            <p className="text-sm text-muted-foreground">
              Jeeves will analyze each warrior's strengths and forge balanced teams.
            </p>
          </div>

          {draftResult ? (
            <div className="space-y-4">
              {/* Draft narrative */}
              <Card className="bg-black/20 border-amber-500/30">
                <CardContent className="p-4">
                  <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-amber-100">
                    {draftResult.draftNarrative}
                  </ReactMarkdown>
                </CardContent>
              </Card>

              {/* Revealed teams */}
              {draftResult.teams?.map((team: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.5 }}
                >
                  <Card className="bg-black/20 border-violet-500/30">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{team.teamEmoji}</span>
                        <div>
                          <h4 className="font-bold text-white">{team.teamName}</h4>
                          <p className="text-xs text-muted-foreground italic">"{team.teamMotto}"</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {team.members?.map((m: any, j: number) => (
                          <div key={j} className="flex items-center gap-2 text-sm">
                            {m.role === "captain" && <Crown className="h-3 w-3 text-yellow-400" />}
                            <span className="text-white">{m.displayName}</span>
                            <span className="text-xs text-muted-foreground">- {m.draftReason}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {activeSeason.status === "recruiting" && (
                <Button
                  onClick={() => activateSeason(activeSeason.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Begin Season — Week 1
                </Button>
              )}
            </div>
          ) : (
            <Card className="bg-black/20 border-amber-500/30">
              <CardContent className="p-6 text-center space-y-4">
                <Users className="h-12 w-12 text-amber-400 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  When enough warriors have joined, run the AI draft to form balanced teams.
                </p>
                <Button
                  onClick={handleRunDraft}
                  disabled={draftLoading}
                  className="bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  {draftLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Crown className="h-4 w-4 mr-2" />
                  )}
                  {draftLoading ? "Drafting Teams..." : "Run AI Draft"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ BATTLE SETUP VIEW ═══ */}
      {view === "battle-setup" && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("overview")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-red-300">Battle Setup</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Configure your battle parameters before engaging the enemy
            </p>
          </div>

          {/* Step 1: Choose Topic/Subject */}
          <Card className="bg-black/20 border-violet-500/30">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-semibold text-violet-300 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Step 1: Choose Battle Subject
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {currentTier.topics.map((topicId) => {
                  const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                  return topic ? (
                    <Button
                      key={topicId}
                      variant={battleSetupTopic === topicId ? "default" : "outline"}
                      onClick={() => setBattleSetupTopic(topicId)}
                      className={battleSetupTopic === topicId ? "bg-gradient-to-r from-violet-600 to-fuchsia-600" : "border-violet-500/30"}
                    >
                      {topic.name}
                    </Button>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Choose Offense or Defense */}
          <Card className="bg-black/20 border-blue-500/30">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Step 2: Choose Your Role
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={battleSetupMode === "defense" ? "default" : "outline"}
                  onClick={() => setBattleSetupMode("defense")}
                  className={battleSetupMode === "defense" ? "bg-gradient-to-r from-blue-600 to-cyan-600 h-20 flex-col" : "border-blue-500/30 h-20 flex-col"}
                >
                  <Shield className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Defense Mode</span>
                  <span className="text-xs opacity-70">Defend your faith</span>
                </Button>
                <Button
                  variant={battleSetupMode === "offense" ? "default" : "outline"}
                  onClick={() => setBattleSetupMode("offense")}
                  className={battleSetupMode === "offense" ? "bg-gradient-to-r from-red-600 to-orange-600 h-20 flex-col" : "border-red-500/30 h-20 flex-col"}
                >
                  <Swords className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Offense Mode</span>
                  <span className="text-xs opacity-70">Challenge others</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {battleSetupMode === "defense"
                  ? "Defend biblical truth against opposing arguments"
                  : "Present biblical arguments to persuade others"}
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Select Opponent */}
          <Card className="bg-black/20 border-amber-500/30">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-semibold text-amber-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Step 3: Select Your Opponent
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {DEFENSE_OPPONENTS.slice(0, 8).map((opponent) => (
                  <Button
                    key={opponent.id}
                    variant={battleSetupOpponentId === opponent.id ? "default" : "outline"}
                    onClick={() => setBattleSetupOpponentId(opponent.id)}
                    className={`h-auto py-3 flex-col items-start text-left ${
                      battleSetupOpponentId === opponent.id
                        ? "bg-gradient-to-r from-amber-600 to-red-600"
                        : "border-amber-500/30"
                    }`}
                  >
                    <span className="font-semibold text-sm">{opponent.name}</span>
                    <span className="text-xs opacity-70 line-clamp-2">{opponent.worldview}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {battleSetupOpponentId
                  ? `Facing: ${DEFENSE_OPPONENTS.find(o => o.id === battleSetupOpponentId)?.name}`
                  : "Choose who you'll debate against"}
              </p>
            </CardContent>
          </Card>

          {/* Start Battle Button */}
          <Button
            onClick={() => {
              if (!battleSetupTopic || !battleSetupOpponentId) return;
              handleStartBattle(battleSetupTopic, battleSetupOpponentId, false);
            }}
            disabled={!battleSetupTopic || !battleSetupOpponentId}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 h-14 text-lg"
          >
            {!battleSetupTopic ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Choose a Topic First
              </>
            ) : !battleSetupOpponentId ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Choose an Opponent
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 mr-2" />
                Begin Battle: {DEFENSE_TOPICS.find(t => t.id === battleSetupTopic)?.name}
                {" vs "}
                {DEFENSE_OPPONENTS.find(o => o.id === battleSetupOpponentId)?.name}
              </>
            )}
          </Button>
        </div>
      )}

      {/* ═══ BATTLE VIEW ═══ */}
      {view === "battle" && (
        <div className="space-y-4">
          {currentBattle ? (
            <>
              {/* Battle Header */}
              <Card className="bg-black/20 border-red-500/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Swords className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-bold text-red-300">
                        {currentBattle.battle_type === "boss" ? "BOSS BATTLE" : "Battle"} — Round {battleRounds.length + 1}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-red-500/30 text-xs">
                      vs {DEFENSE_OPPONENTS.find((o) => o.id === currentBattle.opponent_id)?.name || currentBattle.opponent_id}
                    </Badge>
                  </div>

                  {/* Team member rotation */}
                  <div className="flex gap-1.5 mt-2">
                    {teamMembers.map((m, i) => (
                      <Badge
                        key={m.id}
                        className={`text-xs ${
                          i === currentSpeakerIdx
                            ? "bg-violet-600 text-white border-violet-400"
                            : "bg-black/30 text-muted-foreground border-border/30"
                        }`}
                      >
                        {m.display_name}
                        {i === currentSpeakerIdx && " (speaking)"}
                      </Badge>
                    ))}
                  </div>

                  {/* Participation meter */}
                  {participationBalance.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {participationBalance.map((p) => (
                        <div
                          key={p.memberId}
                          className={`flex-1 h-2 rounded-full ${
                            p.status === "carrying" ? "bg-red-500" :
                            p.status === "silent" ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                          title={`${p.name}: ${p.pct}%`}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Battle Messages */}
              <div ref={battleScrollRef} className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {battleMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "disciple" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                        msg.role === "opponent"
                          ? "bg-red-900/30 border border-red-500/30 text-red-100"
                          : msg.role === "disciple"
                          ? "bg-blue-900/30 border border-blue-500/30 text-blue-100"
                          : "bg-amber-900/30 border border-amber-500/30 text-amber-100"
                      }`}>
                        <div className="text-xs font-semibold mb-1 opacity-70">{msg.speaker}</div>
                        <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {battleLoading && (
                  <div className="flex justify-start">
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Weapon Drawer */}
              {teamWeapons.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {teamWeapons.slice(0, 6).map((w: any) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeaponId(selectedWeaponId === w.id ? null : w.id)}
                      className={`shrink-0 px-2 py-1 rounded text-xs border transition-all ${
                        selectedWeaponId === w.id
                          ? "bg-emerald-600/30 border-emerald-400 text-emerald-200"
                          : "bg-black/20 border-border/30 text-muted-foreground hover:border-emerald-500/50"
                      }`}
                    >
                      {w.name || w.topic}
                    </button>
                  ))}
                </div>
              )}

              {/* Battle Input */}
              {!battleLoading && currentBattle.status !== "completed" && (
                <div className="flex gap-2">
                  <Textarea
                    value={battleInput}
                    onChange={(e) => setBattleInput(e.target.value)}
                    placeholder={`${teamMembers[currentSpeakerIdx]?.display_name || "You"}, defend the faith...`}
                    className="bg-black/30 border-violet-500/30 min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleBattleSubmit(); }
                    }}
                  />
                  <Button
                    onClick={handleBattleSubmit}
                    disabled={!battleInput.trim()}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Battle Setup — pick topic and opponent */
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-red-300 text-center">Choose Your Battle</h3>

              {/* Enemy Squad Opponents */}
              {myTeam?.ai_enemy_squad?.opponents && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Your Assigned Opponents</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(myTeam.ai_enemy_squad.opponents as string[]).map((oppId) => {
                      const opp = DEFENSE_OPPONENTS.find((o) => o.id === oppId);
                      if (!opp) return null;
                      return (
                        <Card key={oppId} className="bg-black/20 border-red-500/20 hover:border-red-400/50 transition-all cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{opp.emoji}</span>
                              <div className="flex-1">
                                <div className="font-semibold text-white">{opp.name}</div>
                                <div className="text-xs text-muted-foreground">{opp.description}</div>
                              </div>
                              <div className="space-y-1">
                                {currentTier.topics.slice(0, 2).map((topicId) => {
                                  const topic = DEFENSE_TOPICS.find((t) => t.id === topicId);
                                  return topic ? (
                                    <Button
                                      key={topicId}
                                      size="sm"
                                      variant="outline"
                                      className="text-xs border-red-500/30 hover:bg-red-500/20"
                                      onClick={() => handleStartBattle(topicId, oppId)}
                                    >
                                      {topic.name}
                                    </Button>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Boss Battle (Week 6) */}
              {activeSeason.week_current === 6 && myTeam && (
                <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/50">
                  <CardContent className="p-4 text-center space-y-2">
                    <h4 className="text-lg font-bold text-red-300">BOSS BATTLE</h4>
                    <p className="text-xs text-muted-foreground">
                      All 3 opponents attack simultaneously. Your whole team must defend.
                    </p>
                    <Button
                      onClick={() => handleStartBattle(currentTier.topics[0], myTeam.ai_enemy_squad?.opponents?.[0] || "atheist", true)}
                      className="bg-gradient-to-r from-red-600 to-orange-600"
                    >
                      <Flame className="h-4 w-4 mr-2" />
                      Enter Boss Battle (+300 pts)
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ LEADERBOARD VIEW ═══ */}
      {view === "leaderboard" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-300 text-center flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            Season Rankings
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry, i) => {
              const level = getTeamLevel(entry.total_points);
              const isMyTeam = entry.team_id === myTeam?.id;
              return (
                <motion.div
                  key={entry.team_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`bg-black/20 ${isMyTeam ? "border-violet-500/50 ring-1 ring-violet-500/30" : "border-border/30"}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                        i === 1 ? "bg-gray-400/20 text-gray-300" :
                        i === 2 ? "bg-amber-700/20 text-amber-500" :
                        "bg-black/30 text-muted-foreground"
                      }`}>
                        {entry.rank}
                      </div>
                      <span className="text-xl">{entry.team_avatar_emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{entry.team_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {level.emoji} {level.label}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-violet-300">{entry.total_points}</div>
                        <div className="text-[10px] text-muted-foreground">pts</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {leaderboard.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">
                No teams yet. Complete battles to see rankings!
              </p>
            )}
          </div>

          {/* Scoring Guide */}
          <Card className="bg-black/20 border-border/30">
            <CardContent className="p-4 space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Scoring Guide
              </h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-green-400">Battle Win: +{SCORING.battleWin}</div>
                <div className="text-green-400">Boss Victory: +{SCORING.bossVictory}</div>
                <div className="text-blue-400">Weapon Forged: +{SCORING.weaponForged}</div>
                <div className="text-blue-400">Weapon Used: +{SCORING.weaponUsedInBattle}</div>
                <div className="text-amber-400">Balanced Team: +{SCORING.participationBonus}</div>
                <div className="text-amber-400">Perfect Week: +{SCORING.perfectWeek}</div>
                <div className="text-red-400">Carry Penalty: {SCORING.carryPenalty}</div>
                <div className="text-red-400">Member Absent: {SCORING.memberAbsent}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ PREP VIEW ═══ */}
      {view === "prep" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-300 text-center">Prepare for Battle</h3>

          <div className="grid grid-cols-1 gap-3">
            {/* Forge Weapon Link */}
            <Card className="bg-black/20 border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <FlaskConical className="h-8 w-8 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-white">Forge New Weapons</h4>
                  <p className="text-xs text-muted-foreground">
                    Create theological arguments and add them to your team arsenal. +{SCORING.weaponForged} pts each!
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>

            {/* Arsenal Link */}
            <Card className="bg-black/20 border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Warehouse className="h-8 w-8 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-white">Team Arsenal ({teamWeapons.length} weapons)</h4>
                  <p className="text-xs text-muted-foreground">
                    Review your team's combined weapons. Deploy them in battle for +{SCORING.weaponUsedInBattle} pts.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>

            {/* 3AM Library Link */}
            <Card className="bg-black/20 border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-white">3AM Library</h4>
                  <p className="text-xs text-muted-foreground">
                    Research doctrines using interdenominational confessional witnesses.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>

            {/* Study the Enemy */}
            {myTeam?.ai_enemy_squad && (
              <Card className="bg-black/20 border-red-500/30">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold text-red-300 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Study the Enemy
                  </h4>
                  {(myTeam.ai_enemy_squad.opponents || []).map((oppId: string) => {
                    const opp = DEFENSE_OPPONENTS.find((o) => o.id === oppId);
                    if (!opp) return null;
                    return (
                      <div key={oppId} className="bg-black/30 rounded p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opp.emoji}</span>
                          <span className="font-semibold text-white text-sm">{opp.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{opp.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {opp.attackTargets.slice(0, 3).map((target, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-red-500/30 text-red-300">
                              {target}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Difficulty Preview */}
            <Card className="bg-black/20 border-violet-500/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-violet-300">6-Week Progression</h4>
                {DIFFICULTY_TIERS.map((tier) => (
                  <div
                    key={tier.tier}
                    className={`flex items-center gap-2 text-xs p-2 rounded ${
                      tier.tier === currentTier.tier ? "bg-violet-600/20 border border-violet-500/30" : "opacity-60"
                    }`}
                  >
                    <span className="font-bold w-16">Wk {tier.weeks.join("-")}</span>
                    <span className={tier.tier === currentTier.tier ? "text-violet-300" : "text-muted-foreground"}>
                      {tier.label}
                    </span>
                    {tier.tier === currentTier.tier && (
                      <Badge className="bg-violet-600/50 text-violet-200 text-[10px] ml-auto">CURRENT</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
