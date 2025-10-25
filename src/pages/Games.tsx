import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Gamepad2, Users, UserPlus, Share2, Sparkles, RefreshCw } from "lucide-react";
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

  const adultGames = [
    { 
      id: "palace_cards", 
      name: "Palace Card Match", 
      description: "Match pairs of palace room cards in this beautiful memory game inspired by physical Phototheology cards. Flip cards to find matching rooms across the eight floors.",
      featured: true,
      skills: "Memory, Visual Recognition, Palace Room Knowledge",
      requiredRooms: ["SR", "IR"]
    },
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
      requiredRooms: ["ST", "CR", "BL", "TR"]
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

          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Palace Games</CardTitle>
              <CardDescription className="text-base">
                These games are designed to help you master the Memory Palace method while deepening your understanding of Scripture. 
                Each game combines biblical knowledge with the phototheology principles to create engaging learning experiences.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adultGames.map((game) => (
              <Card key={game.id} className={game.featured ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {game.featured && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {game.name}
                  </CardTitle>
                  <CardDescription className="min-h-[80px]">{game.description}</CardDescription>
                  <div className="pt-2 space-y-2">
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
                    {game.id === "palace_cards" ? (
                      <Button
                        onClick={() => navigate(`/games/palace-cards`)}
                        className="w-full"
                        variant="default"
                      >
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        Play Now
                      </Button>
                    ) : game.id === "chain_chess" ? (
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
        </div>
      </main>
    </div>
  );
};

export default Games;
