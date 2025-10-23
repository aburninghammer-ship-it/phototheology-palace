import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Gamepad2, Users } from "lucide-react";

const Games = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const startChainChess = async (vsJeeves: boolean) => {
    navigate(`/games/chain-chess/new${vsJeeves ? '/jeeves' : ''}`);
  };

  const adultGames = [
    { 
      id: "chain_chess", 
      name: "Chain Chess", 
      description: "Build biblical commentary chains by connecting verses, principles, and Palace rooms. Challenge Jeeves or other players to create the deepest theological connections.",
      featured: true,
      skills: "Biblical Knowledge, Critical Thinking, Memory Palace Mastery"
    },
    { 
      id: "palace_quiz", 
      name: "Palace Quiz", 
      description: "Test your mastery of the 9 Rooms and 50 Principles. Race against time to correctly identify which room each principle belongs to and explain their connections.",
      skills: "Palace Principles, Room Categories, Speed Recall"
    },
    { 
      id: "verse_match", 
      name: "Verse Match", 
      description: "Match Bible verses with their book, chapter, and verse references. Start with easier passages and progress to obscure verses only true scholars know.",
      skills: "Verse Memorization, Biblical Literacy, Pattern Recognition"
    },
    { 
      id: "principle_puzzle", 
      name: "Principle Puzzle", 
      description: "Given a Bible verse, identify which Palace principle(s) it exemplifies. Compete to find multiple valid connections and explain your reasoning.",
      skills: "Theological Analysis, Principle Application, Creative Thinking"
    },
    { 
      id: "timeline_challenge", 
      name: "Timeline Challenge", 
      description: "Place biblical events, prophecies, and their fulfillments in chronological order. Master the flow of redemptive history from Genesis to Revelation.",
      skills: "Biblical Timeline, Historical Context, Prophetic Understanding"
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
          </div>

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
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Skills:</strong> {game.skills}
                    </p>
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
