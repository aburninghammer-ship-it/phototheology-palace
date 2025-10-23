import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Trophy, MessageSquare, Sparkles, Target, Share2, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiPicker } from "@/components/EmojiPicker";
import { WebRTCCall } from "@/components/WebRTCCall";

interface Move {
  player: string;
  commentary: string;
  category?: string;
  jeeves_feedback?: string;
  score?: number;
  timestamp: string;
}

const ChainChess = () => {
  const { gameId, mode } = useParams<{ gameId: string; mode?: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [game, setGame] = useState<any>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentVerse, setCurrentVerse] = useState("John 3:16");
  const [verseText, setVerseText] = useState("");
  const [commentary, setCommentary] = useState("");
  const [challengeCategory, setChallengeCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const categories = ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"];
  const isVsJeeves = mode === "jeeves";

  useEffect(() => {
    if (user && (!gameId || gameId === "new")) {
      initializeGame();
    } else if (gameId && gameId !== "new") {
      loadGame();
    }
  }, [user, gameId]);

  useEffect(() => {
    if (gameId) {
      const channel = supabase
        .channel(`game_${gameId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "game_moves", filter: `game_id=eq.${gameId}` }, () => {
          loadMoves();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [gameId]);

  const initializeGame = async () => {
    try {
      // Create new game
      const { data: newGame, error } = await supabase
        .from("games")
        .insert({
          game_type: "chain_chess",
          player1_id: user!.id,
          player2_id: isVsJeeves ? null : null,
          current_turn: user!.id,
          status: "in_progress",
          game_state: { categories: 3, verse: "John 3:16" },
        })
        .select()
        .single();

      if (error) throw error;

      setGame(newGame);
      await fetchVerseText("John 3:16");
      navigate(`/games/chain-chess/${newGame.id}${isVsJeeves ? "/jeeves" : ""}`);

      // Jeeves makes first move
      await jeevesMove(newGame.id, true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchVerseText = async (verseRef: string) => {
    try {
      // Parse verse reference (e.g., "John 3:16")
      const parts = verseRef.match(/^(\d?\s?\w+)\s(\d+):(\d+)$/);
      if (parts) {
        const [, book, chapter, verse] = parts;
        // Format the book name properly (replace spaces with underscores for API)
        const formattedBook = book.trim().replace(/\s+/g, '%20');
        const response = await fetch(
          `https://bible-api.com/${formattedBook}%20${chapter}:${verse}?translation=kjv`
        );
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.text) {
          setVerseText(data.text.trim());
        } else if (data.verses && data.verses[0]) {
          setVerseText(data.verses[0].text.trim());
        } else {
          setVerseText("For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.");
        }
      }
    } catch (error) {
      console.error("Error fetching verse text:", error);
      // Fallback text for John 3:16
      setVerseText("For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.");
    }
  };

  const loadGame = async () => {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (data) {
      setGame(data);
      const gameState = data.game_state as any;
      const verse = gameState?.verse || "John 3:16";
      setCurrentVerse(verse);
      await fetchVerseText(verse);
      setIsMyTurn(data.current_turn === user!.id);
      loadMoves();
    }
  };

  const loadMoves = async () => {
    const { data } = await supabase
      .from("game_moves")
      .select("*")
      .eq("game_id", gameId)
      .order("created_at", { ascending: true });

    if (data) {
      const formattedMoves = data.map((move) => {
        const moveData = move.move_data as any;
        return {
          player: moveData.player,
          commentary: moveData.commentary,
          category: moveData.category,
          jeeves_feedback: moveData.jeeves_feedback,
          score: moveData.score,
          timestamp: move.created_at,
        };
      });
      setMoves(formattedMoves);

      // Calculate scores
      const userMoves = formattedMoves.filter(m => m.player === "user");
      const opponentMoves = formattedMoves.filter(m => m.player !== "user");
      setUserScore(userMoves.reduce((sum, m) => sum + (m.score || 0), 0));
      setOpponentScore(opponentMoves.reduce((sum, m) => sum + (m.score || 0), 0));
    }
  };

  const jeevesMove = async (currentGameId: string, isFirst = false) => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess",
          verse: currentVerse,
          isFirstMove: isFirst,
          previousMoves: moves,
          categories: 3,
        },
      });

      if (error) throw error;

      const move = {
        player: "jeeves",
        commentary: data.commentary,
        category: data.challengeCategory,
        score: data.score || 8,
        timestamp: new Date().toISOString(),
      };

      await supabase.from("game_moves").insert({
        game_id: currentGameId,
        player_id: null,
        move_data: move,
      });

      setChallengeCategory(data.challengeCategory);
      setIsMyTurn(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const submitMove = async () => {
    if (!commentary.trim() || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please provide commentary and select a category",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Get Jeeves feedback and score
      const { data: feedback, error: feedbackError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-feedback",
          verse: currentVerse,
          userCommentary: commentary,
          category: selectedCategory,
          previousMoves: moves,
        },
      });

      if (feedbackError) throw feedbackError;

      const move = {
        player: "user",
        commentary: commentary,
        category: selectedCategory,
        jeeves_feedback: feedback.feedback,
        score: feedback.score,
        timestamp: new Date().toISOString(),
      };

      await supabase.from("game_moves").insert({
        game_id: gameId,
        player_id: user!.id,
        move_data: move,
      });

      setCommentary("");
      setSelectedCategory("");
      setIsMyTurn(false);

      // Update game state
      await supabase
        .from("games")
        .update({
          current_turn: isVsJeeves ? user!.id : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", gameId);

      // Jeeves responds
      if (isVsJeeves) {
        setTimeout(() => jeevesMove(gameId!), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const endGame = async () => {
    try {
      const winner = userScore > opponentScore ? user!.id : null;
      
      await supabase
        .from("games")
        .update({
          status: "completed",
          winner_id: winner,
        })
        .eq("id", gameId);

      // Award points to winner
      if (winner) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", winner)
          .single();
        
        if (profile) {
          await supabase
            .from("profiles")
            .update({ points: (profile.points || 0) + 10 })
            .eq("id", winner);
        }
      }

      toast({
        title: "Game Over!",
        description: winner === user!.id ? "Congratulations! You won!" : "Good game! Jeeves won this round.",
      });

      navigate("/games");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = () => {
    const inviteLink = window.location.href;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: "Link copied!",
        description: "Share this link to invite someone to watch or join.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    });
  };

  const shareInviteLink = async () => {
    const inviteLink = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chain Chess Game`,
          text: `Join my Chain Chess game on Phototheology Palace!`,
          url: inviteLink,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyInviteLink();
        }
      }
    } else {
      copyInviteLink();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Chain Chess
            </h1>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="text-lg">
                <Target className="mr-2 h-4 w-4" />
                You: {userScore}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                <Sparkles className="mr-2 h-4 w-4" />
                {isVsJeeves ? "Jeeves" : "Opponent"}: {opponentScore}
              </Badge>
              <Button variant="outline" size="sm" onClick={shareInviteLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={copyInviteLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Verse</CardTitle>
              <CardDescription className="text-lg font-semibold">{currentVerse}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed italic">
                {verseText || "Loading verse text..."}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {!isVsJeeves && gameId && (
                <WebRTCCall
                  roomId={gameId}
                  userId={user!.id}
                  userName={user!.email || "User"}
                />
              )}
              
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversation
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <ScrollArea className="h-[480px] pr-4">
                  <div className="space-y-4">
                    {moves.map((move, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${move.player === "jeeves" ? "bg-purple-50 dark:bg-purple-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={move.player === "jeeves" ? "default" : "secondary"}>
                            {move.player === "jeeves" ? "Jeeves" : "You"}
                          </Badge>
                          {move.score && (
                            <Badge variant="outline">
                              <Trophy className="mr-1 h-3 w-3" />
                              {move.score}/10
                            </Badge>
                          )}
                        </div>
                        
                        {move.category && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Category: {move.category}
                          </p>
                        )}
                        
                        <p className="mb-2">{move.commentary}</p>
                        
                        {move.jeeves_feedback && (
                          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-purple-500">
                            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                              Jeeves' Feedback:
                            </p>
                            <p className="text-sm">{move.jeeves_feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {processing && (
                      <div className="text-center text-muted-foreground">
                        <Sparkles className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Thinking...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              </Card>
            </div>

            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Your Turn</CardTitle>
                {challengeCategory && (
                  <CardDescription className="text-lg">
                    Respond using: <Badge>{challengeCategory}</Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isMyTurn && !processing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Commentary</label>
                      <Textarea
                        placeholder="Build on the previous commentary using the challenge category... (emojis supported 😊)"
                        value={commentary}
                        onChange={(e) => setCommentary(e.target.value)}
                        rows={8}
                      />
                      <div className="flex justify-end">
                        <EmojiPicker 
                          onEmojiSelect={(emoji) => setCommentary(commentary + emoji)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Choose a category for Jeeves' next response:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => setSelectedCategory(cat)}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={submitMove} className="w-full" disabled={!commentary.trim() || !selectedCategory}>
                      Submit Response
                    </Button>

                    {moves.length >= 6 && (
                      <Button onClick={endGame} variant="secondary" className="w-full">
                        End Game
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    {processing ? (
                      <>
                        <Sparkles className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
                        <p className="text-muted-foreground">
                          {isVsJeeves ? "Jeeves is thinking..." : "Waiting for opponent..."}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">
                        Waiting for your turn...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChainChess;
