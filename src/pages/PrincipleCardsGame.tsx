import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Trophy,
  Loader2,
  PlayCircle,
  CheckCircle2,
  Clock,
  Share2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { SocialShareButton } from "@/components/SocialShareButton";

export default function PrincipleCardsGame() {
  const { t } = useTranslation();
  const { gameId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translatedFloors } = useTranslatedPalaceData();

  const [game, setGame] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get all principles from palace data
  const allPrinciples = translatedFloors.flatMap(floor => 
    floor.rooms.map(room => ({
      principle: room.name,
      tag: room.tag,
      description: room.purpose,
      coreQuestion: room.coreQuestion,
      method: room.method
    }))
  );

  useEffect(() => {
    if (gameId) {
      fetchGameData();
      
      // Subscribe to game updates
      const gameChannel = supabase
        .channel(`game-${gameId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'principle_card_games',
            filter: `id=eq.${gameId}`
          },
          () => fetchGameData()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'principle_card_players',
            filter: `game_id=eq.${gameId}`
          },
          () => fetchGameData()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'principle_card_rounds',
            filter: `game_id=eq.${gameId}`
          },
          () => fetchGameData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(gameChannel);
      };
    }
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from("principle_card_games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (gameError) throw gameError;
      setGame(gameData);

      // Fetch players with profiles
      const { data: playersData, error: playersError } = await supabase
        .from("principle_card_players")
        .select(`
          *,
          profiles (display_name, avatar_url)
        `)
        .eq("game_id", gameId)
        .order("score", { ascending: false });

      if (playersError) throw playersError;
      setPlayers(playersData || []);

      // Fetch current round
      if (gameData.status === "playing") {
        const { data: roundData } = await supabase
          .from("principle_card_rounds")
          .select("*")
          .eq("game_id", gameId)
          .eq("round_number", gameData.current_round)
          .maybeSingle();

        setCurrentRound(roundData);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!user || game?.host_user_id !== user.id) return;

    try {
      // Update game status
      await supabase
        .from("principle_card_games")
        .update({ status: "playing", started_at: new Date().toISOString() })
        .eq("id", gameId);

      // Create first round
      await createNewRound(1);

      toast({
        title: t('principles.gameStarted'),
        description: t('principles.goodLuck')
      });
    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createNewRound = async (roundNumber: number) => {
    // Pick random principle
    const principle = allPrinciples[Math.floor(Math.random() * allPrinciples.length)];
    
    // Generate scenario
    const scenario = `A believer is studying ${principle.principle}. ${principle.coreQuestion}`;

    await supabase
      .from("principle_card_rounds")
      .insert({
        game_id: gameId,
        round_number: roundNumber,
        card_principle: principle.principle,
        card_description: principle.description,
        scenario_text: scenario
      });
  };

  const submitResponse = async () => {
    if (!user || !response.trim()) return;

    setSubmitting(true);
    try {
      // Update round with player's response
      const { error } = await supabase
        .from("principle_card_rounds")
        .update({
          correct_player_id: user.id,
          completed_at: new Date().toISOString()
        })
        .eq("id", currentRound.id)
        .is("correct_player_id", null); // Only if no one has answered yet

      if (error) throw error;

      // Award points
      await supabase
        .from("principle_card_players")
        .update({
          score: players.find(p => p.user_id === user.id)?.score + 100 || 100,
          cards_won: players.find(p => p.user_id === user.id)?.cards_won + 1 || 1
        })
        .eq("game_id", gameId)
        .eq("user_id", user.id);

      // Check if game is complete
      if (game.current_round >= game.total_rounds) {
        await endGame();
      } else {
        // Next round
        await supabase
          .from("principle_card_games")
          .update({ current_round: game.current_round + 1 })
          .eq("id", gameId);

        await createNewRound(game.current_round + 1);
      }

      setResponse("");
      toast({
        title: t('principles.correct'),
        description: t('principles.wonRound')
      });
    } catch (error: any) {
      console.error("Error submitting response:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const endGame = async () => {
    const winner = players.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    await supabase
      .from("principle_card_games")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        winner_id: winner.user_id
      })
      .eq("id", gameId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('principles.gameTitle')}</h1>
            <p className="text-muted-foreground">
              {t('principles.roundOf', { current: game?.current_round || 1, total: game?.total_rounds || 10 })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={game?.status === "waiting" ? "secondary" : "default"}>
              {game?.status}
            </Badge>
            <SocialShareButton
              title={t('principles.shareGameTitle')}
              description={t('principles.shareGameDescription')}
              url={window.location.href}
              variant="button"
              size="icon"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">{t('principles.playersLabel', { current: players.length, max: game?.max_players })}</h3>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.profiles?.avatar_url} />
                      <AvatarFallback>
                        {player.profiles?.display_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {player.profiles?.display_name || "Player"}
                        {player.user_id === game?.host_user_id && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {t('principles.host')}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('principles.playerStats', { points: player.score, cards: player.cards_won })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            {game?.status === "waiting" && (
              <Card className="p-8 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">{t('principles.waitingForPlayersTitle')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('principles.waitingForPlayersDescription')}
                </p>
                {user?.id === game.host_user_id && players.length >= 2 && (
                  <Button onClick={startGame} size="lg">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {t('principles.startGame')}
                  </Button>
                )}
              </Card>
            )}

            {game?.status === "playing" && currentRound && (
              <div className="space-y-6">
                {/* Principle Card */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="text-center mb-4">
                    <Badge className="mb-2">{currentRound.card_principle}</Badge>
                    <h3 className="text-2xl font-bold">{t('principles.principleCard')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentRound.card_description}
                  </p>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="font-medium">{t('principles.scenario')}:</p>
                    <p className="text-sm">{currentRound.scenario_text}</p>
                  </div>
                </Card>

                {/* Response Area */}
                {!currentRound.completed_at ? (
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">{t('principles.yourResponse')}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('principles.explainPrinciple')}
                    </p>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder={t('principles.typeResponsePlaceholder')}
                      rows={4}
                      className="mb-4"
                    />
                    <Button
                      onClick={submitResponse}
                      disabled={submitting || !response.trim()}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('common.submitting')}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {t('principles.submitResponse')}
                        </>
                      )}
                    </Button>
                  </Card>
                ) : (
                  <Card className="p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="font-medium">{t('principles.roundComplete')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('principles.waitingForNextRound')}
                    </p>
                  </Card>
                )}
              </div>
            )}

            {game?.status === "completed" && (
              <Card className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-2xl font-bold mb-2">{t('principles.gameOver')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('principles.winner', { name: players.find(p => p.user_id === game.winner_id)?.profiles?.display_name })}
                </p>
                <Button onClick={() => navigate("/games/principle-cards")}>
                  {t('principles.backToLobby')}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
