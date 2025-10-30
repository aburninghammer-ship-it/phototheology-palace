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
import { Trophy, MessageSquare, Sparkles, Target, Share2, Copy, MessagesSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiPicker } from "@/components/EmojiPicker";
import { WebRTCCall } from "@/components/WebRTCCall";
import { ChatInput } from "@/components/ChatInput";

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
  const [selectedCategoryBase, setSelectedCategoryBase] = useState<string>("");
  const [specificChallenge, setSpecificChallenge] = useState<string>("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGameCategories, setSelectedGameCategories] = useState<string[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<"kids" | "adults">("adults");
  const [userVerse, setUserVerse] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ userId: string; userName: string; message: string; timestamp: string }>>([]);
  const [userDisplayName, setUserDisplayName] = useState<string>("");
  const [whoStarts, setWhoStarts] = useState<"jeeves" | "player" | null>(null);

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
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user!.id)
      .single();
    
    if (profile) {
      setUserDisplayName(profile.display_name || profile.username || "User");
    }
  };

  useEffect(() => {
    if (gameId) {
      const gameChannel = supabase
        .channel(`game_${gameId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "game_moves", filter: `game_id=eq.${gameId}` }, () => {
          loadMoves();
        })
        .subscribe();

      // Chat channel for text messages
      const chatChannel = supabase
        .channel(`chat_${gameId}`)
        .on("broadcast", { event: "message" }, ({ payload }) => {
          setChatMessages((prev) => [...prev, payload]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(gameChannel);
        supabase.removeChannel(chatChannel);
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

    if (!whoStarts) {
      toast({
        title: "Choose Who Starts",
        description: "Please select who should make the first move",
        variant: "destructive",
      });
      return;
    }

    try {
      // Jeeves chooses the verse if he starts, otherwise use a random one for player to respond to
      const randomVerse = whoStarts === "jeeves" ? getRandomVerse() : getRandomVerse();
      
      // Create new game
      const { data: newGame, error } = await supabase
        .from("games")
        .insert({
          game_type: "chain_chess",
          player1_id: user!.id,
          player2_id: isVsJeeves ? null : null,
          current_turn: whoStarts === "player" ? user!.id : null,
          status: "in_progress",
          game_state: { 
            categories: selectedGameCategories,
            verse: randomVerse,
            difficulty: difficultyLevel,
            whoStarts: whoStarts
          },
        })
        .select()
        .single();

      if (error) throw error;

      setGame(newGame);
      setCurrentVerse(randomVerse);
      await fetchVerseText(randomVerse);
      setGameStarted(true);
      
      // Navigate immediately to the game page
      navigate(`/games/chain-chess/${newGame.id}${isVsJeeves ? "/jeeves" : ""}`, { replace: true });
      
      if (whoStarts === "jeeves") {
        // Jeeves makes first move - show processing state
        setProcessing(true);
        toast({
          title: "Jeeves is preparing his opening...",
          description: "Please wait while Jeeves crafts his first move",
        });
        console.log("=== Triggering Jeeves opening move (non-blocking) ===");
        // Don't await - let it run in background
        jeevesMove(newGame.id, true);
      } else {
        // Player goes first
        setIsMyTurn(true);
      }
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
    
    // First get the game state to check whose turn it is
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("current_turn")
      .eq("id", gameId)
      .single();

    if (gameError) {
      console.error("Error loading game:", gameError);
    } else if (gameData) {
      // Update isMyTurn based on whose turn it is
      // null means Jeeves' turn, user.id means user's turn
      setIsMyTurn(gameData.current_turn === user!.id);
      console.log("Current turn:", gameData.current_turn);
      console.log("Is my turn:", gameData.current_turn === user!.id);
    }
    
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

  const jeevesMove = async (currentGameId: string, isFirst = false, userChallenge?: string) => {
    setProcessing(true);
    try {
      console.log("=== Jeeves Move Start ===");
      console.log("First move:", isFirst);
      console.log("Current verse:", currentVerse);
      console.log("Game ID:", currentGameId);
      console.log("Available categories:", selectedGameCategories);
      console.log("User's challenge to Jeeves:", userChallenge);
      
      // Reload moves to get the latest including user's just-submitted move
      const { data: latestMoves } = await supabase
        .from("game_moves")
        .select("*")
        .eq("game_id", currentGameId)
        .order("created_at", { ascending: true });
      
      const formattedMoves = latestMoves?.map((move) => {
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
      }) || [];
      
      console.log("Latest moves for Jeeves:", formattedMoves);
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess",
          verse: currentVerse,
          isFirstMove: isFirst,
          previousMoves: formattedMoves,
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

      if (!data.commentary || data.commentary.trim() === "") {
        console.error("Jeeves response missing commentary (thought):", data);
        toast({
          title: "Error",
          description: "Jeeves did not provide a thought/commentary. Please check the console logs.",
          variant: "destructive",
        });
        throw new Error("Jeeves did not provide commentary (thought)");
      }

      // Validate challenge specificity
      if (data.challengeCategory) {
        const hasSpecificName = data.challengeCategory.includes(" - ");
        if (!hasSpecificName) {
          console.warn("Jeeves provided generic challenge:", data.challengeCategory);
          // Try to make it more specific
          if (data.challengeCategory.includes("Books of the Bible")) {
            data.challengeCategory = "Books of the Bible - Romans";
          } else if (data.challengeCategory.includes("Rooms of the Palace")) {
            data.challengeCategory = "Rooms of the Palace - Story Room";
          } else if (data.challengeCategory.includes("Principles")) {
            data.challengeCategory = "Principles of the Palace - 2D";
          }
        }
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

      // If this is the first move and Jeeves chose a verse, update the game verse
      if (isFirst && data.verse) {
        setCurrentVerse(data.verse);
        await fetchVerseText(data.verse);
        
        // Update game state with Jeeves' chosen verse
        await supabase
          .from("games")
          .update({
            game_state: {
              categories: selectedGameCategories,
              verse: data.verse,
              difficulty: game?.game_state?.difficulty || difficultyLevel,
              whoStarts: "jeeves"
            }
          })
          .eq("id", currentGameId);
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

    if (!selectedCategory.includes(" - ")) {
      toast({
        title: "Incomplete challenge",
        description: "Please specify the exact book, room, or principle for your challenge",
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

      // Store the challenge before clearing form
      const userChallengeToJeeves = selectedCategory;

      // Clear form
      setCommentary("");
      setUserVerse("");
      setSelectedCategory("");
      setSelectedCategoryBase("");
      setSpecificChallenge("");
      setIsMyTurn(false);

      // Update game state - set turn to NULL (Jeeves' turn)
      await supabase
        .from("games")
        .update({
          current_turn: null, // null means it's Jeeves' turn
          updated_at: new Date().toISOString(),
        })
        .eq("id", gameId);

      toast({
        title: "Response submitted!",
        description: `Scored ${feedback.score}/10 - Jeeves is thinking...`,
      });

      // Wait a bit and reload moves to show user's move
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadMoves();

      // Jeeves responds after loading user's move
      if (isVsJeeves) {
        console.log("=== Triggering Jeeves Response ===");
        console.log("Game ID:", gameId);
        console.log("User's challenge:", userChallengeToJeeves);
        setTimeout(async () => {
          console.log("=== Jeeves Move Triggered ===");
          await jeevesMove(gameId!, false, userChallengeToJeeves);
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsMyTurn(true); // Re-enable form on error
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

  const sendChatMessage = async (message: string) => {
    if (!gameId) return;
    
    const chatChannel = supabase.channel(`chat_${gameId}`);
    await chatChannel.send({
      type: "broadcast",
      event: "message",
      payload: {
        userId: user!.id,
        userName: userDisplayName || "User",
        message,
        timestamp: new Date().toISOString(),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
                <CardTitle className="text-2xl">Setup Chain Chess with Jeeves</CardTitle>
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
                  <label className="text-sm font-medium">Who should start first?</label>
                  <CardDescription className="text-sm">
                    Choose who makes the opening move
                  </CardDescription>
                  <div className="flex gap-3">
                    <Button
                      variant={whoStarts === "jeeves" ? "default" : "outline"}
                      onClick={() => setWhoStarts("jeeves")}
                      className="flex-1 h-auto py-4"
                    >
                      <div>
                        <div className="font-semibold">🤖 Jeeves Starts</div>
                        <div className="text-xs opacity-80 mt-1">
                          Jeeves will choose the verse and give an exposition
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={whoStarts === "player" ? "default" : "outline"}
                      onClick={() => setWhoStarts("player")}
                      className="flex-1 h-auto py-4"
                    >
                      <div>
                        <div className="font-semibold">👤 You Start</div>
                        <div className="text-xs opacity-80 mt-1">
                          You choose the verse and make the first move
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Game Categories</label>
                  <CardDescription className="text-sm">
                    Select which categories can be used for challenges
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
                  disabled={selectedGameCategories.length === 0 || !whoStarts}
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

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {!isVsJeeves && gameId && (
                <WebRTCCall
                  roomId={gameId}
                  userId={user!.id}
                  userName={userDisplayName || "User"}
                />
              )}
              
              <Card className="flex flex-col" style={{ height: '800px' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Game Conversation
                  </CardTitle>
                  {challengeCategory && (
                    <CardDescription className="text-sm">
                      Current Challenge: <Badge variant="outline">{challengeCategory}</Badge>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <ScrollArea className="flex-1 pr-4">
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
                          
                          {move.verse && (
                            <p className="text-sm font-semibold text-primary mb-2">
                              {move.player === "jeeves" ? "Jeeves' Verse: " : "Your Verse: "}
                              {move.verse}
                            </p>
                          )}
                          
                          {move.commentary ? (
                            <div className="mb-2">
                              {move.player === "jeeves" && (
                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                                  💭 Jeeves' Thought:
                                </p>
                              )}
                              <p className="text-foreground">
                                {move.commentary}
                              </p>
                            </div>
                          ) : (
                            <div className="mb-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                              <p className="text-xs text-destructive">
                                ⚠️ Missing commentary - there was an error.
                              </p>
                            </div>
                          )}
                          
                          {move.challengeCategory && (
                            <div className="mt-2 p-2 bg-background/50 rounded border-l-2 border-primary">
                              <p className="text-sm font-semibold text-primary">
                                Challenge: {move.challengeCategory}
                              </p>
                            </div>
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

                  {isMyTurn && !processing ? (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Verse</label>
                        <input
                          type="text"
                          placeholder={
                            challengeCategory?.includes(" - ") 
                              ? `Add a verse related to: ${challengeCategory.split(" - ")[1]}`
                              : "Add a verse from the challenged category (e.g., Romans 8:28)"
                          }
                          value={userVerse}
                          onChange={(e) => setUserVerse(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Commentary</label>
                        <Textarea
                          placeholder="Build on Jeeves' thought and connect your verse..."
                          value={commentary}
                          onChange={(e) => setCommentary(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-end">
                          <EmojiPicker 
                            onEmojiSelect={(emoji) => setCommentary(commentary + emoji)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Challenge Jeeves with:</label>
                        
                        {/* Step 1: Select Category */}
                        <div className="flex flex-wrap gap-2">
                          {selectedGameCategories.map((cat) => (
                            <Button
                              key={cat}
                              variant={selectedCategoryBase === cat ? "default" : "outline"}
                              onClick={() => {
                                setSelectedCategoryBase(cat);
                                setSpecificChallenge("");
                                setSelectedCategory("");
                              }}
                              size="sm"
                            >
                              {cat}
                            </Button>
                          ))}
                        </div>

                        {/* Step 2: Enter Specific Challenge */}
                        {selectedCategoryBase && (
                          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                            <label className="text-xs font-medium text-muted-foreground">
                              {selectedCategoryBase === "Books of the Bible" && "Which book? (e.g., Romans, Daniel, Psalms)"}
                              {selectedCategoryBase === "Rooms of the Palace" && "Which room? (e.g., Story Room, Gems Room, Fire Room)"}
                              {selectedCategoryBase === "Principles of the Palace" && "Which principle? (e.g., 2D/3D, Time Zones, Repeat & Enlarge)"}
                            </label>
                            <input
                              type="text"
                              placeholder={
                                selectedCategoryBase === "Books of the Bible" ? "e.g., Romans" :
                                selectedCategoryBase === "Rooms of the Palace" ? "e.g., Story Room" :
                                "e.g., 2D/3D"
                              }
                              value={specificChallenge}
                              onChange={(e) => {
                                setSpecificChallenge(e.target.value);
                                setSelectedCategory(`${selectedCategoryBase} - ${e.target.value}`);
                              }}
                              className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                            />
                            {specificChallenge && (
                              <p className="text-xs text-primary">
                                ✓ Challenge set: {selectedCategoryBase} - {specificChallenge}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <Button onClick={submitMove} className="w-full" disabled={!commentary.trim() || !selectedCategory.includes(" - ") || !userVerse.trim()}>
                        Submit Response
                      </Button>

                      {moves.length >= 6 && (
                        <Button onClick={endGame} variant="secondary" className="w-full">
                          End Game
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-t">
                      {processing ? (
                        <>
                          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-500" />
                          <p className="text-sm text-muted-foreground">
                            {isVsJeeves ? "Jeeves is thinking..." : "Waiting for opponent..."}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Waiting for your turn...
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Text Chat Sidebar */}
            {!isVsJeeves && (
              <div className="space-y-4">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessagesSquare className="h-5 w-5" />
                      Text Chat
                    </CardTitle>
                    <CardDescription>
                      Chat with your opponent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      <div className="space-y-3">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              msg.userId === user!.id
                                ? "bg-primary/10 ml-auto max-w-[80%]"
                                : "bg-muted mr-auto max-w-[80%]"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground mb-1">
                              {msg.userId === user!.id ? "You" : msg.userName}
                            </p>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <ChatInput onSend={sendChatMessage} placeholder="Send a message..." />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChainChess;
