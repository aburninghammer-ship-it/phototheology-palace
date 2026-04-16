import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator, Users, Swords, Trophy, Clock, Loader2, Copy, Check,
  Play, Crown, ArrowLeft, Send, Star, Sparkles, UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

type Difficulty = "easy" | "intermediate" | "advanced" | "pro";
type GameStatus = "waiting" | "active" | "grading" | "completed";
type GameMode = "individuals" | "teams";

interface BattleGame {
  id: string;
  host_id: string;
  room_code: string;
  verse: string;
  equation: string;
  symbols: string[];
  explanation: string;
  difficulty: string;
  game_mode: GameMode;
  max_players: number;
  status: GameStatus;
  time_limit_seconds: number | null;
  combined_result: string | null;
  combined_score: number | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface BattlePlayer {
  id: string;
  game_id: string;
  user_id: string;
  display_name: string;
  team_name: string | null;
  assigned_symbols: string[];
  assigned_portion: string | null;
  answer: string | null;
  score: number | null;
  feedback: string | null;
  is_done: boolean;
  submitted_at: string | null;
}

interface GradeResult {
  playerGrades: Array<{
    displayName: string;
    score: number;
    feedback: string;
    highlights: string[];
  }>;
  combinedAnalysis: string;
  combinedScore: number;
  mvpName: string;
  closingInsight: string;
}

// ─── LOBBY ─────────────────────────────────────────────────

function BattleLobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tab, setTab] = useState<"create" | "join">(searchParams.get("join") ? "join" : "create");
  const [verse, setVerse] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameMode, setGameMode] = useState<GameMode>("individuals");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [joinCode, setJoinCode] = useState(searchParams.get("code") || "");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const difficultyInfo: Record<Difficulty, { symbols: number; color: string }> = {
    easy: { symbols: 3, color: "bg-green-500" },
    intermediate: { symbols: 6, color: "bg-yellow-500" },
    advanced: { symbols: 9, color: "bg-orange-500" },
    pro: { symbols: 12, color: "bg-red-500" },
  };

  const handleCreate = async () => {
    if (!verse.trim()) {
      toast.error("Enter a verse for the battle");
      return;
    }
    if (!user) return;
    setCreating(true);

    try {
      // Generate equation via Jeeves
      const { data: eqData, error: eqError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "equations-challenge",
          difficulty,
          symbolCount: difficultyInfo[difficulty].symbols,
          verse: verse.trim(),
        },
      });

      if (eqError) throw eqError;
      const eq = eqData;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      // Create game
      const { data: game, error: gameError } = await supabase
        .from("equation_battle_games")
        .insert({
          host_id: user.id,
          verse: eq.verse || verse.trim(),
          equation: eq.equation,
          symbols: eq.symbols || [],
          explanation: eq.explanation || "",
          difficulty,
          game_mode: gameMode,
          max_players: maxPlayers,
          time_limit_seconds: 300,
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Add host as player
      await supabase.from("equation_battle_players").insert({
        game_id: game.id,
        user_id: user.id,
        display_name: profile?.display_name || "Host",
      });

      toast.success("Battle created! Share the room code.");
      navigate(`/equations-battle/${game.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create battle");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !user) return;
    setJoining(true);

    try {
      const { data: game, error } = await supabase
        .from("equation_battle_games")
        .select("*")
        .eq("room_code", joinCode.trim().toUpperCase())
        .single();

      if (error || !game) throw new Error("Game not found. Check the code.");
      if (game.status !== "waiting") throw new Error("This game has already started.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      const { error: joinError } = await supabase
        .from("equation_battle_players")
        .insert({
          game_id: game.id,
          user_id: user.id,
          display_name: profile?.display_name || "Player",
        });

      if (joinError) {
        if (joinError.code === "23505") throw new Error("You already joined this game.");
        throw joinError;
      }

      navigate(`/equations-battle/${game.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Equation Battle - Phototheology</title>
      </Helmet>
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Swords className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Equation Battle</h1>
          </div>
          <p className="text-muted-foreground">
            Split a biblical equation among players. Each person decodes their portion. Jeeves combines and scores the results.
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "create" | "join")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">🏟️ Create Battle</TabsTrigger>
            <TabsTrigger value="join">🚪 Join Battle</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Verse / Passage</Label>
                  <Input
                    placeholder="e.g. John 3:16, Philippians 2:5-8"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {(["easy", "intermediate", "advanced", "pro"] as Difficulty[]).map((d) => (
                      <Button
                        key={d}
                        variant={difficulty === d ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(d)}
                        className="capitalize"
                      >
                        {d} ({difficultyInfo[d].symbols})
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Game Mode</Label>
                  <RadioGroup value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)} className="mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individuals" id="ind" />
                      <Label htmlFor="ind">Individuals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teams" id="teams" />
                      <Label htmlFor="teams">Teams</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Max Players (2-12)</Label>
                  <Input
                    type="number"
                    min={2}
                    max={12}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
                  />
                </div>

                <Button onClick={handleCreate} disabled={creating} className="w-full" size="lg">
                  {creating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating Equation...</> : "⚔️ Create Battle"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Room Code</Label>
                  <Input
                    placeholder="e.g. EB1A2B3C"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="text-center text-2xl font-mono tracking-widest"
                  />
                </div>
                <Button onClick={handleJoin} disabled={joining || !joinCode.trim()} className="w-full" size="lg">
                  {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                  Join Battle
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// ─── GAME ──────────────────────────────────────────────────

function BattleGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<BattleGame | null>(null);
  const [players, setPlayers] = useState<BattlePlayer[]>([]);
  const [myAnswer, setMyAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const myPlayer = players.find((p) => p.user_id === user?.id);
  const isHost = game?.host_id === user?.id;
  const allDone = players.length > 0 && players.every((p) => p.is_done);

  const fetchData = useCallback(async () => {
    if (!gameId) return;
    const [gameRes, playersRes] = await Promise.all([
      supabase.from("equation_battle_games").select("*").eq("id", gameId).single(),
      supabase.from("equation_battle_players").select("*").eq("game_id", gameId).order("joined_at"),
    ]);

    if (gameRes.data) setGame(gameRes.data as unknown as BattleGame);
    if (playersRes.data) setPlayers(playersRes.data as unknown as BattlePlayer[]);
  }, [gameId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime
  useEffect(() => {
    if (!gameId) return;
    const channel = supabase
      .channel(`eq-battle-${gameId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "equation_battle_games", filter: `id=eq.${gameId}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "equation_battle_players", filter: `game_id=eq.${gameId}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [gameId, fetchData]);

  // Timer
  useEffect(() => {
    if (game?.status !== "active" || !game.started_at || !game.time_limit_seconds) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - new Date(game.started_at!).getTime()) / 1000;
      const remaining = Math.max(0, game.time_limit_seconds! - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.status, game?.started_at, game?.time_limit_seconds]);

  const copyCode = () => {
    if (game) {
      navigator.clipboard.writeText(game.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startGame = async () => {
    if (!game || !isHost || players.length < 2) return;

    try {
      // Split equation among players via Jeeves
      const { data: splitData, error: splitError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "equation-battle-split",
          equation: game.equation,
          symbols: game.symbols,
          playerCount: players.length,
        },
      });

      if (splitError) throw splitError;

      const portions = splitData.portions || [];

      // Assign portions to players
      for (let i = 0; i < players.length; i++) {
        const portion = portions[i] || { assignedSymbols: [], portionText: "Decode your portion" };
        await supabase
          .from("equation_battle_players")
          .update({
            assigned_symbols: portion.assignedSymbols || [],
            assigned_portion: portion.portionText || "",
          })
          .eq("id", players[i].id);
      }

      // Start game
      await supabase
        .from("equation_battle_games")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", game.id);

      toast.success("Battle started!");
    } catch (err: any) {
      toast.error(err.message || "Failed to start");
    }
  };

  const submitAnswer = async () => {
    if (!myPlayer || !myAnswer.trim()) return;
    setSubmitting(true);
    try {
      await supabase
        .from("equation_battle_players")
        .update({ answer: myAnswer.trim(), is_done: true, submitted_at: new Date().toISOString() })
        .eq("id", myPlayer.id);
      toast.success("Answer submitted!");
    } catch (err: any) {
      toast.error("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const gradeAll = async () => {
    if (!game || !isHost) return;
    setGrading(true);

    try {
      await supabase
        .from("equation_battle_games")
        .update({ status: "grading" })
        .eq("id", game.id);

      const playerAnswers = players.map((p) => ({
        displayName: p.display_name,
        teamName: p.team_name,
        assignedSymbols: p.assigned_symbols,
        assignedPortion: p.assigned_portion,
        answer: p.answer || "(no answer submitted)",
      }));

      const { data: result, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "equation-battle-grade",
          playerAnswers,
          fullEquation: game.equation,
          fullVerse: game.verse,
          fullSymbols: game.symbols,
        },
      });

      if (error) throw error;
      setGradeResult(result);

      // Update player scores
      if (result.playerGrades) {
        for (let i = 0; i < result.playerGrades.length && i < players.length; i++) {
          await supabase
            .from("equation_battle_players")
            .update({
              score: result.playerGrades[i].score,
              feedback: result.playerGrades[i].feedback,
            })
            .eq("id", players[i].id);
        }
      }

      // Update game
      await supabase
        .from("equation_battle_games")
        .update({
          status: "completed",
          combined_result: result.combinedAnalysis,
          combined_score: result.combinedScore,
          completed_at: new Date().toISOString(),
        })
        .eq("id", game.id);
    } catch (err: any) {
      toast.error(err.message || "Grading failed");
      await supabase
        .from("equation_battle_games")
        .update({ status: "active" })
        .eq("id", game.id);
    } finally {
      setGrading(false);
    }
  };

  // Auto-grade when all done
  useEffect(() => {
    if (allDone && isHost && game?.status === "active" && !grading) {
      gradeAll();
    }
  }, [allDone, isHost, game?.status]);

  // Load grade result from DB for completed games
  useEffect(() => {
    if (game?.status === "completed" && game.combined_result && !gradeResult) {
      // Reconstruct grade result from DB
      setGradeResult({
        playerGrades: players.map((p) => ({
          displayName: p.display_name,
          score: p.score || 0,
          feedback: p.feedback || "",
          highlights: [],
        })),
        combinedAnalysis: game.combined_result,
        combinedScore: game.combined_score || 0,
        mvpName: players.reduce((best, p) => (p.score || 0) > (best.score || 0) ? p : best, players[0])?.display_name || "",
        closingInsight: "",
      });
    }
  }, [game?.status, game?.combined_result, players]);

  if (!game) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading battle...</p>
        </div>
      </>
    );
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <Helmet>
        <title>Equation Battle - {game.room_code}</title>
      </Helmet>
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/equations-battle")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Swords className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Equation Battle</CardTitle>
                <Badge variant="outline" className="font-mono text-lg cursor-pointer" onClick={copyCode}>
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {game.room_code}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="capitalize">{game.difficulty}</Badge>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {players.length}/{game.max_players}
                </Badge>
                {game.status === "active" && timeLeft !== null && (
                  <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>
                    <Clock className="h-3 w-3 mr-1" /> {formatTime(timeLeft)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">📖 <strong>Verse:</strong> {game.verse}</p>
              {(game.status !== "waiting" || isHost) && (
                <p className="text-sm font-mono bg-muted p-2 rounded">🧮 {game.equation}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* WAITING phase */}
        {game.status === "waiting" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⏳ Waiting for Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {players.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      {p.user_id === game.host_id && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span>{p.display_name}</span>
                    </div>
                  ))}
                </div>
                {isHost && (
                  <Button onClick={startGame} disabled={players.length < 2} className="w-full mt-4" size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Start Battle ({players.length} players)
                  </Button>
                )}
                {!isHost && <p className="text-center text-muted-foreground mt-4">Waiting for host to start...</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ACTIVE phase */}
        {game.status === "active" && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* My Assignment */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Your Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myPlayer?.assigned_portion ? (
                    <>
                      <div className="bg-muted p-3 rounded space-y-2">
                        <p className="font-mono text-sm">{myPlayer.assigned_portion}</p>
                        <div className="flex gap-1 flex-wrap">
                          {myPlayer.assigned_symbols.map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Explain what each principle means and how it connects to <strong>{game.verse}</strong>. Show the Christ-centered insight your portion reveals.
                      </p>
                      {myPlayer.is_done ? (
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded text-center">
                          <Check className="h-5 w-5 text-green-500 mx-auto mb-1" />
                          <p className="text-sm text-green-600 font-medium">Answer submitted! Waiting for others...</p>
                        </div>
                      ) : (
                        <>
                          <Textarea
                            placeholder="Decode each symbol and explain how they connect to the verse..."
                            value={myAnswer}
                            onChange={(e) => setMyAnswer(e.target.value)}
                            rows={6}
                          />
                          <Button onClick={submitAnswer} disabled={submitting || !myAnswer.trim()} className="w-full">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Submit Answer
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Waiting for assignments...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Player Status Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                      <span>{p.display_name}</span>
                      {p.is_done ? (
                        <Badge variant="default" className="text-xs bg-green-600">Done</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Working...</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Progress value={(players.filter((p) => p.is_done).length / players.length) * 100} className="mt-3" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* GRADING phase */}
        {game.status === "grading" && (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Jeeves is Grading...</h3>
              <p className="text-muted-foreground">Combining all answers and scoring each player's contribution.</p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto mt-4" />
            </CardContent>
          </Card>
        )}

        {/* COMPLETED phase */}
        {game.status === "completed" && gradeResult && (
          <div className="space-y-4">
            {/* MVP Banner */}
            {gradeResult.mvpName && (
              <Card className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30">
                <CardContent className="py-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">🏆 MVP: {gradeResult.mvpName}</h3>
                  <p className="text-sm text-muted-foreground">Highest scoring contribution!</p>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" /> Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...gradeResult.playerGrades]
                    .sort((a, b) => b.score - a.score)
                    .map((pg, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded bg-muted/50">
                        <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{pg.displayName}</span>
                            <Badge variant={pg.score >= 80 ? "default" : "secondary"}>{pg.score}/100</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{pg.feedback}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Combined Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Jeeves' Combined Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {gradeResult.combinedAnalysis.split("\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {gradeResult.closingInsight && (
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded italic text-sm">
                    💡 {gradeResult.closingInsight}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => navigate("/equations-battle")} size="lg">
                ⚔️ Start New Battle
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ROUTER ────────────────────────────────────────────────

export default function EquationBattlePage() {
  const { gameId } = useParams<{ gameId: string }>();
  return gameId ? <BattleGame /> : <BattleLobby />;
}
