import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy, MessageSquare, Sparkles, Target, ChevronDown, Bot, User,
  BookOpen, Building2, Lightbulb, Send, Loader2, ArrowRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ptRooms, biblicalBooks, ptPrinciples,
  type PTRoom, type BiblicalBook, type PTPrinciple
} from "@/data/chainChessData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Types
interface Move {
  id: string;
  player: "user" | "jeeves";
  verse: string;
  verseText: string;
  commentary: string;
  challengeType: "room" | "book" | "principle";
  challengeId: string;
  challengeName: string;
  score?: number;
  ruling?: {
    approved: boolean;
    explanation: string;
    score: number;
  };
  timestamp: string;
}

interface GameSettings {
  difficulty: "kids" | "adults";
  enabledCategories: {
    books: boolean;
    rooms: boolean;
    principles: boolean;
  };
}

interface GameState {
  status: "setup" | "loading" | "in_progress" | "completed";
  settings: GameSettings;
  moves: Move[];
  currentChallenge?: {
    type: "room" | "book" | "principle";
    id: string;
    name: string;
  };
  playerScore: number;
  jeevesScore: number;
  roundNumber: number;
  currentTurn: "user" | "jeeves";
  winner?: "user" | "jeeves" | "tie";
}

const ChainChess = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    status: "setup",
    settings: {
      difficulty: "adults",
      enabledCategories: {
        books: true,
        rooms: true,
        principles: true,
      },
    },
    moves: [],
    playerScore: 0,
    jeevesScore: 0,
    roundNumber: 0,
    currentTurn: "jeeves", // Jeeves ALWAYS starts
  });

  // Input state for user's turn
  const [userVerse, setUserVerse] = useState("");
  const [userCommentary, setUserCommentary] = useState("");
  const [userChallengeType, setUserChallengeType] = useState<"room" | "book" | "principle">("book");
  const [userChallengeId, setUserChallengeId] = useState("");
  const [processing, setProcessing] = useState(false);

  // UI state
  const [showRules, setShowRules] = useState(false);

  // Get available challenge options based on enabled categories
  const getAvailableChallengeTypes = useCallback(() => {
    const types: ("room" | "book" | "principle")[] = [];
    if (gameState.settings.enabledCategories.books) types.push("book");
    if (gameState.settings.enabledCategories.rooms) types.push("room");
    if (gameState.settings.enabledCategories.principles) types.push("principle");
    return types;
  }, [gameState.settings.enabledCategories]);

  // Start the game - Jeeves goes first
  const startGame = async () => {
    if (!user) return;

    const availableTypes = getAvailableChallengeTypes();
    if (availableTypes.length === 0) {
      toast({
        title: "Select at least one category",
        description: "Please enable at least one challenge category (Books, Rooms, or Principles)",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => ({ ...prev, status: "loading" }));
    setProcessing(true);

    try {
      // Create game in database
      const { data: newGame, error } = await supabase
        .from("games")
        .insert([{
          game_type: "chain_chess_v3",
          player1_id: user.id,
          status: "in_progress",
          game_state: JSON.parse(JSON.stringify({
            version: 3,
            settings: gameState.settings,
            playerScore: 0,
            jeevesScore: 0,
            roundNumber: 1,
          })),
        }])
        .select()
        .single();

      if (error) throw error;

      // Get Jeeves' opening move
      const { data: jeevesData, error: jeevesError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v3-opening",
          difficulty: gameState.settings.difficulty,
          enabledCategories: gameState.settings.enabledCategories,
        },
      });

      if (jeevesError) throw jeevesError;

      const openingMove: Move = {
        id: crypto.randomUUID(),
        player: "jeeves",
        verse: jeevesData.verse,
        verseText: jeevesData.verseText,
        commentary: jeevesData.commentary,
        challengeType: jeevesData.challengeType,
        challengeId: jeevesData.challengeId,
        challengeName: jeevesData.challengeName,
        score: 0,
        timestamp: new Date().toISOString(),
      };

      // Save move to database
      await supabase.from("game_moves").insert({
        game_id: newGame.id,
        player_id: null,
        move_data: JSON.parse(JSON.stringify(openingMove)),
      });

      setGameState(prev => ({
        ...prev,
        status: "in_progress",
        moves: [openingMove],
        currentChallenge: {
          type: jeevesData.challengeType,
          id: jeevesData.challengeId,
          name: jeevesData.challengeName,
        },
        jeevesScore: 1,
        roundNumber: 1,
        currentTurn: "user",
      }));

      // Set default challenge type based on enabled categories
      if (!gameState.settings.enabledCategories[userChallengeType + "s" as keyof typeof gameState.settings.enabledCategories]) {
        setUserChallengeType(availableTypes[0]);
      }

      // Navigate to the game
      navigate(`/games/chain-chess/${newGame.id}/jeeves`, { replace: true });

    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({
        title: "Error starting game",
        description: error.message,
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, status: "setup" }));
    } finally {
      setProcessing(false);
    }
  };

  // Submit user's move
  const submitUserMove = async () => {
    if (!userVerse.trim()) {
      toast({ title: "Enter a verse", description: "Please provide a Bible verse reference", variant: "destructive" });
      return;
    }
    if (!userCommentary.trim()) {
      toast({ title: "Add commentary", description: "Please write commentary connecting your verse to the challenge", variant: "destructive" });
      return;
    }
    if (!userChallengeId) {
      toast({ title: "Select a challenge", description: "Please select a challenge for Jeeves", variant: "destructive" });
      return;
    }

    setProcessing(true);

    try {
      const currentChallenge = gameState.currentChallenge;

      // Have Jeeves judge the user's response
      const { data: judgment, error: judgmentError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v3-judge",
          userVerse,
          userCommentary,
          challengeType: currentChallenge?.type,
          challengeId: currentChallenge?.id,
          challengeName: currentChallenge?.name,
          previousMoves: gameState.moves,
          difficulty: gameState.settings.difficulty,
        },
      });

      if (judgmentError) throw judgmentError;

      const challengeName = getChallengeNameById(userChallengeType, userChallengeId);

      const userMove: Move = {
        id: crypto.randomUUID(),
        player: "user",
        verse: userVerse,
        verseText: judgment.verseText || "",
        commentary: userCommentary,
        challengeType: userChallengeType,
        challengeId: userChallengeId,
        challengeName,
        ruling: {
          approved: judgment.approved,
          explanation: judgment.explanation,
          score: judgment.score || 0,
        },
        timestamp: new Date().toISOString(),
      };

      // Save user's move
      await supabase.from("game_moves").insert({
        game_id: gameId,
        player_id: user?.id,
        move_data: JSON.parse(JSON.stringify(userMove)),
      });

      const newMoves = [...gameState.moves, userMove];
      const newPlayerScore = gameState.playerScore + (judgment.approved ? judgment.score : 0);

      setGameState(prev => ({
        ...prev,
        moves: newMoves,
        playerScore: newPlayerScore,
        currentTurn: "jeeves",
      }));

      // Clear user input
      setUserVerse("");
      setUserCommentary("");
      setUserChallengeId("");

      // Show ruling feedback
      if (judgment.approved) {
        toast({
          title: "✅ Connection Approved!",
          description: `+${judgment.score} points! ${judgment.explanation}`,
        });
      } else {
        toast({
          title: "❌ Connection Weak",
          description: judgment.explanation,
          variant: "destructive",
        });
      }

      // Get Jeeves' response
      setTimeout(() => getJeevesResponse(newMoves, userChallengeType, userChallengeId, challengeName), 1500);

    } catch (error: any) {
      console.error("Error submitting move:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Get Jeeves' response to user's challenge
  const getJeevesResponse = async (
    currentMoves: Move[],
    challengeType: "room" | "book" | "principle",
    challengeId: string,
    challengeName: string
  ) => {
    setProcessing(true);

    try {
      const { data: jeevesData, error: jeevesError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v3-response",
          challengeType,
          challengeId,
          challengeName,
          previousMoves: currentMoves,
          difficulty: gameState.settings.difficulty,
          enabledCategories: gameState.settings.enabledCategories,
        },
      });

      if (jeevesError) throw jeevesError;

      const jeevesMove: Move = {
        id: crypto.randomUUID(),
        player: "jeeves",
        verse: jeevesData.verse,
        verseText: jeevesData.verseText,
        commentary: jeevesData.commentary,
        challengeType: jeevesData.challengeType,
        challengeId: jeevesData.challengeId,
        challengeName: jeevesData.challengeName,
        score: jeevesData.score || 1,
        timestamp: new Date().toISOString(),
      };

      // Save Jeeves' move
      await supabase.from("game_moves").insert({
        game_id: gameId,
        player_id: null,
        move_data: JSON.parse(JSON.stringify(jeevesMove)),
      });

      setGameState(prev => ({
        ...prev,
        moves: [...prev.moves, jeevesMove],
        currentChallenge: {
          type: jeevesData.challengeType,
          id: jeevesData.challengeId,
          name: jeevesData.challengeName,
        },
        jeevesScore: prev.jeevesScore + 1,
        roundNumber: prev.roundNumber + 1,
        currentTurn: "user",
      }));

    } catch (error: any) {
      console.error("Error getting Jeeves response:", error);
      toast({
        title: "Jeeves encountered an error",
        description: error.message,
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, currentTurn: "user" }));
    } finally {
      setProcessing(false);
    }
  };

  // Get challenge name by ID
  const getChallengeNameById = (type: "room" | "book" | "principle", id: string): string => {
    switch (type) {
      case "room":
        return ptRooms.find(r => r.id === id)?.name || id;
      case "book":
        return biblicalBooks.find(b => b.id === id)?.name || id;
      case "principle":
        return ptPrinciples.find(p => p.id === id)?.name || id;
      default:
        return id;
    }
  };

  // Load existing game
  useEffect(() => {
    if (user && gameId && gameId !== "new") {
      loadGame();
    }
  }, [user, gameId]);

  const loadGame = async () => {
    try {
      const { data: game } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (game) {
        const state = game.game_state as any;

        // Load moves
        const { data: movesData } = await supabase
          .from("game_moves")
          .select("*")
          .eq("game_id", gameId)
          .order("created_at", { ascending: true });

        const loadedMoves = movesData?.map(m => m.move_data as unknown as Move) || [];
        const lastMove = loadedMoves[loadedMoves.length - 1];

        setGameState({
          status: game.status === "completed" ? "completed" : "in_progress",
          settings: state.settings || {
            difficulty: "adults",
            enabledCategories: { books: true, rooms: true, principles: true },
          },
          moves: loadedMoves,
          currentChallenge: lastMove ? {
            type: lastMove.challengeType,
            id: lastMove.challengeId,
            name: lastMove.challengeName,
          } : undefined,
          playerScore: state.playerScore || loadedMoves.filter(m => m.player === "user" && m.ruling?.approved).reduce((sum, m) => sum + (m.ruling?.score || 0), 0),
          jeevesScore: state.jeevesScore || loadedMoves.filter(m => m.player === "jeeves").length,
          roundNumber: state.roundNumber || Math.ceil(loadedMoves.length / 2),
          currentTurn: lastMove?.player === "jeeves" ? "user" : "jeeves",
          winner: state.winner,
        });
      }
    } catch (error) {
      console.error("Error loading game:", error);
    }
  };

  // Render a move in the game history
  const renderMove = (move: Move, index: number) => {
    const isJeeves = move.player === "jeeves";
    
    return (
      <motion.div
        key={move.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex gap-4 ${isJeeves ? "flex-row" : "flex-row-reverse"}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isJeeves ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
        }`}>
          {isJeeves ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </div>
        
        <Card className={`flex-1 ${isJeeves ? "bg-primary/5 border-primary/20" : "bg-secondary/30"}`}>
          <CardContent className="pt-4 space-y-3">
            {/* Player label */}
            <div className="flex items-center gap-2">
              <Badge variant={isJeeves ? "default" : "secondary"}>
                {isJeeves ? "Jeeves" : "You"}
              </Badge>
              <span className="text-xs text-muted-foreground">Round {Math.ceil((index + 1) / 2)}</span>
            </div>

            {/* Verse */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">{move.verse}</p>
              <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                "{move.verseText}"
              </p>
            </div>

            {/* Commentary */}
            <div className="text-sm">
              <p className="font-medium mb-1">Commentary:</p>
              <p className="text-muted-foreground">{move.commentary}</p>
            </div>

            {/* Ruling (for user moves) */}
            {move.ruling && (
              <div className={`p-2 rounded text-sm ${move.ruling.approved ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                <p className="font-medium">{move.ruling.approved ? "✅ Approved" : "❌ Weak Connection"}</p>
                <p className="text-xs mt-1">{move.ruling.explanation}</p>
                {move.ruling.approved && <p className="text-xs font-bold mt-1">+{move.ruling.score} points</p>}
              </div>
            )}

            {/* Challenge issued */}
            <div className="pt-2 border-t border-border">
              <p className="text-sm">
                <span className="font-medium">Challenge for {isJeeves ? "you" : "Jeeves"}: </span>
                <Badge variant="outline" className="ml-1">
                  {move.challengeType === "book" && <BookOpen className="h-3 w-3 mr-1" />}
                  {move.challengeType === "room" && <Building2 className="h-3 w-3 mr-1" />}
                  {move.challengeType === "principle" && <Lightbulb className="h-3 w-3 mr-1" />}
                  {move.challengeName}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Chain Chess
              </h1>
              <p className="text-muted-foreground mt-1">
                Build a chain of connected Scripture with Jeeves
              </p>
            </div>

            {gameState.status === "in_progress" && (
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <User className="mr-2 h-4 w-4" />
                  You: {gameState.playerScore}
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Bot className="mr-2 h-4 w-4" />
                  Jeeves: {gameState.jeevesScore}
                </Badge>
              </div>
            )}
          </div>

          {/* Rules */}
          <Collapsible open={showRules} onOpenChange={setShowRules}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>How to Play</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showRules ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-4 space-y-3 text-sm">
                  <p><strong>1.</strong> Jeeves opens with a Bible verse, commentary, and a challenge.</p>
                  <p><strong>2.</strong> You respond with a verse that meets the challenge, add your commentary, and issue a new challenge for Jeeves.</p>
                  <p><strong>3.</strong> Jeeves judges your connection and responds to your challenge.</p>
                  <p><strong>4.</strong> Continue building a chain of connected Scripture!</p>
                  <Separator />
                  <p className="text-muted-foreground">
                    <strong>Challenge Types:</strong> Books of the Bible, PT Rooms, or PT Principles
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Setup Screen */}
          {gameState.status === "setup" && (
            <Card>
              <CardHeader>
                <CardTitle>Start a New Game</CardTitle>
                <CardDescription>Configure your Chain Chess game</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <div className="flex gap-3">
                    <Button
                      variant={gameState.settings.difficulty === "kids" ? "default" : "outline"}
                      onClick={() => setGameState(prev => ({
                        ...prev,
                        settings: { ...prev.settings, difficulty: "kids" },
                      }))}
                      className="flex-1"
                    >
                      Kids
                    </Button>
                    <Button
                      variant={gameState.settings.difficulty === "adults" ? "default" : "outline"}
                      onClick={() => setGameState(prev => ({
                        ...prev,
                        settings: { ...prev.settings, difficulty: "adults" },
                      }))}
                      className="flex-1"
                    >
                      Adults
                    </Button>
                  </div>
                </div>

                {/* Challenge Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Challenge Categories</Label>
                  <p className="text-xs text-muted-foreground">Select which types of challenges can be used</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="books"
                        checked={gameState.settings.enabledCategories.books}
                        onCheckedChange={(checked) => setGameState(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            enabledCategories: { ...prev.settings.enabledCategories, books: !!checked },
                          },
                        }))}
                      />
                      <Label htmlFor="books" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Books of the Bible
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rooms"
                        checked={gameState.settings.enabledCategories.rooms}
                        onCheckedChange={(checked) => setGameState(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            enabledCategories: { ...prev.settings.enabledCategories, rooms: !!checked },
                          },
                        }))}
                      />
                      <Label htmlFor="rooms" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        PT Palace Rooms
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="principles"
                        checked={gameState.settings.enabledCategories.principles}
                        onCheckedChange={(checked) => setGameState(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            enabledCategories: { ...prev.settings.enabledCategories, principles: !!checked },
                          },
                        }))}
                      />
                      <Label htmlFor="principles" className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        PT Principles
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={startGame} 
                  className="w-full" 
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Jeeves is preparing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Game (Jeeves Opens)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading Screen */}
          {gameState.status === "loading" && (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                <p className="text-lg font-medium">Jeeves is preparing the opening verse...</p>
              </CardContent>
            </Card>
          )}

          {/* Game in Progress */}
          {gameState.status === "in_progress" && (
            <div className="space-y-6">
              {/* Move History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Game History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      <AnimatePresence>
                        {gameState.moves.map((move, index) => renderMove(move, index))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* User Input (when it's user's turn) */}
              {gameState.currentTurn === "user" && !processing && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Turn
                    </CardTitle>
                    <CardDescription>
                      Respond to Jeeves' challenge: <Badge variant="outline">{gameState.currentChallenge?.name}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* User's verse */}
                    <div className="space-y-2">
                      <Label>Your Verse <span className="text-muted-foreground font-normal">(optional — from the book of {gameState.currentChallenge?.name || "..."})</span></Label>
                      <Input
                        placeholder="e.g., John 3:16"
                        value={userVerse}
                        onChange={(e) => setUserVerse(e.target.value)}
                      />
                    </div>

                    {/* User's commentary */}
                    <div className="space-y-2">
                      <Label>Your Commentary (explain the connection)</Label>
                      <Textarea
                        placeholder="Explain how your verse connects to the challenge and builds on the chain..."
                        value={userCommentary}
                        onChange={(e) => setUserCommentary(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Separator />

                    {/* User's challenge for Jeeves */}
                    <div className="space-y-4">
                      <Label>Your Challenge for Jeeves</Label>
                      
                      {/* Challenge type selector */}
                      <div className="flex gap-2 flex-wrap">
                        {gameState.settings.enabledCategories.books && (
                          <Button
                            variant={userChallengeType === "book" ? "default" : "outline"}
                            size="sm"
                            onClick={() => { setUserChallengeType("book"); setUserChallengeId(""); }}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        )}
                        {gameState.settings.enabledCategories.rooms && (
                          <Button
                            variant={userChallengeType === "room" ? "default" : "outline"}
                            size="sm"
                            onClick={() => { setUserChallengeType("room"); setUserChallengeId(""); }}
                          >
                            <Building2 className="h-4 w-4 mr-1" />
                            Room
                          </Button>
                        )}
                        {gameState.settings.enabledCategories.principles && (
                          <Button
                            variant={userChallengeType === "principle" ? "default" : "outline"}
                            size="sm"
                            onClick={() => { setUserChallengeType("principle"); setUserChallengeId(""); }}
                          >
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Principle
                          </Button>
                        )}
                      </div>

                      {/* Challenge item selector */}
                      <Select value={userChallengeId} onValueChange={setUserChallengeId}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a ${userChallengeType}...`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {userChallengeType === "book" && biblicalBooks.map(book => (
                            <SelectItem key={book.id} value={book.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant={book.testament === "OT" ? "secondary" : "default"} className="text-xs">
                                  {book.testament}
                                </Badge>
                                {book.name}
                              </div>
                            </SelectItem>
                          ))}
                          {userChallengeType === "room" && ptRooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{room.tag}</Badge>
                                {room.name}
                              </div>
                            </SelectItem>
                          ))}
                          {userChallengeType === "principle" && ptPrinciples.map(principle => (
                            <SelectItem key={principle.id} value={principle.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{principle.shortName}</Badge>
                                {principle.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={submitUserMove} 
                      className="w-full" 
                      size="lg"
                      disabled={processing || !userVerse || !userCommentary || !userChallengeId}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Move
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Jeeves thinking */}
              {(processing || gameState.currentTurn === "jeeves") && (
                <Card className="border-primary/30">
                  <CardContent className="py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Jeeves is thinking...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChainChess;
