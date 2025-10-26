import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Gamepad2, Users, UserPlus, Share2, Sparkles, RefreshCw, Flame, Lock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MonthlyGameCard } from "@/components/MonthlyGameCard";
import { RoomPrerequisites } from "@/components/RoomPrerequisites";

const Games = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyGames, setMonthlyGames] = useState<any[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [generatingGames, setGeneratingGames] = useState(false);

  useEffect(() => {
    if (user) {
      fetchActiveGames();
      fetchMonthlyGames();
    }
  }, [user]);

  const fetchMonthlyGames = async () => {
    const { data: games } = await supabase
      .from("monthly_games")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setMonthlyGames(games || []);

    // Fetch user ratings
    if (user && games) {
      const { data: ratings } = await supabase
        .from("game_ratings")
        .select("game_id, rating")
        .eq("user_id", user.id)
        .in("game_id", games.map(g => g.id));

      const ratingsMap: Record<string, number> = {};
      ratings?.forEach(r => {
        ratingsMap[r.game_id] = r.rating;
      });
      setUserRatings(ratingsMap);
    }
  };

  const fetchActiveGames = async () => {
    const { data } = await supabase
      .from("games")
      .select("*")
      .or(`player1_id.eq.${user?.id},player2_id.eq.${user?.id}`)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(5);

    setActiveGames(data || []);
    setLoading(false);
  };

  const inviteFriend = () => {
    const inviteUrl = `${window.location.origin}/games`;
    const message = `Join me in Phototheology Palace Games! Let's compete in biblical knowledge and memory palace mastery.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Phototheology Games',
        text: message,
        url: inviteUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${message}\n\n${inviteUrl}`);
      toast({
        title: "Invitation copied!",
        description: "Share the link with your friend",
      });
    }
  };

  const startChainChess = async (vsJeeves: boolean) => {
    navigate(`/games/chain-chess/new${vsJeeves ? '/jeeves' : ''}`);
  };

  const generateMonthlyGames = async () => {
    setGeneratingGames(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-monthly-games");
      
      if (error) throw error;

      toast({
        title: "Games Generated!",
        description: `${data.games.length} new games created for this month`,
      });

      fetchMonthlyGames();
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate games",
        variant: "destructive",
      });
    } finally {
      setGeneratingGames(false);
    }
  };

  const cardGames = [
    { 
      id: "palace_cards", 
      name: "Palace Memory Match", 
      description: "Match pairs of palace room cards in this beautiful memory game inspired by physical Phototheology cards. Flip cards to find matching rooms across the eight floors.",
      featured: true,
      skills: "Memory, Visual Recognition, Palace Room Knowledge",
      requiredRooms: ["SR", "IR"],
      players: "1",
      duration: "5-10 min"
    },
    { 
      id: "room_snap", 
      name: "Room Snap", 
      description: "Speed-based card game where you must identify matching room principles faster than your opponent. When two cards share the same floor or principle, be the first to 'snap' and claim them!",
      featured: true,
      skills: "Quick Recognition, Palace Principles, Speed Processing",
      requiredRooms: ["SR", "OR", "CR", "DR"],
      players: "2-4",
      duration: "10-15 min"
    },
    { 
      id: "theology_deck", 
      name: "Theology Deck Builder", 
      description: "Build your own deck of Palace rooms, Bible verses, and prophetic cards. Create powerful combinations where Sanctuary rooms unlock prophetic timelines, and verse chains strengthen your theological arguments.",
      featured: false,
      skills: "Strategy, Deck Building, Multi-Room Synergy",
      requiredRooms: ["BL", "PR", "ST", "QA", "CR"],
      players: "2",
      duration: "20-30 min"
    },
    { 
      id: "scripture_combinations", 
      name: "Scripture Combinations", 
      description: "Build powerful hands using verse cards, room principle cards, and prophecy cards. Create winning combinations like 'Sanctuary Sequence' (5 sanctuary-related verses), 'Prophetic Chain' (Daniel→Revelation progression), or 'Christ-Centered Suite' (5 verses revealing the same aspect of Christ).",
      featured: false,
      skills: "Pattern Recognition, Biblical Knowledge, Strategic Thinking",
      requiredRooms: ["ST", "BL", "PR", "QA"],
      players: "2-6",
      duration: "15-20 min"
    },
  ];

  const escapeRooms = [
    {
      id: "escape_rooms",
      name: "Palace Escape Rooms",
      description: "60-minute biblical challenges with 4 unique formats: Room-as-Room (master one methodology), Category Gauntlet (prophecy/sanctuary specialist), Live Mission (apologetics training), or Async Hunt (24-hour crisis defense).",
      featured: true,
      skills: "Palace Mastery, Biblical Defense, Theological Accuracy, Speed Thinking",
      requiredRooms: ["SR", "OR", "CR", "DR", "BL", "PR", "ST"],
      players: "1-10",
      duration: "30-60 min (or 24 hrs)"
    },
  ];

  const competitiveGames = [
    { 
      id: "chain_chess", 
      name: "Chain Chess", 
      description: "Build biblical commentary chains by connecting verses, principles, and Palace rooms. Challenge Jeeves or other players to create the deepest theological connections.",
      featured: true,
      skills: "Biblical Knowledge, Critical Thinking, Memory Palace Mastery",
      requiredRooms: ["QR", "QA", "CR", "DR", "ST"]
    },
    { 
      id: "concentration", 
      name: "Biblical Parallels Concentration", 
      description: "Match Old Testament events with their New Testament fulfillments. Find typological parallels like Moses→Joshua matching John Baptist→Jesus transitions.",
      featured: true,
      skills: "Typology, Pattern Recognition, Biblical Parallels",
      requiredRooms: ["ST", "P‖", "CR", "DR"]
    },
    { 
      id: "palace_quiz", 
      name: "Palace Quiz", 
      description: "Test your mastery of the 9 Rooms and 50 Principles. Race against time to correctly identify which room each principle belongs to and explain their connections.",
      skills: "Palace Principles, Room Categories, Speed Recall",
      requiredRooms: ["SR", "OR", "NF", "CR", "BL"]
    },
    { 
      id: "verse_match", 
      name: "Verse Match", 
      description: "Match Bible verses with their book, chapter, and verse references. Start with easier passages and progress to obscure verses only true scholars know.",
      skills: "Verse Memorization, Biblical Literacy, Pattern Recognition",
      requiredRooms: ["SR", "IR", "24", "BR"]
    },
    { 
      id: "principle_puzzle", 
      name: "Principle Puzzle", 
      description: "Given a Bible verse, identify which Palace principle(s) it exemplifies. Compete to find multiple valid connections and explain your reasoning.",
      skills: "Theological Analysis, Principle Application, Creative Thinking",
      requiredRooms: ["CR", "DR", "TRm", "PRm"]
    },
    { 
      id: "timeline_challenge", 
      name: "Timeline Challenge", 
      description: "Place biblical events, prophecies, and their fulfillments in chronological order. Master the flow of redemptive history from Genesis to Revelation.",
      skills: "Biblical Timeline, Historical Context, Prophetic Understanding",
      requiredRooms: ["SR", "TZ", "PR", "FR"]
    },
    { 
      id: "symbol_decoder", 
      name: "Symbol Decoder", 
      description: "Decode biblical symbols and types across Scripture. Match symbols like lamb, rock, water, and bread to their meanings and Christ fulfillments.",
      skills: "Typology, Symbolism, Cross-References",
      requiredRooms: ["ST", "CR", "BL", "TR"],
      players: "1-2",
      duration: "10-15 min"
    },
    { 
      id: "sanctuary_architect", 
      name: "Sanctuary Architect", 
      description: "Map Bible passages to sanctuary articles and services. Build the complete picture of how Christ fulfills each element from altar to ark.",
      skills: "Sanctuary System, Prophetic Fulfillment, Systematic Theology",
      requiredRooms: ["BL", "CR", "ST", "DR"]
    },
    { 
      id: "feast_calendar", 
      name: "Feast Calendar", 
      description: "Connect biblical events and prophecies to the seven feasts of Israel. Discover the prophetic timeline hidden in God's appointed times.",
      skills: "Feast System, Prophetic Timeline, Redemptive History",
      requiredRooms: ["FR", "TZ", "CR", "PR"]
    },
    { 
      id: "dimension_detective", 
      name: "Dimension Detective", 
      description: "Analyze verses through all five dimensions: Literal, Christ, Personal, Church, Heaven. See the full diamond from every angle.",
      skills: "Multi-dimensional Analysis, Hermeneutics, Application",
      requiredRooms: ["DR", "CR", "C6", "FRt"]
    },
    { 
      id: "cycle_navigator", 
      name: "Cycle Navigator", 
      description: "Place stories and prophecies within the eight covenant cycles from Adam to Christ's Return. Navigate the patterns of redemptive history.",
      skills: "Covenant Theology, Historical Patterns, Cyclical Analysis",
      requiredRooms: ["SR", "TZ", "PRm", "P||"]
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Gamepad2 className="h-8 w-8" />
              Palace Games
            </h1>
            <Button onClick={inviteFriend} className="gap-2" size="lg">
              <UserPlus className="h-5 w-5" />
              Invite a Friend
            </Button>
          </div>

          {/* Active Games Section */}
          {activeGames.length > 0 && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Active Games
                </CardTitle>
                <CardDescription>Resume your ongoing matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/games/chain-chess/${game.id}`)}
                    >
                      <div>
                        <p className="font-medium">{game.game_type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {game.player2_id ? 'vs Player' : 'Waiting for opponent...'}
                        </p>
                      </div>
                      <Badge>{game.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly AI-Generated Games */}
          {monthlyGames.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    Monthly Games
                  </h2>
                  <p className="text-muted-foreground">
                    AI-generated games that refresh monthly
                  </p>
                </div>
                <Button 
                  onClick={generateMonthlyGames} 
                  disabled={generatingGames}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${generatingGames ? 'animate-spin' : ''}`} />
                  {generatingGames ? 'Generating...' : 'Generate New'}
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyGames.map((game) => (
                  <MonthlyGameCard
                    key={game.id}
                    game={game}
                    userRating={userRatings[game.id]}
                    onRatingUpdate={fetchMonthlyGames}
                  />
                ))}
              </div>
            </div>
          )}

          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                Welcome to Palace Games
              </CardTitle>
              <CardDescription className="text-base">
                Master the Memory Palace method through engaging biblical games. Each game trains specific Palace principles while deepening your Scripture knowledge.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="card_games" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="card_games" className="gap-2">
                <Trophy className="h-4 w-4" />
                Card Games
              </TabsTrigger>
              <TabsTrigger value="escape_rooms" className="gap-2">
                <Lock className="h-4 w-4" />
                Escape Rooms
              </TabsTrigger>
              <TabsTrigger value="competitive" className="gap-2">
                <Zap className="h-4 w-4" />
                Competitive
              </TabsTrigger>
            </TabsList>

            {/* CARD GAMES TAB */}
            <TabsContent value="card_games">
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Phototheology Card Games
                </h3>
                <p className="text-sm text-muted-foreground">
                  Physical-inspired card games that train memory, speed recognition, and Palace mastery through matching, building, and strategic play.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {cardGames.map((game) => (
                  <Card key={game.id} className={game.featured ? "border-amber-500 shadow-lg" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {game.featured && <Trophy className="h-5 w-5 text-amber-500" />}
                        {game.name}
                      </CardTitle>
                      <CardDescription className="min-h-[80px]">{game.description}</CardDescription>
                      <div className="pt-2 space-y-2">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>👥 {game.players}</span>
                          <span>⏱️ {game.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong>Skills:</strong> {game.skills}
                        </p>
                        {game.requiredRooms && (
                          <RoomPrerequisites rooms={game.requiredRooms} compact />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {game.id === "palace_cards" ? (
                        <Button
                          onClick={() => navigate(`/games/palace-cards`)}
                          className="w-full"
                          variant="default"
                        >
                          <Gamepad2 className="mr-2 h-4 w-4" />
                          Play Now
                        </Button>
                      ) : (
                        <Button
                          onClick={() => toast({ title: "Coming Soon!", description: `${game.name} is under development` })}
                          className="w-full"
                          variant="outline"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Coming Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ESCAPE ROOMS TAB */}
            <TabsContent value="escape_rooms">
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Palace Escape Rooms
                </h3>
                <p className="text-sm text-muted-foreground">
                  60-minute biblical crisis scenarios where you must apply Palace principles under pressure. Defend the faith, solve mysteries, or decode prophecy before time runs out.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {escapeRooms.map((game) => (
                  <Card key={game.id} className="border-red-500 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-red-500" />
                        {game.name}
                      </CardTitle>
                      <CardDescription className="min-h-[80px]">{game.description}</CardDescription>
                      <div className="pt-2 space-y-2">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>👥 {game.players}</span>
                          <span>⏱️ {game.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong>Skills:</strong> {game.skills}
                        </p>
                        {game.requiredRooms && (
                          <RoomPrerequisites rooms={game.requiredRooms} compact />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => navigate(`/escape-room`)}
                        className="w-full"
                        variant="default"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Enter Escape Room
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* COMPETITIVE GAMES TAB */}
            <TabsContent value="competitive">
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-lg mb-2">Competitive & Study Games</h3>
                <p className="text-sm text-muted-foreground">
                  Challenge other players or Jeeves AI in biblical knowledge battles, quizzes, and strategic games.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitiveGames.map((game) => (
                  <Card key={game.id} className={game.featured ? "border-primary shadow-lg" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {game.featured && <Trophy className="h-5 w-5 text-yellow-500" />}
                        {game.name}
                      </CardTitle>
                      <CardDescription className="min-h-[80px]">{game.description}</CardDescription>
                      <div className="pt-2 space-y-2">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>👥 {game.players || "1-2"}</span>
                          <span>⏱️ {game.duration || "15-20 min"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong>Skills:</strong> {game.skills}
                        </p>
                        {game.requiredRooms && (
                          <RoomPrerequisites rooms={game.requiredRooms} compact />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {game.id === "chain_chess" ? (
                          <>
                            <Button
                              onClick={() => startChainChess(false)}
                              className="w-full"
                              variant="default"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Play vs Player
                            </Button>
                            <Button
                              onClick={() => startChainChess(true)}
                              className="w-full"
                              variant="outline"
                            >
                              <Gamepad2 className="mr-2 h-4 w-4" />
                              Play vs Jeeves
                            </Button>
                          </>
                        ) : game.id === "concentration" ? (
                          <Button
                            onClick={() => navigate(`/games/concentration`)}
                            className="w-full"
                            variant="default"
                          >
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            Play Now
                          </Button>
                        ) : game.id === "palace_quiz" || game.id === "verse_match" || game.id === "principle_puzzle" ? (
                          <>
                            <Button
                              onClick={() => navigate(`/games/${game.id}`)}
                              className="w-full"
                              variant={game.featured ? "default" : "outline"}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Play Solo
                            </Button>
                            <Button
                              onClick={() => navigate(`/games/${game.id}/jeeves`)}
                              className="w-full"
                              variant="outline"
                            >
                              <Gamepad2 className="mr-2 h-4 w-4" />
                              Play vs Jeeves
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => navigate(`/games/${game.id}`)}
                              className="w-full"
                              variant={game.featured ? "default" : "outline"}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Play vs Player
                            </Button>
                            <Button
                              onClick={() => navigate(`/games/${game.id}/jeeves`)}
                              className="w-full"
                              variant="outline"
                            >
                              <Gamepad2 className="mr-2 h-4 w-4" />
                              Play vs Jeeves
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Games;
