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
  verse?: string; // User's verse response
  commentary: string;
  category?: string;
  challengeCategory?: string; // Challenge for next player
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
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGameCategories, setSelectedGameCategories] = useState<string[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<"kids" | "adults">("adults");
  const [userVerse, setUserVerse] = useState("");

  const categories = ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"];
  const isVsJeeves = mode === "jeeves";

  // Pool of verses to randomly select from
  const versePool = [
    "John 3:16", "Psalm 23:1", "Romans 8:28", "Philippians 4:13", "Proverbs 3:5-6",
    "Isaiah 40:31", "Jeremiah 29:11", "Matthew 6:33", "2 Timothy 3:16", "Hebrews 11:1",
    "1 Corinthians 13:4", "Ephesians 2:8", "Romans 12:2", "Joshua 1:9", "Psalm 46:1",
    "Matthew 28:19", "John 14:6", "Galatians 5:22", "Colossians 3:2", "James 1:2-3",
    "1 Peter 5:7", "Revelation 21:4", "Genesis 1:1", "Exodus 20:3", "Deuteronomy 6:5",
    "Psalm 119:105", "Isaiah 53:5", "Matthew 5:16", "Luke 6:31", "Acts 1:8",
    "Romans 3:23", "1 John 4:8", "Revelation 3:20", "Mark 16:15", "John 1:1"
  ];

  const getRandomVerse = () => {
    return versePool[Math.floor(Math.random() * versePool.length)];
  };

  useEffect(() => {
    if (user && gameId && gameId !== "new") {
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

  const startGameWithCategories = async () => {
    if (selectedGameCategories.length === 0) {
      toast({
        title: "Select Categories",
        description: "Please select at least one category to play with",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get a random verse for this game
      const randomVerse = getRandomVerse();
      
      // Create new game
      const { data: newGame, error } = await supabase
        .from("games")
        .insert({
          game_type: "chain_chess",
          player1_id: user!.id,
          player2_id: isVsJeeves ? null : null,
          current_turn: null, // Jeeves will go first
          status: "in_progress",
          game_state: { 
            categories: selectedGameCategories,
            verse: randomVerse,
            difficulty: difficultyLevel
          },
        })
        .select()
        .single();

      if (error) throw error;

      setGame(newGame);
      setCurrentVerse(randomVerse);
      await fetchVerseText(randomVerse);
      setGameStarted(true);
      
      // Navigate after setting state
      navigate(`/games/chain-chess/${newGame.id}${isVsJeeves ? "/jeeves" : ""}`, { replace: true });

      // Jeeves makes first move after a brief delay to ensure state is set
      setTimeout(async () => {
        await jeevesMove(newGame.id, true);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleGameCategory = (category: string) => {
    setSelectedGameCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const fetchVerseText = async (verseRef: string) => {
    // Common verse fallbacks
    const verseFallbacks: Record<string, string> = {
      "John 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      "Psalm 23:1": "The LORD is my shepherd; I shall not want.",
      "Romans 8:28": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      "Philippians 4:13": "I can do all things through Christ which strengtheneth me.",
      "Proverbs 3:5": "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
    };

    try {
      const parts = verseRef.match(/^(\d?\s?\w+)\s(\d+):(\d+)$/);
      if (parts) {
        const [, book, chapter, verse] = parts;
        const formattedBook = book.trim().replace(/\s+/g, '%20');
        
        const response = await fetch(
          `https://bible-api.com/${formattedBook}%20${chapter}:${verse}?translation=kjv`,
          { signal: AbortSignal.timeout(5000) }
        );
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.text) {
          setVerseText(data.text.trim());
          return;
        } else if (data.verses && data.verses[0]) {
          setVerseText(data.verses[0].text.trim());
          return;
        }
      }
      
      // Use fallback if available
      setVerseText(verseFallbacks[verseRef] || "Verse text temporarily unavailable. Please try refreshing the page.");
    } catch (error) {
      console.error("Error fetching verse text:", error);
      setVerseText(verseFallbacks[verseRef] || "Verse text temporarily unavailable. Please try refreshing the page.");
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
      setSelectedGameCategories(gameState?.categories || categories);
      setGameStarted(true);
      loadMoves();
    }
  };

  const loadMoves = async () => {
    console.log("=== Loading Moves ===");
    console.log("Game ID:", gameId);
    
    const { data, error } = await supabase
      .from("game_moves")
      .select("*")
      .eq("game_id", gameId)
      .order("created_at", { ascending: true });

    console.log("Moves query result:", { data, error });

    if (error) {
      console.error("Error loading moves:", error);
      return;
    }

    if (data) {
      const formattedMoves = data.map((move) => {
        const moveData = move.move_data as any;
        return {
          player: moveData.player,
          verse: moveData.verse,
          commentary: moveData.commentary,
          category: moveData.category,
          challengeCategory: moveData.challengeCategory,
          jeeves_feedback: moveData.jeeves_feedback,
          score: moveData.score,
          timestamp: move.created_at,
        };
      });
      
      console.log("Formatted moves:", formattedMoves);
      setMoves(formattedMoves);

      // Calculate scores
      const userMoves = formattedMoves.filter(m => m.player === "user");
      const opponentMoves = formattedMoves.filter(m => m.player !== "user");
      const newUserScore = userMoves.reduce((sum, m) => sum + (m.score || 0), 0);
      const newOpponentScore = opponentMoves.reduce((sum, m) => sum + (m.score || 0), 0);
      
      console.log("Scores - User:", newUserScore, "Opponent:", newOpponentScore);
      setUserScore(newUserScore);
      setOpponentScore(newOpponentScore);
    }
  };

  const jeevesMove = async (currentGameId: string, isFirst = false) => {
    setProcessing(true);
    try {
      console.log("=== Jeeves Move Start ===");
      console.log("First move:", isFirst);
      console.log("Current verse:", currentVerse);
      console.log("Game ID:", currentGameId);
      console.log("Available categories:", selectedGameCategories);
      console.log("Previous moves:", moves);
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess",
          verse: currentVerse,
          isFirstMove: isFirst,
          previousMoves: moves,
          availableCategories: selectedGameCategories,
          difficulty: game?.game_state?.difficulty || difficultyLevel,
        },
      });

      console.log("=== Jeeves Response ===");
      console.log("Data:", data);
      console.log("Error:", error);

      if (error) {
        console.error("Jeeves invoke error:", error);
        toast({
          title: "Jeeves Error",
          description: error.message || "Failed to get response from Jeeves",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        console.error("No data received from Jeeves");
        toast({
          title: "Error",
          description: "No response from Jeeves",
          variant: "destructive",
        });
        throw new Error("No data received from Jeeves");
      }

      if (!data.commentary) {
        console.error("Jeeves response missing commentary:", data);
        toast({
          title: "Error",
          description: "Jeeves response missing commentary",
          variant: "destructive",
        });
        throw new Error("Jeeves did not provide commentary");
      }

      console.log("=== Creating Jeeves Move ===");
      const move = {
        player: "jeeves",
        verse: data.verse || currentVerse,
        commentary: data.commentary,
        challengeCategory: data.challengeCategory || "Books of the Bible",
        score: data.score || 8,
        timestamp: new Date().toISOString(),
      };

      console.log("Saving Jeeves move:", move);

      const { error: insertError } = await supabase.from("game_moves").insert({
        game_id: currentGameId,
        player_id: null,
        move_data: move,
      });

      if (insertError) {
        console.error("Error saving move:", insertError);
        throw insertError;
      }

      setChallengeCategory(data.challengeCategory);
      setIsMyTurn(true);

      // Reload moves to ensure the new move is displayed
      await loadMoves();

      // Update game state
      await supabase
        .from("games")
        .update({
          current_turn: user!.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentGameId);
    } catch (error: any) {
      console.error("Jeeves move error:", error);
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
    if (!commentary.trim() || !selectedCategory || !userVerse.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your verse, commentary, and challenge category",
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
          userVerse: userVerse,
          userCommentary: commentary,
          challengeCategory: challengeCategory,
          newChallengeCategory: selectedCategory,
          previousMoves: moves,
          difficulty: game?.game_state?.difficulty || difficultyLevel,
        },
      });

      if (feedbackError) throw feedbackError;

      const move = {
        player: "user",
        verse: userVerse,
        commentary: commentary,
        challengeCategory: selectedCategory,
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
      setUserVerse("");
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
            {gameStarted && (
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
            )}
          </div>

          {!gameStarted && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Setup Chain Chess</CardTitle>
                <CardDescription>
                  Configure your game settings before starting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <div className="flex gap-3">
                    <Button
                      variant={difficultyLevel === "kids" ? "default" : "outline"}
                      onClick={() => setDifficultyLevel("kids")}
                      className="flex-1"
                    >
                      Kids
                    </Button>
                    <Button
                      variant={difficultyLevel === "adults" ? "default" : "outline"}
                      onClick={() => setDifficultyLevel("adults")}
                      className="flex-1"
                    >
                      Adults
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Game Categories</label>
                  <CardDescription className="text-sm">
                    Select which categories Jeeves can use to challenge you
                  </CardDescription>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedGameCategories.includes(cat) ? "default" : "outline"}
                      onClick={() => toggleGameCategory(cat)}
                      className="w-full h-auto py-4 text-left justify-start"
                    >
                      <div>
                        <div className="font-semibold">{cat}</div>
                        <div className="text-sm opacity-80">
                          {cat === "Books of the Bible" && "Connect to other scripture passages"}
                          {cat === "Rooms of the Palace" && "Relate to Phototheology Palace principles"}
                          {cat === "Principles of the Palace" && "Apply specific lenses (2D/3D, Time Zones, etc.)"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={startGameWithCategories}
                  className="w-full"
                  size="lg"
                  disabled={selectedGameCategories.length === 0}
                >
                  Start Game ({difficultyLevel === "kids" ? "Kids" : "Adults"} Level)
                </Button>
              </CardContent>
            </Card>
          )}

          {gameStarted && (
            <>

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
                        
                        {move.verse && move.player === "user" && (
                          <p className="text-sm font-semibold text-primary mb-2">
                            Verse: {move.verse}
                          </p>
                        )}
                        
                        <p className="mb-2">{move.commentary}</p>
                        
                        {move.challengeCategory && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            Challenge: {move.challengeCategory}
                          </p>
                        )}
                        
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
                    Build on Jeeves' thought using: <Badge>{challengeCategory}</Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isMyTurn && !processing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Verse</label>
                      <input
                        type="text"
                        placeholder="Add a verse from the challenged category (e.g., Romans 8:28)"
                        value={userVerse}
                        onChange={(e) => setUserVerse(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Choose a verse that relates to the challenge: {challengeCategory}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Commentary</label>
                      <Textarea
                        placeholder="Build on Jeeves' thought and connect your verse... (emojis supported 😊)"
                        value={commentary}
                        onChange={(e) => setCommentary(e.target.value)}
                        rows={6}
                      />
                      <div className="flex justify-end">
                        <EmojiPicker 
                          onEmojiSelect={(emoji) => setCommentary(commentary + emoji)}
                        />
                      </div>
                    </div>

                     <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Challenge Jeeves with:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedGameCategories.map((cat) => (
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

                    <Button onClick={submitMove} className="w-full" disabled={!commentary.trim() || !selectedCategory || !userVerse.trim()}>
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
          </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChainChess;
