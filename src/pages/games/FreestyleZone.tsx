import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Zap, SkipForward, Send, Trophy,
  BookOpen, Sparkles, FileText, ChevronRight, ChevronDown, ChevronUp, Loader2,
  Play, Flame, Target, Crown, Eye, Swords, HelpCircle, Lightbulb, History, X,
  Users, Plus, Minus, Link2, Unlink, ShieldCheck, AlertTriangle,
  Shapes, Lock, ArrowLeftRight, Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  useFreestyleZone,
  CATEGORY_CONFIG,
  DIFFICULTY_CONFIG,
  type Difficulty,
  type DropCategory,
  type DropFocus,
  type FreestyleMode,
  type FactCheckResult,
  type VerseStormDrop,
  type TrinityDrop,
  type ConstraintDrop,
  type OppositesDrop,
  type TargetDrop,
  type PalaceRoomDrop,
} from "@/hooks/useFreestyleZone";

// ── Saved Session Types ────────────────────────────────────────────────

interface SavedSessionRow {
  id: string;
  score: number;
  metadata: {
    difficulty?: string;
    dropFocus?: string;
    totalDrops?: number;
    passCount?: number;
    duration?: number;
    drops?: Array<{ category: string; drop: string }>;
    responses?: string[];
    scores?: Array<{ christConnection: number; depth: number; creativity: number; chainLink: number; totalScore: number; feedback: string }>;
    freestyleMode?: FreestyleMode;
    polishedContent?: { title: string; content: string; keyVerses: string[]; format: string };
    players?: string[];
    playerResponses?: number[];
  };
  created_at: string;
}

