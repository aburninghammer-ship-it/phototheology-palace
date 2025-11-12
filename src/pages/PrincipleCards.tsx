import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  PlayCircle, 
  Trophy, 
  Loader2,
  Plus,
  Share2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SocialShareButton } from "@/components/SocialShareButton";

interface Game {
  id: string;
  room_id: string;
  host_user_id: string;
  status: string;
  max_players: number;
  current_round: number;
  total_rounds: number;
  created_at: string;
  player_count?: number;
  host_display_name?: string;
}

export default function PrincipleCards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [totalRounds, setTotalRounds] = useState(10);

  useEffect(() => {
    fetchGames();
    
    // Subscribe to game changes
    const channel = supabase
      .channel('principle-card-games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'principle_card_games'
        },
        () => fetchGames()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGames = async () => {
    try {
      const { data: gamesData, error } = await supabase
        .from("principle_card_games")
        .select(`
          *,
          principle_card_players (count)
        `)
        .in("status", ["waiting", "playing"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch host names
      const gamesWithDetails = await Promise.all(
        (gamesData || []).map(async (game) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", game.host_user_id)
            .single();

          return {
            ...game,
            player_count: game.principle_card_players?.[0]?.count || 0,
            host_display_name: profile?.display_name || "Unknown"
          };
        })
      );

      setGames(gamesWithDetails);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async () => {
    if (!user) return;

    setCreating(true);
    try {
      const { data: game, error: gameError } = await supabase
        .from("principle_card_games")
        .insert({
          room_id: "all", // Can be customized to specific rooms
          host_user_id: user.id,
          max_players: maxPlayers,
          total_rounds: totalRounds,
          status: "waiting"
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Join as first player
      const { error: playerError } = await supabase
        .from("principle_card_players")
        .insert({
          game_id: game.id,
          user_id: user.id
        });

      if (playerError) throw playerError;

      toast({
        title: "Game Created!",
        description: "Waiting for players to join..."
      });

      navigate(`/games/principle-cards/${game.id}`);
    } catch (error: any) {
      console.error("Error creating game:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const joinGame = async (gameId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("principle_card_players")
        .insert({
          game_id: gameId,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Joined Game!",
        description: "Get ready to play!"
      });

      navigate(`/games/principle-cards/${gameId}`);
    } catch (error: any) {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Principle Cards</h1>
          <p className="text-muted-foreground mb-4">
            Multiplayer game where principles become cards - match them to scenarios!
          </p>
          <SocialShareButton
            title="Join me in Principle Cards!"
            description="A fun multiplayer game where biblical principles become cards. Test your knowledge and compete with friends!"
            url={window.location.origin + "/games/principle-cards"}
            variant="dropdown"
            size="sm"
          />
        </div>

        {/* Create Game Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Create New Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Players
              </label>
              <Input
                type="number"
                min={2}
                max={8}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Total Rounds
              </label>
              <Input
                type="number"
                min={5}
                max={20}
                value={totalRounds}
                onChange={(e) => setTotalRounds(parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={createGame}
                disabled={creating}
                className="w-full"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Create Game
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Games */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Games</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : games.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No active games. Create one to get started!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <Card key={game.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {game.host_display_name}'s Game
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Room: {game.room_id.toUpperCase()}
                      </p>
                    </div>
                    <Badge variant={game.status === "waiting" ? "secondary" : "default"}>
                      {game.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {game.player_count}/{game.max_players} Players
                    </span>
                    <span>
                      {game.total_rounds} Rounds
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {game.status === "waiting" && game.player_count < game.max_players && (
                      <Button
                        onClick={() => joinGame(game.id)}
                        className="flex-1"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Join Game
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate(`/games/principle-cards/${game.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Game
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How to Play */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">How to Play</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>1. Create or Join:</strong> Start a new game or join an existing one
            </p>
            <p>
              <strong>2. Draw Cards:</strong> Each round, a new principle card is revealed
            </p>
            <p>
              <strong>3. Match Scenario:</strong> First player to correctly apply the principle to the scenario wins the round
            </p>
            <p>
              <strong>4. Score Points:</strong> Win rounds to earn points and cards
            </p>
            <p>
              <strong>5. Win the Game:</strong> Player with the most points after all rounds wins!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
