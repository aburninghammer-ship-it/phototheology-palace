import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Construction, Gamepad2, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const GamePlay = () => {
  const { gameId, mode } = useParams<{ gameId: string; mode?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const gameData: Record<string, { name: string; description: string; skills: string }> = {
    palace_quiz: { 
      name: "Palace Quiz", 
      description: "Test your mastery of the 9 Rooms and 50 Principles. Race against time to correctly identify which room each principle belongs to.",
      skills: "Palace Principles, Room Categories, Speed Recall"
    },
    verse_match: { 
      name: "Verse Match", 
      description: "Match Bible verses with their book, chapter, and verse references. Progress from easier passages to obscure verses.",
      skills: "Verse Memorization, Biblical Literacy, Pattern Recognition"
    },
    principle_puzzle: { 
      name: "Principle Puzzle", 
      description: "Given a Bible verse, identify which Palace principle(s) it exemplifies. Find multiple valid connections.",
      skills: "Theological Analysis, Principle Application, Creative Thinking"
    },
    timeline_challenge: { 
      name: "Timeline Challenge", 
      description: "Place biblical events, prophecies, and their fulfillments in chronological order across redemptive history.",
      skills: "Biblical Timeline, Historical Context, Prophetic Understanding"
    },
    symbol_decoder: { 
      name: "Symbol Decoder", 
      description: "Decode biblical symbols and types across Scripture. Match symbols to their meanings and Christ fulfillments.",
      skills: "Typology, Symbolism, Cross-References"
    },
    sanctuary_architect: { 
      name: "Sanctuary Architect", 
      description: "Map Bible passages to sanctuary articles and services. Build the complete picture of Christ's fulfillment.",
      skills: "Sanctuary System, Prophetic Fulfillment, Systematic Theology"
    },
    feast_calendar: { 
      name: "Feast Calendar", 
      description: "Connect biblical events and prophecies to the seven feasts of Israel. Discover the prophetic timeline.",
      skills: "Feast System, Prophetic Timeline, Redemptive History"
    },
    dimension_detective: { 
      name: "Dimension Detective", 
      description: "Analyze verses through all five dimensions: Literal, Christ, Personal, Church, Heaven.",
      skills: "Multi-dimensional Analysis, Hermeneutics, Application"
    },
    cycle_navigator: { 
      name: "Cycle Navigator", 
      description: "Place stories and prophecies within the eight covenant cycles from Adam to Christ's Return.",
      skills: "Covenant Theology, Historical Patterns, Cyclical Analysis"
    },
  };

  const game = gameData[gameId || ""];
  const isVsJeeves = mode === "jeeves";

  if (!user) return null;

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-destructive">Game Not Found</h1>
            <p className="text-muted-foreground">The game you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/games")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button onClick={() => navigate("/games")} variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="text-6xl mx-auto">
                {isVsJeeves ? "🤖" : "⚔️"}
              </div>
              <CardTitle className="text-4xl">{game.name}</CardTitle>
              <CardDescription className="text-lg">{game.description}</CardDescription>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Skills:</strong> {game.skills}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-8 text-center space-y-4">
                <Construction className="h-16 w-16 mx-auto text-blue-600 dark:text-blue-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground">Game Under Development</h3>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  {isVsJeeves 
                    ? "This game mode vs Jeeves is being perfected! We're training him to be your worthy opponent."
                    : "This multiplayer mode is being built! Soon you'll be able to challenge other players."}
                </p>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Currently Available:</p>
                  <div className="flex items-center justify-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">Chain Chess (vs Jeeves or Players)</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <p className="text-sm font-medium text-muted-foreground">More games launching soon!</p>
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  onClick={() => navigate("/games/chain-chess/new/jeeves")} 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Play Chain Chess vs Jeeves
                </Button>
                <Button 
                  onClick={() => navigate("/games/chain-chess/new")} 
                  size="lg"
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Play Chain Chess vs Player
                </Button>
                <Button 
                  onClick={() => navigate("/games")} 
                  size="lg"
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse All Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GamePlay;