const PLAYER_COLORS = [
  { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/40", light: "bg-blue-500/10" },
  { bg: "bg-green-500", text: "text-green-600 dark:text-green-400", border: "border-green-500/40", light: "bg-green-500/10" },
  { bg: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/40", light: "bg-purple-500/10" },
  { bg: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/40", light: "bg-orange-500/10" },
  { bg: "bg-pink-500", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/40", light: "bg-pink-500/10" },
  { bg: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/40", light: "bg-teal-500/10" },
  { bg: "bg-red-500", text: "text-red-600 dark:text-red-400", border: "border-red-500/40", light: "bg-red-500/10" },
  { bg: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/40", light: "bg-indigo-500/10" },
];

// ── Past Sessions Viewer ───────────────────────────────────────────────

function PastSessionDetail({ session, onClose }: { session: SavedSessionRow; onClose: () => void }) {
  const meta = session.metadata;
  const drops = meta.drops || [];
  const responses = meta.responses || [];
  const scores = meta.scores || [];
  const polished = meta.polishedContent;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Sessions
        </Button>
        <Badge variant="outline" className="font-mono">{session.score}/100</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Session — {new Date(session.created_at).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Difficulty: <Badge variant="outline" className="ml-1">{meta.difficulty || "beginner"}</Badge></p>
          <p>Category: {meta.dropFocus || "Random Mix"} · Mode: {meta.freestyleMode === "partial" ? "Partial" : "Whole"} Freestyle</p>
          <p>Drops: {meta.totalDrops || drops.length} | Answered: {responses.filter(r => r && !r.startsWith("[Jeeves")).length} | Passes: {meta.passCount || 0}</p>
          {meta.duration && <p>Duration: {Math.round(meta.duration / 60)} min</p>}
          {meta.players && meta.players.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <p className="font-medium text-foreground flex items-center gap-1 mb-2">
                <Users className="h-3.5 w-3.5" /> Multiplayer — {meta.players.length} Players
              </p>
              <div className="grid grid-cols-2 gap-2">
                {meta.players.map((name, pi) => {
                  const color = PLAYER_COLORS[pi % PLAYER_COLORS.length];
                  const playerDropIndices = (meta.playerResponses || [])
                    .map((pIdx, di) => pIdx === pi ? di : -1)
                    .filter(di => di >= 0);
                  const playerScores = playerDropIndices
                    .map(di => scores[di])
                    .filter(s => s && s.totalScore > 0);
                  const avg = playerScores.length > 0
                    ? Math.round(playerScores.reduce((sum, s) => sum + s.totalScore, 0) / playerScores.length)
                    : 0;
                  return (
                    <div key={pi} className={`p-2 rounded-lg ${color.light} ${color.border} border`}>
                      <p className={`font-semibold text-xs ${color.text}`}>{name}</p>
                      <p className="text-[10px]">{playerDropIndices.length} drops · Avg: {avg}/40</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drops & Responses */}
      {drops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Drops & Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
            {drops.map((drop, i) => (
              <div key={i} className="border-b border-border/40 pb-3 last:border-0">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-[10px] shrink-0">#{i + 1}</Badge>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">[{drop.category}] {drop.drop}</p>
                    {meta.players && meta.playerResponses && meta.playerResponses[i] !== undefined && (
                      <Badge variant="outline" className={`text-[10px] ${PLAYER_COLORS[meta.playerResponses[i] % PLAYER_COLORS.length].text}`}>
                        {meta.players[meta.playerResponses[i]]}
                      </Badge>
                    )}
                    {responses[i] ? (
                      <p className="text-sm text-muted-foreground">{responses[i]}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Passed</p>
                    )}
                    {scores[i] && (
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        <span>Christ: {scores[i].christConnection}</span>
                        <span>Depth: {scores[i].depth}</span>
                        <span>Creative: {scores[i].creativity}</span>
                        <span>Chain: {scores[i].chainLink}</span>
                        <span className="font-bold">{scores[i].totalScore}/40</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Polished Content */}
      {polished && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" /> {polished.title}
              <Badge variant="outline" className="text-[10px] ml-auto">{polished.format}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
              {polished.content}
            </div>
            {polished.keyVerses?.length > 0 && (
              <p className="text-xs text-muted-foreground">Key verses: {polished.keyVerses.join(", ")}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(polished.content)}
            >
              Copy Content
            </Button>
          </CardContent>
        </Card>
      )}

      {!polished && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            No polished content saved for this session.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PastSessionsList({ sessions, onSelect }: { sessions: SavedSessionRow[]; onSelect: (s: SavedSessionRow) => void }) {
  if (sessions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No saved sessions yet. Complete a freestyle game to see it here!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((s) => {
        const meta = s.metadata;
        return (
          <Card
            key={s.id}
            className="cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={() => onSelect(s)}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[44px]">
                  <p className="text-lg font-bold text-primary">{s.score}</p>
                  <p className="text-[10px] text-muted-foreground">/100</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {new Date(s.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div className="flex gap-2 text-[10px] text-muted-foreground">
                    <span>{meta.difficulty || "beginner"}</span>
                    <span>{meta.totalDrops || 0} drops</span>
                    {meta.duration && <span>{Math.round(meta.duration / 60)}m</span>}
                    {meta.freestyleMode === "partial" && (
                      <Badge variant="outline" className="text-[8px] px-1 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400">Partial</Badge>
                    )}
                    {meta.players && meta.players.length > 0 && (
                      <Badge variant="outline" className="text-[8px] px-1 py-0 border-blue-500/30 text-blue-600 dark:text-blue-400">
                        <Users className="h-2.5 w-2.5 mr-0.5" />{meta.players.length}P
                      </Badge>
                    )}
                    {meta.polishedContent && <Badge variant="outline" className="text-[8px] px-1 py-0">Polished</Badge>}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Setup Phase ────────────────────────────────────────────────────────

const DROP_FOCUS_OPTIONS: { value: DropFocus; label: string; icon: string; description: string }[] = [
  { value: "random", label: "Random Mix", icon: "🎲", description: "A diverse mix of all categories" },
  { value: "scripture", label: "Scripture", icon: "📖", description: "Bible verses, parables, events, and characters" },
  { value: "nature", label: "Nature", icon: "🌿", description: "Natural world phenomena, animals, and landscapes" },
  { value: "everyday", label: "Everyday Life", icon: "🏠", description: "Ordinary experiences, memories, and objects" },
  { value: "history", label: "History", icon: "🏛️", description: "Historical events, people, and movements" },
  { value: "human_experience", label: "Human Experience", icon: "💭", description: "Emotions, relationships, and universal moments" },
  { value: "symbolic", label: "Symbolic", icon: "🔮", description: "Symbols, archetypes, and abstract concepts" },
];

function SetupScreen({ onStart, hasExisting, onResume, onAbandon, pastSessions, onViewSession }: {
  onStart: (d: Difficulty, focus: DropFocus, players: string[], freestyleMode: FreestyleMode) => void;
  hasExisting: boolean;
  onResume: () => void;
  onAbandon: () => void;
  pastSessions: SavedSessionRow[];
  onViewSession: (s: SavedSessionRow) => void;
}) {
  const [selectedFocus, setSelectedFocus] = useState<DropFocus>("random");
  const [selectedMode, setSelectedMode] = useState<FreestyleMode>("whole");
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "master"];
  const icons = [Play, Target, Swords, Crown];

  const addPlayer = () => {
    if (playerNames.length < 8) setPlayerNames([...playerNames, ""]);
  };
  const removePlayer = (index: number) => {
    if (playerNames.length > 2) setPlayerNames(playerNames.filter((_, i) => i !== index));
  };
  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };
  const validPlayers = playerNames.filter(n => n.trim());

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent rounded-full blur-2xl scale-150" />
          <Flame className="h-16 w-16 text-orange-500 relative animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          The Freestyler Training Zone
        </h1>
        <p className="text-muted-foreground text-lg">
          Train your theological reflexes. Connect random drops to Christ. Build chains under pressure.
        </p>
      </div>

      {hasExisting && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">You have an active session</p>
              <p className="text-sm text-muted-foreground">Pick up where you left off, or start fresh</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={onAbandon}>Start Fresh</Button>
              <Button onClick={onResume}>Resume</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" /> How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
            <p>Jeeves presents a random <strong>"drop"</strong> — a verse, natural phenomenon, historical event, or everyday moment.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
            <p>You connect it to <strong>Christ</strong> — and ideally to previous drops, building a chain.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
            <p>Jeeves evaluates your connection on 4 dimensions: Christ connection, depth, creativity, and chain linking.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">4</span>
            <p>You can <strong>PASS</strong> any drop (momentum penalty), and sessions last up to <strong>60 minutes</strong>.</p>
          </div>
        </CardContent>
      </Card>

      {/* Freestyle Mode Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Link2 className="h-5 w-5 text-purple-500" />
          Freestyle Mode
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { mode: "partial" as FreestyleMode, icon: Unlink, color: "text-amber-500", label: "Partial", desc: "Each drop stands alone" },
            { mode: "whole" as FreestyleMode, icon: Link2, color: "text-purple-500", label: "Whole", desc: "Chain-link your responses" },
            { mode: "verse_storm" as FreestyleMode, icon: Zap, color: "text-orange-500", label: "Verse Storm", desc: "Verse + 10-15 objects, beat the clock" },
            { mode: "trinity_drop" as FreestyleMode, icon: Shapes, color: "text-teal-500", label: "Trinity Drop", desc: "Object + Concept + Action" },
            { mode: "constraint" as FreestyleMode, icon: Lock, color: "text-rose-500", label: "Constraint", desc: "Freestyle with a restriction" },
            { mode: "opposites" as FreestyleMode, icon: ArrowLeftRight, color: "text-red-500", label: "Opposites", desc: "Tension pairs, connect both sides" },
            { mode: "target" as FreestyleMode, icon: Target, color: "text-blue-500", label: "Target", desc: "Apply a verse to a specific person" },
            { mode: "palace_room" as FreestyleMode, icon: Building2, color: "text-violet-500", label: "Palace Room", desc: "Interpret through a PT room lens" },
          ] as const).map(({ mode: m, icon: Icon, color, label, desc }) => (
            <Card
              key={m}
              className={`cursor-pointer transition-all ${
                selectedMode === m
                  ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                  : "hover:border-primary/40 hover:bg-primary/5"
              }`}
              onClick={() => setSelectedMode(m)}
            >
              <CardContent className="p-3 space-y-1.5 text-center">
                <Icon className={`h-6 w-6 mx-auto ${color}`} />
                <p className="font-semibold text-xs">{label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Players Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Players
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant={isMultiplayer ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setIsMultiplayer(!isMultiplayer)}
              >
                {isMultiplayer ? "Multiplayer" : "Solo"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        {isMultiplayer && (
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add 2-8 players. Everyone takes turns on the same device — round-robin style.
            </p>
            <div className="space-y-2">
              {playerNames.map((name, i) => {
                const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color.bg} shrink-0`} />
                    <Input
                      value={name}
                      onChange={(e) => updatePlayerName(i, e.target.value)}
                      placeholder={`Player ${i + 1}`}
                      className="h-8 text-sm"
                    />
                    {playerNames.length > 2 && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => removePlayer(i)}>
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            {playerNames.length < 8 && (
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={addPlayer}>
                <Plus className="h-3.5 w-3.5" /> Add Player
              </Button>
            )}
            {isMultiplayer && validPlayers.length < 2 && (
              <p className="text-xs text-muted-foreground">Add player names now, or start and let others join later.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Drop Category Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Choose Your Drop Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {DROP_FOCUS_OPTIONS.map((opt) => (
            <Card
              key={opt.value}
              className={`cursor-pointer transition-all text-center ${
                selectedFocus === opt.value
                  ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                  : "hover:border-primary/40 hover:bg-primary/5"
              }`}
              onClick={() => setSelectedFocus(opt.value)}
            >
              <CardContent className="p-3 space-y-1">
                <span className="text-2xl">{opt.icon}</span>
                <p className="text-xs font-semibold">{opt.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {DROP_FOCUS_OPTIONS.find(o => o.value === selectedFocus)?.description}
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Choose Your Fire Level
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {difficulties.map((diff, i) => {
            const config = DIFFICULTY_CONFIG[diff];
            const Icon = icons[i];
            const fireColors = [
              "hover:border-green-500/50 hover:shadow-green-500/10",
              "hover:border-yellow-500/50 hover:shadow-yellow-500/10",
              "hover:border-orange-500/50 hover:shadow-orange-500/10",
              "hover:border-red-500/50 hover:shadow-red-500/10",
            ];
            const flameCount = i + 1;
            return (
              <motion.div
                key={diff}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all shadow-md hover:shadow-lg ${fireColors[i]}`}
                  onClick={() => onStart(diff, selectedFocus, isMultiplayer ? validPlayers : [], selectedMode)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <span className="text-sm" title={`${flameCount} fire${flameCount > 1 ? 's' : ''}`}>
                        {"🔥".repeat(flameCount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Past Sessions
          </h2>
          <PastSessionsList sessions={pastSessions} onSelect={onViewSession} />
        </div>
      )}
    </div>
  );
}

// ── Active Session ─────────────────────────────────────────────────────

function ActiveSession({
  gameState, currentDrop, currentDropIndex, currentFeedback, timeRemaining,
  momentum, isGeneratingDrop, isEvaluating, isAskingJeeves, jeevesAssist,
  onSubmit, onPass, onNext, onEnd, onAskJeeves, onSubmitStorm,
  players, currentPlayerIndex, pendingStormAutoSubmitRef,
}: {
  gameState: ReturnType<typeof useFreestyleZone>["gameState"];
  currentDrop: ReturnType<typeof useFreestyleZone>["currentDrop"];
  currentDropIndex: number;
  currentFeedback: ReturnType<typeof useFreestyleZone>["currentFeedback"];
  timeRemaining: number;
  momentum: number;
  isGeneratingDrop: boolean;
  isEvaluating: boolean;
  isAskingJeeves: boolean;
  jeevesAssist: string | null;
  onSubmit: (response: string) => void;
  onSubmitStorm: (response: string) => void;
  onPass: () => void;
  onNext: () => void;
  onEnd: () => void;
  onAskJeeves: () => void;
  players: string[];
  currentPlayerIndex: number;
  pendingStormAutoSubmitRef: React.MutableRefObject<boolean>;
}) {
  const [input, setInput] = useState("");
  const [showChainHistory, setShowChainHistory] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSubmitted = currentFeedback !== null;
  const isStorm = gameState.freestyleMode === "verse_storm";
  const stormDrop = gameState.verseStormDrop;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Storm auto-submit when timer hits 0
  useEffect(() => {
    if (pendingStormAutoSubmitRef.current && isStorm && !hasSubmitted && !isEvaluating) {
      pendingStormAutoSubmitRef.current = false;
      const text = input.trim() || "(Time expired — no response)";
      onSubmitStorm(text);
      setInput("");
    }
  }, [gameState.stormTimeRemaining, isStorm, hasSubmitted, isEvaluating]);

  const handleSubmit = () => {
    if (!input.trim() || isEvaluating) return;
    if (isStorm) {
      onSubmitStorm(input.trim());
    } else {
      onSubmit(input.trim());
    }
    setInput("");
  };

  const handleNext = () => {
    onNext();
  };

  // Focus textarea when new drop arrives
  useEffect(() => {
    if (currentDrop && !hasSubmitted) {
      textareaRef.current?.focus();
    }
  }, [currentDrop, hasSubmitted]);

  // Momentum glow color — fire-themed
  const getGlowColor = () => {
    if (momentum >= 80) return "shadow-lg shadow-orange-500/30 border-orange-400/40";
    if (momentum >= 60) return "shadow-lg shadow-yellow-500/20 border-yellow-400/30";
    if (momentum >= 40) return "shadow-md shadow-amber-500/20 border-amber-400/20";
    return "shadow-md shadow-red-500/20 border-red-400/20";
  };

  const catConfig = currentDrop ? CATEGORY_CONFIG[currentDrop.category] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Flame className={`h-4 w-4 ${momentum >= 70 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
            <Badge variant="outline" className={DIFFICULTY_CONFIG[gameState.difficulty].color}>
              {DIFFICULTY_CONFIG[gameState.difficulty].label}
            </Badge>
          </div>
          {gameState.dropFocus && gameState.dropFocus !== "random" && (
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400">
              {DROP_FOCUS_OPTIONS.find(o => o.value === gameState.dropFocus)?.icon} {DROP_FOCUS_OPTIONS.find(o => o.value === gameState.dropFocus)?.label}
            </Badge>
          )}
          <Badge variant="outline" className={`text-[10px] ${
            gameState.freestyleMode === "partial" ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
            : gameState.freestyleMode === "verse_storm" ? "border-orange-500/30 text-orange-600 dark:text-orange-400"
            : gameState.freestyleMode === "trinity_drop" ? "border-teal-500/30 text-teal-600 dark:text-teal-400"
            : gameState.freestyleMode === "constraint" ? "border-rose-500/30 text-rose-600 dark:text-rose-400"
            : gameState.freestyleMode === "opposites" ? "border-red-500/30 text-red-600 dark:text-red-400"
            : gameState.freestyleMode === "target" ? "border-blue-500/30 text-blue-600 dark:text-blue-400"
            : gameState.freestyleMode === "palace_room" ? "border-violet-500/30 text-violet-600 dark:text-violet-400"
            : "border-purple-500/30 text-purple-600 dark:text-purple-400"
          }`}>
            {{ partial: "Partial", whole: "Whole", verse_storm: "Storm", trinity_drop: "Trinity", constraint: "Constraint", opposites: "Opposites", target: "Target", palace_room: "Palace" }[gameState.freestyleMode]}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            Drop #{currentDropIndex + 1}
          </Badge>
          {players.length > 0 && (
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Users className="h-2.5 w-2.5 mr-0.5" />{players.length}P
            </Badge>
          )}
          {/* Streak indicator */}
          {gameState.consecutivePasses === 0 && gameState.scores.length > 0 && (
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px]">
              {gameState.scores.length - gameState.passCount} streak
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 text-sm font-mono px-2 py-1 rounded-md ${
            timeRemaining < 300
              ? "text-red-500 bg-red-500/10 animate-pulse"
              : timeRemaining < 600
              ? "text-amber-500 bg-amber-500/10"
              : "text-muted-foreground bg-muted/50"
          }`}>
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeRemaining)}
          </div>

          <Button variant="outline" size="sm" onClick={onEnd}>
            End Session
          </Button>
        </div>
      </div>

      {/* Momentum Bar — fire gradient */}
      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: momentum >= 80
              ? "linear-gradient(90deg, #f97316, #ef4444, #f59e0b)"
              : momentum >= 60
              ? "linear-gradient(90deg, #f97316, #eab308)"
              : momentum >= 40
              ? "linear-gradient(90deg, #eab308, #d97706)"
              : "linear-gradient(90deg, #dc2626, #991b1b)",
          }}
          animate={{ width: `${momentum}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {momentum >= 70 && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full opacity-50"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
            animate={{ width: `${momentum}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Flame className={`h-3 w-3 ${momentum >= 70 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          {momentum >= 80 ? "On Fire!" : momentum >= 60 ? "Heating Up" : momentum >= 40 ? "Warming" : "Cold"}
        </span>
        <span>{Math.round(momentum)}%</span>
      </div>

      {/* Current Player Indicator */}
      {players.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayerIndex}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`${PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length].border} ${PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length].light}`}>
              <CardContent className="p-3 flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length].bg}`} />
                <span className={`font-bold ${PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length].text}`}>
                  {players[currentPlayerIndex]}'s Turn
                </span>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Chain History — full previous answers */}
      {gameState.drops.length > 1 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowChainHistory(!showChainHistory)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Your Chain ({gameState.drops.length - 1} previous)</span>
            {showChainHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <AnimatePresence>
            {showChainHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                  {gameState.drops.slice(0, -1).map((d, i) => {
                    const cat = CATEGORY_CONFIG[d.category];
                    const wasPassed = gameState.userResponses[i] === "";
                    const response = gameState.userResponses[i];
                    const scores = gameState.scores[i];
                    return (
                      <Card key={i} className={`${wasPassed ? "opacity-50" : ""} border-border/40`}>
                        <CardContent className="p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Badge className={`${cat.color} text-white text-[10px] px-1.5 py-0`}>{cat.emoji} {cat.label}</Badge>
                            <span className="text-[10px] text-muted-foreground">Drop #{i + 1}</span>
                            {players.length > 0 && gameState.playerResponses[i] !== undefined && (
                              <Badge variant="outline" className={`text-[10px] px-1 py-0 ${PLAYER_COLORS[gameState.playerResponses[i] % PLAYER_COLORS.length].text}`}>
                                {players[gameState.playerResponses[i]]}
                              </Badge>
                            )}
                            {wasPassed && <Badge variant="outline" className="text-[10px] px-1 py-0">PASSED</Badge>}
                            {scores && (
                              <span className="ml-auto text-[10px] font-mono font-bold text-foreground">{scores.totalScore}/40</span>
                            )}
                          </div>
                          <p className="text-xs font-medium">{d.drop}</p>
                          {!wasPassed && response && (
                            <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-2">{response}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact breadcrumb when collapsed */}
          {!showChainHistory && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {gameState.drops.slice(0, -1).map((d, i) => {
                const cat = CATEGORY_CONFIG[d.category];
                const wasPassed = gameState.userResponses[i] === "";
                return (
                  <div
                    key={i}
                    className={`shrink-0 text-xs px-2 py-1 rounded-full ${wasPassed ? "bg-muted text-muted-foreground line-through" : "bg-primary/10 text-primary"}`}
                    title={d.drop}
                  >
                    {cat.emoji} {i + 1}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Drop Card — mode-specific rendering */}
      <AnimatePresence mode="wait">
        {isGeneratingDrop ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-dashed border-orange-500/30">
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <div className="relative">
                  <Flame className="h-10 w-10 text-orange-500/50 animate-pulse" />
                  <Loader2 className="h-5 w-5 animate-spin text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {isStorm ? "Jeeves is building your storm..." : "Jeeves is preparing your next drop..."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : isStorm && stormDrop ? (
          /* ── Verse Storm Card ── */
          <motion.div
            key={`storm-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {/* Storm Countdown Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold ${
                    gameState.stormTimeRemaining <= 30 ? "text-red-500 animate-pulse" :
                    gameState.stormTimeRemaining <= 60 ? "text-amber-500" : "text-green-500"
                  }`}>
                    {gameState.stormTimeRemaining <= 0 ? "TIME'S UP" : formatTime(gameState.stormTimeRemaining)}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-orange-500" /> Verse Storm
                  </span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      gameState.stormTimeRemaining <= 30 ? "animate-pulse" : ""
                    }`}
                    style={{
                      background: gameState.stormTimeRemaining <= 30
                        ? "linear-gradient(90deg, #ef4444, #dc2626)"
                        : gameState.stormTimeRemaining <= 60
                        ? "linear-gradient(90deg, #f59e0b, #d97706)"
                        : "linear-gradient(90deg, #22c55e, #16a34a)",
                    }}
                    animate={{
                      width: `${(gameState.stormTimeRemaining / (
                        gameState.difficulty === "beginner" ? 300 :
                        gameState.difficulty === "intermediate" ? 240 :
                        gameState.difficulty === "advanced" ? 180 : 120
                      )) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
                <CardContent className="p-6 space-y-4">
                  {/* Verse Block */}
                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-500/5 rounded-r-lg">
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{stormDrop.verse}</p>
                    <p className="text-sm leading-relaxed mt-1 italic">{stormDrop.verseText}</p>
                  </div>

                  {/* Object Grid */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Connect as many as you can:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {stormDrop.objects.map((obj, i) => {
                        const colors = ["bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
                          "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
                          "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
                          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
                          "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"];
                        return (
                          <Badge key={i} variant="outline" className={`text-xs px-2 py-1 justify-center ${colors[i % colors.length]}`}>
                            {obj}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : gameState.freestyleMode === "trinity_drop" && gameState.trinityDrop ? (
          /* ── Trinity Drop Card ── */
          <motion.div
            key={`trinity-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-teal-500 text-white"><Shapes className="h-3 w-3 mr-1" /> Trinity Drop</Badge>
                <div className="flex items-center gap-3 text-center">
                  <div className="flex-1 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <p className="text-[10px] text-muted-foreground">Object</p>
                    <p className="font-semibold text-sm">{gameState.trinityDrop.object}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <p className="text-[10px] text-muted-foreground">Concept</p>
                    <p className="font-semibold text-sm">{gameState.trinityDrop.concept}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <p className="text-[10px] text-muted-foreground">Action</p>
                    <p className="font-semibold text-sm">{gameState.trinityDrop.action}</p>
                  </div>
                </div>
                {gameState.trinityDrop.verse && (
                  <div className="border-l-4 border-teal-500/40 pl-3 py-1">
                    <p className="text-xs font-medium text-teal-600 dark:text-teal-400">{gameState.trinityDrop.verse}</p>
                    {gameState.trinityDrop.verseText && <p className="text-xs italic text-muted-foreground">{gameState.trinityDrop.verseText}</p>}
                  </div>
                )}
                {gameState.trinityDrop.hint && gameState.difficulty === "beginner" && (
                  <p className="text-sm text-muted-foreground italic">Hint: {gameState.trinityDrop.hint}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : gameState.freestyleMode === "constraint" && gameState.constraintDrop ? (
          /* ── Constraint Card ── */
          <motion.div
            key={`constraint-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-rose-500 text-white"><Lock className="h-3 w-3 mr-1" /> Constraint</Badge>
                <div className="border-l-4 border-rose-500/40 pl-3 py-2 bg-rose-500/5 rounded-r-lg">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{gameState.constraintDrop.verse}</p>
                  <p className="text-sm italic mt-1">{gameState.constraintDrop.verseText}</p>
                </div>
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
                  <p className="text-[10px] text-muted-foreground">Constraint</p>
                  <p className="font-bold text-sm text-rose-600 dark:text-rose-400">{gameState.constraintDrop.constraint}</p>
                </div>
                <p className="text-xl font-medium">{gameState.constraintDrop.drop}</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : gameState.freestyleMode === "opposites" && gameState.oppositesDrop ? (
          /* ── Opposites Card ── */
          <motion.div
            key={`opposites-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-red-500 text-white"><ArrowLeftRight className="h-3 w-3 mr-1" /> Opposites</Badge>
                <div className="border-l-4 border-red-500/40 pl-3 py-2">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{gameState.oppositesDrop.verse}</p>
                  <p className="text-sm italic mt-1">{gameState.oppositesDrop.verseText}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                    <p className="font-bold text-lg">{gameState.oppositesDrop.pair[0]}</p>
                  </div>
                  <span className="text-muted-foreground font-bold text-sm shrink-0">vs</span>
                  <div className="flex-1 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                    <p className="font-bold text-lg">{gameState.oppositesDrop.pair[1]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : gameState.freestyleMode === "target" && gameState.targetDrop ? (
          /* ── Target Card ── */
          <motion.div
            key={`target-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-blue-500 text-white"><Target className="h-3 w-3 mr-1" /> Target</Badge>
                <div className="border-l-4 border-blue-500/40 pl-3 py-2">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{gameState.targetDrop.verse}</p>
                  <p className="text-sm italic mt-1">{gameState.targetDrop.verseText}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎯</span>
                    <p className="font-bold">{gameState.targetDrop.targetPerson}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{gameState.targetDrop.targetDescription}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : gameState.freestyleMode === "palace_room" && gameState.palaceRoomDrop ? (
          /* ── Palace Room Card ── */
          <motion.div
            key={`palace-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-violet-500 text-white"><Building2 className="h-3 w-3 mr-1" /> Palace Room</Badge>
                <div className="border-l-4 border-violet-500/40 pl-3 py-2">
                  <p className="text-sm font-bold text-violet-600 dark:text-violet-400">{gameState.palaceRoomDrop.verse}</p>
                  <p className="text-sm italic mt-1">{gameState.palaceRoomDrop.verseText}</p>
                </div>
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-violet-500 shrink-0" />
                  <div>
                    <p className="font-bold">{gameState.palaceRoomDrop.roomName}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 border-violet-500/30 text-violet-600 dark:text-violet-400">
                      {gameState.palaceRoomDrop.roomCode}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : currentDrop ? (
          /* ── Standard Drop Card (Partial / Whole) ── */
          <motion.div
            key={`drop-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-3">
                {catConfig && (
                  <Badge className={`${catConfig.color} text-white`}>
                    {catConfig.emoji} {catConfig.label}
                  </Badge>
                )}
                <p className="text-xl font-medium leading-relaxed">
                  {currentDrop.drop}
                </p>
                {currentDrop.hint && gameState.difficulty === "beginner" && (
                  <p className="text-sm text-muted-foreground italic">
                    Hint: {currentDrop.hint}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Response Area */}
      {!hasSubmitted ? (
        <div className="space-y-3">
          {/* Jeeves Assist Display */}
          <AnimatePresence>
            {jeevesAssist && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Jeeves Shows the Way</span>
                    </div>
                    <p className="text-sm leading-relaxed">{jeevesAssist}</p>
                    <p className="text-xs text-muted-foreground italic">Next drop loading automatically...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isStorm ? "Connect as many objects as you can to this verse..."
              : gameState.freestyleMode === "trinity_drop" ? "Weave the object, concept, and action together through Christ..."
              : gameState.freestyleMode === "constraint" ? "Freestyle within the constraint — connect the drop to Christ..."
              : gameState.freestyleMode === "opposites" ? "How do both sides of this tension point to Christ?"
              : gameState.freestyleMode === "target" ? "How would you explain this verse to this person?"
              : gameState.freestyleMode === "palace_room" ? "Interpret this verse through the lens of this palace room..."
              : gameState.freestyleMode === "partial" ? "Connect this drop to Christ... How does it point to Him?"
              : "Connect this drop to Christ... How does it point to Him? Can you link it to previous drops?"
            }
            className="min-h-[120px] resize-none"
            disabled={isEvaluating || isGeneratingDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPass}
                disabled={isEvaluating || isGeneratingDrop || isAskingJeeves}
                className="gap-1"
              >
                <SkipForward className="h-4 w-4" /> PASS
              </Button>
              <Button
                variant="outline"
                onClick={onAskJeeves}
                disabled={isEvaluating || isGeneratingDrop || isAskingJeeves || !!jeevesAssist}
                className="gap-1 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
              >
                {isAskingJeeves ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Jeeves is freestyling...</>
                ) : jeevesAssist ? (
                  <><Lightbulb className="h-4 w-4" /> Jeeves Freestyled</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Jeeves! Freestyle!</>
                )}
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isEvaluating || isGeneratingDrop}
              className="gap-1"
            >
              {isEvaluating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</>
              ) : (
                <><Send className="h-4 w-4" /> Submit (Cmd+Enter)</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Feedback Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5">
            <CardContent className="p-4 space-y-3">
              {/* Score Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className={`h-5 w-5 ${currentFeedback.totalScore >= 30 ? 'text-orange-500' : currentFeedback.totalScore >= 20 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <span className="text-lg font-bold font-mono">{currentFeedback.totalScore}/40</span>
                </div>
                {currentFeedback.totalScore >= 35 && (
                  <Badge className="bg-orange-500 text-white animate-pulse">Blazing!</Badge>
                )}
                {currentFeedback.totalScore >= 28 && currentFeedback.totalScore < 35 && (
                  <Badge className="bg-yellow-500 text-white">Strong</Badge>
                )}
              </div>

              {/* Storm: Objects Connected Count */}
              {isStorm && (currentFeedback as any).objectsConnected !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="font-mono font-bold">
                    Connected {(currentFeedback as any).objectsConnected}/{(currentFeedback as any).totalObjects || "?"} objects
                  </span>
                </div>
              )}

              {/* Score Bars */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Christ Connection", value: currentFeedback.christConnection, emoji: "✝️" },
                  { label: "Depth", value: currentFeedback.depth, emoji: "🔍" },
                  { label: "Creativity", value: currentFeedback.creativity, emoji: "💡" },
                  ...(gameState.freestyleMode === "whole" ? [{ label: "Chain Link", value: currentFeedback.chainLink, emoji: "🔗" }] : []),
                  ...(isStorm && (currentFeedback as any).objectsConnected !== undefined ? [{ label: "Objects Connected", value: (currentFeedback as any).objectsConnected, emoji: "🎯" }] : []),
                ].map(({ label, value, emoji }, idx) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">{emoji} {label}</span>
                      <span className="font-mono font-bold text-xs">{value}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: value >= 8
                            ? "linear-gradient(90deg, #f97316, #ef4444)"
                            : value >= 5
                            ? "linear-gradient(90deg, #eab308, #f97316)"
                            : "linear-gradient(90deg, #6b7280, #9ca3af)"
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${value * 10}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-orange-500/10">
                <p className="text-sm text-muted-foreground">
                  {currentFeedback.feedback}
                </p>
                {currentFeedback.suggestion && (
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">
                    {currentFeedback.suggestion}
                  </p>
                )}
              </div>

              {/* Background Fact Check */}
              {currentFeedback.factCheck ? (
                <div className={`p-2 rounded-lg text-xs border ${
                  currentFeedback.factCheck.verified
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {currentFeedback.factCheck.verified ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <span className={`font-medium ${currentFeedback.factCheck.verified ? "text-green-400" : "text-amber-400"}`}>
                      {currentFeedback.factCheck.verified ? "Fact Check: Verified" : "Fact Check: Issues Found"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{currentFeedback.factCheck.note}</p>
                  {currentFeedback.factCheck.issues.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {currentFeedback.factCheck.issues.map((issue, i) => (
                        <div key={i} className="p-1.5 rounded bg-amber-500/5 border border-amber-500/10">
                          <p className="text-amber-300"><strong>Claim:</strong> {issue.claim}</p>
                          <p className="text-muted-foreground"><strong>Correction:</strong> {issue.correction}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Fact-checking in background...</span>
                </div>
              )}

              <Button onClick={handleNext} className="w-full gap-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Next Drop <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Completion Screen ──────────────────────────────────────────────────

function CompletionScreen({
  gameState, sessionSummary, jeevesDemo, polishedContent,
  isGeneratingSummary, isGeneratingDemo, isPolishing,
  onGenerateSummary, onGenerateDemo, onPolish, onPlayAgain,
  players,
}: {
  gameState: ReturnType<typeof useFreestyleZone>["gameState"];
  sessionSummary: ReturnType<typeof useFreestyleZone>["sessionSummary"];
  jeevesDemo: ReturnType<typeof useFreestyleZone>["jeevesDemo"];
  polishedContent: ReturnType<typeof useFreestyleZone>["polishedContent"];
  isGeneratingSummary: boolean;
  isGeneratingDemo: boolean;
  isPolishing: boolean;
  onGenerateSummary: () => void;
  onGenerateDemo: () => void;
  onPolish: (format: string) => void;
  onPlayAgain: () => void;
  players: string[];
}) {
  const answeredCount = gameState.userResponses.filter(r => r !== "").length;
  const avgScore = gameState.scores.length > 0
    ? Math.round(gameState.scores.reduce((s, sc) => s + sc.totalScore, 0) / gameState.scores.length)
    : 0;

  // Auto-generate summary on mount
  useEffect(() => {
    if (!sessionSummary && !isGeneratingSummary) {
      onGenerateSummary();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="relative inline-flex"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent rounded-full blur-xl scale-150" />
          <Flame className="h-16 w-16 text-orange-500 mx-auto relative" />
        </motion.div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Session Complete!
        </h1>
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Target className="h-3 w-3" /> {gameState.drops.length} drops
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 border-green-500/30 text-green-600 dark:text-green-400">
            <Send className="h-3 w-3" /> {answeredCount} answered
          </Badge>
          {gameState.passCount > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 border-muted-foreground/30">
              <SkipForward className="h-3 w-3" /> {gameState.passCount} passed
            </Badge>
          )}
          <Badge className="gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Flame className="h-3 w-3" /> Avg: {avgScore}/40
          </Badge>
        </div>
      </div>

      {/* Per-Player Scorecards */}
      {players.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Player Scorecards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const playerStats = players.map((name, pi) => {
                const dropIndices = gameState.playerResponses
                  .map((pIdx, di) => pIdx === pi ? di : -1)
                  .filter(di => di >= 0);
                const playerScores = dropIndices
                  .map(di => gameState.scores[di])
                  .filter(s => s && s.totalScore > 0);
                const avg = playerScores.length > 0
                  ? Math.round(playerScores.reduce((sum, s) => sum + s.totalScore, 0) / playerScores.length)
                  : 0;
                const best = playerScores.length > 0
                  ? Math.max(...playerScores.map(s => s.totalScore))
                  : 0;
                return { name, pi, dropCount: dropIndices.length, answered: playerScores.length, avg, best };
              });
              const winner = playerStats.reduce((best, p) => p.avg > best.avg ? p : best, playerStats[0]);
              return (
                <div className="grid grid-cols-2 gap-3">
                  {playerStats.map((p) => {
                    const color = PLAYER_COLORS[p.pi % PLAYER_COLORS.length];
                    const isWinner = p === winner && players.length > 1;
                    return (
                      <div key={p.pi} className={`p-3 rounded-lg border ${color.border} ${color.light} ${isWinner ? 'ring-2 ring-yellow-400' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                          <span className={`font-bold text-sm ${color.text}`}>{p.name}</span>
                          {isWinner && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Drops: {p.dropCount} · Answered: {p.answered}</p>
                          <p className="font-mono font-bold text-foreground">Avg: {p.avg}/40 · Best: {p.best}/40</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="demo">Jeeves Demo</TabsTrigger>
          <TabsTrigger value="polish">Polish & Save</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {isGeneratingSummary ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Jeeves is reviewing your session...</p>
              </CardContent>
            </Card>
          ) : sessionSummary ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{sessionSummary.title}</h2>
                  <Badge className="text-lg px-3 py-1">{sessionSummary.overallGrade}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Strengths</h3>
                    <ul className="text-sm space-y-1">
                      {sessionSummary.strengths.map((s, i) => (
                        <li key={i} className="flex gap-1"><span className="text-green-500">+</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Growth Areas</h3>
                    <ul className="text-sm space-y-1">
                      {sessionSummary.growthAreas.map((g, i) => (
                        <li key={i} className="flex gap-1"><span className="text-amber-500">~</span> {g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {sessionSummary.bestMoment && (
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-primary mb-1">Best Moment</p>
                    <p className="text-sm">{sessionSummary.bestMoment}</p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground italic">{sessionSummary.patternNoticed}</p>
                <p className="text-sm">{sessionSummary.encouragement}</p>

                {sessionSummary.recommendedNextDifficulty && (
                  <p className="text-xs text-muted-foreground">
                    Recommended next: <strong>{DIFFICULTY_CONFIG[sessionSummary.recommendedNextDifficulty]?.label}</strong>
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Evaluation Tab — Chain Review */}
        <TabsContent value="evaluation" className="space-y-3">
          {gameState.drops.map((drop, i) => {
            const response = gameState.userResponses[i];
            const scores = gameState.scores[i];
            const wasPassed = response === "";
            const cat = CATEGORY_CONFIG[drop.category];
            return (
              <Card key={i} className={wasPassed ? "opacity-60" : ""}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${cat.color} text-white text-xs`}>{cat.emoji} {cat.label}</Badge>
                    <span className="text-xs text-muted-foreground">Drop #{i + 1}</span>
                    {players.length > 0 && gameState.playerResponses[i] !== undefined && (
                      <Badge variant="outline" className={`text-[10px] ${PLAYER_COLORS[gameState.playerResponses[i] % PLAYER_COLORS.length].text}`}>
                        {players[gameState.playerResponses[i]]}
                      </Badge>
                    )}
                    {wasPassed && <Badge variant="outline" className="text-xs">PASSED</Badge>}
                  </div>
                  <p className="text-sm font-medium">{drop.drop}</p>
                  {!wasPassed && response && (
                    <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3">{response}</p>
                  )}
                  {scores && (
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Christ: {scores.christConnection}</span>
                      <span>Depth: {scores.depth}</span>
                      <span>Creative: {scores.creativity}</span>
                      {gameState.freestyleMode === "whole" && <span>Chain: {scores.chainLink}</span>}
                      <span className="font-bold text-foreground">{scores.totalScore}/40</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Jeeves Demo Tab */}
        <TabsContent value="demo" className="space-y-4">
          {!jeevesDemo && !isGeneratingDemo ? (
            <Card>
              <CardContent className="p-8 text-center space-y-3">
                <Sparkles className="h-10 w-10 text-primary mx-auto" />
                <p className="text-muted-foreground">
                  Watch Jeeves freestyle YOUR drops — building a master-level chain from every prompt in your session.
                </p>
                <Button onClick={onGenerateDemo} className="gap-1">
                  <Sparkles className="h-4 w-4" /> Show Me How It's Done
                </Button>
              </CardContent>
            </Card>
          ) : isGeneratingDemo ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Jeeves is building a freestyle masterpiece...</p>
              </CardContent>
            </Card>
          ) : jeevesDemo ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {jeevesDemo.title}
                </h2>

                <div className="space-y-4">
                  {jeevesDemo.chain.map((entry, i) => {
                    const cat = CATEGORY_CONFIG[entry.category as DropCategory] || CATEGORY_CONFIG.scripture;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={`${cat.color} text-white text-xs`}>{cat.emoji}</Badge>
                          <span className="text-xs text-muted-foreground font-medium">{entry.drop}</span>
                        </div>
                        <p className="text-sm pl-4 border-l-2 border-primary/30">{entry.connection}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{jeevesDemo.conclusion}</p>
                  <p className="text-sm text-primary font-medium">{jeevesDemo.closingVerse}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Polish & Save Tab */}
        <TabsContent value="polish" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" /> Transform Your Session
              </h3>
              <p className="text-sm text-muted-foreground">
                Turn your freestyle connections into polished content.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "devotional", label: "Devotional", icon: BookOpen },
                  { id: "sermon_outline", label: "Sermon Outline", icon: FileText },
                  { id: "bible_study", label: "Bible Study Guide", icon: Target },
                  { id: "script", label: "Video/Podcast Script", icon: Play },
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1"
                    onClick={() => onPolish(id)}
                    disabled={isPolishing}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {isPolishing && (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Polishing your content...</p>
              </CardContent>
            </Card>
          )}

          {polishedContent && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{polishedContent.title}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(polishedContent.content);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {polishedContent.content}
                </div>
                {polishedContent.keyVerses?.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Key verses: {polishedContent.keyVerses.join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={onPlayAgain} variant="outline" className="gap-1">
          <Flame className="h-4 w-4 text-orange-500" /> Light Another Fire
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function FreestyleZone() {
  const navigate = useNavigate();
  const game = useFreestyleZone();
  const { user } = useAuth();
  const [pastSessions, setPastSessions] = useState<SavedSessionRow[]>([]);
  const [viewingSession, setViewingSession] = useState<SavedSessionRow | null>(null);

  // Fetch past sessions
  useEffect(() => {
    if (!user) return;
    supabase
      .from("game_scores")
      .select("id, score, metadata, created_at")
      .eq("user_id", user.id)
      .eq("game_type", "freestyle_zone")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setPastSessions(data as unknown as SavedSessionRow[]);
      });
  }, [user, game.gameState.phase]); // re-fetch when phase changes (after completing a game)

  const handlePlayAgain = () => {
    window.location.reload();
  };

  // If viewing a past session detail
  if (viewingSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6 pb-24">
          <PastSessionDetail session={viewingSession} onClose={() => setViewingSession(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/games")}
          className="mb-4 gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Games
        </Button>

        {game.sessionLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : game.gameState.phase === "setup" ? (
          <SetupScreen
            onStart={(d, f, p, m) => game.startSession(d, f, p, m)}
            hasExisting={game.hasExistingSession}
            onResume={game.resumeGame}
            onAbandon={game.abandonSession}
            pastSessions={pastSessions}
            onViewSession={setViewingSession}
          />
        ) : game.gameState.phase === "active" ? (
          <ActiveSession
            gameState={game.gameState}
            currentDrop={game.currentDrop}
            currentDropIndex={game.currentDropIndex}
            currentFeedback={game.currentFeedback}
            timeRemaining={game.timeRemaining}
            momentum={game.gameState.momentum}
            isGeneratingDrop={game.isGeneratingDrop}
            isEvaluating={game.isEvaluating}
            isAskingJeeves={game.isAskingJeeves}
            jeevesAssist={game.jeevesAssist}
            onSubmit={game.submitResponse}
            onSubmitStorm={game.submitStormResponse}
            onPass={game.passDrop}
            onNext={game.advanceToNextDrop}
            onEnd={game.endSession}
            onAskJeeves={game.askJeevesForHelp}
            players={game.gameState.players}
            currentPlayerIndex={game.gameState.currentPlayerIndex}
            pendingStormAutoSubmitRef={game.pendingStormAutoSubmitRef}
          />
        ) : (
          <CompletionScreen
            gameState={game.gameState}
            sessionSummary={game.sessionSummary}
            jeevesDemo={game.jeevesDemo}
            polishedContent={game.polishedContent}
            isGeneratingSummary={game.isGeneratingSummary}
            isGeneratingDemo={game.isGeneratingDemo}
            isPolishing={game.isPolishing}
            onGenerateSummary={game.generateSessionSummary}
            onGenerateDemo={game.generateJeevesDemo}
            onPolish={game.polishSession}
            onPlayAgain={handlePlayAgain}
            players={game.gameState.players}
          />
        )}
      </main>
    </div>
  );
}
